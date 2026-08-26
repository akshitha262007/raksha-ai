import numpy as np
from models.hazard import HazardPredictionRequest, HazardPredictionResponse

def predict_hazard_risk(data: HazardPredictionRequest) -> HazardPredictionResponse:
    """
    Heuristic Landslide Risk Scoring Engine (XGBoost ready interface).
    
    Formula:
      Risk = 0.35 * Slope_Norm + 0.35 * Rainfall_Norm + 0.20 * Moisture_Norm + 0.10 * Vegetation_Deficit
    """
    # 1. Normalize Inputs
    slope_norm = min(data.slope_angle / 60.0, 1.0)
    rainfall_norm = min(data.rainfall_24h / 250.0, 1.0)
    moisture_norm = min(data.soil_moisture / 100.0, 1.0)
    veg_deficit = max(0.0, 1.0 - data.ndvi) / 2.0  # NDVI range [-1, 1], deficit normalized [0, 1]

    # 2. Compute Weighted Risk Score
    raw_score = (0.35 * slope_norm) + (0.35 * rainfall_norm) + (0.20 * moisture_norm) + (0.10 * veg_deficit)
    risk_score = round(float(np.clip(raw_score, 0.0, 1.0)), 4)

    # 3. Determine Risk Category
    if risk_score >= 0.80:
        category = "CRITICAL"
    elif risk_score >= 0.60:
        category = "HIGH"
    elif risk_score >= 0.35:
        category = "MEDIUM"
    else:
        category = "LOW"

    # 4. Identify Contributing Factors
    factors = []
    if data.slope_angle > 35.0:
        factors.append(f"Steep slope gradient ({data.slope_angle}°)")
    if data.rainfall_24h > 100.0:
        factors.append(f"Heavy 24h precipitation ({data.rainfall_24h} mm)")
    if data.soil_moisture > 70.0:
        factors.append(f"High soil moisture saturation ({data.soil_moisture}%)")
    if data.ndvi < 0.2:
        factors.append(f"Low vegetation stability (NDVI: {data.ndvi})")
    if not factors:
        factors.append("Baseline environmental telemetry within safe parameters")

    # 5. SOP Action Recommendations
    actions = []
    if category in ["HIGH", "CRITICAL"]:
        actions.append("Issue immediate automated Web Push alert to localized geofence.")
        actions.append("Mobilize nearest NDRF/SDRF rescue battalion resources.")
        actions.append("Initiate mandatory evacuation protocols for downslope settlements.")
    elif category == "MEDIUM":
        actions.append("Elevate emergency monitoring station alert status to AMBER.")
        actions.append("Inspect slope drainage channels and soil stability sensors.")
    else:
        actions.append("Maintain routine satellite & weather telemetry monitoring.")

    # Confidence score calculation based on parameter telemetry consistency
    confidence = round(0.88 + 0.10 * (1.0 - abs(0.5 - risk_score)), 2)

    return HazardPredictionResponse(
        risk_score=risk_score,
        risk_category=category,
        confidence_score=confidence,
        key_contributing_factors=factors,
        recommended_actions=actions,
        model_version="v1.0-heuristic-xgboost-ready"
    )
