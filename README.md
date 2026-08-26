# RAKSHA-AI Enterprise Baseline

**Self-Contained Landslide Hazard Risk & Rescue Optimization System**

RAKSHA-AI is a modular, standalone, product-ready enterprise system for evaluating landslide hazard risk and optimizing emergency rescue resource dispatch. Built specifically for high-risk disaster sectors such as Sikkim and the North-Eastern Region (NER) of India, it operates entirely on open telemetry/satellite data models without relying on paid SMS gateways or restricted APIs.

---

## 🏗️ Architecture Overview

```
fearless-hopper/
├── README.md                  # System Orchestration & Setup Documentation
├── backend/                   # Python FastAPI Backend Service
│   ├── main.py                # App entrypoint, CORS setup, router mounting
│   ├── requirements.txt       # Dependencies (fastapi, uvicorn, scipy, etc.)
│   ├── api/                   # Router endpoints (/predict-hazard, /optimize-dispatch)
│   ├── models/                # Pydantic schemas (Hazard, Dispatch)
│   └── services/              # Heuristic Risk Pipeline & SciPy LP Transportation Solver
└── frontend/                  # React + Vite Frontend SPA
    ├── package.json           # Dependencies (react, leaflet, react-leaflet, lucide-react)
    ├── vite.config.js         # Vite bundler & API proxy configuration
    ├── index.html             # HTML Shell with Leaflet CSS
    └── src/                   # React Components (MapView, Predictor, Dispatcher, Push Alerts)
```

---

## ⚡ Quickstart Guide

### 1. Running Backend (`/backend`)

**Prerequisites**: Python 3.9+

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server (runs on http://localhost:8000)
python main.py
# Alternatively:
uvicorn main:app --reload --port 8000
```

- **Swagger API Docs**: Interactive Swagger documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

### 2. Running Frontend (`/frontend`)

**Prerequisites**: Node.js 18+ & npm

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server (runs on http://localhost:3000)
npm run dev
```

- **Open SPA**: Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Endpoints

### 1. Landslide Hazard Risk Prediction
- **Endpoint**: `POST /api/predict-hazard`
- **Request Body**:
  ```json
  {
    "slope_angle": 42.5,
    "rainfall_24h": 185.0,
    "soil_moisture": 78.0,
    "ndvi": 0.15,
    "location_name": "Gangtok-Pakyong Belt, Sikkim"
  }
  ```
- **Response**: Risk score ($0.0 - 1.0$), risk rating (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), model confidence level, key factors, and SOP recommendations.

### 2. NDRF / SDRF Resource Dispatch Optimization
- **Endpoint**: `POST /api/optimize-dispatch`
- **Request Body**: Accepts list of rescue supply depots and affected disaster sites with capacities and demands.
- **Algorithm**: Solves linear programming transportation model via `scipy.optimize.linprog(method='highs')`.
- **Response**: Status (`OPTIMAL`), minimum transport cost metric, and detailed allocation matrix routing units from depots to sites.

---

## 🔔 Browser Web Push Alerts (VAPID)

RAKSHA-AI implements browser-native Web Push notifications utilizing the VAPID key handshake pattern. This ensures zero dependence on third-party paid SMS gateways while delivering immediate geofenced emergency alerts to user browsers.

---

## 🛡️ License

Enterprise Product Baseline — RAKSHA-AI System Architecture.
