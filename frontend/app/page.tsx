'use client';
import { useState, useEffect, useCallback } from 'react';

const API_URL = 'https://alarm-saas-api.onrender.com';

interface Monitor {
  id: string;
  name: string;
  url: string;
  status: string;
  last_check: string | null;
  response_time: number | null;
  uptime_count: number;
  downtime_count: number;
  telegram_chat_id: string | null;
  created_at: string;
}

interface Stats {
  total: number;
  up: number;
  down: number;
  avgResponseTime: number;
}

export default function Dashboard() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, up: 0, down: 0, avgResponseTime: 0 });
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [checking, setChecking] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', url: '', telegramChatId: '' });

  const fetchMonitors = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/monitors`);
      if (res.ok) {
        const data = await res.json();
        setMonitors(data);
        const statsRes = await fetch(`${API_URL}/api/stats`);
        if (statsRes.ok) setStats(await statsRes.json());
      }
    } catch (e) {
      // API not available - show demo data
      setMonitors([
        { id: '1', name: 'Google', url: 'https://google.com', status: 'up', last_check: new Date().toISOString(), response_time: 120, uptime_count: 100, downtime_count: 0, telegram_chat_id: null, created_at: new Date().toISOString() },
        { id: '2', name: 'GitHub', url: 'https://github.com', status: 'up', last_check: new Date().toISOString(), response_time: 85, uptime_count: 98, downtime_count: 2, telegram_chat_id: null, created_at: new Date().toISOString() },
        { id: '3', name: 'Example Site', url: 'https://example.com', status: 'down', last_check: new Date().toISOString(), response_time: null, uptime_count: 45, downtime_count: 5, telegram_chat_id: null, created_at: new Date().toISOString() },
      ]);
      setStats({ total: 3, up: 2, down: 1, avgResponseTime: 102 });
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchMonitors(); }, [fetchMonitors]);

  const addMonitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.url) return;
    setAdding(true);
    try {
      await fetch(`${API_URL}/api/monitors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setForm({ name: '', url: '', telegramChatId: '' });
      await fetchMonitors();
    } catch (e) {
      alert('Failed to add monitor');
    }
    setAdding(false);
  };

  const deleteMonitor = async (id: string) => {
    if (!confirm('Delete this monitor?')) return;
    try {
      await fetch(`${API_URL}/api/monitors/${id}`, { method: 'DELETE' });
      await fetchMonitors();
    } catch (e) {
      setMonitors(prev => prev.filter(m => m.id !== id));
    }
  };

  const checkNow = async (id: string) => {
    setChecking(id);
    try {
      await fetch(`${API_URL}/api/check/${id}`, { method: 'POST' });
      await fetchMonitors();
    } catch (e) {
      // Demo mode - just refresh
      await fetchMonitors();
    }
    setChecking(null);
  };

  const getUptimePercent = (m: Monitor) => {
    const total = m.uptime_count + m.downtime_count;
    if (total === 0) return '—';
    return ((m.uptime_count / total) * 100).toFixed(1) + '%';
  };

  const getStatusColor = (status: string) => {
    if (status === 'up') return 'bg-green-500';
    if (status === 'down') return 'bg-red-500';
    return 'bg-yellow-500';
  };

  const getStatusText = (status: string) => {
    if (status === 'up') return 'Up';
    if (status === 'down') return 'Down';
    return 'Pending';
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-lg">🔔</span>
            </div>
            <h1 className="text-xl font-bold">AlarmSaaS</h1>
          </div>
          <nav className="flex gap-6 text-sm">
            <a href="#" className="text-white font-medium">Dashboard</a>
            <a href="#status" className="text-gray-400 hover:text-white transition">Status Page</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Settings</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-1">Total Monitors</p>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-1">Up</p>
            <p className="text-3xl font-bold text-green-400">{stats.up}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-1">Down</p>
            <p className="text-3xl font-bold text-red-400">{stats.down}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-1">Avg Response</p>
            <p className="text-3xl font-bold">{stats.avgResponseTime}ms</p>
          </div>
        </div>

        {/* Add Monitor Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Add Monitor</h2>
          <form onSubmit={addMonitor} className="grid md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Name (e.g. My Website)"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-red-500 transition"
              required
            />
            <input
              type="url"
              placeholder="https://example.com"
              value={form.url}
              onChange={e => setForm({ ...form, url: e.target.value })}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-red-500 transition"
              required
            />
            <input
              type="text"
              placeholder="Telegram Chat ID (optional)"
              value={form.telegramChatId}
              onChange={e => setForm({ ...form, telegramChatId: e.target.value })}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-red-500 transition"
            />
            <button
              type="submit"
              disabled={adding}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-medium transition disabled:opacity-50"
            >
              {adding ? 'Adding...' : '+ Add Monitor'}
            </button>
          </form>
        </div>

        {/* Monitors Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="font-semibold">Your Monitors</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : monitors.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 mb-2">No monitors yet</p>
              <p className="text-gray-600 text-sm">Add your first URL above to start monitoring</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-800">
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">URL</th>
                    <th className="px-6 py-3 font-medium">Response</th>
                    <th className="px-6 py-3 font-medium">Uptime</th>
                    <th className="px-6 py-3 font-medium">Last Check</th>
                    <th className="px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {monitors.map(monitor => (
                    <tr key={monitor.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(monitor.status) === 'bg-green-500' ? 'bg-green-500/20 text-green-400' : getStatusColor(monitor.status) === 'bg-red-500' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          <span className={`w-2 h-2 rounded-full ${getStatusColor(monitor.status)} ${monitor.status === 'up' ? 'animate-pulse' : ''}`}></span>
                          {getStatusText(monitor.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">{monitor.name}</td>
                      <td className="px-6 py-4 text-gray-400">
                        <a href={monitor.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                          {monitor.url}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {monitor.response_time ? `${monitor.response_time}ms` : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={monitor.uptime_count + monitor.downtime_count > 50 && (monitor.uptime_count / (monitor.uptime_count + monitor.downtime_count)) > 0.99 ? 'text-green-400' : 'text-gray-400'}>
                          {getUptimePercent(monitor)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {monitor.last_check ? new Date(monitor.last_check).toLocaleString() : 'Never'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => checkNow(monitor.id)}
                            disabled={checking === monitor.id}
                            className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded transition disabled:opacity-50"
                          >
                            {checking === monitor.id ? 'Checking...' : 'Check'}
                          </button>
                          <button
                            onClick={() => deleteMonitor(monitor.id)}
                            className="px-3 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Demo Notice */}
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-sm text-yellow-400">
          💡 <b>Demo Mode:</b> This shows sample data. Connect to your backend API by setting <code className="bg-gray-800 px-1 rounded">API_URL</code> in the frontend code.
        </div>
      </main>
    </div>
  );
}