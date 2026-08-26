/**
 * RAKSHA-AI OASIS Common Alerting Protocol (CAP v1.2) Exporter Service
 * Generates SACHET national cell-broadcasting XML & JSON payloads.
 */

export function generateCAP12Payload(params = {}, hazardResult = {}) {
  const riskScore = hazardResult.risk_score || 0.75;
  const category = hazardResult.risk_category || 'HIGH';
  const location = params.location_name || 'Gangtok-Pakyong Belt, Sikkim Sector';
  const nowISO = new Date().toISOString();

  const xmlPayload = `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>RAKSHA-CAP-${Date.now()}</identifier>
  <sender>ndma.sikkim.rakshaai@gov.in</sender>
  <sent>${nowISO}</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <code>SACHET-CELL-BROADCAST-V1</code>
  <info>
    <category>Geo</category>
    <event>Landslide Hazard Warning</event>
    <urgency>${category === 'CRITICAL' ? 'Immediate' : 'Expected'}</urgency>
    <severity>${category === 'CRITICAL' ? 'Extreme' : 'Severe'}</severity>
    <certainty>Observed</certainty>
    <eventCode>
      <valueName>SAME</valueName>
      <value>LSW</value>
    </eventCode>
    <headline>🚨 RAKSHA-AI LANDSLIDE HAZARD ALERT: ${location}</headline>
    <description>24h Precipitation: ${params.rainfall_24h || 185}mm | Slope: ${params.slope_angle || 42.5}° | Risk Index: ${Math.round(riskScore * 100)}%. Mandatory evacuation and SOP protocols active.</description>
    <instruction>Evacuate downslope zones immediately. Avoid NH-10 Pakyong Cut route.</instruction>
    <area>
      <areaDesc>${location}</areaDesc>
      <circle>27.3389,88.6065,5000</circle>
    </area>
  </info>
</alert>`;

  return {
    xmlPayload,
    jsonPayload: {
      alertId: `RAKSHA-CAP-${Date.now()}`,
      sent: nowISO,
      status: 'Actual',
      category: 'Geo',
      event: 'Landslide Hazard Warning',
      location,
      riskIndex: Math.round(riskScore * 100),
      categoryRating: category
    }
  };
}

export function downloadCAP12XML(params, hazardResult) {
  const { xmlPayload } = generateCAP12Payload(params, hazardResult);
  const blob = new Blob([xmlPayload], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CAP12_Landslide_Alert_SACHET_${Date.now()}.xml`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
