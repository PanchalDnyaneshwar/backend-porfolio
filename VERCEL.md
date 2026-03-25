# Deploy this Nest API on Vercel

This app is exposed as a **serverless function** via [`api/index.ts`](api/index.ts) and [`vercel.json`](vercel.json) rewrites. `nest build` still writes to `dist/` for local `start:prod`; on Vercel, some project presets still run a **static output check** and expect an `outputDirectory` that exists after the build step.

## Error: “No Output Directory named public”

Vercel may require a **`public`** directory to exist after `npm run build` when the project (or dashboard) targets that output folder.

### Fix in the repo (already applied)

- A committed [`public/`](public/) folder (with `.gitkeep`) exists so the directory is present after clone/build.
- [`vercel.json`](vercel.json) sets `"outputDirectory": "public"` so the build step satisfies Vercel’s check.
- **All HTTP routes** are still rewritten to `/api/index.ts`, so the API handles traffic; the `public` folder is not used for your REST API surface.

### Fix in the Vercel dashboard (if it still fails)

1. **Settings** → **General** → **Build & Development Settings**
2. **Framework Preset**: **Other**
3. **Output Directory**: either leave empty (repo `vercel.json` supplies `public`) or set to **`public`** to match the repo.
4. **Build Command**: `npm run build`
5. **Root Directory**: folder that contains this `vercel.json` and `package.json`.

## After deploy — smoke test

Replace `YOUR_DEPLOYMENT_URL` with your production URL (no trailing slash).

```bash
curl -sS "YOUR_DEPLOYMENT_URL/health"
curl -sS "YOUR_DEPLOYMENT_URL/"
```

You should get JSON from the API, not a static-file error.

## Environment variables

Set the same variables as local production (e.g. `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, `ADMIN_URL`, etc.) in **Settings → Environment Variables** for Production (and Preview if needed).
