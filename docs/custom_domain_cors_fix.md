# Custom Domain CORS Fix

## Issue Summary

The frontend works on the Vercel preview domain but backend-powered flows can fail on the custom domains `https://gffai.sg` and `https://www.gffai.sg` with a browser CORS error.

## Why The Vercel Domain Worked

The backend CORS allow-list was configured to allow the Vercel frontend domain, but the new custom domains were not included in `BACKEND_CORS_ORIGINS`.

When the browser sends requests from `https://gffai.sg` or `https://www.gffai.sg` to `https://gff-ai-backend.onrender.com`, FastAPI only allows the request if the page origin is explicitly listed in the CORS configuration.

## Required Render Environment Variables

Set these values in the Render service:

```env
BACKEND_CORS_ORIGINS=http://localhost:5173,http://localhost:3000,https://ai-enterprise-platform-five.vercel.app,https://gffai.sg,https://www.gffai.sg
FRONTEND_URL=https://www.gffai.sg
```

Notes:

- `BACKEND_CORS_ORIGINS` must include every allowed browser origin.
- `FRONTEND_URL` can point to the preferred production frontend URL.
- Do not remove the localhost or Vercel origins unless you intentionally want to stop allowing them.

## Current Backend Parsing Behavior

`BACKEND_CORS_ORIGINS` is parsed from a comma-separated string and the backend:

- trims whitespace around each origin
- ignores empty values
- preserves local development origins
- avoids wildcard `*` in production

Example:

```text
Input:
" https://a.com, https://b.com, "

Output:
["https://a.com", "https://b.com"]
```

## After Updating Render Env

Render must be redeployed after environment variable changes.

Use:

1. Open the `gff-ai-backend` service in Render
2. Update the environment variables
3. Click `Manual Deploy`
4. Click `Deploy latest commit`

## How To Verify In The Browser

1. Open `https://www.gffai.sg`
2. Open DevTools
3. Go to `Console` and `Network`
4. Trigger a backend-powered flow such as Blueprint generation
5. Confirm requests go to `https://gff-ai-backend.onrender.com/api/v1/...`
6. Confirm responses return `200` or a valid API response

Also test:

- `https://gffai.sg`
- `https://www.gffai.sg`
- `https://ai-enterprise-platform-five.vercel.app`

## Expected Fix

After Render is redeployed with the updated CORS allow-list, browser errors such as:

```text
Blocked by CORS policy
```

should stop appearing for requests from `https://gffai.sg` and `https://www.gffai.sg`.
