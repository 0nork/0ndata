# JAX CRM Workflow Setup Guide

This document describes how to set up the CRM workflows that power the JAX prediction engine. Since workflow creation isn't available through the API, these must be created manually in the CRM workflow builder.

Each workflow uses a **Custom Code** action that runs the corresponding script from `scripts/crm-workflows/`.

---

## Prerequisites

Before setting up workflows, ensure:
1. All 6 Custom Object schemas are installed (predictions, prediction_stats, jax_unlocks, jax_sentences, jax_social_stats, jax_config)
2. The default jax_config record exists
3. You have the JAX bot URL: `https://www.jaxxai.com`
4. You have a valid PIT token for this location

---

## Workflow 1: JAX Prediction Cycle

**Purpose**: Run predictions for all enabled coins and store results in CRM.

| Setting | Value |
|---------|-------|
| Name | JAX - Run Prediction Cycle |
| Trigger | Scheduled: Every 15 minutes |
| Script | `01-run-prediction-cycle.js` |

### Setup Steps:
1. Create workflow → Trigger: **Schedule** → Every 15 minutes
2. Add action: **Execute Code (Custom Code)**
3. Paste contents of `scripts/crm-workflows/01-run-prediction-cycle.js`
4. Set input data variables:
   - `locationId` = `2ro22dYDzTD41y7R5VWi`
   - `jaxApiUrl` = `https://www.jaxxai.com`
   - `crmApiKey` = your PIT token
5. Save and activate

---

## Workflow 2: Verify Predictions

**Purpose**: Check pending predictions against current prices, mark WIN/LOSS.

| Setting | Value |
|---------|-------|
| Name | JAX - Verify Predictions |
| Trigger | Scheduled: Every 30 minutes (offset 15 min from cycle) |
| Script | `02-verify-predictions.js` |

### Setup Steps:
1. Create workflow → Trigger: **Schedule** → Every 30 minutes
2. Add action: **Execute Code (Custom Code)**
3. Paste contents of `scripts/crm-workflows/02-verify-predictions.js`
4. Set same input data variables as Workflow 1
5. Save and activate

---

## Workflow 3: Check Milestones

**Purpose**: Evaluate unlocks against current stats, create unlock records.

| Setting | Value |
|---------|-------|
| Name | JAX - Check Milestones |
| Trigger | Scheduled: Every 30 minutes (after verify) OR chained from Workflow 2 |
| Script | `03-check-milestones.js` |

### Setup Steps:
1. Create workflow → Trigger: **Schedule** or chain after Workflow 2
2. Add action: **Execute Code (Custom Code)**
3. Paste contents of `scripts/crm-workflows/03-check-milestones.js`
4. Set input data variables
5. **Chain action**: If new unlocks found, trigger Workflow 5 (Apply Upgrade)
6. Save and activate

---

## Workflow 4: Generate Sentence

**Purpose**: Pull latest JAX sentence and store in CRM.

| Setting | Value |
|---------|-------|
| Name | JAX - Generate Sentence |
| Trigger | Chained from Workflow 3 (when unlock occurs) OR scheduled daily |
| Script | `04-generate-sentence.js` |

### Setup Steps:
1. Create workflow → Trigger: **Schedule** (daily) or chain from milestone check
2. Add action: **Execute Code (Custom Code)**
3. Paste contents of `scripts/crm-workflows/04-generate-sentence.js`
4. Set input data: add `triggerType` = `cycle`
5. Save and activate

---

## Workflow 5: Apply Unlock Upgrade

**Purpose**: When an unlock is achieved, update JAX Config with new capabilities.

| Setting | Value |
|---------|-------|
| Name | JAX - Apply Unlock Upgrade |
| Trigger | Chained from Workflow 3 (milestone check) |
| Script | `07-apply-unlock-upgrade.js` |

### Setup Steps:
1. Create workflow → Trigger: **Internal trigger** (called from Workflow 3)
2. Add action: **Execute Code (Custom Code)**
3. Paste contents of `scripts/crm-workflows/07-apply-unlock-upgrade.js`
4. Set input data:
   - `unlockId` = `{{custom_code_output.unlockId}}` (from Workflow 3)
   - `unlockName` = `{{custom_code_output.unlockName}}`
   - Plus standard locationId, crmApiKey, jaxApiUrl
