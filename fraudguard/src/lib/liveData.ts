// src/lib/liveData.ts
//
// Fetches real rows from Supabase and returns them shaped EXACTLY like
// the interfaces in src/lib/data.ts (Project, Vendor) — so your existing
// components (Vendors.tsx, Projects list, etc.) work with either source.
//
// MIGRATION PATH (don't rewrite everything at once):
//   1. Keep using `@/lib/data` (static) everywhere for now — nothing breaks.
//   2. In ONE component at a time, swap the import:
//        - import { VENDORS } from '@/lib/data'
//        + import { useLiveVendors } from '@/lib/liveData'
//      and call the hook instead of using the static array directly.
//   3. Once every page is swapped, `data.ts` becomes optional demo/seed data.
//
// Run db/schema_and_rls.sql AND db/schema_additions.sql in Supabase before
// using this file — it selects columns that only exist after both.

import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import type { Project, Vendor, Risk, VerifyStatus } from './data';

function scoreToRisk(score: number): Risk {
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 30) return 'MEDIUM';
  return 'LOW';
}

interface ProjectRow {
  id: string;
  name: string;
  state: string;
  district: string;
  constituency: string | null;
  project_type: string;
  amount_sanctioned: number;
  amount_spent: number;
  risk_score: number;
  finding: string;
  verify_status: VerifyStatus;
  fiscal_year: string;
  latitude: number | null;
  longitude: number | null;
  vendors: { name: string } | null;
}

// Rough equirectangular projection of India's bounding box onto the same
// 0-100 x/y space your static PROJECTS entries use. Not surveying-grade,
// but consistent with your existing hand-placed coordinates.
function toXY(lat: number | null, lon: number | null): { x: number; y: number } {
  if (lat == null || lon == null) return { x: 50, y: 50 };
  const x = ((lon - 68) / 30) * 100;
  const y = ((38 - lat) / 32) * 100;
  return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
}

function rowToProject(row: ProjectRow): Project {
  const { x, y } = toXY(row.latitude, row.longitude);
  return {
    id: row.id,
    name: row.name,
    state: row.state,
    district: row.district,
    constituency: row.constituency || row.district,
    type: row.project_type,
    vendor: row.vendors?.name || 'Unknown Vendor',
    allocated: row.amount_sanctioned / 100000, // paise/rupees -> lakhs
    spent: row.amount_spent / 100000,
    risk: scoreToRisk(row.risk_score),
    riskScore: row.risk_score,
    finding: row.finding,
    verify: row.verify_status,
    year: row.fiscal_year,
    x,
    y,
    lat: row.latitude ?? undefined,
    lon: row.longitude ?? undefined,
  };
}

/** React hook: live project list, scoped automatically by RLS to the
 * logged-in user's region (a district officer only gets their district). */
export function useLiveProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select(
          `id, name, state, district, constituency, project_type,
           amount_sanctioned, amount_spent, risk_score, finding,
           verify_status, fiscal_year, latitude, longitude,
           vendors ( name )`
        );

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setProjects((data as unknown as ProjectRow[]).map(rowToProject));
      }
      setLoading(false);
    })();
  }, []);

  return { projects, loading, error };
}

interface VendorRow {
  id: string;
  name: string;
  pan: string;
  gstin: string;
  risk_score: number;
  concentration: number;
  alerts: number;
  districts_count: number;
  high_risk_count: number;
  incorporated_year: number;
  relation_note: string;
}

function rowToVendor(row: VendorRow, projectCount: number, totalCrore: number): Vendor {
  return {
    name: row.name,
    pan: row.pan,
    gstin: row.gstin,
    projects: projectCount,
    total: totalCrore,
    risk: scoreToRisk(row.risk_score),
    riskScore: row.risk_score,
    concentration: row.concentration,
    alerts: row.alerts,
    districts: row.districts_count,
    highRisk: row.high_risk_count,
    established: String(row.incorporated_year),
    relation: row.relation_note,
  };
}

/** React hook: live vendor list with project counts computed from real rows. */
export function useLiveVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: vendorRows, error: vendorError } = await supabase
        .from('vendors')
        .select(
          'id, name, pan, gstin, risk_score, concentration, alerts, districts_count, high_risk_count, incorporated_year, relation_note'
        );

      if (vendorError) {
        setError(vendorError.message);
        setLoading(false);
        return;
      }

      // Compute real project count + total value per vendor from actual rows,
      // rather than trusting a separately-maintained counter (this is the
      // same class of bug as the 12,482-vs-13 mismatch — always derive
      // counts from the source table, never store them twice).
      const { data: projectRows, error: projectError } = await supabase
        .from('projects')
        .select('vendor_id, amount_spent');

      if (projectError) {
        setError(projectError.message);
        setLoading(false);
        return;
      }

      const byVendor: Record<string, { count: number; total: number }> = {};
      for (const p of projectRows as { vendor_id: string; amount_spent: number }[]) {
        if (!p.vendor_id) continue;
        if (!byVendor[p.vendor_id]) byVendor[p.vendor_id] = { count: 0, total: 0 };
        byVendor[p.vendor_id].count += 1;
        byVendor[p.vendor_id].total += p.amount_spent / 10000000; // -> crore
      }

      setVendors(
        (vendorRows as VendorRow[]).map((v) =>
          rowToVendor(v, byVendor[v.id]?.count || 0, +(byVendor[v.id]?.total || 0).toFixed(1))
        )
      );
      setLoading(false);
    })();
  }, []);

  return { vendors, loading, error };
}
