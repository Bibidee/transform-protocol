# Transform Protocol

A decentralised transformation readiness consensus dApp built on [GenLayer](https://genlayer.com).

**Live:** https://transform-protocol-psi.vercel.app  
**Contract:** `0x16C4C04d84c51b2409AE0D7107435D20D1865c73` — GenLayer StudioNet

---

## What it does

Organisations facing complex transformations — ERP rollouts, AI adoption, cloud migrations — submit a structured dossier to an on-chain intelligent contract. GenLayer validators evaluate the dossier and produce a canonical, tamper-proof **Readiness Verdict** with a confidence score, risk assessment, key blockers, and required actions.

The protocol replaces subjective consulting opinions with decentralised, reproducible consensus. Every verdict is written on-chain, auditable, and independent of any single stakeholder's bias.

---

## How it works

1. **Create a Dossier** — register a transformation case with context, scope, and constraints
2. **Register an Implementation Plan** — submit the approach, assumptions, risks, and failure conditions
3. **Add Stakeholder Signals** — capture resistance patterns and readiness indicators across the organisation
4. **Submit Evidence** — register public document URLs (hashed and stored on-chain)
5. **Assess Readiness Domains** *(optional)* — self-assess 11 readiness dimensions for richer validator context
6. **Request Consensus** — GenLayer validators evaluate all inputs and produce a Readiness Verdict

---

## Readiness dimensions

Leadership Alignment · Mid-Management · Incentive Alignment · Culture Readiness · Delivery Capacity · Timeline Realism · Technology Readiness · Data Readiness · Change Capacity · Regulatory Readiness · Financial Sustainability

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, inline styles |
| Blockchain | GenLayer StudioNet |
| Contract | Python Intelligent Contract (`contract/TransformProtocol.py`) |
| Client | genlayer-js v1.1.8 |
| Wallet | MetaMask (injected `window.ethereum`) |
| Deployment | Vercel |

---

## Running locally

```bash
git clone https://github.com/Bibidee/transform-protocol.git
cd transform-protocol
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x16C4C04d84c51b2409AE0D7107435D20D1865c73
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Connect MetaMask to GenLayer StudioNet.

---

## Contract

The intelligent contract lives at `contract/TransformProtocol.py`. It is deployed on GenLayer StudioNet and handles all state: cases, implementation plans, signals, evidence, domain assessments, and verdicts.

All writes use `writeContract` via genlayer-js, which encodes calldata through `makeCalldataObject` — ensuring transactions appear as `Call` (not `Send`) on the GenLayer explorer.

---

## Constraints

- No backend, database, or server-side AI
- No Privy, WalletConnect, or Supabase
- Contract storage is the canonical source of truth
- Evidence URLs must be intentionally and permanently public — on-chain storage is immutable
- LocalStorage is used only for: pending transaction hash recovery, recently viewed case IDs, form draft convenience
