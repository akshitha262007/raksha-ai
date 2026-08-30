import random
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from models.hazard import HazardPredictionRequest, HazardPredictionResponse
from services.hazard_service import predict_hazard_risk

router = APIRouter(prefix="/api", tags=["Hazard Prediction"])

@router.post(
    "/predict-hazard",
    response_model=HazardPredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Predict Landslide Hazard Risk Index",
    description="Evaluates slope gradient, 24h precipitation, soil moisture saturation, and NDVI telemetry parameters using AavishkarRiskEngine."
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

@router.get(
    "/telemetry",
    status_code=status.HTTP_200_OK,
    summary="Get Mock Live Telemetry Stream",
    description="Returns live 7-channel multi-spectral sensor telemetry with realistic micro-variations and sensor jitter."
)
async def get_live_telemetry():
    def random_jitter(base, rng):
        return round(base + (random.random() * rng - rng / 2.0), 2)

    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "node_id": "Node #7-Mangan",
        "rssi": -84,
        "sensors": {
            "precipitation_24h_mm": random_jitter(185.0, 5.0),
            "soil_saturation_pct": random_jitter(78.0, 2.0),
            "slope_gradient_deg": 42.5,
            "ndvi_stability": 0.15,
            "micro_seismic_g": random_jitter(0.077, 0.005),
            "pore_pressure_kpa": random_jitter(47.1, 1.2),
            "inclinometer_mm_h": random_jitter(3.43, 0.2)
        }
    }
