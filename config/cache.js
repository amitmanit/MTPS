// ============================================================
// config/cache.js — Simple In-Memory Cache with TTL
// Works across warm serverless function instances.
// Cache auto-expires so fresh data is always served.
// ============================================================

const store = {};

/**
 * Get a cached value by key.
 * Returns null if not found or expired.
 */
const get = (key) => {
  const entry = store[key];
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    delete store[key]; // cleanup expired entry
    return null;
  }
  return entry.value;
};

/**
 * Store a value in cache with a TTL (in seconds).
 * Default TTL: 5 minutes (300s)
 */
const set = (key, value, ttlSeconds = 300) => {
  store[key] = {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000
  };
};

/**
 * Invalidate (delete) a specific cache key.
 * Call this when data is updated (e.g., admin adds a notice).
 */
const del = (key) => {
  delete store[key];
};

/**
 * Clear all cached data.
 */
const flush = () => {
  Object.keys(store).forEach(key => delete store[key]);
};

module.exports = { get, set, del, flush };
