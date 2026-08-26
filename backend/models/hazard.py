from pydantic import BaseModel, Field
from typing import List, Optional

class HazardPredictionRequest(BaseModel):
    slope_angle: float = Field(..., ge=0.0, le=90.0, description="Slope gradient in degrees")
    rainfall_24h: float = Field(..., ge=0.0, le=1000.0, description="24-hour cumulative rainfall in mm")
    soil_moisture: float = Field(..., ge=0.0, le=100.0, description="Soil moisture saturation percentage")
    ndvi: float = Field(..., ge=-1.0, le=1.0, description="Normalized Difference Vegetation Index")
    location_name: Optional[str] = Field(default="Sikkim High-Risk Sector A", description="Target region/sector name")

class HazardPredictionResponse(BaseModel):
    risk_score: float = Field(..., description="Calculated hazard risk score between 0.0 and 1.0")
    risk_category: str = Field(..., description="Qualitative risk rating: LOW, MEDIUM, HIGH, CRITICAL")
    confidence_score: float = Field(..., description="Model confidence level between 0.0 and 1.0")
    key_contributing_factors: List[str] = Field(..., description="List of primary risk triggers")
    recommended_actions: List[str] = Field(..., description="Standard Operating Procedure recommendations")
    model_version: str = Field(default="v1.0-heuristic-xgboost-ready", description="Active prediction model identifier")
