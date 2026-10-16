import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchCategories, fetchProducts } from '../api/catalog.js'
import ProductCard from '../components/ProductCard.jsx'
import { ProductGridSkeleton } from '../components/Skeleton.jsx'

function HomePage() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('name_asc')
  const [page, setPage] = useState(1)
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: fetchCategories, staleTime: 300_000 })

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(1)
    }, 350)

    return () => clearTimeout(debounceTimer)
  }, [searchInput])

  const productsQuery = useQuery({
    queryKey: ['products', { category, search, minPrice, maxPrice, sort, page }],
    queryFn: () => fetchProducts({ category: category || undefined, search: search || undefined, minPrice: minPrice || undefined, maxPrice: maxPrice || undefined, sort, page, limit: 12 }),
    placeholderData: (previousData) => previousData,
  })
  const products = productsQuery.data?.data || []
  const pagination = productsQuery.data?.pagination || { totalItems: 0, totalPages: 0 }
  const categories = categoriesQuery.data || []
  const isLoading = productsQuery.isLoading
  const error = productsQuery.error?.response?.data?.error || (categoriesQuery.error ? 'We could not load the categories.' : '')

  function resetFilters() {
    setSearchInput('')
    setSearch('')
    setCategory('')
    setMinPrice('')
    setMaxPrice('')
    setSort('name_asc')
    setPage(1)
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Fresh choices, delivered simply</p>
          <h1>Good food starts with a good shop.</h1>
          <p>Stock your kitchen with everyday favorites and fresh finds from one thoughtful grocery list.</p>
        </div>
        <div className="hero-art" aria-hidden="true">✦</div>
      </section>

      <section id="categories">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The market</p>
            <h2>Shop the essentials</h2>
          </div>
          <p>{pagination.totalItems} items</p>
        </div>

        <div className="search-form catalog-search">
          <input
            className="search-input"
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search groceries by name"
            value={searchInput}
          />
        </div>

        {isLoading && <ProductGridSkeleton />}
        {!isLoading && error && <div className="error-state">{error}</div>}
        {!isLoading && !error && products.length === 0 && <div className="state">No products matched your search.</div>}
        {!isLoading && !error && products.length > 0 && (
          <div className="catalog-layout">
            <aside className="filter-sidebar">
              <div className="filter-heading"><h2>Filters</h2><button className="text-button" onClick={resetFilters} type="button">Reset</button></div>
              <label className="filter-label">Category<select className="category-select" onChange={(event) => { setCategory(event.target.value); setPage(1) }} value={category}><option value="">All categories</option>{categories.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select></label>
              <fieldset className="price-fields"><legend>Price range</legend><div><label>Min<input min="0" onChange={(event) => { setMinPrice(event.target.value); setPage(1) }} placeholder="$0" step="0.01" type="number" value={minPrice} /></label><label>Max<input min="0" onChange={(event) => { setMaxPrice(event.target.value); setPage(1) }} placeholder="$50" step="0.01" type="number" value={maxPrice} /></label></div></fieldset>
              <label className="filter-label">Sort by<select className="category-select" onChange={(event) => { setSort(event.target.value); setPage(1) }} value={sort}><option value="name_asc">Name A-Z</option><option value="name_desc">Name Z-A</option><option value="price_asc">Price low to high</option><option value="price_desc">Price high to low</option><option value="newest">Newest</option></select></label>
            </aside>
            <div className="catalog-results">
              <div className="product-grid">
                {products.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
              {pagination.totalPages > 1 && <nav aria-label="Product pages" className="pagination"><button disabled={page === 1} onClick={() => setPage(page - 1)} type="button">Previous</button>{Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map((pageNumber) => <button className={pageNumber === page ? 'current-page' : ''} key={pageNumber} onClick={() => setPage(pageNumber)} type="button">{pageNumber}</button>)}<button disabled={page === pagination.totalPages} onClick={() => setPage(page + 1)} type="button">Next</button></nav>}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default HomePage