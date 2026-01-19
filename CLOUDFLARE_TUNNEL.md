# Cloudflare Tunnel (Cloudflare Tunnel / cloudflared)

This guide shows two simple ways to expose your local app to the internet using Cloudflare Tunnel:

- Quick ephemeral tunnel (no Cloudflare account required) — good for quick sharing.
- Persistent named tunnel (recommended) — maps a subdomain from your Cloudflare-managed domain to your local service.

All steps assume your frontend is running on `http://localhost:3001` and backend on `http://localhost:5001` (adjust ports if different).

---

## 0. Install `cloudflared` (Windows)

Option A — download installer (recommended):
1. Go to: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
2. Download the Windows installer (`.msi`) and run it.

Option B — package managers (if available):
- Chocolatey: `choco install cloudflared`
- winget: `winget install Cloudflare.cloudflared`  
(If those fail, use the direct installer from Cloudflare site.)

Verify install:

```powershell
cloudflared --version
```

---

## 1. Quick ephemeral tunnel (fast share, no Cloudflare account)

This creates a temporary public URL under `trycloudflare.com` that tunnels to your local port.

```powershell
# Run from your machine where frontend is running
# Expose frontend (with Vite proxy /api -> backend)
cloudflared tunnel --url http://localhost:3001
```

Output will include a public URL like `https://random-id.trycloudflare.com` — share that URL.

Notes:
- Ephemeral URL lasts while the `cloudflared` process runs.
- Good for fast testing and sharing with one or a few people.

---

## 2. Persistent named tunnel (recommended for repeatable sharing)

Prerequisites: a Cloudflare account and a domain managed in Cloudflare's dashboard.

Steps (high-level):

1. Authenticate `cloudflared` with your Cloudflare account (opens browser):

```powershell
cloudflared tunnel login
```

This stores a `cert.pem` in `%USERPROFILE%/.cloudflared`.

2. Create a named tunnel (one-time):

```powershell
cloudflared tunnel create movieweb-tunnel
```

This prints a `Tunnel id` and creates a credentials file in `%USERPROFILE%/.cloudflared/`.

3. Add DNS record that points a subdomain to the tunnel (Cloudflare CLI or dashboard):

```powershell
# Example: map movieweb.yourdomain.com to the tunnel
cloudflared tunnel route dns movieweb-tunnel movieweb.yourdomain.com
```

Alternatively, add a CNAME in Cloudflare DNS pointing `movieweb` to `TARGET.cfargotunnel.com` per Cloudflare docs.

4. Create a local `config.yml` (recommended location: `%USERPROFILE%/.cloudflared/config.yml` or `.cloudflared/config.yml` in your project):

```yaml
# Example config.yml
# Replace <TUNNEL_ID> if required (created by `cloudflared tunnel create`)
# Use either credentials-file path or rely on default location

tunnel: <TUNNEL_ID>
credentials-file: C:\Users\<YOU>\.cloudflared\<TUNNEL_ID>.json

ingress:
  - hostname: movieweb.yourdomain.com
    service: http://localhost:3001
  - hostname: api.movieweb.yourdomain.com
    service: http://localhost:5001
  - service: http_status:404
```

This example exposes both `movieweb.yourdomain.com` (frontend) and `api.movieweb.yourdomain.com` (backend). Adjust hostnames and ports as needed.

5. Run the tunnel (manual run):

```powershell
cloudflared tunnel run movieweb-tunnel
```

6. (Optional) Install `cloudflared` as a Windows service so the tunnel starts on boot.
Run PowerShell as Administrator and follow Cloudflare docs; the command looks like:

```powershell
# run as admin
cloudflared service install
```

See Cloudflare docs for exact platform-specific service installation steps.

---

## 3. Recommended setup for this project

- Keep the Vite proxy as configured: Vite serves frontend on `:3001` and proxies `/api` to backend `:5001`.
- Use a single public hostname (e.g. `movieweb.yourdomain.com`) for the frontend. The frontend will call `/api/*` which will be proxied by the client (Vite) to the local backend — but when serving via the tunnel, requests will arrive at the cloudflared ingress and direct to `localhost:3001` and then to backend via Vite proxy.

Better alternative: expose both frontend and backend on distinct hostnames (example in config.yml) and let frontend use full API host `https://api.movieweb.yourdomain.com` (update `VITE_API_URL`). This avoids depending on Vite dev server proxy in production.

---

## 4. Troubleshooting

- If the public URL does not load, check `cloudflared` logs for errors.
- If backend requests fail, verify ports and that backend is listening on `localhost`.
- For custom domain routing, ensure your domain is managed by Cloudflare and the DNS record was created with `cloudflared tunnel route dns` or via the dashboard.

---

## 5. Security notes

- For private testing, consider enabling Cloudflare Access policies on the hostname so only authorized users can access the tunnel.
- Do NOT expose admin interfaces or databases directly without authentication.

---

## 6. Quick checklist (copy & paste)

```powershell
# install cloudflared (one-time)
# use MSI from Cloudflare or choco/winget if available

# ephemeral quick share
cloudflared tunnel --url http://localhost:3001

# persistent (requires Cloudflare account + domain)
cloudflared tunnel login
cloudflared tunnel create movieweb-tunnel
# edit config.yml with TUNNEL_ID and ingress rules
cloudflared tunnel route dns movieweb-tunnel movieweb.yourdomain.com
cloudflared tunnel run movieweb-tunnel

# optional: install service (admin)
cloudflared service install
```

---

If you want, I can:
- Add the example `config.yml` into the project (`.cloudflared/config.yml`).
- Walk you through creating the tunnel step-by-step in your terminal (I'll provide exact commands and watch for errors).
