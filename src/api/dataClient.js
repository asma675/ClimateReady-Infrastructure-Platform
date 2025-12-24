// Data access layer
// - Uses Supabase (Postgres) when VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY are set.
// - Falls back to localStorage seeded demo data when env vars are missing (so the app always runs).

import { supabase, hasSupabase } from "./supabaseClient";

const STORAGE_KEY = "resilient_gov_data_v1";

function nowIso() {
  return new Date().toISOString();
}

function safeJsonParse(value, fallback) {
  try { return JSON.parse(value); } catch { return fallback; }
}

function makeId(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function loadStore() {
  // In the browser, keep a durable local store for demo mode and for
  // entities that are not backed by Supabase (e.g., RiskAlert).
  if (typeof window === "undefined") return seedStore();

  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = safeJsonParse(raw, null);
  const seeded = seedStore();

  // First run: seed
  if (!parsed) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  // Schema upgrade: merge in any new keys/seed data without overwriting user edits
  const version = parsed.__schemaVersion ?? 1;
  if (version !== 2) {
    const merged = {
      ...seeded,
      ...parsed,
      InfrastructureAsset: (parsed.InfrastructureAsset && parsed.InfrastructureAsset.length) ? parsed.InfrastructureAsset : seeded.InfrastructureAsset,
      InvestmentProject: (parsed.InvestmentProject && parsed.InvestmentProject.length) ? parsed.InvestmentProject : seeded.InvestmentProject,
      RiskAlert: (parsed.RiskAlert && parsed.RiskAlert.length) ? parsed.RiskAlert : seeded.RiskAlert
    };
    merged.__schemaVersion = 2;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  }

  // If someone cleared arrays accidentally, re-seed just those arrays
  const repaired = { ...parsed };
  let changed = false;
  for (const key of ["InfrastructureAsset", "InvestmentProject", "RiskAlert"]) {
    if (!Array.isArray(repaired[key]) || repaired[key].length === 0) {
      repaired[key] = seeded[key];
      changed = true;
    }
  }
  if (changed) {
    repaired.__schemaVersion = 2;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(repaired));
    return repaired;
  }

  return parsed;
}


function saveStore(store) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function sortByField(items, orderBy) {
  if (!orderBy) return [...items];
  const desc = String(orderBy).startsWith("-");
  const field = desc ? String(orderBy).slice(1) : String(orderBy);
  const sorted = [...items].sort((a, b) => {
    const av = a?.[field];
    const bv = b?.[field];
    if (typeof av === "number" && typeof bv === "number") return av - bv;
    return String(av ?? "").localeCompare(String(bv ?? ""));
  });
  return desc ? sorted.reverse() : sorted;
}

