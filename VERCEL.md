# Deploy this Nest API on Vercel

This app is exposed as a **serverless function** via [`api/index.ts`](api/index.ts) and [`vercel.json`](vercel.json) rewrites. It is **not** a static site: `nest build` writes to `dist/`, and there is **no** `public/` output folder.

## Error: “No Output Directory named public”

That happens when the Vercel project is configured like a **static frontend** (Output Directory = `public`, or a framework preset that implies it).

### Fix in the Vercel dashboard

1. Open the project → **Settings** → **General** → **Build & Development Settings**.
2. **Framework Preset**: choose **Other**, or leave detection but ensure **Output Directory** is not forced to `public`.
3. **Output Directory**: **clear it** (empty). Do not set `public`.
4. **Build Command**: `npm run build` (optional but recommended to typecheck/compile).
5. **Install Command**: `npm install` (default).
6. **Root Directory**: set to the folder that contains this `package.json` and `vercel.json` (often the repo root for a backend-only repo).

Redeploy.

### Fix in the repo

[`vercel.json`](vercel.json) includes `framework: null`, `outputDirectory: null`, and `buildCommand` so CLI/Git deployments align with an API-only project. If the dashboard still overrides settings, clear overrides there.

## After deploy — smoke test

Replace `YOUR_DEPLOYMENT_URL` with your production URL (no trailing slash).

```bash
curl -sS "YOUR_DEPLOYMENT_URL/health"
curl -sS "YOUR_DEPLOYMENT_URL/"
```

You should get JSON from the API, not a static-file error.

## Environment variables

Set the same variables as local production (e.g. `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, `ADMIN_URL`, etc.) in **Settings → Environment Variables** for Production (and Preview if needed).
