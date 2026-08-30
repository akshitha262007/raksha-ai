from pydantic import BaseModel, Field
from typing import List, Optional

class HazardPredictionRequest(BaseModel):
    slope_angle: float = Field(..., ge=0.0, le=90.0, description="Slope gradient in degrees")
    rainfall_24h: float = Field(..., ge=0.0, le=1000.0, description="24-hour cumulative rainfall in mm")
    soil_moisture: float = Field(..., ge=0.0, le=100.0, description="Soil moisture saturation percentage")
    ndvi: float = Field(..., ge=-1.0, le=1.0, description="Normalized Difference Vegetation Index")
    location_name: Optional[str] = Field(default="Sikkim High-Risk Sector A", description="Target region/sector name")
    
    # Geotechnical & Multi-Sensor Extended Telemetry
    cohesion: Optional[float] = Field(default=12.0, ge=0.0, description="Soil cohesion in kPa")
    friction_angle_deg: Optional[float] = Field(default=25.0, ge=0.0, le=90.0, description="Internal friction angle in degrees")
    soil_depth: Optional[float] = Field(default=2.0, ge=0.1, description="Soil depth over failure plane in meters")
    water_height: Optional[float] = Field(default=1.8, ge=0.0, description="Water table height over failure plane in meters")
    insar_disp: Optional[float] = Field(default=30.0, ge=0.0, le=100.0, description="InSAR satellite ground deformation index (0-100)")
    seismic_spike: Optional[float] = Field(default=15.0, ge=0.0, le=100.0, description="Micro-seismic tremor intensity index (0-100)")
    river_drop_pct: Optional[float] = Field(default=10.0, ge=0.0, le=100.0, description="Upstream river flow drop percentage (Damming indicator)")

class HazardPredictionResponse(BaseModel):
    risk_score: float = Field(..., description="Calculated hazard risk score between 0.0 and 1.0")
    risk_category: str = Field(..., description="Qualitative risk rating: LOW, MEDIUM, HIGH, CRITICAL")
    confidence_score: float = Field(..., description="Model confidence level between 0.0 and 1.0")
    key_contributing_factors: List[str] = Field(..., description="List of primary risk triggers")
    recommended_actions: List[str] = Field(..., description="Standard Operating Procedure recommendations")
    model_version: str = Field(default="v2.0-aavishkar-risk-engine", description="Active prediction model identifier")
    
    # Aavishkar Two-Layer Risk Engine Metrics
    factor_of_safety: Optional[float] = Field(default=None, description="Calculated geotechnical Factor of Safety (Fs)")
    layer1_lri: Optional[float] = Field(default=None, description="Layer 1 Base Landslide Risk Index (LRI 0-100)")
    anomaly_flagged: Optional[bool] = Field(default=None, description="Layer 1 High-Recall Anomaly Flag")
    alert_color: Optional[str] = Field(default=None, description="Layer 2 Convergence Alert Color: GREEN, YELLOW, ORANGE, RED")
    layer2_action: Optional[str] = Field(default=None, description="Layer 2 Multi-Sensor Decision Action")
