export function ProductGridSkeleton() {
  return <div className="product-grid">{Array.from({ length: 8 }, (_, index) => <div className="skeleton-card" key={index}><div className="skeleton skeleton-art" /><div className="skeleton-info"><div className="skeleton skeleton-line short" /><div className="skeleton skeleton-line" /><div className="skeleton skeleton-line price" /></div></div>)}</div>
}

export function OrderListSkeleton() {
  return <div className="orders-list">{Array.from({ length: 3 }, (_, index) => <div className="skeleton-order" key={index}><div className="skeleton skeleton-line short" /><div className="skeleton skeleton-line" /><div className="skeleton skeleton-line" /></div>)}</div>
}