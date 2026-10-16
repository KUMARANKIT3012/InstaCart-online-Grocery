export async function getHealthStatus() {
  return {
    status: 'ok',
    service: 'instacart-api',
    timestamp: new Date().toISOString(),
  }
}