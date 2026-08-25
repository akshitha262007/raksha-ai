/**
 * RAKSHA-AI Core Risk Evaluation & Resource Allocation Engine
 * Smart India Hackathon Problem Statement 26001: Landslide Risk Monitoring System in NER
 */

export interface ResourceNode {
  id: string;
  name: string;
  type: 'NDRF' | 'SDRF' | 'Civil Defence' | 'Medical Corps' | 'State Police';
  lat: number;
  lng: number;
  status: 'Available' | 'Dispatched' | 'Accepted' | 'En Route' | 'Arrived' | 'Operation Active' | 'Completed' | 'Overdue';
  capacity: number;
  contact: string;
  assignedZoneId?: string | null;
  baseCity: string;
}

export interface LandslideZone {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  rainfall: number; // Precipitation intensity in mm/hr (0 - 120 mm/hr)
  soilMoisture: number; // Soil volumetric water content % (0 - 100%)
  slopeAngle: number; // Terrain gradient in degrees (0 - 75°)
  riskScore: number; // Evaluated risk score percentage (0 - 100%)
  riskLevel: 'Safe' | 'Moderate' | 'Critical';
  assignedResource: ResourceNode | null;
  lastUpdated: string;
  elevation: number; // Meters above sea level
  geologicalComposition: string;
  populationAtRisk: number;
  affectedAreaKm2: number;
  district: string;
  mainHazard: string;
  historicalLandslides: number;
  instabilityRating: 'Low' | 'Moderate' | 'High' | 'Severe';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'INFO' | 'WARNING' | 'ALERT' | 'OPTIMIZE' | 'CITIZEN_REPORT' | 'ACCOUNTABILITY' | 'ESCALATION';
  message: string;
  zoneId?: string;
  details?: string;
}

export type AlertLanguage = 'en' | 'hi' | 'as' | 'bn' | 'ne' | 'mn';

export interface AlertDeliveryReport {
  targetPopulation: number;
  smsDelivered: number;
  appNotifications: number;
  voiceCalls: number;
  undelivered: number;
  acknowledged: number;
  pending: number;
  undeliveredSubzones: Array<{
    name: string;
    unreachableCount: number;
    recommendedIntervention: string;
  }>;
}

export interface CitizenAlert {
  id: string;
  incidentId: string;
  zoneId: string;
  hazard: string;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  affectedZoneName: string;
  district: string;
  populationAtRisk: number;
  recommendedAction: string;
  messages: Record<AlertLanguage, string>;
  selectedLanguage: AlertLanguage;
  channels: {
    sms: boolean;
    app: boolean;
    cellBroadcast: boolean;
    ivr: boolean;
    siren: boolean;
    teams: boolean;
  };
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'DISPATCHED' | 'SIMULATING';
  createdAt: string;
  dispatchedAt?: string;
  deliveryReport: AlertDeliveryReport;
}

export interface IncidentTimelineEvent {
  id: string;
  time: string;
  icon: string;
  title: string;
  description: string;
}

export interface EmergencyIncident {
  id: string;
  zoneId: string;
  zoneName: string;
  state: string;
  hazard: string;
  severity: 'Safe' | 'Moderate' | 'Critical';
  populationAtRisk: number;
  detectedTime: string;
  status: 'Monitoring' | 'Alert Recommended' | 'Alert Dispatched' | 'Response Active' | 'Escalated' | 'Resolved';
  citizenAlertStatus: 'Normal Monitoring' | 'Advisory Recommended' | 'Warning Recommended' | 'Emergency Alert Recommended' | 'Dispatched';
  timeline: IncidentTimelineEvent[];
  targetResponseTimeMinutes: number;
}