function seedStore() {
  const ts = nowIso();
  return {
    __schemaVersion: 2,
    InfrastructureAsset: [
      {
        id: "asset_01",
        name: "North Substation A",
        asset_type: "Electrical Substation",
        region: "Ontario",
        municipality: "Brampton",
        lat: 43.7315,
        lng: -79.7624,
        time_horizon: "current",
        overall_risk_score: 72,
        climate_risks: { wildfire_risk: 12, flood_risk: 65, heat_risk: 54, storm_risk: 78 },
        population_served: 125000,
        equity_score: 0.62,
        updated_at: ts
      },
      {
        id: "asset_02",
        name: "Trans-Canada Highway Bridge — Calgary Section",
        asset_type: "Bridge",
        region: "Alberta",
        municipality: "Calgary",
        lat: 51.0447,
        lng: -114.0719,
        time_horizon: "current",
        overall_risk_score: 83,
        climate_risks: { wildfire_risk: 28, flood_risk: 44, heat_risk: 61, storm_risk: 32 },
        population_served: 125000,
        equity_score: 0.58,
        updated_at: ts
      },
      {
        id: "asset_03",
        name: "Metro Vancouver — Pumping Station 7",
        asset_type: "Water Pump Station",
        region: "British Columbia",
        municipality: "Vancouver",
        lat: 49.2827,
        lng: -123.1207,
        time_horizon: "current",
        overall_risk_score: 58,
        climate_risks: { wildfire_risk: 9, flood_risk: 52, heat_risk: 33, storm_risk: 48 },
        population_served: 210000,
        equity_score: 0.49,
        updated_at: ts
      },
      {
        id: "asset_04",
        name: "Downtown Toronto — Transit Hub",
        asset_type: "Transit Station",
        region: "Ontario",
        municipality: "Toronto",
        lat: 43.6532,
        lng: -79.3832,
        time_horizon: "current",
        overall_risk_score: 49,
        climate_risks: { wildfire_risk: 3, flood_risk: 39, heat_risk: 44, storm_risk: 41 },
        population_served: 420000,
        equity_score: 0.67,
        updated_at: ts
      },
      {
        id: "asset_05",
        name: "Halifax Harbour — Coastal Protection Segment",
        asset_type: "Coastal Barrier",
        region: "Nova Scotia",
        municipality: "Halifax",
        lat: 44.6488,
        lng: -63.5752,
        time_horizon: "current",
        overall_risk_score: 64,
        climate_risks: { wildfire_risk: 6, flood_risk: 71, heat_risk: 21, storm_risk: 69 },
        population_served: 98000,
        equity_score: 0.44,
        updated_at: ts
      },
      {
        id: "asset_06",
        name: "Montréal — Hospital District Power Feed",
        asset_type: "Electrical Feeder",
        region: "Quebec",
        municipality: "Montréal",
        lat: 45.5017,
        lng: -73.5673,
        time_horizon: "current",
        overall_risk_score: 57,
        climate_risks: { wildfire_risk: 4, flood_risk: 42, heat_risk: 55, storm_risk: 28 },
        population_served: 150000,
        equity_score: 0.72,
        updated_at: ts
      },
      {
        id: "asset_07",
        name: "Winnipeg — Water Treatment Intake",
        asset_type: "Water Treatment Plant",
        region: "Manitoba",
        municipality: "Winnipeg",
        lat: 49.8951,
        lng: -97.1384,
        time_horizon: "current",
        overall_risk_score: 46,
        climate_risks: { wildfire_risk: 10, flood_risk: 31, heat_risk: 49, storm_risk: 35 },
        population_served: 70500,
        equity_score: 0.51,
        updated_at: ts
      },
      {
        id: "asset_08",
        name: "Saskatoon — Rail Junction",
        asset_type: "Rail",
        region: "Saskatchewan",
        municipality: "Saskatoon",
        lat: 52.1332,
        lng: -106.6700,
        time_horizon: "current",
        overall_risk_score: 52,
        climate_risks: { wildfire_risk: 18, flood_risk: 26, heat_risk: 50, storm_risk: 30 },
        population_served: 64000,
        equity_score: 0.39,
        updated_at: ts
      },
      {
        id: "asset_09",
        name: "St. John’s — Emergency Operations Centre",
        asset_type: "EOC",
        region: "Newfoundland and Labrador",
        municipality: "St. John's",
        lat: 47.5615,
        lng: -52.7126,
        time_horizon: "current",
        overall_risk_score: 60,
        climate_risks: { wildfire_risk: 2, flood_risk: 55, heat_risk: 18, storm_risk: 74 },
        population_served: 21000,
        equity_score: 0.46,
        updated_at: ts
      },
      {
        id: "asset_10",
        name: "Ottawa — Government Services Data Node",
        asset_type: "Data Centre",
        region: "Ontario",
        municipality: "Ottawa",
        lat: 45.4215,
        lng: -75.6972,
        time_horizon: "current",
        overall_risk_score: 41,
        climate_risks: { wildfire_risk: 3, flood_risk: 29, heat_risk: 36, storm_risk: 27 },
        population_served: 300000,
        equity_score: 0.63,
        updated_at: ts
      }
    ],
    InvestmentProject: [
      {
        id: "proj_01",
        title: "Bridge Deck Drainage Retrofit",
        description: "Reduce flood exposure and icing risk on critical corridor.",
        asset_id: "asset_02",
        status: "under_review",
        cost: 1200000,
        risk_reduction_impact: 0.78,
        population_benefit: 0.62,
        equity_score: 0.41,
        cost_benefit_ratio: 1.9,
        priority_rank: 1,
        updated_at: ts
      },
      {
        id: "proj_02",
        title: "Substation Flood Barrier + SCADA Hardening",
        description: "Add perimeter protection and improve sensor redundancy.",
        asset_id: "asset_01",
        status: "approved",
        cost: 850000,
        risk_reduction_impact: 0.66,
        population_benefit: 0.70,
        equity_score: 0.55,
        cost_benefit_ratio: 1.6,
        priority_rank: 2,
        updated_at: ts
      },
      {
        id: "proj_03",
        title: "Coastal Surge Gate Upgrade",
        description: "Mitigate surge risk and extend lifespan of coastal barrier segment.",
        asset_id: "asset_05",
        status: "proposed",
        cost: 2300000,
        risk_reduction_impact: 0.72,
        population_benefit: 0.48,
        equity_score: 0.43,
        cost_benefit_ratio: 1.3,
        priority_rank: 3,
        updated_at: ts
      }
    ],
    RiskAlert: [
      {
        id: "alert_01",
        title: "Rapid Risk Increase — Trans-Canada Highway Bridge (Calgary Section)",
        description: "Risk score increased due to multiple active alerts and short-term forecast conditions. Immediate attention recommended.",
        severity: "high",
        status: "active",
        alert_category: "infrastructure",
        issued_at: ts,
        data_source: "ClimateReady Signals",
        geolocation: { lat: 51.0447, lng: -114.0719, region: "Calgary, Alberta" },
        previous_risk_score: 68,
        new_risk_score: 83,
        risk_score_change: 15,
        affected_population: 125000,
        recommended_actions: [
          "Activate emergency response readiness team",
          "Inspect drainage + expansion joints",
          "Coordinate with municipal traffic management"
        ]
      },
      {
        id: "alert_02",
        title: "Public Concern Alert — Calgary",
        description: "Online discussions indicate increased concern related to heat impacts and vulnerable populations.",
        severity: "high",
        status: "active",
        alert_category: "public_concern",
        issued_at: ts,
        data_source: "Social Signals (demo)",
        geolocation: { lat: 51.0447, lng: -114.0719, region: "Calgary, Alberta" },
        previous_risk_score: 0,
        new_risk_score: 0,
        risk_score_change: 0,
        affected_population: 98000,
        recommended_actions: [
          "Increase cooling-centre capacity messaging",
          "Coordinate with public health partners"
        ]
      },
      {
        id: "alert_03",
        title: "Heat Advisory — Metro Vancouver",
        description: "Prolonged heat event expected; elevated heat-stress risk for vulnerable populations.",
        severity: "medium",
        status: "active",
        alert_category: "weather",
        issued_at: ts,
        data_source: "Environment Canada (demo)",
        geolocation: { lat: 49.2827, lng: -123.1207, region: "Vancouver, British Columbia" },
        previous_risk_score: 0,
        new_risk_score: 0,
        risk_score_change: 0,
        affected_population: 50000,
        recommended_actions: [
          "Coordinate transit cooling measures",
          "Monitor water demand + pump station loads"
        ]
      }
    ]
  };
}


