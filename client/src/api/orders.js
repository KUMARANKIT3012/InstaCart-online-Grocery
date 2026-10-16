import apiClient from './client.js'

export async function createOrder(deliveryAddress) {
  const response = await apiClient.post('/orders', { deliveryAddress })
  return response.data
}

export async function fetchOrders() {
  const response = await apiClient.get('/orders')
  return response.data.orders
}

export async function fetchOrder(id) {
  const response = await apiClient.get(`/orders/${id}`)
  return response.data.order
}