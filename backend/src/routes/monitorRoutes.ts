import { Router, Request, Response } from 'express';
import {
  getAllMonitors, getMonitor, addMonitor, deleteMonitor,
  getStats, getIncidents, getOpenIncidents
} from '../services/monitorService';

const router = Router();

// Get all monitors
router.get('/monitors', (req: Request, res: Response) => {
  const monitors = getAllMonitors();
  res.json(monitors);
});

// Get single monitor
router.get('/monitors/:id', (req: Request, res: Response) => {
  const monitor = getMonitor(req.params.id);
  if (!monitor) return res.status(404).json({ error: 'Monitor not found' });
  res.json(monitor);
});

// Add monitor
router.post('/monitors', (req: Request, res: Response) => {
  const { name, url, telegramChatId } = req.body;
  if (!name || !url) return res.status(400).json({ error: 'Name and URL required' });

  try {
    const monitor = addMonitor(name, url, telegramChatId);
    res.json(monitor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add monitor' });
  }
});

// Delete monitor
router.delete('/monitors/:id', (req: Request, res: Response) => {
  deleteMonitor(req.params.id);
  res.json({ success: true });
});

// Get stats
router.get('/stats', (req: Request, res: Response) => {
  res.json(getStats());
});

// Get incidents
router.get('/incidents', (req: Request, res: Response) => {
  const { monitorId } = req.query;
  res.json(getIncidents(monitorId as string));
});

// Get open incidents
router.get('/incidents/open', (req: Request, res: Response) => {
  res.json(getOpenIncidents());
});

export default router;