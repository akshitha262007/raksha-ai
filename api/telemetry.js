// Mock Live Sensor Stream for RAKSHA-AI Engine (Vercel Serverless Function)
export default function handler(req, res) {
  // Add realistic micro-variations to simulate sensor jitter
  const randomJitter = (base, range) => parseFloat((base + (Math.random() * range - range / 2)).toFixed(2));

  const telemetryPayload = {
    timestamp: new Date().toISOString(),
    node_id: "Node #7-Mangan",
    rssi: -84,
    sensors: {
      precipitation_24h_mm: randomJitter(185, 5),
      soil_saturation_pct: randomJitter(78, 2),
      slope_gradient_deg: 42.5,
      ndvi_stability: 0.15,
      micro_seismic_g: randomJitter(0.077, 0.005),
      pore_pressure_kpa: randomJitter(47.1, 1.2),
      inclinometer_mm_h: randomJitter(3.43, 0.2)
    }
  };

  res.status(200).json(telemetryPayload);
}
