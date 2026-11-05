import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const IDLE_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes

// Events that will count as user activity on an iPad
const ACTIVITY_EVENTS = ['touchstart', 'touchend', 'touchmove', 'keydown'] as const;

export function useIdleRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isCleanHomepage = location.pathname === '/' && !location.search;
    if (isCleanHomepage) return;

    let timer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, IDLE_TIMEOUT_MS);
    };

    ACTIVITY_EVENTS.forEach(event => window.addEventListener(event, resetTimer, { passive: true }));

    resetTimer();

    return () => {
      clearTimeout(timer);
      ACTIVITY_EVENTS.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [location.pathname, location.search, navigate]);
}
