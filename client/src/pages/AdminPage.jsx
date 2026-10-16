import { useEffect, useState } from 'react'
import {
  createAdminCategory,
  createAdminProduct,
  deleteAdminCategory,
  deleteAdminProduct,
  fetchAdminCategories,
  fetchAdminOrders,
  fetchAdminProducts,
  updateAdminCategory,
  updateAdminInventory,
  updateAdminOrderStatus,
  updateAdminProduct,
} from '../api/admin.js'

const blankProduct = { name: '', slug: '', description: '', price: '', unit: '', imageUrl: '', imageFile: null, stockQuantity: 0, categoryId: '', isActive: true }
const blankCategory = { name: '', slug: '' }

function AdminPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [orders, setOrders] = useState([])
  const [productForm, setProductForm] = useState(blankProduct)
  const [categoryForm, setCategoryForm] = useState(blankCategory)
  const [editingProduct, setEditingProduct] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [inventoryDrafts, setInventoryDrafts] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadAdminData() {
    try {
      const [loadedProducts, loadedCategories, loadedOrders] = await Promise.all([
        fetchAdminProducts(), fetchAdminCategories(), fetchAdminOrders(),
      ])
      setProducts(loadedProducts)
      setCategories(loadedCategories)
      setOrders(loadedOrders)
      setInventoryDrafts(Object.fromEntries(loadedProducts.map((product) => [product.id, product.stock_quantity])))
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to load the admin dashboard.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(loadAdminData, 0)
    return () => window.clearTimeout(timer)
  }, [])

  function updateProductField(field, value) { setProductForm({ ...productForm, [field]: value }) }
  function updateCategoryField(field, value) { setCategoryForm({ ...categoryForm, [field]: value }) }

  function buildProductFormData() {
    const formData = new FormData()
    Object.entries(productForm).forEach(([field, value]) => {
      if (field !== 'imageFile' && value !== null && value !== '') formData.append(field, value)
    })
    if (productForm.imageFile) formData.append('image', productForm.imageFile)
    return formData
  }

  async function submitProduct(event) {
    event.preventDefault()
    setError('')
    try {
      const productPayload = buildProductFormData()
      if (editingProduct) await updateAdminProduct(editingProduct, productPayload)
      else await createAdminProduct(productPayload)
      setProductForm(blankProduct)
      setEditingProduct(null)
      await loadAdminData()
    } catch (requestError) { setError(requestError.response?.data?.error || 'Unable to save product.') }
  }

  async function submitCategory(event) {
    event.preventDefault()
    setError('')
    try {
      if (editingCategory) await updateAdminCategory(editingCategory, categoryForm)
      else await createAdminCategory(categoryForm)
      setCategoryForm(blankCategory)
      setEditingCategory(null)
      await loadAdminData()
    } catch (requestError) { setError(requestError.response?.data?.error || 'Unable to save category.') }
  }

  async function removeProduct(id) {
    if (!window.confirm('Deactivate this product?')) return
    try { await deleteAdminProduct(id); await loadAdminData() } catch (requestError) { setError(requestError.response?.data?.error || 'Unable to deactivate product.') }
  }

  async function removeCategory(id) {
    if (!window.confirm('Delete this category? Categories with products cannot be deleted.')) return
    try { await deleteAdminCategory(id); await loadAdminData() } catch (requestError) { setError(requestError.response?.data?.error || 'Unable to delete category.') }
  }

  async function saveInventory(id) {
    try { await updateAdminInventory(id, Number(inventoryDrafts[id])); await loadAdminData() } catch (requestError) { setError(requestError.response?.data?.error || 'Unable to update inventory.') }
  }

  async function changeOrderStatus(id, status) {
    try { const updated = await updateAdminOrderStatus(id, status); setOrders(orders.map((order) => order.id === updated.id ? { ...order, status: updated.status } : order)) } catch (requestError) { setError(requestError.response?.data?.error || 'Unable to update order status.') }
  }

  if (isLoading) return <main className="page-shell"><div className="state">Loading admin dashboard...</div></main>

  return (
    <main className="page-shell admin-page">
      <div className="section-heading"><div><p className="eyebrow">Operations</p><h1>Admin dashboard</h1></div><button className="text-button" onClick={loadAdminData} type="button">Refresh data</button></div>
      {error && <div className="error-state">{error}</div>}

      <section className="admin-section">
        <div className="admin-section-heading"><h2>Products & inventory</h2><span>{products.length} products</span></div>
        <div className="admin-grid">
          <form className="admin-form" onSubmit={submitProduct}>
            <h3>{editingProduct ? 'Edit product' : 'Create product'}</h3>
            <input onChange={(event) => updateProductField('name', event.target.value)} placeholder="Product name" required value={productForm.name} />
            <input onChange={(event) => updateProductField('slug', event.target.value)} placeholder="slug-format" required value={productForm.slug} />
            <textarea onChange={(event) => updateProductField('description', event.target.value)} placeholder="Description" rows="3" value={productForm.description} />
            <div className="admin-form-row"><input min="0" onChange={(event) => updateProductField('price', event.target.value)} placeholder="Price" required step="0.01" type="number" value={productForm.price} /><input onChange={(event) => updateProductField('unit', event.target.value)} placeholder="Unit" required value={productForm.unit} /></div>
            <div className="admin-form-row"><input min="0" onChange={(event) => updateProductField('stockQuantity', event.target.value)} placeholder="Stock" required type="number" value={productForm.stockQuantity} /><select onChange={(event) => updateProductField('categoryId', event.target.value)} required value={productForm.categoryId}><option value="">Category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
            <label className="file-label">Product image<input accept="image/*" onChange={(event) => updateProductField('imageFile', event.target.files[0] || null)} type="file" /></label>
            <label className="checkbox-label"><input checked={productForm.isActive} onChange={(event) => updateProductField('isActive', event.target.checked)} type="checkbox" /> Active in catalog</label>
            <button className="button" type="submit">{editingProduct ? 'Save product' : 'Create product'}</button>
            {editingProduct && <button className="text-button" onClick={() => { setEditingProduct(null); setProductForm(blankProduct) }} type="button">Cancel edit</button>}
          </form>
            <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Product</th><th>Price</th><th>Inventory</th><th>Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><strong>{product.name}</strong><small>{product.category_name}</small></td><td>${Number(product.price).toFixed(2)}</td><td><div className="inventory-control"><input min="0" onChange={(event) => setInventoryDrafts({ ...inventoryDrafts, [product.id]: event.target.value })} type="number" value={inventoryDrafts[product.id] ?? 0} /><button className="text-button" onClick={() => saveInventory(product.id)} type="button">Save</button></div></td><td><button className="text-button" onClick={() => { setEditingProduct(product.id); setProductForm({ name: product.name, slug: product.slug, description: product.description || '', price: product.price, unit: product.unit, imageUrl: product.image_url || '', imageFile: null, stockQuantity: product.stock_quantity, categoryId: product.category_id, isActive: product.is_active }) }} type="button">Edit</button><button className="remove-button" onClick={() => removeProduct(product.id)} type="button">Deactivate</button></td></tr>)}</tbody></table></div>
        </div>
      </section>

      <section className="admin-section"><div className="admin-section-heading"><h2>Categories</h2><span>{categories.length} categories</span></div><div className="admin-grid"><form className="admin-form" onSubmit={submitCategory}><h3>{editingCategory ? 'Edit category' : 'Create category'}</h3><input onChange={(event) => updateCategoryField('name', event.target.value)} placeholder="Category name" required value={categoryForm.name} /><input onChange={(event) => updateCategoryField('slug', event.target.value)} placeholder="slug-format" required value={categoryForm.slug} /><button className="button" type="submit">{editingCategory ? 'Save category' : 'Create category'}</button>{editingCategory && <button className="text-button" onClick={() => { setEditingCategory(null); setCategoryForm(blankCategory) }} type="button">Cancel edit</button>}</form><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Products</th><th>Actions</th></tr></thead><tbody>{categories.map((category) => <tr key={category.id}><td><strong>{category.name}</strong><small>{category.slug}</small></td><td>{category.product_count}</td><td><button className="text-button" onClick={() => { setEditingCategory(category.id); setCategoryForm({ name: category.name, slug: category.slug }) }} type="button">Edit</button><button className="remove-button" onClick={() => removeCategory(category.id)} type="button">Delete</button></td></tr>)}</tbody></table></div></div></section>

      <section className="admin-section"><div className="admin-section-heading"><h2>Orders</h2><span>{orders.length} total</span></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><strong>#{order.id}</strong><small>{new Date(order.created_at).toLocaleDateString()}</small></td><td>{order.user_first_name} {order.user_last_name}<small>{order.user_email}</small></td><td>${Number(order.total).toFixed(2)}</td><td><select className="status-select" onChange={(event) => changeOrderStatus(order.id, event.target.value)} value={order.status}><option value="placed">Placed</option><option value="packed">Packed</option><option value="out_for_delivery">Out for delivery</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select></td></tr>)}</tbody></table></div></section>
    </main>
  )
}

export default AdminPage