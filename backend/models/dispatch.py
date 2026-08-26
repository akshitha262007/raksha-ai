from pydantic import BaseModel, Field
from typing import List, Optional

class Depot(BaseModel):
    id: str = Field(..., description="Unique depot/battalion identifier")
    name: str = Field(..., description="Depot name (e.g., NDRF Gangtok Base)")
    capacity: float = Field(..., ge=0.0, description="Available rescue teams/units capacity")
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class DisasterSite(BaseModel):
    id: str = Field(..., description="Unique disaster site identifier")
    name: str = Field(..., description="Site name (e.g., Pakyong Slide Point)")
    demand: float = Field(..., ge=0.0, description="Required rescue teams/units")
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    severity: Optional[str] = "HIGH"

class AllocationItem(BaseModel):
    depot_id: str
    depot_name: str
    site_id: str
    site_name: str
    units_allocated: float
    unit_cost_distance: float
    total_cost: float

class DispatchOptimizationRequest(BaseModel):
    depots: List[Depot]
    sites: List[DisasterSite]
    cost_matrix: Optional[List[List[float]]] = Field(
        default=None, 
        description="Optional custom m x n cost matrix. If omitted, calculated automatically using geographical distance."
    )

class DispatchOptimizationResponse(BaseModel):
    status: str = Field(..., description="Optimization status: OPTIMAL, INFEASIBLE, ERROR")
    total_cost: float = Field(..., description="Total cost/response time metric minimized")
    allocations: List[AllocationItem] = Field(..., description="Detailed routing allocation matrix")
    unmet_demand: float = Field(default=0.0, description="Remaining unfulfilled demand across sites")
    unused_supply: float = Field(default=0.0, description="Remaining unused supply across depots")
    message: str = Field(default="Optimization executed successfully via SciPy Highs LP solver.")
