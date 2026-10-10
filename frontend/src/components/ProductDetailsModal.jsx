import React, { useState } from 'react'
import {
  X,
  Star,
  Flame,
  ShoppingCart,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Layers
} from 'lucide-react'
import ProductArtwork from './ProductArtwork'

export default function ProductDetailsModal({
  product,
  onClose,
  onAddToCart,
  formatPrice,
  allProducts = [],
  onOpenProduct
}) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('L')
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  if (!product) return null

  const isClothing = (product.category || '').toLowerCase().includes('clothing')
  const sizes = ['S', 'M', 'L', 'XL', '2XL']

  // Find related products in same category
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3)

  async function handleAdd() {
    setIsAdding(true)
    await onAddToCart(product.id, product.name, quantity)
    setIsAdding(false)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Product details for ${product.name}`}
    >
      <div className="product-details-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close product details"
        >
          <X size={20} />
        </button>

        <div className="details-modal-grid">
          {/* Left Column: Artwork Showcase */}
          <div className="details-artwork-col">
            <ProductArtwork product={product} size="large" />

            <div className="details-perks-row">
              <div className="perk-chip">
                <Truck size={14} className="accent-lime" />
                <span>Express Dispatch</span>
              </div>
              <div className="perk-chip">
                <ShieldCheck size={14} className="accent-cyan" />
                <span>100% Authentic Merch</span>
              </div>
              <div className="perk-chip">
                <RotateCcw size={14} className="accent-pink" />
                <span>7-Day Size Exchange</span>
              </div>
            </div>
          </div>

          {/* Right Column: Specs & Actions */}
          <div className="details-info-col">
            <div className="details-header-meta">
              <span className="details-brand-pill">{product.brand || 'SHOPSMART'}</span>
              <span className="details-category-pill">{product.category}</span>
              <span className="details-stock-pill">● IN STOCK</span>
            </div>

            <h2 className="details-title">{product.name}</h2>

            {/* Ratings and Popularity */}
            <div className="details-metrics-bar">
              <div className="details-rating-chip">
                <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                <strong>{Number(product.rating || 0).toFixed(1)} / 5.0</strong>
              </div>
              <div className="details-pop-chip">
                <Flame size={14} className="accent-pink" />
                <span>Popularity Index: <strong>{product.popularity} / 100</strong></span>
              </div>
            </div>

            {/* Price Row */}
            <div className="details-price-row">
              <span className="details-currency">₹</span>
              <span className="details-price-val">{formatPrice(product.price)}</span>
              <span className="details-tax-note">Inclusive of all duties & taxes</span>
            </div>

            {/* Size Selector for Clothing */}
            {isClothing && (
              <div className="details-size-section">
                <div className="size-label-row">
                  <span className="size-label">SELECT FIT SIZE:</span>
                  <span className="size-guide-hint">Over-sized streetwear cut</span>
                </div>
                <div className="size-pills-row">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`size-pill ${selectedSize === s ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tags list */}
            {product.tags && (
              <div className="details-tags-section">
                <span className="tags-label">TAGS & ARCHIVES:</span>
                <div className="tags-container">
                  {product.tags.split('|').map((tag) => (
                    <span key={tag} className="tag-bubble">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Cart Button */}
            <div className="details-actions-row">
              <div className="quantity-counter">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="qty-val">{quantity}</span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className={`details-add-btn ${justAdded ? 'added' : ''}`}
                onClick={handleAdd}
                disabled={isAdding}
              >
                {justAdded ? (
                  <>
                    <Check size={18} strokeWidth={3} />
                    <span>ADDED TO CART</span>
                  </>
                ) : isAdding ? (
                  <span>ADDING TO CART...</span>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    <span>ADD TO CART • ₹{formatPrice(Number(product.price) * quantity)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Related Products in same universe */}
        {relatedProducts.length > 0 && (
          <div className="related-products-row">
            <h4 className="related-title">
              <Layers size={14} className="accent-purple" />
              <span>MORE FROM {product.category.toUpperCase()}</span>
            </h4>
            <div className="related-grid">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  className="related-item-card"
                  onClick={() => onOpenProduct(rel.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="related-thumb">
                    <ProductArtwork product={rel} />
                  </div>
                  <div className="related-info">
                    <h5 className="related-name">{rel.name}</h5>
                    <span className="related-price">₹{formatPrice(rel.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