export interface ResponseUnitAssignment {
  id: string;
  incidentId: string;
  zoneId: string;
  role: 'Rescue' | 'Medical' | 'Police' | 'Evacuation';
  unitName: string;
  type: 'NDRF' | 'SDRF' | 'Civil Defence' | 'Medical Corps' | 'State Police';
  status: 'Assigned' | 'Accepted' | 'En Route' | 'Arrived' | 'Operation Active' | 'Completed' | 'Overdue';
  assignedAt: string;
  acknowledgedAt?: string;
  dispatchedAt?: string;
  arrivedAt?: string;
  acknowledgementDeadline: string;
  acknowledgementWindowSeconds: number;
  escalationLevel: 1 | 2 | 3 | 4;
  currentLat: number;
  currentLng: number;
  targetLat: number;
  targetLng: number;
  baseLat: number;
  baseLng: number;
  contact: string;
  personnelCount: number;
  backupRequested?: boolean;
  backupUnitName?: string;
}

/* ========================================================================== */
/* MULTI-SOURCE & AI SENSOR FUSION SCHEMAS */
/* ========================================================================== */

export type DataSourceId = 'satellite' | 'rainfall' | 'soilMoisture' | 'terrain' | 'historical' | 'weather' | 'groundSensors';

export interface DataSourceChannel {
  id: DataSourceId;
  name: string;
  icon: string;
  status: 'Available' | 'Unavailable' | 'Simulated';
  enabled: boolean;
  weight: number; // Percentage contribution weight (e.g. 20%)
  individualConfidence: number; // 0-100%
  riskContributionScore: number; // 0-100%
  riskContributionLevel: 'SAFE' | 'MODERATE' | 'HIGH' | 'EXTREME';
  valueDisplay: string;
  dataType: 'LIVE DATA' | 'DEMO DATA' | 'FUTURE INTEGRATION';
  explanation: string;
}

export interface SensorFusionResult {
  combinedProbability: number; // 0-100%
  confidenceScore: number; // 0-100%
  riskLevel: 'Safe' | 'Moderate' | 'Critical';
  warningCategory: string; // E.g. "🔴 HIGH-CONFIDENCE EXTREME RISK" or "🟠 EXTREME RISK — LOW CONFIDENCE"
  hasConflictingSignals: boolean;
  conflictDescription?: string;
  activeSourceCount: number;
  totalSourceCount: number;
  recommendedAction: string;
}

/**
 * Default Multi-Source Data Channels Array
 */
export const DEFAULT_DATA_SOURCES: DataSourceChannel[] = [
  {
    id: 'satellite',
    name: 'Satellite Observation',
    icon: '🛰️',
    status: 'Available',
    enabled: true,
    weight: 20,
    individualConfidence: 62,
    riskContributionScore: 65,
    riskContributionLevel: 'MODERATE',
    valueDisplay: 'Terrain Slump & Thermal Anomaly',
    dataType: 'LIVE DATA',
    explanation: 'Satellite observation provides land-surface information. Confidence may decrease because of cloud cover, resolution, or orbital revisit cycles.'
  },
  {
    id: 'rainfall',
    name: 'Rainfall Telemetry',
    icon: '🌧️',
    status: 'Available',
    enabled: true,
    weight: 20,
    individualConfidence: 94,
    riskContributionScore: 94,
    riskContributionLevel: 'EXTREME',
    valueDisplay: '142 mm / 24h',
    dataType: 'LIVE DATA',
    explanation: 'High rainfall rate creates intense hydrostatic pressure within upper soil horizons.'
  },
  {
    id: 'soilMoisture',
    name: 'Soil Moisture Saturation',
    icon: '💧',
    status: 'Available',
    enabled: true,
    weight: 15,
    individualConfidence: 89,
    riskContributionScore: 89,
    riskContributionLevel: 'EXTREME',
    valueDisplay: '87% Volumetric Saturation',
    dataType: 'DEMO DATA',
    explanation: 'Pore-water pressure reduces effective stress and soil cohesion on steep slopes.'
  },
  {
    id: 'terrain',
    name: 'Terrain & Slope Gradient',
    icon: '⛰️',
    status: 'Available',
    enabled: true,
    weight: 15,
    individualConfidence: 92,
    riskContributionScore: 92,
    riskContributionLevel: 'EXTREME',
    valueDisplay: '38° Slope • 1,420m Elevation',
    dataType: 'DEMO DATA',
    explanation: 'Steep slope gradients experience high shear stress when soil saturation peaks.'
  },
  {
    id: 'historical',
    name: 'Historical Landslide Data',
    icon: '📚',
    status: 'Available',
    enabled: true,
    weight: 15,
    individualConfidence: 90,
    riskContributionScore: 90,
    riskContributionLevel: 'EXTREME',
    valueDisplay: '3 Historical Events Nearby',
    dataType: 'DEMO DATA',
    explanation: 'Historical event records confirm localized structural fault sensitivity and landslide susceptibility.'
  },
  {
    id: 'weather',
    name: 'Weather Forecast',
    icon: '🌦️',
    status: 'Available',
    enabled: true,
    weight: 10,
    individualConfidence: 88,
    riskContributionScore: 88,
    riskContributionLevel: 'EXTREME',
    valueDisplay: 'Heavy Rain Forecast (24–48h)',
    dataType: 'DEMO DATA',
    explanation: 'Short-term meteorological forecast indicates sustained precipitation accumulation.'
  },
  {
    id: 'groundSensors',
    name: 'Ground Movement Sensors',
    icon: '📡',
    status: 'Simulated',
    enabled: true,
    weight: 5,
    individualConfidence: 75,
    riskContributionScore: 80,
    riskContributionLevel: 'HIGH',
    valueDisplay: '+4.8 mm Displace (Simulated)',
    dataType: 'FUTURE INTEGRATION',
    explanation: 'Ground sensors can provide direct local subsurface displacement measurements during physical deployment.'
  }
];

