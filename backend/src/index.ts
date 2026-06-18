import express from 'express';
import cors from 'cors';
import monitorRoutes from './routes/monitorRoutes';
import { checkMonitor, getAllMonitors, updateMonitorStatus, createIncident, resolveIncident, getMonitor } from './services/monitorService';
import { alertDown, alertUp } from './services/telegramService';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api', monitorRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Run checks manually
app.post('/api/check', async (req, res) => {
  const monitors = getAllMonitors();
  const results = [];

  for (const monitor of monitors) {
    const result = await checkMonitor(monitor.url);
    result.monitorId = monitor.id;

    const wasDown = monitor.status === 'down' || monitor.status === 'pending';

    updateMonitorStatus(monitor.id, result.status, result.responseTime, monitor.status);

    if (result.status === 'down' && wasDown) {
      createIncident(monitor.id, 'down', result.error || 'Connection failed');
      if (monitor.telegram_chat_id) {
        await alertDown(monitor.name, monitor.url, monitor.telegram_chat_id, result.error);
      }
    } else if (result.status === 'up' && wasDown) {
      resolveIncident(monitor.id, 'down');
      if (monitor.telegram_chat_id) {
        await alertUp(monitor.name, monitor.url, monitor.telegram_chat_id, result.responseTime);
      }
    }

    results.push(result);
  }

  res.json({ checked: monitors.length, results });
});

// Check single monitor
app.post('/api/check/:id', async (req, res) => {
  const monitor = getMonitor(req.params.id);
  if (!monitor) return res.status(404).json({ error: 'Monitor not found' });

  const result = await checkMonitor(monitor.url);
  result.monitorId = monitor.id;

  const wasDown = monitor.status === 'down' || monitor.status === 'pending';
  updateMonitorStatus(monitor.id, result.status, result.responseTime, monitor.status);

  if (result.status === 'down' && wasDown) {
    createIncident(monitor.id, 'down', result.error || 'Connection failed');
    if (monitor.telegram_chat_id) {
      await alertDown(monitor.name, monitor.url, monitor.telegram_chat_id, result.error);
    }
  } else if (result.status === 'up' && wasDown) {
    resolveIncident(monitor.id, 'down');
    if (monitor.telegram_chat_id) {
      await alertUp(monitor.name, monitor.url, monitor.telegram_chat_id, result.responseTime);
    }
  }

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Alarm SaaS API running on port ${PORT}`);
});