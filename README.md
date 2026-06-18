# AlarmSaaS - Uptime Monitoring System

Monitor your websites, get instant alerts when they go down. Simple, fast, reliable.

## Features

- 🌐 Monitor unlimited URLs
- 🔔 Telegram alerts when sites go down
- 📊 Real-time status dashboard
- 📈 Uptime statistics
- 🟢 Public status page
- ⚡ 5-minute check interval

## Quick Start

### 1. Deploy Backend (Railway/Render/Fly.io)

```bash
cd backend
npm install
npm run dev
```

**Environment Variables:**
- `TELEGRAM_BOT_TOKEN` - Your Telegram bot token (optional)
- `PORT` - Server port (default: 3001)

### 2. Deploy Frontend

The frontend auto-deploys to GitHub Pages on push to main.

**Environment:**
- Update `API_URL` in `frontend/app/page.tsx` to point to your backend

### 3. Add Telegram Alerts

1. Create a bot via @BotFather on Telegram
2. Start a conversation with your bot
3. Get your chat ID from @userinfobot
4. Add monitors with your chat ID

## API Endpoints

```
GET  /api/monitors     - List all monitors
POST /api/monitors     - Add a monitor
DELETE /api/monitors/:id - Remove monitor
POST /api/check        - Check all monitors
POST /api/check/:id    - Check single monitor
GET  /api/stats        - Get statistics
GET  /api/incidents    - Get incident history
```

## Architecture

- **Frontend:** Next.js (static export → GitHub Pages)
- **Backend:** Express.js (any Node.js host)
- **Database:** SQLite (built-in, no setup)
- **Monitoring:** GitHub Actions cron (free) or external cron service

## Deploy Options

| Service | Backend | Frontend |
|---------|---------|----------|
| Railway | ✅ | ❌ |
| Render | ✅ | ❌ |
| Fly.io | ✅ | ❌ |
| GitHub Pages | ❌ | ✅ |
| Vercel | ❌ | ✅ |

## License

MIT