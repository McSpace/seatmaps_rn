/**
 * Sandbox API client with automatic JWT authentication.
 *
 * Auth flow (mirrors JetsApiService from the web library):
 *   GET /auth?appId={APP_ID}  →  Authorization: Bearer {PRIVATE_KEY}
 *   ← { accessToken: "..." }
 *   All subsequent requests  →  Authorization: Bearer {accessToken}
 *
 * The token is cached in memory (+ AsyncStorage across restarts) and
 * refreshed automatically 5 minutes before expiry.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Config ──────────────────────────────────────────────────────────────────

const BASE_URL = 'https://sandbox.quicket.io/api/v1';
const APP_ID = 'aff6eb5e-1c83-4e5c-a2a2-seatmaps-com';
const PRIVATE_KEY = 'd5c55bd9-60f0-4e2f-84e0-seatmaps-com';

const STORAGE_KEY = 'jetsJwtToken';
const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000; // 5 minutes

// ─── In-memory cache ─────────────────────────────────────────────────────────

let cachedToken: string | null = null;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseJwtExp(token: string): number {
  const payload = token.split('.')[1];
  const padded = payload.replace(/-/g, '+').replace(/_/g, '/');
  const json = atob(padded);
  return JSON.parse(json).exp as number;
}

function isTokenValid(token: string): boolean {
  try {
    const exp = parseJwtExp(token);
    return exp * 1000 - Date.now() > TOKEN_EXPIRY_BUFFER_MS;
  } catch {
    return false;
  }
}

// ─── Token management ────────────────────────────────────────────────────────

async function loadCachedToken(): Promise<string | null> {
  if (cachedToken && isTokenValid(cachedToken)) return cachedToken;

  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored && isTokenValid(stored)) {
      cachedToken = stored;
      return stored;
    }
  } catch {
    // ignore storage errors
  }
  return null;
}

async function fetchNewToken(): Promise<string> {
  const res = await fetch(`${BASE_URL}/auth?appId=${APP_ID}`, {
    headers: { Authorization: `Bearer ${PRIVATE_KEY}` },
  });
  if (!res.ok) throw new Error(`Auth failed: HTTP ${res.status}`);

  const { accessToken } = await res.json();
  if (!accessToken) throw new Error('Auth response missing accessToken');

  cachedToken = accessToken;
  try {
    const exp = parseJwtExp(accessToken);
    const ttlMs = exp * 1000 - Date.now() - TOKEN_EXPIRY_BUFFER_MS;
    if (ttlMs > 0) {
      await AsyncStorage.setItem(STORAGE_KEY, accessToken);
      // Schedule automatic cache invalidation
      setTimeout(() => {
        cachedToken = null;
        AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
      }, ttlMs);
    }
  } catch {
    // store without TTL if parsing fails
    await AsyncStorage.setItem(STORAGE_KEY, accessToken).catch(() => {});
  }

  return accessToken;
}

async function getToken(): Promise<string> {
  const existing = await loadCachedToken();
  if (existing) return existing;
  return fetchNewToken();
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * POST to a seatmap endpoint with automatic JWT auth.
 * Retries once if the token was rejected (401).
 */
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const token = await getToken();

  const res = await fetch(`${BASE_URL}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  // Token expired server-side → clear cache and retry once
  if (res.status === 401) {
    cachedToken = null;
    await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});

    const freshToken = await fetchNewToken();
    const retry = await fetch(`${BASE_URL}/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${freshToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!retry.ok) throw new Error(`HTTP ${retry.status}`);
    return retry.json() as Promise<T>;
  }

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}
