// ══════════════════════════════════════════════════════════════════
// TAXI MOOO: SESSION SECURITY & AUTO-LOCK / LOGOUT
// Automatically locks & requires re-login after inactivity (10 mins)
// or when exiting / navigating away.
// ══════════════════════════════════════════════════════════════════

export const SESSION_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes of inactivity

const ADMIN_AUTH_KEY = 'taximooo_admin_auth';
const ADMIN_ACTIVITY_KEY = 'taximooo_admin_last_activity';

const CLIENT_USER_KEY = 'taximooo_user';
const CLIENT_ACTIVITY_KEY = 'taximooo_client_last_activity';

// ─── ADMIN SESSION SECURITY ───────────────────────────────────────

export function touchAdminActivity(): void {
  try {
    localStorage.setItem(ADMIN_ACTIVITY_KEY, String(Date.now()));
  } catch {}
}

export function clearAdminSession(): void {
  try {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    localStorage.removeItem(ADMIN_ACTIVITY_KEY);
  } catch {}
}

export function setAdminAuthenticated(): void {
  try {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    touchAdminActivity();
  } catch {}
}

export function isAdminSessionValid(): boolean {
  try {
    const isAuth = localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    if (!isAuth) return false;

    const last = Number(localStorage.getItem(ADMIN_ACTIVITY_KEY) || 0);
    if (!last || Date.now() - last > SESSION_TIMEOUT_MS) {
      clearAdminSession();
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function initAdminActivityTracker(onTimeout: () => void): () => void {
  let lastThrottle = 0;

  const handleInteraction = () => {
    const now = Date.now();
    if (now - lastThrottle > 5000) {
      lastThrottle = now;
      touchAdminActivity();
    }
  };

  const checkTimeout = () => {
    if (!isAdminSessionValid()) {
      onTimeout();
    }
  };

  const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
  events.forEach((evt) => {
    window.addEventListener(evt, handleInteraction, { passive: true });
  });

  const interval = setInterval(checkTimeout, 10000);
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      checkTimeout();
    }
  };
  const handleFocus = () => checkTimeout();

  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('focus', handleFocus);

  // Initial touch
  touchAdminActivity();

  return () => {
    events.forEach((evt) => window.removeEventListener(evt, handleInteraction));
    clearInterval(interval);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('focus', handleFocus);
  };
}

// ─── CLIENT SESSION SECURITY ──────────────────────────────────────

export function touchClientActivity(): void {
  try {
    localStorage.setItem(CLIENT_ACTIVITY_KEY, String(Date.now()));
  } catch {}
}

export function clearClientSession(): void {
  try {
    localStorage.removeItem(CLIENT_USER_KEY);
    localStorage.removeItem(CLIENT_ACTIVITY_KEY);
  } catch {}
}

export function setClientSession(user: any): void {
  try {
    localStorage.setItem(CLIENT_USER_KEY, JSON.stringify(user));
    touchClientActivity();
  } catch {}
}

export function isClientSessionValid(): boolean {
  try {
    const s = localStorage.getItem(CLIENT_USER_KEY);
    if (!s) return false;
    const user = JSON.parse(s);
    if (!user || !user.isLoggedIn) return false;

    const last = Number(localStorage.getItem(CLIENT_ACTIVITY_KEY) || 0);
    if (!last || Date.now() - last > SESSION_TIMEOUT_MS) {
      clearClientSession();
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function getValidClientUser(): any | null {
  if (!isClientSessionValid()) return null;
  try {
    const s = localStorage.getItem(CLIENT_USER_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

export function initClientActivityTracker(onTimeout: () => void): () => void {
  let lastThrottle = 0;

  const handleInteraction = () => {
    const now = Date.now();
    if (now - lastThrottle > 5000) {
      lastThrottle = now;
      touchClientActivity();
    }
  };

  const checkTimeout = () => {
    if (!isClientSessionValid()) {
      onTimeout();
    }
  };

  const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
  events.forEach((evt) => {
    window.addEventListener(evt, handleInteraction, { passive: true });
  });

  const interval = setInterval(checkTimeout, 10000);
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      checkTimeout();
    }
  };
  const handleFocus = () => checkTimeout();

  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('focus', handleFocus);

  // Initial touch
  touchClientActivity();

  return () => {
    events.forEach((evt) => window.removeEventListener(evt, handleInteraction));
    clearInterval(interval);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('focus', handleFocus);
  };
}

