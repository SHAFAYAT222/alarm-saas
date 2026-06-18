import fetch from 'node-fetch';
import db from '../config/database';

export interface Monitor {
  id: string;
  name: string;
  url: string;
  user_id: string;
  status: string;
  last_check: string | null;
  last_status: string | null;
  response_time: number | null;
  uptime_count: number;
  downtime_count: number;
  created_at: string;
  telegram_chat_id: string | null;
}

export interface CheckResult {
  monitorId: string;
  status: 'up' | 'down';
  responseTime: number;
  statusCode?: number;
  error?: string;
}

export async function checkMonitor(url: string): Promise<CheckResult> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timeout);
    const responseTime = Date.now() - start;

    const isUp = response.status >= 200 && response.status < 400;

    return {
      status: isUp ? 'up' : 'down',
      responseTime,
      statusCode: response.status,
      monitorId: '',
    };
  } catch (error: any) {
    const responseTime = Date.now() - start;
    return {
      status: 'down',
      responseTime,
      error: error.message || 'Connection failed',
      monitorId: '',
    };
  }
}

export function getAllMonitors(): Monitor[] {
  return db.prepare('SELECT * FROM monitors ORDER BY created_at DESC').all() as Monitor[];
}

export function getMonitor(id: string): Monitor | undefined {
  return db.prepare('SELECT * FROM monitors WHERE id = ?').get(id) as Monitor | undefined;
}

export function addMonitor(name: string, url: string, telegramChatId?: string): Monitor {
  const id = 'mon_' + Math.random().toString(36).substring(2, 15);
  db.prepare(
    'INSERT INTO monitors (id, name, url, telegram_chat_id) VALUES (?, ?, ?, ?)'
  ).run(id, name, url, telegramChatId || null);
  return getMonitor(id)!;
}

export function deleteMonitor(id: string): void {
  db.prepare('DELETE FROM incidents WHERE monitor_id = ?').run(id);
  db.prepare('DELETE FROM monitors WHERE id = ?').run(id);
}

export function updateMonitorStatus(
  id: string,
  status: string,
  responseTime: number,
  lastStatus: string | null
): void {
  const monitor = getMonitor(id);
  if (!monitor) return;

  let uptimeCount = monitor.uptime_count;
  let downtimeCount = monitor.downtime_count;

  if (status === 'up') {
    uptimeCount++;
  } else {
    downtimeCount++;
  }

  db.prepare(`
    UPDATE monitors
    SET status = ?, last_check = datetime('now'), last_status = ?, response_time = ?,
        uptime_count = ?, downtime_count = ?
    WHERE id = ?
  `).run(status, lastStatus, responseTime, uptimeCount, downtimeCount, id);
}

export function createIncident(monitorId: string, type: 'down' | 'up', message: string): void {
  const id = 'inc_' + Math.random().toString(36).substring(2, 15);
  db.prepare(
    'INSERT INTO incidents (id, monitor_id, type, message) VALUES (?, ?, ?, ?)'
  ).run(id, monitorId, type, message);
}

export function resolveIncident(monitorId: string, type: string): void {
  db.prepare(`
    UPDATE incidents SET resolved_at = datetime('now')
    WHERE monitor_id = ? AND type = ? AND resolved_at IS NULL
  `).run(monitorId, type);
}

export function getIncidents(monitorId?: string): any[] {
  if (monitorId) {
    return db.prepare(
      'SELECT * FROM incidents WHERE monitor_id = ? ORDER BY created_at DESC LIMIT 50'
    ).all(monitorId);
  }
  return db.prepare('SELECT * FROM incidents ORDER BY created_at DESC LIMIT 50').all();
}

export function getOpenIncidents(): any[] {
  return db.prepare(
    'SELECT * FROM incidents WHERE resolved_at IS NULL ORDER BY created_at DESC'
  ).all();
}

export function getStats(): { total: number; up: number; down: number; avgResponseTime: number } {
  const total = (db.prepare('SELECT COUNT(*) as count FROM monitors').get() as any).count;
  const up = (db.prepare("SELECT COUNT(*) as count FROM monitors WHERE status = 'up'").get() as any).count;
  const down = (db.prepare("SELECT COUNT(*) as count FROM monitors WHERE status = 'down'").get() as any).count;
  const avgResult = db.prepare('SELECT AVG(response_time) as avg FROM monitors WHERE response_time IS NOT NULL').get() as any;
  const avgResponseTime = avgResult?.avg || 0;

  return { total, up, down, avgResponseTime: Math.round(avgResponseTime) };
}

export function setSetting(key: string, value: string): void {
  db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value);
}

export function getSetting(key: string): string | undefined {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined;
  return row?.value;
}