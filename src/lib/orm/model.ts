// Base Model class — maps to a CRM Custom Object schema
// CRUD methods route through the CRM API client

import { crmRequest } from "@/lib/bridge/client";
import { QueryBuilder, type QueryResult } from "./query";
import { getSchema, type SchemaDefinition } from "@/lib/schemas/registry";

interface CRMRecordResponse {
  id: string;
  [key: string]: unknown;
}

interface CRMCreateResponse {
  object: CRMRecordResponse;
}

interface CRMGetResponse {
  object: CRMRecordResponse;
}

export class Model<T = Record<string, unknown>> {
  readonly schemaKey: string;
  readonly locationId: string;
  private schemaDef: SchemaDefinition | undefined;

  constructor(schemaKey: string, locationId: string) {
    this.schemaKey = schemaKey;
    this.locationId = locationId;
    this.schemaDef = getSchema(schemaKey);
  }

  /** Convert camelCase to snake_case for CRM */
  private toCrmFields(data: Partial<T>): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      const snakeKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`
      );
      result[snakeKey] = value;
    }
    return result;
  }

  /** Convert snake_case from CRM to camelCase */
  private fromCrmFields(data: Record<string, unknown>): T {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
        letter.toUpperCase()
      );
      result[camelKey] = value;
    }
    return result as T;
  }

  async create(data: Partial<T>): Promise<T & { id: string }> {
    const crmData = this.toCrmFields(data);

    const res = await crmRequest<CRMCreateResponse>({
      method: "POST",
      path: `/objects/${this.schemaKey}/records`,
      locationId: this.locationId,
      body: {
        locationId: this.locationId,
        properties: crmData,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to create record: ${JSON.stringify(res.data)}`);
    }

    return {
      ...this.fromCrmFields(res.data.object),
      id: res.data.object.id,
    };
  }

  async findById(id: string): Promise<(T & { id: string }) | null> {
    const res = await crmRequest<CRMGetResponse>({
      method: "GET",
      path: `/objects/${this.schemaKey}/records/${id}`,
      query: { locationId: this.locationId },
      locationId: this.locationId,
    });

    if (!res.ok) return null;

    return {
      ...this.fromCrmFields(res.data.object),
      id: res.data.object.id,
    };
  }

  async update(id: string, data: Partial<T>): Promise<T & { id: string }> {
    const crmData = this.toCrmFields(data);

    const res = await crmRequest<CRMGetResponse>({
      method: "PUT",
      path: `/objects/${this.schemaKey}/records/${id}`,
      locationId: this.locationId,
      body: {
        locationId: this.locationId,
        properties: crmData,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to update record: ${JSON.stringify(res.data)}`);
    }

    return {
      ...this.fromCrmFields(res.data.object),
      id: res.data.object.id,
    };
  }

  async delete(id: string): Promise<boolean> {
    const res = await crmRequest({
      method: "DELETE",
      path: `/objects/${this.schemaKey}/records/${id}`,
      query: { locationId: this.locationId },
      locationId: this.locationId,
    });

    return res.ok;
  }

  /** Start building a query */
  find(): QueryBuilder<T> {
    return new QueryBuilder<T>(this.schemaKey, this.locationId);
  }

  /** Convenience: find all with optional limit */
  async findAll(limit?: number): Promise<QueryResult<T>> {
    const qb = this.find();
    if (limit) qb.limit(limit);
    return qb.execute();
  }

  /** Get schema definition for this model */
  getSchemaDefinition(): SchemaDefinition | undefined {
    return this.schemaDef;
  }
}
