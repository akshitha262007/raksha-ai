import numpy as np
from models.hazard import HazardPredictionRequest, HazardPredictionResponse

class AavishkarRiskEngine:
    """
    Aavishkar Multi-Layer Geotechnical & Multi-Sensor Convergence Engine.
    Combines Factor of Safety (Fs) infinite slope stability with 
    Layer 1 High-Recall Anomaly Scanning and Layer 2 Convergence Verification.
    """
    def __init__(self):
        # Weights for LRI calculation
        self.w = {'rain': 0.30, 'slope': 0.35, 'insar': 0.20, 'seismic': 0.15}
        
    def calculate_factor_of_safety(self, cohesion, friction_angle_deg, slope_deg, soil_depth, water_height, gamma=18, gamma_w=9.81):
        """Calculates Factor of Safety (Fs) for slope stability."""
        phi = np.radians(friction_angle_deg)
        theta = np.radians(slope_deg)
        
        numerator = cohesion + (gamma * soil_depth - gamma_w * water_height) * (np.cos(theta)**2) * np.tan(phi)
        denominator = gamma * soil_depth * np.sin(theta) * np.cos(theta)
        
        if denominator == 0:
            return 2.0  # Flat terrain, stable
        return numerator / denominator

    def layer_1_high_recall_scan(self, rain_anomaly, fs_score, insar_disp, seismic_spike):
        """LAYER 1: Fast anomaly detection (Ensures NO event is missed)."""
        # Calculate Base LRI (0 to 100)
        fs_norm = max(0.0, min(1.0, 1.0 - fs_score))  # Fs < 1 increases risk
        
        lri = (self.w['rain'] * rain_anomaly + 
               self.w['slope'] * (fs_norm * 100.0) + 
               self.w['insar'] * insar_disp + 
               self.w['seismic'] * seismic_spike)
        
        has_anomaly = lri > 40.0 or fs_score < 1.1 or seismic_spike > 70.0
        return lri, has_anomaly

    def layer_2_cross_verification(self, lri, fs_score, rain_mm_hr, seismic_spike, river_drop_pct):
        """
        LAYER 2: Multi-Sensor Convergence Engine.
        Eliminates False Alarms before issuing Public Red Alerts.
        """
        # Count independent converging indicators
        convergence_count = 0
        if rain_mm_hr > 50.0: convergence_count += 1      # Cloudburst trigger
        if fs_score < 1.0: convergence_count += 1         # Geotechnical collapse point
        if seismic_spike > 75.0: convergence_count += 1   # Glacial shear / Avalanche shock
        if river_drop_pct > 40.0: convergence_count += 1  # Upstream River Damming (Cascading)

        # Graduated Risk Matrix Output
        if lri >= 85.0 and convergence_count >= 2:
            return "RED", "CRITICAL EVACUATION", "Multi-factor convergence verified. Immediate hazard imminent."
        elif lri >= 65.0 or convergence_count >= 2:
            return "ORANGE", "TARGETED PRE-ALERT", "High risk detected. Restrict road corridors & alert first responders."
        elif lri >= 40.0:
            return "YELLOW", "INTERNAL ADVISORY", "Elevated monitoring. District control room notified."
        else:
            return "GREEN", "NORMAL MONITORING", "Conditions stable."

risk_engine = AavishkarRiskEngine()

def predict_hazard_risk(data: HazardPredictionRequest) -> HazardPredictionResponse:
    """
    Landslide Hazard Risk Evaluator powered by AavishkarRiskEngine.
    """
    # 1. Geotechnical Factor of Safety (Fs) Calculation
    fs = risk_engine.calculate_factor_of_safety(
        cohesion=data.cohesion if data.cohesion is not None else 12.0,
        friction_angle_deg=data.friction_angle_deg if data.friction_angle_deg is not None else 25.0,
        slope_deg=data.slope_angle,
        soil_depth=data.soil_depth if data.soil_depth is not None else 2.0,
        water_height=data.water_height if data.water_height is not None else 1.8
    )

    # 2. Layer 1 High-Recall Anomaly Scan
    rain_anomaly = min(100.0, (data.rainfall_24h / 250.0) * 100.0)
    insar = data.insar_disp if data.insar_disp is not None else 30.0
    seismic = data.seismic_spike if data.seismic_spike is not None else 15.0
    river_drop = data.river_drop_pct if data.river_drop_pct is not None else 10.0

    lri_score, anomaly_flagged = risk_engine.layer_1_high_recall_scan(
        rain_anomaly=rain_anomaly,
        fs_score=fs,
        insar_disp=insar,
        seismic_spike=seismic
    )

    # 3. Layer 2 Multi-Sensor Convergence Verification
    rain_mm_hr = data.rainfall_24h / 4.0  # Peak rainfall intensity approximation
    alert_color, l2_action, l2_message = risk_engine.layer_2_cross_verification(
        lri=lri_score,
        fs_score=fs,
        rain_mm_hr=rain_mm_hr,
        seismic_spike=seismic,
        river_drop_pct=river_drop
    )

    # 4. Map Alert Color to Standard Risk Category & Score (0.0 to 1.0)
    risk_score = round(float(np.clip(lri_score / 100.0, 0.0, 1.0)), 4)
    if alert_color == "RED":
        category = "CRITICAL"
    elif alert_color == "ORANGE":
        category = "HIGH"
    elif alert_color == "YELLOW":
        category = "MEDIUM"
    else:
        category = "LOW"

    # 5. Key Triggers
    factors = []
    if fs < 1.0:
        factors.append(f"Geotechnical failure point exceeded (Factor of Safety Fs = {fs:.2f})")
    elif fs < 1.2:
        factors.append(f"Marginal slope stability (Factor of Safety Fs = {fs:.2f})")
    if data.slope_angle > 35.0:
        factors.append(f"Steep terrain slope gradient ({data.slope_angle}°)")
    if data.rainfall_24h > 100.0:
        factors.append(f"Heavy 24h precipitation ({data.rainfall_24h} mm)")
    if insar > 50.0:
        factors.append(f"InSAR satellite ground deformation displacement ({insar:.0f}/100)")
    if seismic > 60.0:
        factors.append(f"Micro-seismic tremor shock spike ({seismic:.0f}/100)")
    if river_drop > 30.0:
        factors.append(f"Upstream river damming flow reduction ({river_drop:.0f}%)")
    if not factors:
        factors.append("Baseline telemetry within safe operating parameters")

    # 6. SOP Action Recommendations
    actions = [f"[{alert_color}] {l2_action}: {l2_message}"]
    if category in ["HIGH", "CRITICAL"]:
        actions.append("Issue immediate automated Web Push alert to localized geofence.")
        actions.append("Mobilize nearest NDRF/SDRF rescue battalion resources.")
        actions.append("Initiate mandatory evacuation protocols for downslope settlements.")
    elif category == "MEDIUM":
        actions.append("Elevate emergency monitoring station alert status to AMBER.")
        actions.append("Inspect slope drainage channels and soil stability sensors.")
    else:
        actions.append("Maintain routine satellite & weather telemetry monitoring.")

    confidence = round(0.92 + 0.06 * (1.0 - abs(0.5 - risk_score)), 2)

    return HazardPredictionResponse(
        risk_score=risk_score,
        risk_category=category,
        confidence_score=confidence,
        key_contributing_factors=factors,
        recommended_actions=actions,
        model_version="v2.0-aavishkar-risk-engine",
        factor_of_safety=round(float(fs), 2),
        layer1_lri=round(float(lri_score), 1),
        anomaly_flagged=anomaly_flagged,
        alert_color=alert_color,
        layer2_action=l2_action
    )
