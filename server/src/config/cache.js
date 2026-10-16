const entries = new Map()

export function getCached(key) {
  const entry = entries.get(key)
  if (!entry) return undefined
  if (entry.expiresAt <= Date.now()) {
    entries.delete(key)
    return undefined
  }
  return entry.value
}

export function setCached(key, value, ttlMs) {
  if (!entries.has(key) && entries.size >= 500) {
    entries.delete(entries.keys().next().value)
  }
  entries.set(key, { value, expiresAt: Date.now() + ttlMs })
  return value
}

export function invalidateCachePrefix(prefix) {
  for (const key of entries.keys()) {
    if (key.startsWith(prefix)) entries.delete(key)
  }
}