// Schema registry — maps app models to CRM Custom Object schemas

export type FieldDataType =
  | "TEXT"
  | "NUMBER"
  | "DATE"
  | "BOOLEAN"
  | "OBJECT"
  | "ARRAY";

export interface FieldDef {
  name: string;
  key: string;
  dataType: FieldDataType;
  required?: boolean;
  description?: string;
}

export interface AssociationDef {
  schemaKey: string;
  type: "ONE_TO_MANY" | "MANY_TO_ONE";
}

export interface SchemaDefinition {
  name: string;
  key: string;
  description?: string;
  fields: FieldDef[];
  associations?: AssociationDef[];
}

const schemas = new Map<string, SchemaDefinition>();

export function registerSchema(schema: SchemaDefinition): void {
  schemas.set(schema.key, schema);
}

export function getSchema(key: string): SchemaDefinition | undefined {
  return schemas.get(key);
}

export function listSchemas(): SchemaDefinition[] {
  return Array.from(schemas.values());
}

export function hasSchema(key: string): boolean {
  return schemas.has(key);
}
