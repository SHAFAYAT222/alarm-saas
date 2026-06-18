# AlarmSaaS - Uptime Monitoring System

Monitor your websites, get instant alerts when they go down.

## 🚀 Deploy in 60 Seconds

### Step 1: Backend (Railway - Free)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (free)
3. Click **New Project** → **Deploy from GitHub repo**
4. Select `SHAFAYAT222/alarm-saas`
5. Set root directory: `backend`
6. Add environment variable: `TELEGRAM_BOT_TOKEN` (optional)
7. Click **Deploy**

Your backend will be live at: `https://your-app.railway.app`

### Step 2: Update Frontend API URL

After backend deploys, update `API_URL` in:
`frontend/app/page.tsx` → change to your Railway URL

### Step 3: Push Changes

```bash
cd alarm-saas
git add .
git commit -m "Update API URL"
git push origin main
```

GitHub Pages will auto-rebuild with your new API URL.

---

## Features

- 🌐 Monitor unlimited URLs
- 🔔 Telegram alerts when sites go down
- 📊 Real-time status dashboard
- 📈 Uptime statistics
- 🟢 Public status page
- ⚡ 5-minute check interval

---

## Telegram Alerts Setup

1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot` → follow prompts → get your **BOT TOKEN**
3. Message your new bot, then message [@userinfobot](https://t.me/userinfobot)
4. Get your **CHAT ID**
5. Add monitors with your Chat ID

---

## API Endpoints

```
GET  /api/monitors     - List all monitors
POST /api/monitors     - Add a monitor {name, url, telegramChatId}
DELETE /api/monitors/:id - Remove monitor
POST /api/check        - Check all monitors
POST /api/check/:id    - Check single monitor
GET  /api/stats        - Get statistics
GET  /api/incidents     - Get incident history
GET  /api/health        - Health check
```

---

## Alternative: Deploy Backend to Render

1. Go to [render.com](https://render.com)
2. Sign up → Connect GitHub
3. **New** → **Web Service**
4. Select repo → Set root to `backend`
5. Build command: `npm install`
6. Start command: `npm start`

---

## All Your Deployments

| Project | Frontend | Backend |
|---------|----------|---------|
| [AlarmSaaS](https://shafayat222.github.io/alarm-saas/) | GitHub Pages | Railway/Render |
| [Trading Portfolio](https://shafayat222.github.io/portfolio/) | GitHub Pages | - |
| [AI SEO SaaS](https://shafayat222.github.io/ai-seo-saas/) | GitHub Pages | Railway/Render |

---

**Need help?** Just message me!