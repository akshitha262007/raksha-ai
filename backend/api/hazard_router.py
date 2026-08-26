from fastapi import APIRouter, HTTPException, status
from models.hazard import HazardPredictionRequest, HazardPredictionResponse
from services.hazard_service import predict_hazard_risk

router = APIRouter(prefix="/api", tags=["Hazard Prediction"])

@router.post(
    "/predict-hazard",
    response_model=HazardPredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Predict Landslide Hazard Risk Index",
    description="Evaluates slope gradient, 24h precipitation, soil moisture saturation, and NDVI telemetry parameters using a heuristic pipeline ready for XGBoost integration."
)
async def predict_hazard_endpoint(request: HazardPredictionRequest):
    try:
        response = predict_hazard_risk(request)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Hazard prediction error: {str(e)}"
        )
