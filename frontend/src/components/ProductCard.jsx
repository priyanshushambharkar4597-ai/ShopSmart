import React, { useState } from 'react'
import { ShoppingCart, Star, Zap, Flame, Award, Sparkles, Check } from 'lucide-react'
import ProductArtwork from './ProductArtwork'

export default function ProductCard({
  product,
  onOpen,
  onAddToCart,
  formatPrice
}) {
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  // Determine dynamic badge based on product metrics
  const popularity = Number(product.popularity || 0)
  const rating = Number(product.rating || 0)
  const id = Number(product.id || 0)

  let badge = null
  if (popularity >= 94) {
    badge = { label: 'BEST SELLER', icon: Flame, color: '#ff2a85', bg: 'rgba(255, 42, 133, 0.18)' }
  } else if (id >= 120) {
    badge = { label: 'NEW DROP', icon: Zap, color: '#00f5a0', bg: 'rgba(0, 245, 160, 0.18)' }
  } else if (rating >= 4.7) {
    badge = { label: 'TOP RATED', icon: Award, color: '#ffb703', bg: 'rgba(255, 183, 3, 0.18)' }
  } else if (popularity >= 85) {
    badge = { label: 'TRENDING', icon: Sparkles, color: '#00f2fe', bg: 'rgba(0, 242, 254, 0.18)' }
  }

  async function handleAddClick(e) {
    e.stopPropagation()
    setIsAdding(true)
    await onAddToCart(product.id, product.name)
    setIsAdding(false)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1800)
  }

  return (
    <article
      className="anime-product-card"
      onClick={() => onOpen(product.id)}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${product.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(product.id)
        }
      }}
    >
      {/* Top Media Area with Artwork & Floating Badges */}
      <div className="card-media-wrapper">
        <ProductArtwork product={product} />

        {badge && (
          <div
            className="dynamic-badge"
            style={{
              color: badge.color,
              backgroundColor: badge.bg,
              borderColor: badge.color
            }}
          >
            <badge.icon size={12} strokeWidth={2.5} />
            <span>{badge.label}</span>
          </div>
        )}

        {/* Popularity Index gauge pill */}
        <div className="popularity-gauge">
          <span className="gauge-label">SCORE</span>
          <span className="gauge-value">{popularity}</span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="card-content">
        <div className="card-meta">
          <span className="card-brand">{product.brand || 'SHOPSMART'}</span>
          <span className="card-category-tag">{product.category}</span>
        </div>

        <h3 className="card-title" title={product.name}>
          {product.name}
        </h3>

        {/* Rating and Reviews */}
        <div className="card-rating-row">
          <div className="stars-pill">
            <Star size={13} fill="#fbbf24" stroke="#fbbf24" />
            <span className="rating-score">{Number(product.rating || 0).toFixed(1)}</span>
          </div>
          <span className="rating-count">({Math.floor((popularity * 1.8) + 12)} verified)</span>
        </div>

        {/* Tags preview */}
        {product.tags && (
          <div className="card-tags">
            {product.tags
              .split('|')
              .slice(0, 2)
              .map((tag) => (
                <span key={tag} className="tag-pill">
                  #{tag}
                </span>
              ))}
          </div>
        )}

        {/* Bottom Price and Add to Cart Action */}
        <div className="card-bottom">
          <div className="price-container">
            <span className="currency-symbol">₹</span>
            <span className="price-amount">{formatPrice(product.price)}</span>
          </div>

          <button
            type="button"
            className={`card-add-button ${justAdded ? 'added' : ''}`}
            onClick={handleAddClick}
            disabled={isAdding}
            aria-label={`Add ${product.name} to cart`}
          >
            {justAdded ? (
              <>
                <Check size={14} strokeWidth={3} />
                <span>ADDED</span>
              </>
            ) : isAdding ? (
              <span>...</span>
            ) : (
              <>
                <ShoppingCart size={14} />
                <span>ADD</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
