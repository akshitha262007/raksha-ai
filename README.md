# RAKSHA-AI | AI-Based Landslide Early Warning & Risk Monitoring System in NER
> **Smart India Hackathon (SIH) Problem Statement 26001**  
> *Developed for Ministry of Development of North Eastern Region (MDoNER) / ISRO Bhuvan GIS Integration*

---

## 🌟 Overview
**RAKSHA-AI** is a high-fidelity early warning and disaster response optimization platform tailored for landslide-prone zones in the North-Eastern Region (NER) of India (*Arunachal Pradesh, Meghalaya, Sikkim, Assam, Nagaland*).

The platform continuously evaluates multi-spectral telemetry parameters, calculates dynamic landslide risk indexes (0-100%), and optimizes responder fleet allocation (NDRF & SDRF battalions) using spatial proximity binding matrix algorithms.

---

## 🚀 Key Features

1. **Algorithmic Landslide Risk Evaluation Engine**
   - Weighted formula: **Precipitation (50%) + Soil Moisture Saturation (30%) + Slope Gradient (20%)**
   - Qualitative Alert Classification:
     - 🟢 **Safe** (< 40%)
     - 🟠 **Moderate** (40% - 70%)
     - 🔴 **Critical** (> 70%)

2. **Citizen Early Warning System (`🚨 Citizen Alerts`)**
   - Multilingual alert generator (English, Hindi, Assamese, Bengali, Nepali, Manipuri).
   - Browser Text-to-Speech (`🔊 PLAY VOICE ALERT`) for accessibility.
   - **Real SMS Test Alert Endpoint** (`POST /api/test-sms`) for sending single test SMS to authorized test mobile numbers.
   - 8-Step Emergency Gateway Dispatch Simulation for mass geofence warning.

3. **Emergency Response Accountability & Deployment Tracking (`🚑 Response Operations`)**
   - Multi-agency battalion assignment (NDRF, SDRF, Police, Evacuation).
   - 5-State lifecycle tracking & 4-Level Automatic Escalation Workflow.
   - Live GPS vector movement simulation on ISRO Bhuvan map.

4. **Geospatial Proximity Matrix (`Math.hypot`)**
   - Coordinates emergency responder nodes (NDRF/SDRF) to critical landslide zones based on minimal spatial Euclidean distance.

5. **Live Telemetry Simulator & Log Ticker**
   - 4-second streaming sync clock simulating localized rainfall anomalies and soil absorption gains.
   - Real-time terminal log ticker with filter controls.

---

## 📱 Real SMS Test Setup

To enable real SMS delivery to your phone during hackathon evaluation:

1. **Copy Environment Template**:
   ```bash
   cp .env.example .env.local
   ```

2. **Configure Provider Credentials in `.env.local`**:
   ```env
   SMS_TEST_MODE=true
   SMS_PROVIDER=twilio
   SMS_ACCOUNT_ID=your_twilio_account_sid
   SMS_API_SECRET=your_twilio_auth_token
   SMS_SENDER_ID=your_twilio_phone_number
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Run Real SMS Test**:
   - Open **🚨 Citizen Alerts** -> **📱 SEND TEST SMS — REAL MESSAGE**.
   - Enter your phone number in international format (e.g., `+919876543210`).
   - Click **`📱 SEND TEST SMS`** and confirm in the dialog box.
   - The backend API (`POST /api/test-sms`) will dispatch the SMS via your configured provider and return submission status & message SID.

> **Note on DLT / India Compliance**: If using an Indian SMS gateway (e.g. Fast2SMS / ValueFirst / ACL Mobile), register your PE-ID and Sender ID as required by TRAI DLT regulations. For development and testing, standard Twilio verified numbers work directly.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict enforcement)
- **Styling**: Tailwind CSS (Dark slate technical theme)
- **Icons**: Lucide React
- **Deployment**: Vercel / Netlify / Cloudflare Pages / Custom Node Server

---

## 💻 Local Development Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 One-Click Public Deployment (Vercel / Netlify)

### Option A: Deploy to Vercel (Recommended)
1. Push this code repository to GitHub / GitLab / Bitbucket.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository. Vercel will automatically detect Next.js settings.
4. Add environment variables (`SMS_TEST_MODE`, `SMS_PROVIDER`, `SMS_ACCOUNT_ID`, `SMS_API_SECRET`, `SMS_SENDER_ID`).
5. Click **"Deploy"**. Your app will be live on a public `.vercel.app` domain in 60 seconds!

---

## 🗺️ Monitored NER Geographical Sectors

| Sector | State | Coordinates | Geology |
| :--- | :--- | :--- | :--- |
| **Tawang Sector 4** | Arunachal Pradesh | 27.586° N, 91.859° E | Weathered Gneiss & Loose Granite |
| **Cherrapunji Plateau** | Meghalaya | 25.298° N, 91.733° E | Saturated Limestone & Karst |
| **Gangtok East Ridge** | Sikkim | 27.338° N, 88.606° E | Disintegrated Mica Schists |
| **Haflong Hill Cut** | Assam | 25.170° N, 93.016° E | Unconsolidated Clay & Sand |
| **Kohima Bypass Pass** | Nagaland | 25.675° N, 94.108° E | Fractured Disintegrated Shale |
