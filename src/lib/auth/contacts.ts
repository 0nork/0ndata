// Contact-as-User system — CRM Contacts become application users

import { crmRequest } from "@/lib/bridge/client";
import { hashPassword, verifyPassword } from "./password";

const PASSWORD_FIELD_KEY = "contact.0ndata_password_hash";

// Default location for user management
// In Marketplace mode, this comes from the installed location
const DEFAULT_LOCATION_ID = process.env.CRM_LOCATION_ID || "";

export interface AppUser {
  contactId: string;
  email: string;
  name: string;
  locationId: string;
}

interface CRMContact {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  customFields?: { id: string; key?: string; value: string; field_value?: string }[];
}

interface CRMContactResponse {
  contact: CRMContact;
}

interface CRMContactListResponse {
  contacts: CRMContact[];
  meta?: { total: number };
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  locationId?: string
): Promise<AppUser> {
  const locId = locationId || DEFAULT_LOCATION_ID;
  const hash = await hashPassword(password);

  const nameParts = name.split(" ");
  const firstName = nameParts[0] || name;
  const lastName = nameParts.slice(1).join(" ") || "";

  const res = await crmRequest<CRMContactResponse>({
    method: "POST",
    path: "/contacts/",
    locationId: locId,
    body: {
      locationId: locId,
      email,
      firstName,
      lastName,
      name,
      customFields: [{ key: PASSWORD_FIELD_KEY, field_value: hash }],
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to create user: ${JSON.stringify(res.data)}`);
  }

  return {
    contactId: res.data.contact.id,
    email,
    name,
    locationId: locId,
  };
}

export async function findUserByEmail(
  email: string,
  locationId?: string
): Promise<(AppUser & { passwordHash: string }) | null> {
  const locId = locationId || DEFAULT_LOCATION_ID;

  // Use GET /contacts/ with query param — search endpoint doesn't work reliably
  const res = await crmRequest<CRMContactListResponse>({
    method: "GET",
    path: "/contacts/",
    locationId: locId,
    query: {
      locationId: locId,
      query: email,
      limit: "1",
    },
  });

  if (!res.ok || !res.data.contacts?.length) return null;

  const contact = res.data.contacts[0];
  // Verify exact email match (query is fuzzy)
  if (contact.email?.toLowerCase() !== email.toLowerCase()) return null;

  // Fetch full contact to get custom fields (list endpoint doesn't include them)
  const fullRes = await crmRequest<CRMContactResponse>({
    method: "GET",
    path: `/contacts/${contact.id}`,
    locationId: locId,
  });

  if (!fullRes.ok) return null;

  const fullContact = fullRes.data.contact;
  // Find password hash — check both key formats (fieldKey and id)
  const hashField = fullContact.customFields?.find(
    (f) =>
      f.id === PASSWORD_FIELD_KEY ||
      f.key === PASSWORD_FIELD_KEY ||
      f.id?.includes("0ndata_password_hash") ||
      f.key?.includes("0ndata_password_hash")
  );

  return {
    contactId: fullContact.id,
    email: fullContact.email,
    name:
      fullContact.name ||
      [fullContact.firstName, fullContact.lastName].filter(Boolean).join(" "),
    locationId: locId,
    passwordHash: hashField?.value || hashField?.field_value || "",
  };
}

export async function verifyUserPassword(
  email: string,
  password: string,
  locationId?: string
): Promise<AppUser | null> {
  const user = await findUserByEmail(email, locationId);
  if (!user || !user.passwordHash) return null;

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;

  return {
    contactId: user.contactId,
    email: user.email,
    name: user.name,
    locationId: user.locationId,
  };
}
