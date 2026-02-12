// Idempotent schema installer — creates CRM Custom Object schemas

import { crmRequest } from "@/lib/bridge/client";
import { listSchemas, type SchemaDefinition } from "./registry";

interface SchemaInstallReport {
  created: string[];
  updated: string[];
  skipped: string[];
  errors: { key: string; error: string }[];
}

interface CRMSchemaResponse {
  schemas?: { key: string; id: string }[];
}

interface CRMSchemaDetail {
  key: string;
  id: string;
  fields: { key: string }[];
}

/** Install all registered schemas for a CRM location */
export async function installSchemas(
  locationId: string
): Promise<SchemaInstallReport> {
  const report: SchemaInstallReport = {
    created: [],
    updated: [],
    skipped: [],
    errors: [],
  };

  const definitions = listSchemas();
  if (definitions.length === 0) return report;

  // Get existing schemas from CRM
  let existingKeys: Set<string>;
  try {
    const res = await crmRequest<CRMSchemaResponse>({
      method: "GET",
      path: "/objects/schemas",
      query: { locationId },
      locationId,
    });
    const existing = res.data?.schemas || [];
    existingKeys = new Set(existing.map((s) => s.key));
  } catch {
    existingKeys = new Set();
  }

  for (const def of definitions) {
    try {
      if (existingKeys.has(def.key)) {
        // Schema exists — check if fields need updating
        const updated = await updateSchemaIfNeeded(locationId, def);
        if (updated) {
          report.updated.push(def.key);
        } else {
          report.skipped.push(def.key);
        }
      } else {
        // Create new schema
        await createSchema(locationId, def);
        report.created.push(def.key);
      }
    } catch (err) {
      report.errors.push({
        key: def.key,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return report;
}

async function createSchema(
  locationId: string,
  def: SchemaDefinition
): Promise<void> {
  await crmRequest({
    method: "POST",
    path: "/objects/schemas",
    locationId,
    body: {
      locationId,
      name: def.name,
      key: def.key,
      description: def.description || "",
      fields: def.fields.map((f) => ({
        name: f.name,
        key: f.key,
        dataType: f.dataType,
        isRequired: f.required || false,
        description: f.description || "",
      })),
    },
  });
}

async function updateSchemaIfNeeded(
  locationId: string,
  def: SchemaDefinition
): Promise<boolean> {
  // Get current schema to check fields
  const res = await crmRequest<CRMSchemaDetail>({
    method: "GET",
    path: `/objects/schemas/${def.key}`,
    query: { locationId },
    locationId,
  });

  const existingFieldKeys = new Set(
    (res.data?.fields || []).map((f) => f.key)
  );
  const newFields = def.fields.filter((f) => !existingFieldKeys.has(f.key));

  if (newFields.length === 0) return false;

  // Update schema with new fields
  await crmRequest({
    method: "PUT",
    path: `/objects/schemas/${def.key}`,
    locationId,
    body: {
      locationId,
      name: def.name,
      fields: def.fields.map((f) => ({
        name: f.name,
        key: f.key,
        dataType: f.dataType,
        isRequired: f.required || false,
        description: f.description || "",
      })),
    },
  });

  return true;
}