5. Save and activate

---

## Workflow 6: Sync Social Stats

**Purpose**: Daily snapshot of JAX social media metrics.

| Setting | Value |
|---------|-------|
| Name | JAX - Sync Social Stats |
| Trigger | Scheduled: Daily at midnight UTC |
| Script | `05-sync-social-stats.js` |

### Setup Steps:
1. Create workflow → Trigger: **Schedule** → Daily
2. Add action: **Execute Code (Custom Code)**
3. Paste contents of `scripts/crm-workflows/05-sync-social-stats.js`
4. Set standard input data variables
5. Save and activate

---

## Workflow 7: Onboarding Setup

**Purpose**: Initialize JAX when user completes the onboarding wizard.

| Setting | Value |
|---------|-------|
| Name | JAX - Onboarding Setup |
| Trigger | **Trigger Link** (embedded in onboarding wizard HTML) |
| Script | `06-onboarding-setup.js` |

### Setup Steps:
1. Create workflow → Trigger: **Trigger Link**
2. Copy the generated trigger link URL
3. Paste it into `onboarding/jax-onboarding-wizard.html` replacing `{{trigger_link_url}}`
4. Add action: **Execute Code (Custom Code)**
5. Paste contents of `scripts/crm-workflows/06-onboarding-setup.js`
6. Set input data:
   - `contactId` = `{{contact.id}}`
   - `selectedCoins` = `{{trigger_link.coins}}` (from query param)
   - `selectedInterval` = `{{trigger_link.interval}}` (from query param)
   - Plus standard locationId, crmApiKey, jaxApiUrl
7. Save and activate

---

## Workflow Chain Overview

```
Scheduled (15 min)
  └─> [1] Run Prediction Cycle
        └─> Writes prediction records to CRM

Scheduled (30 min)
  └─> [2] Verify Predictions
        └─> Updates WIN/LOSS on prediction records
        └─> Updates prediction_stats
        └─> [3] Check Milestones
              ├─> Creates unlock records
              ├─> [5] Apply Unlock Upgrade → Updates jax_config
              └─> [4] Generate Sentence → Stores sentence

Scheduled (Daily)
  └─> [6] Sync Social Stats → Stores daily metrics

Trigger Link (Onboarding)
  └─> [7] Onboarding Setup → Creates config, baseline stats, fires first cycle
```

---

## Input Data Variables (All Workflows)

These must be set in the Custom Code action's input data section:

| Variable | Value | Required |
|----------|-------|----------|
| `locationId` | `2ro22dYDzTD41y7R5VWi` | Yes |
| `jaxApiUrl` | `https://www.jaxxai.com` | Yes |
| `crmApiKey` | Your PIT token | Yes |

---

## Custom Objects Created

| Schema Key | Display Name | Fields |
|-----------|-------------|--------|
| `custom_objects.predictions` | Prediction | coin, direction, confidence, models_used, entry_price, target_price, result, verified_at, cycle_number |
| `custom_objects.prediction_stats` | Prediction Stat | date, win_rate, total_predictions, wins, losses, streak, interval_minutes |
| `custom_objects.jax_unlocks` | JAX Unlock | unlock_name, unlock_id, unlocked_at, triggered_by, notification_sent |
| `custom_objects.jax_sentences` | JAX Sentence | text, cycle_number, models_used, emotion, context |
| `custom_objects.jax_social_stats` | JAX Social Stat | date, follower_count, total_likes, total_retweets |
| `custom_objects.jax_config` | JAX Config | config_key, prediction_interval, enabled_coins, enabled_features, active_models, autonomous_mode |

---

## Troubleshooting

- **Custom Code not executing**: Ensure the PIT token has `objects.readonly`, `objects.write`, `contacts.readonly`, `contacts.write` scopes
- **Predictions not storing**: Check that the `custom_objects.predictions` schema exists and has all fields
- **Unlocks not applying**: Verify the unlock ID matches the UPGRADE_MAP keys in `07-apply-unlock-upgrade.js`
- **Rate limits**: CRM API has rate limits. The scripts include basic error handling but if you see 429 errors, increase workflow intervals
