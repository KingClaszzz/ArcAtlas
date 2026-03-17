# Arc Showcase

A premium Web3 platform for discovering and interacting with projects built on the Arc network. Features a managed ecosystem directory, community governance, and an AI Transaction Agent.

## Core Features
- **Project Directory**: Curated list of verified projects building on Arc.
- **Ecosystem Governance**: Community-driven project submissions and review process.
- **ArcBot (AI Agent)**: Live assistant for network knowledge, wallet portfolio discovery, and intent-based transactions.
- **Non-Custodial**: Fully integrated with WalletConnect and wagmi; you sign everything.

## Getting Started

### Backend Setup
1. `cd backend`
2. `npm install`
3. Configure `.env`:
   - `DATABASE_URL`: PostgreSQL connection string (e.g., Supabase/Railway)
   - `JATEVO_API_KEY`: API key for the AI engine
   - `SESSION_SECRET`: Secure string for auth sessions
4. `npx prisma db push` (Sync database schema)
5. `npm run dev`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Configure `.env`:
   - `NEXT_PUBLIC_API_URL`: Backend URL (default: http://localhost:4000)
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Your project ID from cloud.walletconnect.com
4. `npm run dev`

## Project Management
Use the built-in CLI for ecosystem maintenance:
```bash
cd backend
npm run manage list          # View all projects
npm run manage add           # Add a new project (manual)
npm run manage approve <id>  # Approve project for ecosystem
npm run manage delete <id>   # Remove project
npm run manage delete-all    # Wipe database (Caution!)
```

## Tech Stack
- **Frontend**: Next.js 14, TailwindCSS, Framer Motion
- **Web3**: wagmi, viem, WalletConnect, SIWE
- **Backend**: Express.js, Prisma ORM, PostgreSQL
- **AI**: ArcBot (GLM-4.7) for contextual network assistance

---
*Built for the Arc Ecosystem. Build by arlor09*