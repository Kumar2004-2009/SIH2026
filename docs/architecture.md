# System Architecture

## High-level flow

```
User / Browser
  |
  v
Frontend (React Dashboard + Dataset Upload Portal)
  |
  v
Backend API (FastAPI)
  |
  +------------------> Dataset Ingestion & Validation
  |                           |
  |                           v
  |                     Database / Storage
  |
  v
FAIR Risk Quantification Engine
  |
  v
Monte Carlo Simulation
  |
  v
Investment Optimizer (Knapsack ILP)
  |
  v
Computed Risk Metrics (EAL, VaR, ROSI)
  |
  v
Frontend (Dashboard visualization + AI Risk Copilot)
```

---

## Components

### Frontend
A React (Vite + TailwindCSS) single-page application with two main areas:
- A **Dataset Upload Portal**, where the user drags-and-drops a 5-CSV bundle, a ZIP archive, or a compiled JSON dataset (or selects "Use Demo Dataset"), and sees live schema validation feedback for each required table.
- An **Executive/Technical Dashboard**, which visualizes the computed risk metrics (EAL, VaR, ROSI, business-unit breakdowns, top-risk assets) and hosts the "what-if budget" investment optimizer panel and the floating AI Risk Copilot chat widget.
The frontend communicates with the backend exclusively over a REST API (CORS-enabled) and never talks to the AI/LLM provider directly.

### Backend API
A FastAPI application that:
- Receives and validates uploaded datasets (`/api/datasets/upload`), rejecting files that don't match the required schema.
- Triggers the risk quantification pipeline on the ingested (or demo) dataset.
- Exposes computed risk metrics and optimizer results (`/risk/*`, `/controls/*`).
- Proxies AI Risk Copilot chat requests (`/chat`) to the LLM provider, keeping the API key server-side only.

### Dataset Ingestion & Validation
The layer that parses uploaded CSVs/ZIP/JSON, checks each table against its required schema (`assets`, `vulnerabilities`, `threat_events`, `controls`, `asset_controls`), and normalizes the data into the common format the risk engine expects. Invalid or missing columns are rejected here with a clear error, before any computation happens.

### FAIR Risk Quantification Engine
The core analytical pipeline (`risk_engine/`), implementing the Open FAIR methodology:
- **Likelihood** — combines EPSS exploit probability and CVSS severity per vulnerability.
- **Threat Event Frequency** — derived from historical threat event telemetry.
- **Loss Magnitude** — combines downtime cost, data breach cost (scaled by data sensitivity), and regulatory penalty into a lognormal loss distribution.
- **Monte Carlo Simulation** — runs thousands of simulated years per asset to produce a full annual loss distribution, from which Expected Annual Loss (EAL) and Value at Risk (VaR95/VaR99) are derived.
- **Control Scenarios** — re-simulates each candidate security control's before/after effect to compute accurate Risk Reduction and ROSI.

### Investment Optimizer
Given a budget and the control scenario results, solves an exact 0/1 knapsack problem using Integer Linear Programming (PuLP/CBC) to select the combination of security investments that maximizes total risk reduction without exceeding the budget — compared against a naive greedy (sort-by-ROSI) baseline to demonstrate the value of exact optimization.

### Database / Storage
Currently, for the hackathon prototype, uploaded datasets and session state are held in the frontend's local/session storage, and computed risk outputs are written to Parquet files on the backend filesystem.

For a production deployment, this component should be **PostgreSQL** (for relational asset/vulnerability/control/user data, which benefits from foreign-key integrity and ACID guarantees needed for auditable compliance reporting) combined with **object storage** (for raw uploaded files and bulk Parquet analytical outputs, which are better suited to file-based storage than relational rows).

### AI Risk Copilot
A backend-proxied chat endpoint that, on each user question, gathers a compact summary of the current computed risk data (organization/business-unit/top-asset EAL and VaR, top ROSI controls) and sends it as context to an LLM (Google Gemini), so the assistant answers using the organization's actual live risk posture rather than generic knowledge.

---

## For Your Own Project

This document should be kept up to date as the architecture evolves — in particular, once 
the Database/Storage layer moves from local/session storage to PostgreSQL + object storage 
(see Future Scope in the main README), update the diagram and the Database/Storage component 
description above to reflect the real, deployed data layer rather than the prototype state.