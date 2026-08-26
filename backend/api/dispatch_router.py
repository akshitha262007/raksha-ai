from fastapi import APIRouter, HTTPException, status
from models.dispatch import DispatchOptimizationRequest, DispatchOptimizationResponse
from services.dispatch_service import optimize_resource_dispatch

router = APIRouter(prefix="/api", tags=["Resource Dispatch Optimization"])

@router.post(
    "/optimize-dispatch",
    response_model=DispatchOptimizationResponse,
    status_code=status.HTTP_200_OK,
    summary="Optimize NDRF/SDRF Emergency Resource Allocation",
    description="Solves linear programming transportation model via SciPy linprog to route rescue teams from depots to disaster sites at minimal transport cost/response time."
)
async def optimize_dispatch_endpoint(request: DispatchOptimizationRequest):
    try:
        response = optimize_resource_dispatch(request)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Resource dispatch optimization error: {str(e)}"
        )
