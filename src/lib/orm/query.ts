// Chainable query builder for CRM Custom Object records

import { crmRequest } from "@/lib/bridge/client";

export type FilterOperator =
  | "eq"
  | "ne"
  | "gt"
  | "lt"
  | "gte"
  | "lte"
  | "contains"
  | "startsWith";

interface FilterClause {
  field: string;
  operator: FilterOperator;
  value: string | number | boolean;
}

interface QueryState {
  schemaKey: string;
  locationId: string;
  filters: FilterClause[];
  orderField?: string;
  orderDirection?: "asc" | "desc";
  limitCount?: number;
  startAfterId?: string;
  startAfterValue?: string;
}

export interface QueryResult<T> {
  records: T[];
  hasMore: boolean;
  nextCursor?: string;
}

interface CRMRecordsResponse {
  objects?: Record<string, unknown>[];
  meta?: { total?: number; startAfterId?: string; startAfter?: string };
}

export class QueryBuilder<T> {
  private state: QueryState;

  constructor(schemaKey: string, locationId: string) {
    this.state = {
      schemaKey,
      locationId,
      filters: [],
    };
  }

  where(
    field: string,
    operator: FilterOperator,
    value: string | number | boolean
  ): QueryBuilder<T> {
    this.state.filters.push({ field, operator, value });
    return this;
  }

  eq(field: string, value: string | number | boolean): QueryBuilder<T> {
    return this.where(field, "eq", value);
  }

  orderBy(field: string, direction: "asc" | "desc" = "asc"): QueryBuilder<T> {
    this.state.orderField = field;
    this.state.orderDirection = direction;
    return this;
  }

  limit(count: number): QueryBuilder<T> {
    this.state.limitCount = count;
    return this;
  }

  startAfter(id: string, value?: string): QueryBuilder<T> {
    this.state.startAfterId = id;
    this.state.startAfterValue = value;
    return this;
  }

  async execute(): Promise<QueryResult<T>> {
    const query: Record<string, string> = {
      locationId: this.state.locationId,
    };

    if (this.state.limitCount) {
      query.limit = String(this.state.limitCount);
    }
    if (this.state.orderField) {
      query.order = this.state.orderField;
      query.orderDirection = this.state.orderDirection || "asc";
    }
    if (this.state.startAfterId) {
      query.startAfterId = this.state.startAfterId;
    }
    if (this.state.startAfterValue) {
      query.startAfter = this.state.startAfterValue;
    }

    // Add filters as search params
    for (const f of this.state.filters) {
      query[`filter.${f.field}.${f.operator}`] = String(f.value);
    }

    const res = await crmRequest<CRMRecordsResponse>({
      method: "GET",
      path: `/objects/${this.state.schemaKey}/records`,
      query,
      locationId: this.state.locationId,
    });

    const records = (res.data?.objects || []) as T[];
    const meta = res.data?.meta;

    return {
      records,
      hasMore: !!meta?.startAfterId,
      nextCursor: meta?.startAfterId,
    };
  }
}
