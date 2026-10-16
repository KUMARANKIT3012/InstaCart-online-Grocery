import apiClient from './client.js'

export async function fetchAdminProducts() { return (await apiClient.get('/admin/products')).data.products }
export async function createAdminProduct(product) { return (await apiClient.post('/admin/products', product)).data.product }
export async function updateAdminProduct(id, product) { return (await apiClient.patch(`/admin/products/${id}`, product)).data.product }
export async function deleteAdminProduct(id) { return apiClient.delete(`/admin/products/${id}`) }
export async function updateAdminInventory(id, stockQuantity) { return (await apiClient.patch(`/admin/products/${id}/inventory`, { stockQuantity })).data.product }
export async function fetchAdminCategories() { return (await apiClient.get('/admin/categories')).data.categories }
export async function createAdminCategory(category) { return (await apiClient.post('/admin/categories', category)).data.category }
export async function updateAdminCategory(id, category) { return (await apiClient.patch(`/admin/categories/${id}`, category)).data.category }
export async function deleteAdminCategory(id) { return apiClient.delete(`/admin/categories/${id}`) }
export async function fetchAdminOrders() { return (await apiClient.get('/admin/orders')).data.orders }
export async function updateAdminOrderStatus(id, status) { return (await apiClient.patch(`/admin/orders/${id}/status`, { status })).data.order }