/**
 * AI Sensor Fusion Algorithm
 * Combines available and enabled data sources dynamically.
 */
export function calculateSensorFusion(sources: DataSourceChannel[]): SensorFusionResult {
  const activeSources = sources.filter(s => s.enabled && s.status !== 'Unavailable');
  const totalSources = sources.length;

  if (activeSources.length === 0) {
    return {
      combinedProbability: 0,
      confidenceScore: 0,
      riskLevel: 'Safe',
      warningCategory: '🟢 SENSORS OFFLINE',
      hasConflictingSignals: false,
      activeSourceCount: 0,
      totalSourceCount: totalSources,
      recommendedAction: 'Re-enable data sources to calculate landslide risk.'
    };
  }

  // 1. Calculate Total Active Weight
  const totalActiveWeight = activeSources.reduce((sum, s) => sum + s.weight, 0);

  // 2. Calculate Weighted Risk Probability
  const weightedRiskSum = activeSources.reduce((sum, s) => sum + (s.riskContributionScore * s.weight), 0);
  const combinedProbability = Math.round((weightedRiskSum / totalActiveWeight) * 10) / 10;

  // 3. Calculate Dynamic Confidence Score
  // Base confidence is the weighted average of active source individual confidences
  const weightedConfSum = activeSources.reduce((sum, s) => sum + (s.individualConfidence * s.weight), 0);
  let baseConfidence = weightedConfSum / totalActiveWeight;

  // Data Availability Penalty: scale by proportion of available weights (max 100%)
  const availabilityFactor = Math.min(1, totalActiveWeight / 100);
  let finalConfidence = Math.round(baseConfidence * (0.65 + 0.35 * availabilityFactor));

  // 4. Signal Consistency & Divergence Check
  const riskScores = activeSources.map(s => s.riskContributionScore);
  const maxRisk = Math.max(...riskScores);
  const minRisk = Math.min(...riskScores);
  const riskSpread = maxRisk - minRisk;

  // Detect conflict if spread > 35% (e.g. Satellite shows 30% risk while Rainfall shows 94% risk)
  const hasConflictingSignals = activeSources.length >= 2 && riskSpread > 35;
  let conflictDescription = '';

  if (hasConflictingSignals) {
    const lowSource = activeSources.find(s => s.riskContributionScore === minRisk);
    const highSource = activeSources.find(s => s.riskContributionScore === maxRisk);
    conflictDescription = `${lowSource?.name || 'Observation'} indicates lower risk (${minRisk}%), while ${highSource?.name || 'Telemetry'} indicates elevated instability (${maxRisk}%).`;
    
    // Penalize confidence when signals conflict
    finalConfidence = Math.max(25, finalConfidence - 12);
  }

  // 5. Categorize Qualitative Risk & Warning Level
  let riskLevel: 'Safe' | 'Moderate' | 'Critical' = 'Safe';
  if (combinedProbability >= 70) riskLevel = 'Critical';
  else if (combinedProbability >= 40) riskLevel = 'Moderate';

  let warningCategory = '';
  let recommendedAction = '';

  if (combinedProbability >= 70) {
    if (finalConfidence >= 75) {
      warningCategory = '🔴 HIGH-CONFIDENCE EXTREME RISK';
      recommendedAction = 'EVACUATE TO A SAFE LOCATION IMMEDIATELY. Dispatch emergency response forces.';
    } else {
      warningCategory = '🟠 EXTREME RISK — LOW CONFIDENCE';
      recommendedAction = 'Request additional ground verification / local authority confirmation before public alert dispatch.';
    }
  } else if (combinedProbability >= 40) {
    warningCategory = '🟡 MODERATE RISK ADVISORY';
    recommendedAction = 'Issue public advisory. Monitor rainfall accumulation and ground seepage.';
  } else {
    warningCategory = '🟢 NORMAL MONITORING';
    recommendedAction = 'Continuous telemetry monitoring active. Terrain stable.';
  }

  return {
    combinedProbability,
    confidenceScore: Math.min(99, Math.max(10, finalConfidence)),
    riskLevel,
    warningCategory,
    hasConflictingSignals,
    conflictDescription,
    activeSourceCount: activeSources.length,
    totalSourceCount: totalSources,
    recommendedAction
  };
}

