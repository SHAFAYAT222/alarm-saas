export const metadata = {
  title: 'AlarmSaaS - Uptime Monitoring',
  description: 'Monitor your websites and get instant alerts when they go down',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0a0a0f', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}