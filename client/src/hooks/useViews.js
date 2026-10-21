import { useState, useEffect } from 'react';
import api from '../services/api';

let cachedViews = null;
const listeners = new Set();

function notify(views) {
  cachedViews = views;
  listeners.forEach((fn) => fn(views));
}

let hasRecorded = false;

export function useViews() {
  const [views, setViews] = useState(cachedViews);
  const [loading, setLoading] = useState(cachedViews === null);

  useEffect(() => {
    listeners.add(setViews);

    if (cachedViews !== null) {
      return () => listeners.delete(setViews);
    }

    if (!hasRecorded) {
      hasRecorded = true;
      const sessionKey = 'portfolio_has_visited';
      const alreadyVisited = sessionStorage.getItem(sessionKey);

      if (!alreadyVisited) {
        sessionStorage.setItem(sessionKey, '1');
        api
          .post('/views')
          .then((res) => {
            const v = res.data.data?.views ?? 1;
            notify(v);
          })
          .catch(() => {
            // Fallback to GET if POST encounters any issue
            api
              .get('/views')
              .then((res) => notify(res.data.data?.views ?? 0))
              .catch(() => notify(0));
          })
          .finally(() => setLoading(false));
      } else {
        api
          .get('/views')
          .then((res) => {
            const v = res.data.data?.views ?? 0;
            notify(v);
          })
          .catch(() => notify(0))
          .finally(() => setLoading(false));
      }
    }

    return () => {
      listeners.delete(setViews);
    };
  }, []);

  return { views, loading };
}

export default useViews;