function entityToTable(entityName) {
  switch (entityName) {
    case "InfrastructureAsset": return "infrastructure_assets";
    case "InvestmentProject": return "investment_projects";
    default: return null;
  }
}

function normalizeRow(entityName, row) {
  // Keep existing UI fields stable (many components expect lat/lng)
  if (!row) return row;
  if (entityName === "InfrastructureAsset") {
    const lat = row.lat ?? row.latitude;
    const lng = row.lng ?? row.longitude;
    return { ...row, lat, lng };
  }
  return row;
}

class EntityApi {
  constructor(entityName) {
    this.entityName = entityName;
    this.table = entityToTable(entityName);
  }

  async list(orderBy, limit) {
    if (hasSupabase && this.table) {
      let q = supabase.from(this.table).select("*");
      if (orderBy) {
        const desc = String(orderBy).startsWith("-");
        const field = desc ? String(orderBy).slice(1) : String(orderBy);
        q = q.order(field, { ascending: !desc });
      }
      if (typeof limit === "number") q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      const rows = (data ?? []).map((r) => normalizeRow(this.entityName, r));
      // If Supabase is configured but table is empty, fall back to seeded demo data
      if (rows.length === 0) {
        const store = loadStore();
        const items = store[this.entityName] ?? [];
        const sorted = sortByField(items, orderBy);
        return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
      }
      return rows;
    }

    // local fallback
    const store = loadStore();
    const items = store[this.entityName] ?? [];
    const sorted = sortByField(items, orderBy);
    return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
  }

  async filter(where = {}, orderBy, limit) {
    if (hasSupabase && this.table) {
      let q = supabase.from(this.table).select("*");
      for (const [key, value] of Object.entries(where || {})) {
        if (value === undefined) continue;
        if (Array.isArray(value)) q = q.in(key, value);
        else q = q.eq(key, value);
      }
      if (orderBy) {
        const desc = String(orderBy).startsWith("-");
        const field = desc ? String(orderBy).slice(1) : String(orderBy);
        q = q.order(field, { ascending: !desc });
      }
      if (typeof limit === "number") q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      const rows = (data ?? []).map((r) => normalizeRow(this.entityName, r));
      // If Supabase is configured but table is empty, fall back to seeded demo data
      if (rows.length === 0) {
        const store = loadStore();
        const items = store[this.entityName] ?? [];
        const sorted = sortByField(items, orderBy);
        return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
      }
      return rows;
    }

    // local fallback
    const store = loadStore();
    const items = store[this.entityName] ?? [];
    const filtered = items.filter((item) => {
      return Object.entries(where || {}).every(([k, v]) => {
        if (v === undefined) return true;
        const iv = item?.[k];
        if (Array.isArray(v)) return v.includes(iv);
        return iv === v;
      });
    });
    const sorted = sortByField(filtered, orderBy);
    return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
  }

