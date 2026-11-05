import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const IDLE_TIMEOUT_MS = 5000; // 2 * 60 * 1000; // 2 minutes

// Events that will count as user activity on an iPad
const ACTIVITY_EVENTS = ['touchstart', 'touchend', 'touchmove', 'keydown', 'pointerdown', 'pointermove', 'scroll'] as const;

// Check if an <audio> element is currently playing
const isAudioPlaying = () => {
  return Array.from(document.querySelectorAll('audio')).some(
    audio => !audio.paused && !audio.ended
  );
};

export function useIdleRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Skip redirect on the homepage
    if (location.pathname === '/') return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    const resetTimer = () => {
      clearTimeout(timer);
      // Don't start countdown while a sound is playing
      if (isAudioPlaying()) return;
      timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, IDLE_TIMEOUT_MS);
    };

    // Suspend countdown when audio starts
    const suspendTimer = () => {
      clearTimeout(timer);
    };

    ACTIVITY_EVENTS.forEach(event => window.addEventListener(event, resetTimer, { passive: true }));

    document.addEventListener('play', suspendTimer, { capture: true });
    document.addEventListener('pause', resetTimer, { capture: true });
    document.addEventListener('ended', resetTimer, { capture: true });

    resetTimer();

    return () => {
      clearTimeout(timer);
      ACTIVITY_EVENTS.forEach(event => window.removeEventListener(event, resetTimer));
      document.removeEventListener('play', suspendTimer, { capture: true });
      document.removeEventListener('pause', resetTimer, { capture: true });
      document.removeEventListener('ended', resetTimer, { capture: true });
    };
  }, [location.pathname, location.search, navigate]);
}