/**
 * Algorithmic evaluation of Landslide Risk Score (0-100%)
 */
export function calculateLandslideRisk(rain: number, moisture: number, slope: number): number {
  const normalizedRain = Math.min(100, Math.max(0, (rain / 100) * 100));
  const normalizedMoisture = Math.min(100, Math.max(0, moisture));
  const normalizedSlope = Math.min(100, Math.max(0, (slope / 60) * 100));

  const weightedScore = (normalizedRain * 0.50) + (normalizedMoisture * 0.30) + (normalizedSlope * 0.20);
  return Math.round(Math.min(100, Math.max(0, weightedScore)) * 10) / 10;
}

export function getRiskLevel(score: number): 'Safe' | 'Moderate' | 'Critical' {
  if (score >= 70) return 'Critical';
  if (score >= 40) return 'Moderate';
  return 'Safe';
}

export function matchZoneToClosestResource(zone: LandslideZone, resources: ResourceNode[]): ResourceNode | null {
  const availableResources = resources.filter(r => r.status === 'Available');
  const candidatePool = availableResources.length > 0 ? availableResources : resources;

  if (candidatePool.length === 0) return null;

  let closestResource: ResourceNode | null = null;
  let minDistance = Infinity;

  for (const resource of candidatePool) {
    const distance = Math.hypot(zone.lat - resource.lat, zone.lng - resource.lng);
    if (distance < minDistance) {
      minDistance = distance;
      closestResource = resource;
    }
  }

  return closestResource;
}

