import React, { useState } from 'react'
import { Check, Plus } from 'lucide-react'
import ProductArtwork from './ProductArtwork'

export default function ProductCard({
  product,
  onOpen,
  onAddToCart,
  formatPrice
}) {
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const popularity = Number(product.popularity || 0)
  const rating = Number(product.rating || 0)
  const id = Number(product.id || 0)

  // Plain square tags in black or signal red
  let badgeLabel = null
  let isRedBadge = false

  if (popularity >= 94) {
    badgeLabel = 'BEST SELLER'
    isRedBadge = true
  } else if (id >= 120) {
    badgeLabel = 'NEW DROP'
    isRedBadge = false
  } else if (rating >= 4.7) {
    badgeLabel = 'TOP RATED'
    isRedBadge = true
  } else if (popularity >= 85) {
    badgeLabel = 'TRENDING'
    isRedBadge = false
  }

  async function handleAddClick(e) {
    e.stopPropagation()
    setIsAdding(true)
    await onAddToCart(product.id, product.name)
    setIsAdding(false)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1600)
  }

  return (
    <article
      className="brutalist-product-card"
      onClick={() => onOpen(product.id)}
      tabIndex={0}
      role="button"
      aria-label={`View technical spec for ${product.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(product.id)
        }
      }}
    >
      {/* Top Header Label Strip */}
      <div className="card-header-strip">
        <span className="card-item-code">ITEM 0{product.id}</span>
        <span className="card-cat-label">{product.category?.toUpperCase()}</span>
      </div>

      {/* Schematic Media Area */}
      <div className="card-artwork-frame">
        <ProductArtwork product={product} />

        {/* Square Bordered Badges */}
        {badgeLabel && (
          <div className={`card-square-badge ${isRedBadge ? 'badge-red' : 'badge-black'}`}>
            <span>[{badgeLabel}]</span>
          </div>
        )}
      </div>

      {/* Card Spec Details */}
      <div className="card-body-block">
        <div className="card-brand-row">
          <span className="brand-name">{product.brand?.toUpperCase() || 'SHOPSMART'}</span>
          <span className="rating-tag">RATING: {Number(product.rating || 0).toFixed(1)}/5.0</span>
        </div>

        <h3 className="card-item-title" title={product.name}>
          {product.name}
        </h3>

        {/* Tag String */}
        {product.tags && (
          <div className="card-tags-list">
            {product.tags
              .split('|')
              .slice(0, 3)
              .map((tag) => (
                <span key={tag} className="tag-spec-item">
                  #{tag.toUpperCase()}
                </span>
              ))}
          </div>
        )}

        {/* Bottom Price & Add Action Grid */}
        <div className="card-price-action-row">
          <div className="price-box">
            <span className="price-label">PRICE (INCL. TAX)</span>
            <span className="price-val">₹{formatPrice(product.price)}</span>
          </div>

          <button
            type="button"
            className={`card-add-btn ${justAdded ? 'just-added' : ''}`}
            onClick={handleAddClick}
            disabled={isAdding}
            aria-label={`Add ${product.name} to loadout`}
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
                <Plus size={14} strokeWidth={3} />
                <span>ADD</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
