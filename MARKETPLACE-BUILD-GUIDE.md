# 0nData — CRM Marketplace App Build Guide

## What This Is
0nData turns the CRM into a full application backend — Custom Objects as database tables, Contacts as users, built-in auth, and a REST API. First showcase app: JAX Crypto Prediction Engine.

**Deployed at**: https://crm.web0n.com
**Pricing**: $9/month + $0.01 per API call

---

## Step 1: Create the Marketplace App (CRM Developer Portal)

### 1A. Go to the CRM Developer Portal
- URL: `https://marketplace.leadconnectorhq.com`
- Sign in with the agency account (mike@rocketopp.com)
- Navigate to **My Apps** > **Create App**

### 1B. App Configuration
| Field | Value |
|-------|-------|
| **App Name** | 0nData |
| **Description** | Turn your CRM into an AI-powered application backend. Custom Objects as tables, Contacts as users, REST API included. |
| **Category** | Developer Tools / AI & Automation |
| **App Type** | Sub-Account (Location) |
| **Distribution** | Listed (Public Marketplace) |
| **Webhook URL** | `https://crm.web0n.com/api/webhooks/crm` |

### 1C. OAuth Scopes Required
Select these scopes:
- `contacts.readonly` — Read user contacts
- `contacts.write` — Create/update contacts (user auth)
- `objects.readonly` — Read Custom Object schemas and records
- `objects.write` — Create/update Custom Object schemas and records
- `locations.readonly` — Read location info
- `custom-fields.readonly` — Read custom field definitions
- `custom-fields.write` — Create custom fields for user auth

### 1D. Redirect URI
```
https://crm.web0n.com/api/marketplace/callback
```

### 1E. Save and Get Credentials
After creating the app, you'll receive:
- **Client ID** → Set as `CRM_CLIENT_ID` in Vercel env vars
- **Client Secret** → Set as `CRM_CLIENT_SECRET` in Vercel env vars

---

## Step 2: Set Environment Variables on Vercel

Add these to the `0ndata` Vercel project (production + preview + development):

```
CRM_CLIENT_ID=<from marketplace app>
CRM_CLIENT_SECRET=<from marketplace app>
CRM_REDIRECT_URI=https://crm.web0n.com/api/marketplace/callback
```

These are IN ADDITION to the existing vars:
- `CRM_LOCATION_ID` (already set)
- `CRM_PIT_TOKEN` (already set)
- `JWT_SECRET` (already set)
- `JAX_API_URL` (already set)
- `CRON_SECRET` (already set)
- `NEXT_PUBLIC_APP_URL` (already set)

---

## Step 3: Marketplace Install Flow (Already Built)

The install flow is already coded in the 0nData codebase:

1. **User clicks "Install" on Marketplace**
   → Redirects to: `https://crm.web0n.com/api/marketplace/install`
   → Which redirects to CRM OAuth with scopes

2. **User authorizes in CRM**
   → CRM redirects to: `https://crm.web0n.com/api/marketplace/callback?code=...`
   → Exchanges code for tokens, saves to token store
   → Runs schema installer for the location (creates Custom Object tables)
   → Redirects to dashboard

3. **Post-install**: App is connected, schemas are created, cron starts running

### Key Files:
- `src/app/api/marketplace/install/route.ts` — Initiates OAuth
- `src/app/api/marketplace/callback/route.ts` — Handles callback, installs schemas
- `src/lib/bridge/oauth.ts` — OAuth flow logic
- `src/lib/schemas/installer.ts` — Creates Custom Object schemas in CRM

---

## Step 4: Marketplace Listing Assets

### App Logo
- 512x512 PNG, transparent background
- JAX-themed or 0nData branded

### Screenshots (3-5)
1. Dashboard showing live prediction stats
2. Unlock progression timeline
3. REST API documentation page
4. Settings/connection status page
5. Landing page hero

### Description (Long)
```
0nData transforms your CRM into a powerful application backend.

Instead of managing separate databases, 0nData uses your CRM's built-in
Custom Objects as database tables, Contacts as users, and provides a
full REST API for your applications.

FIRST APP: JAX Crypto Prediction Engine
- Real-time BTC & ETH price predictions every 15 minutes
- Verified accuracy tracking with transparent win/loss records
- 52-unlock progression system that restores prediction tools
- Community-driven evolution — more users = more capabilities

WHAT YOU GET:
- Custom Object schemas automatically created in your CRM
- Contact-as-User authentication system
- JWT session management
- Rate-limited REST API with usage tracking
- Vercel Cron automation (every 15 minutes)
- Webhook integration for real-time sync

PRICING:
$9/month base + $0.01 per API call above included tier
```

### Category Tags
`AI`, `Automation`, `Developer Tools`, `Crypto`, `Analytics`

---

## Step 5: Webhook Configuration

In the Marketplace app settings, configure these webhook events:
- `contact.created` — Sync new users
- `contact.updated` — Sync user changes
- `contact.deleted` — Handle user deletion

The webhook receiver is at: `src/app/api/webhooks/crm/route.ts`

---

## Step 6: Testing the Install Flow

1. Create a test sub-account in the CRM
2. Go to: `https://crm.web0n.com/api/marketplace/install`
3. Authorize with the test sub-account
4. Verify:
   - Tokens saved (check server logs)
   - Schemas created (check CRM > Custom Objects)
   - Dashboard loads with data
   - Cron cycle runs successfully

---

## Step 7: Submit for Review

### Pre-submission Checklist
- [ ] App logo uploaded (512x512)
- [ ] Screenshots uploaded (3-5)
- [ ] Long description written
- [ ] OAuth scopes are minimal (only what's needed)
- [ ] Webhook URL is live and responding
- [ ] Install flow works end-to-end
- [ ] Pricing is configured ($9/month + metered)
- [ ] Privacy policy URL provided
- [ ] Terms of service URL provided
- [ ] Support email: mike@rocketopp.com

### Submit
Click "Submit for Review" in the Developer Portal. Review typically takes 3-5 business days.

---

## Architecture Summary

```
User clicks "Install" on CRM Marketplace
    ↓
OAuth flow → crm.web0n.com/api/marketplace/callback
    ↓
Exchange code → Save tokens → Install schemas
    ↓
Custom Objects created in user's CRM location:
  - predictions (crypto price predictions)
  - prediction_stats (daily stats)
  - jax_unlocks (earned milestones)
  - jax_sentences (AI generated text)
  - jax_social_stats (social metrics)
  - jax_config (bot configuration)
    ↓
Cron runs every 15 min:
  Fetch prices → Predict → Verify → Stats → Unlocks → Sentences
    ↓
Dashboard at crm.web0n.com shows live data
```

---

## What's Next: 0nCORE.com

After the Marketplace app is live, the same pattern becomes the foundation for **0nCORE** — the premium offering where every client gets:
- Their own project folder (Google Drive)
- Their own AI chatbot
- Their own 0nMCP server connection
- Their own workflows and automations
- Segmented access to the master dashboard

This is the agency-scale version of what 0nData does for a single app.
