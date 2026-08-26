import numpy as np
from scipy.optimize import linprog
import math
from models.dispatch import (
    DispatchOptimizationRequest, 
    DispatchOptimizationResponse, 
    AllocationItem
)

def calculate_distance(lat1, lon1, lat2, lon2) -> float:
    """Haversine distance in kilometers between two points."""
    if None in (lat1, lon1, lat2, lon2):
        return 15.0  # Fallback default distance metric
    
    R = 6371.0  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

def optimize_resource_dispatch(request: DispatchOptimizationRequest) -> DispatchOptimizationResponse:
    """
    Solves linear programming transportation problem for rescue resource dispatch using SciPy linprog (HiGHS).
    
    Minimize Cost: sum_i sum_j (c_ij * x_ij)
    Subject to:
      sum_j (x_ij) <= Supply_i  (Depot capacity limits)
      sum_i (x_ij) >= Demand_j  (Site requirements)
      x_ij >= 0
    """
    depots = request.depots
    sites = request.sites
    m = len(depots)
    n = len(sites)

    if m == 0 or n == 0:
        return DispatchOptimizationResponse(
            status="ERROR",
            total_cost=0.0,
            allocations=[],
            message="At least one depot and one disaster site are required for optimization."
        )

    # Build cost matrix (m x n) if not provided
    if request.cost_matrix and len(request.cost_matrix) == m and len(request.cost_matrix[0]) == n:
        cost_matrix = np.array(request.cost_matrix, dtype=float)
    else:
        cost_matrix = np.zeros((m, n), dtype=float)
        for i, depot in enumerate(depots):
            for j, site in enumerate(sites):
                cost_matrix[i, j] = calculate_distance(
                    depot.latitude, depot.longitude,
                    site.latitude, site.longitude
                )

    # Flatten cost vector c of length m*n
    c = cost_matrix.flatten()

    # Total Supply & Demand
    total_supply = sum(d.capacity for d in depots)
    total_demand = sum(s.demand for s in sites)

    # Build Inequality constraints A_ub * x <= b_ub
    # 1. Supply constraints: sum_j x_ij <= Supply_i  =>  A_supply * x <= Supply
    A_supply = np.zeros((m, m * n))
    for i in range(m):
        A_supply[i, i * n : (i + 1) * n] = 1.0
    b_supply = np.array([d.capacity for d in depots])

    # 2. Demand constraints: sum_i x_ij >= Demand_j  => -sum_i x_ij <= -Demand_j
    A_demand = np.zeros((n, m * n))
    for j in range(n):
        for i in range(m):
            A_demand[j, i * n + j] = -1.0
    b_demand = np.array([-s.demand for s in sites])

    A_ub = np.vstack([A_supply, A_demand])
    b_ub = np.concatenate([b_supply, b_demand])

    # Bounds: x_ij >= 0
    bounds = [(0, None) for _ in range(m * n)]

    # Solve using SciPy linprog (method='highs')
    res = linprog(c, A_ub=A_ub, b_ub=b_ub, bounds=bounds, method='highs')

    if not res.success:
        return DispatchOptimizationResponse(
            status="INFEASIBLE",
            total_cost=0.0,
            allocations=[],
            unmet_demand=max(0.0, total_demand - total_supply),
            unused_supply=max(0.0, total_supply - total_demand),
            message=f"Optimization failed or infeasible: {res.message}"
        )

    # Parse flattened decision vector x back into m x n matrix
    x_matrix = res.x.reshape((m, n))
    allocations = []
    total_allocated_units = 0.0

    for i, depot in enumerate(depots):
        for j, site in enumerate(sites):
            units = float(x_matrix[i, j])
            if units > 1e-4:  # Filter zero allocations
                unit_cost = float(cost_matrix[i, j])
                item_total_cost = round(units * unit_cost, 2)
                total_allocated_units += units
                allocations.append(AllocationItem(
                    depot_id=depot.id,
                    depot_name=depot.name,
                    site_id=site.id,
                    site_name=site.name,
                    units_allocated=round(units, 2),
                    unit_cost_distance=unit_cost,
                    total_cost=item_total_cost
                ))

    unmet = max(0.0, total_demand - total_allocated_units)
    unused = max(0.0, total_supply - total_allocated_units)

    return DispatchOptimizationResponse(
        status="OPTIMAL",
        total_cost=round(float(res.fun), 2),
        allocations=allocations,
        unmet_demand=round(unmet, 2),
        unused_supply=round(unused, 2),
        message="Optimal resource dispatch routing successfully computed via SciPy LP solver."
    )
