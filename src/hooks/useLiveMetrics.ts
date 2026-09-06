import { useEffect, useState } from 'react';

function useSessionId() {
  const [sessionId, setSessionId] = useState('');
  useEffect(() => {
    let sid = sessionStorage.getItem('pujaGuideSession');
    if (!sid) {
      sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem('pujaGuideSession', sid);
    }
    setSessionId(sid);
  }, []);
  return sessionId;
}

export function useLiveMetrics() {
  const sessionId = useSessionId();
  const [stats, setStats] = useState({ totalViews: 0, activeSessions: 0 });

  useEffect(() => {
    if (!sessionId) return;

    // Register visit
    fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    }).catch(() => {});

    // Fetch stats
    const load = () =>
      fetch('/api/metrics')
        .then((r) => r.json())
        .then((data) => {
          if (data && data.totalViews !== undefined) {
            setStats(data);
          }
        })
        .catch(() => {});

    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, [sessionId]);

  return stats;
}
