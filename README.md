
# IPSS Self-Assessment (GitHub Pages) — Name + Email capture

Host a professional IPSS questionnaire on **GitHub Pages**. Frontend: Vite + React + Tailwind + Recharts.
Backend: **Google Apps Script Web App** writing to Google Sheets. Captures **Name + Email** (+IPSS items, QoL, UTM).

## 1) Backend — Google Apps Script
- Open https://script.google.com → New project.
- Paste `apps_script/Code.gs` into the editor.
- Replace `YOUR_SHEET_ID_HERE` with your Google Sheet ID (create a new sheet and copy its ID from the URL).
- **Deploy → New deployment → Web app**:

  - Execute as: **Me**

  - Who has access: **Anyone**

  - Copy the **Web app URL**.

- The script will create headers automatically if the sheet is empty.

## 2) Frontend — Configure & run
- Edit `src/config.ts` and set `ENDPOINT` to your Apps Script Web App URL.
- Edit `vite.config.ts` and set `base` to `'/REPO_NAME/'` (your GitHub repo name).
- Install deps and run locally:

  ```bash

  npm ci

  npm run dev

  ```

## 3) Deploy to GitHub Pages
- Create a new GitHub repo (e.g., `ipss-self-check`). Push all files.
- Ensure `vite.config.ts` base is `'/ipss-self-check/'`.
- The included GitHub Action builds and deploys on pushes to **main**.
- Pages URL: `https://<username>.github.io/ipss-self-check/`

## 4) Share on WhatsApp
- Share your link with UTM tags: `...?utm_source=whatsapp&utm_medium=group&utm_campaign=ipss_launch`
- UTM values are stored in your sheet (no PII in analytics).

## Troubleshooting
- If the form says "Network error": make sure your Apps Script is deployed as **Web app** and `ENDPOINT` matches the latest deployment URL.
- If the page loads without styling on GitHub Pages: ensure `base` in `vite.config.ts` matches your repo name, and links in `index.html` include `/REPO_NAME/` prefix.
