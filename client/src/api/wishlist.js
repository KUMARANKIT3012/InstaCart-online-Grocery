import apiClient from './client.js'

export async function fetchWishlist() { return (await apiClient.get('/wishlist')).data.products }
export async function addWishlist(productId) { return (await apiClient.post(`/wishlist/${productId}`)).data.products }
export async function removeWishlist(productId) { return (await apiClient.delete(`/wishlist/${productId}`)).data.products }