  async create(data) {
    if (hasSupabase && this.table) {
      const payload = { ...data };

      // DB columns use latitude/longitude; UI often uses lat/lng
      if (this.entityName === "InfrastructureAsset") {
        if (payload.lat !== undefined && payload.latitude === undefined) payload.latitude = payload.lat;
        if (payload.lng !== undefined && payload.longitude === undefined) payload.longitude = payload.lng;
      }

      const { data: created, error } = await supabase
        .from(this.table)
        .insert(payload)
        .select("*")
        .single();

      if (error) throw error;
      return normalizeRow(this.entityName, created);
    }

    // local fallback
    const store = loadStore();
    const items = store[this.entityName] ?? [];
    const id = data?.id ?? makeId(this.entityName.toLowerCase());
    const next = { ...data, id, updated_at: nowIso() };
    store[this.entityName] = [next, ...items];
    saveStore(store);
    return next;
  }

  async update(id, patch) {
    if (hasSupabase && this.table) {
      const payload = { ...patch };

      if (this.entityName === "InfrastructureAsset") {
        if (payload.lat !== undefined && payload.latitude === undefined) payload.latitude = payload.lat;
        if (payload.lng !== undefined && payload.longitude === undefined) payload.longitude = payload.lng;
      }

      const { data: updated, error } = await supabase
        .from(this.table)
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

      if (error) throw error;
      return normalizeRow(this.entityName, updated);
    }

    // local fallback
    const store = loadStore();
    const items = store[this.entityName] ?? [];
    const idx = items.findIndex((x) => x.id === id);
    if (idx === -1) throw new Error(`Not found: ${this.entityName} ${id}`);
    const next = { ...items[idx], ...patch, updated_at: nowIso() };
    const updatedItems = [...items];
    updatedItems[idx] = next;
    store[this.entityName] = updatedItems;
    saveStore(store);
    return next;
  }
}

export const govData = {
  entities: {
    InfrastructureAsset: new EntityApi("InfrastructureAsset"),
    InvestmentProject: new EntityApi("InvestmentProject"),
    // Used by Live Monitoring (alert feed, rapid risk changes, counters)
    RiskAlert: new EntityApi("RiskAlert"),
  },

  // Used by the Live Monitoring action buttons. These are implemented as
  // lightweight client-side helpers so the UI stays functional without
  // requiring serverless functions.
  functions: {
    /**
     * Simulates fetching external feeds and creating new alerts.
     * @param {string} name
     */
    async invoke(name) {
      const store = loadStore();

      const now = new Date();
      const raw = String(name || "");
      const norm = raw.toLowerCase().replace(/[^a-z0-9]/g, "");

      // Accept both snake_case and camelCase names
      if (norm === 'fetchweatheralerts') {
        const newAlert = {
          id: `alert_${Math.random().toString(36).slice(2, 9)}`,
          type: 'weather',
          title: 'Winter Storm Advisory - Prairie Region',
          description: 'ECCC issued a winter storm advisory. Monitor road access and backup power readiness.',
          severity: 'medium',
          status: 'active',
          location: 'Prairie Region',
          affected_assets: ['asset_2'],
          created_at: now.toISOString(),
          risk_score_change: 7,
          population_affected: 18000,
        };
        store.RiskAlert.unshift(newAlert);
        saveStore(store);
        return { ok: true, created: 1 };
      }

      if (norm === 'analyzesocialmedia') {
        const newAlert = {
          id: `alert_${Math.random().toString(36).slice(2, 9)}`,
          type: 'social',
          title: 'Public Concern Alert - Transit Cooling Centers',
          description: 'Social signals indicate rising concern about heat impacts and cooling center access.',
          severity: 'high',
          status: 'active',
          location: 'Urban Corridor',
          affected_assets: ['asset_7'],
          created_at: now.toISOString(),
          risk_score_change: 12,
          population_affected: 52000,
        };
        store.RiskAlert.unshift(newAlert);
        saveStore(store);
        return { ok: true, created: 1 };
      }

      if (norm === 'updateriskscores') {
        // Small synthetic update to demonstrate "rapid risk changes".
        const asset = store.InfrastructureAsset?.[0];
        if (asset) {
          const prev = Number(asset.overall_risk_score || 0);
          asset.overall_risk_score = Math.min(100, prev + 5);
        }
        saveStore(store);
        return { ok: true };
      }

      // Unknown function name - no-op.
      return { ok: true };
    }
  }
};
