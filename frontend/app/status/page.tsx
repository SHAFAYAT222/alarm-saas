'use client';
import { useState, useEffect } from 'react';

const API_URL = 'https://alarm-saas-api.onrender.com';

export default function StatusPage() {
  const [monitors, setMonitors] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/monitors`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data)) setMonitors(data);
      })
      .catch(() => {
        // Demo data
        setMonitors([
          { id: '1', name: 'Google', url: 'https://google.com', status: 'up', response_time: 120, last_check: new Date().toISOString() },
          { id: '2', name: 'GitHub', url: 'https://github.com', status: 'up', response_time: 85, last_check: new Date().toISOString() },
        ]);
      });
  }, []);

  const upCount = monitors.filter(m => m.status === 'up').length;
  const total = monitors.length;
  const uptimePercent = total > 0 ? ((upCount / total) * 100).toFixed(2) : '100.00';

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <h1 className="text-2xl font-bold mb-2">🔔 AlarmSaaS Status</h1>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${upCount === total ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
            <span className={`w-2 h-2 rounded-full ${upCount === total ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`}></span>
            {upCount === total ? 'All Systems Operational' : 'Some Systems Down'}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-gray-900 border border-gray-800 rounded-xl mb-8">
          <div className="p-4 border-b border-gray-800">
            <h2 className="font-semibold">Uptime: {uptimePercent}%</h2>
          </div>
          <div className="divide-y divide-gray-800">
            {monitors.map(m => (
              <div key={m.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-sm text-gray-500">{m.url}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1 text-sm ${m.status === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    <span className={`w-2 h-2 rounded-full ${m.status === 'up' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                    {m.status === 'up' ? 'Up' : 'Down'}
                  </span>
                  {m.response_time && <p className="text-xs text-gray-500 mt-1">{m.response_time}ms</p>}
                </div>
              </div>
            ))}
            {monitors.length === 0 && (
              <p className="p-8 text-center text-gray-500">No monitors configured</p>
            )}
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm">
          Powered by <a href="#" className="text-red-400 hover:underline">AlarmSaaS</a>
        </p>
      </main>
    </div>
  );
}