export function calculateSpatialDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function generateMultilingualCitizenAlert(
  hazard: string,
  locationName: string,
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME'
): Record<AlertLanguage, string> {
  const severityTag = severity === 'EXTREME' ? '🔴 EXTREME LANDSLIDE RISK' : severity === 'HIGH' ? '🟠 LANDSLIDE WARNING' : '🟡 LANDSLIDE ADVISORY';
  
  return {
    en: `${severityTag}\n\nAffected Zone: ${locationName}\nHeavy rainfall may cause severe landslides in your area.\n\n🏃 MOVE TO A SAFE PLACE NOW.\n🚫 Avoid hills, steep slopes and river channels.\n📢 Follow instructions from local authorities.`,
    hi: `🔴 भूस्खलन की गंभीर चेतावनी\n\nप्रभावित क्षेत्र: ${locationName}\nभारी बारिश से आपके क्षेत्र में भूस्खलन का खतरा है।\n\n🏃 तुरंत सुरक्षित स्थान पर जाएं।\n🚫 पहाड़ियों, ढलानों और नदी-नालों से दूर रहें।\n📢 स्थानीय प्रशासन के निर्देशों का पालन करें।`,
    as: `🔴 ভূমিস্খলনৰ প্ৰবল সতৰ্কবাণী\n\nপ্ৰভাৱিত অঞ্চল: ${locationName}\nপ্ৰবল বৰষুণৰ বাবে আপোনাৰ অঞ্চলত ভূমিস্খলনৰ সৃষ্টি হ'ব পাৰে।\n\n🏃 এতিয়াই সুৰক্ষিত স্থানলৈ স্থানান্তৰিত হওক।\n🚫 পাহাৰ, থিয় ঢাল আৰু নদীৰ খাঁজ এৰাই চলক।\n📢 স্থানীয় কৰ্তৃপক্ষৰ নিৰ্দেশনা পাল কৰক।`,
    bn: `🔴 তীব্র ভূমিধসের সতর্কতা\n\nক্ষতিগ্রস্ত এলাকা: ${locationName}\nভারী বৃষ্টির কারণে আপনার এলাকায় ভয়াবহ ভূমিধস হতে পারে।\n\n🏃 এখনই নিরাপদ স্থানে সরে যান।\n🚫 পাহাড়, খাড়া ঢাল এবং নদীর চ্যানেল এড়িয়ে চলুন।\n📢 স্থানীয় কর্তৃপক্ষের নির্দেশাবলী মেনে চলুন।`,
    ne: `🔴 चरम पहिरोको चेतावनी\n\nप्रभावित क्षेत्र: ${locationName}\nभारी वर्षाले गर्दा तपाईंको क्षेत्रमा पहिरो जान सक्छ।\n\n🏃 तुरुन्त सुरक्षित ठाउँमा जानुहोस्।\n🚫 डाँडा, ठाडो भिरालो र नदी किनारबाट टाढा रहनुहोस्।\n📢 स्थानीय अधिकारीहरूको निर्देशन पालना गर्नुहोस्।`,
    mn: `🔴 লৈমাই তাংবগী চেকশিনৱা পাওতাক\n\nঅকোনবা মফম: ${locationName}\nঅকাংবা নোংচুদুনা অপোনবা মফমদা লৈমাই তাংবা য়াই।\n\n🏃 চেফোং মফমদা থুনা চৎলু।\n🚫 চিংশাং অমসুং তুরেল পরিদা চৎখিগনু।\n📢 মফম অদুগী লৈঙাকফমগী পাওতাক ইন্নু।`
  };
}

export function explainAiRiskReasoning(zone: LandslideZone) {
  return {
    factors: [
      { name: 'Rainfall Intensity', value: `${zone.rainfall} mm/h`, threshold: '> 75 mm/h', impact: 'High Hydrostatic Pressure' },
      { name: 'Soil Moisture Saturation', value: `${zone.soilMoisture}%`, threshold: '> 80%', impact: 'Pore Water Saturation' },
      { name: 'Slope Gradient', value: `${zone.slopeAngle}°`, threshold: '> 35°', impact: 'Gravitational Shear Stress' },
      { name: 'Historical Landslides', value: `${zone.historicalLandslides} Recorded`, threshold: '> 2 Events', impact: 'Structural Fault Sensitivity' },
      { name: 'Ground Instability', value: zone.instabilityRating, threshold: 'High/Severe', impact: 'Disintegrated Subsurface Layer' }
    ],
    explanation: `High rainfall (${zone.rainfall} mm/h) combined with elevated soil moisture saturation (${zone.soilMoisture}%), steep terrain gradient (${zone.slopeAngle}°), and historical landslide activity in ${zone.name} elevated the calculated risk index to ${zone.riskScore}%. Gravitational shear forces exceed basal friction boundaries.`
  };
}
