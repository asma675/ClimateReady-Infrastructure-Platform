# 🌍 ClimateReady — Climate Risk Infrastructure Mapping Platform

ClimateReady is an interactive web application that visualizes **climate risks to critical infrastructure** across Canada.
It helps governments, planners, and emergency managers **identify vulnerable assets, assess risk levels, and prioritize mitigation investments** using data-driven insights.

---

## 🚀 Features

### 🗺️ Interactive Climate Risk Map

* Map-based visualization of infrastructure assets (hospitals, bridges, power stations, water systems, etc.)
* Dynamic marker sizing based on **overall climate risk score**
* Color-coded risk levels:

  * 🟢 Low (0–29%)
  * 🟡 Medium (30–59%)
  * 🔴 High (60%+)

### 🎛️ Advanced Filters

* **Risk Type Filters**

  * Flood
  * Wildfire
  * Heat
  * Storm
* **Time Horizon Selection**

  * Current
  * 2030
  * 2050

### 📊 Asset Insights

* Asset-level risk scores
* Climate risk breakdowns by hazard type
* Population served (when available)
* Location details (municipality, province)

### 📌 Project Creation

* Create and track **investment projects** directly from high-risk assets
* Supports climate adaptation and resilience planning workflows

### 🖥️ Fullscreen & Responsive Design

* Optimized for dashboards, presentations, and large displays
* Smooth animations powered by Framer Motion

---

## 🧠 Use Cases

* Government climate adaptation planning
* Infrastructure resilience assessments
* Emergency preparedness & risk mitigation
* Capital planning & investment prioritization
* Climate analytics and policy decision support

---

## 🛠️ Tech Stack

**Frontend**

* React
* React Router
* TanStack React Query
* Framer Motion
* Tailwind CSS
* shadcn/ui

**Mapping**

* Leaflet
* React Leaflet
* OpenStreetMap tiles

**Icons & UI**

* Lucide React
* Custom emoji-based asset icons

**Data Layer**

* Mocked government-style API (`govData`)
* Supports extensible schemas for real datasets

---

## 📂 Project Structure

```
src/
├── pages/
│   └── RiskMap.jsx
├── components/
│   ├── map/
│   │   ├── RiskMapView.jsx
│   │   └── MapFilters.jsx
│   ├── modals/
│   │   ├── AssetDetailModal.jsx
│   │   └── CreateProjectModal.jsx
├── api/
│   └── dataClient.js
├── utils/
│   └── createPageUrl.js
```

---

## ⚙️ Installation & Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Then open:

```
http://localhost:3000
```

---

## 🧩 Data Model (Example)

```js
{
  id: "asset_001",
  name: "Central Hospital",
  asset_type: "hospital",
  time_horizon: "2030",
  latitude: 45.4215,
  longitude: -75.6972,
  overall_risk_score: 68,
  climate_risks: {
    flood_risk: 72,
    wildfire_risk: 40,
    heat_risk: 80,
    storm_risk: 55
  },
  population_served: 250000
}
```

---

## 🔮 Roadmap / Future Enhancements

* Real-time climate and satellite data integration
* Scenario comparison animations (Current → 2030 → 2050)
* Exportable risk reports (PDF / CSV)
* AI-powered risk forecasting models
* Role-based access control for government users

---

## 🤝 Contributing

Contributions are welcome.
Please open an issue or submit a pull request for enhancements or bug fixes.

---

## 📜 License

MIT License

---

## 🌱 Why ClimateReady?

ClimateReady is designed to bridge the gap between **climate science, infrastructure data, and actionable decision-making** — empowering organizations to prepare for climate impacts **before emergencies occur**.

## By: Asma Ahmed


