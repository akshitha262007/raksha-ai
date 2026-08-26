/**
 * RAKSHA-AI Drone Recon & Waypoint Export Service
 * Generates survey flight grids and exports ArduPilot/PX4 compatible KML/JSON files.
 */

export function generateDroneWaypoints(centerLat = 27.3389, centerLng = 88.6065) {
  const waypoints = [];
  const radius = 0.015; // Approx 1.5km grid radius

  const gridOffsets = [
    { name: 'TAKEOFF / WP-01', latOff: 0.0, lngOff: 0.0, alt: 50 },
    { name: 'MANGAN CUT WP-02', latOff: radius, lngOff: radius, alt: 120 },
    { name: 'PAKYONG SLIDE WP-03', latOff: radius, lngOff: -radius, alt: 150 },
    { name: 'GANGTOK SLOPE WP-04', latOff: -radius, lngOff: -radius, alt: 140 },
    { name: 'SINGTAM RIVER WP-05', latOff: -radius, lngOff: radius, alt: 110 },
    { name: 'RECON RETURN WP-06', latOff: 0.0, lngOff: 0.0, alt: 60 }
  ];

  return gridOffsets.map((pt, idx) => ({
    id: `WP-${idx + 1}`,
    name: pt.name,
    latitude: parseFloat((centerLat + pt.latOff).toFixed(5)),
    longitude: parseFloat((centerLng + pt.lngOff).toFixed(5)),
    altitudeMeters: pt.alt
  }));
}

export function downloadKML(waypoints, filename = 'RAKSHA-AI_Drone_Survey_FlightPlan.kml') {
  const kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>RAKSHA-AI Autonomous Drone Survey Flight Plan</name>
    <description>SIH PS 26001 ArduPilot/PX4 Waypoints Grid for Sikkim Landslide Inspection</description>
    ${waypoints.map(wp => `
    <Placemark>
      <name>${wp.name}</name>
      <description>Altitude: ${wp.altitudeMeters}m AGL</description>
      <Point>
        <coordinates>${wp.longitude},${wp.latitude},${wp.altitudeMeters}</coordinates>
      </Point>
    </Placemark>`).join('\n')}
  </Document>
</kml>`;

  const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
