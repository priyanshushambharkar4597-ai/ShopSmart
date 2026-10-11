import React, { useState } from 'react'
import { X, Check, Plus, Minus } from 'lucide-react'
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
      className="brutalist-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Product Spec Sheet for ${product.name}`}
    >
      <div className="brutalist-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Header Bar */}
        <div className="modal-top-bar">
          <div className="modal-header-tag">
            <span>[SPECIFICATION SHEET // ITEM 0{product.id}]</span>
          </div>
          <button
            type="button"
            className="modal-close-square-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={16} strokeWidth={3} />
          </button>
        </div>

        {/* Modal Main Split Grid */}
        <div className="modal-split-grid">
          {/* Left Column: Media Graphic */}
          <div className="modal-media-col">
            <ProductArtwork product={product} size="large" />
            <div className="artwork-caption-strip">
              <span>AUTHENTIC SHOPSMART CONCEPT ARCHIVE</span>
              <span>[QC VERIFIED]</span>
            </div>
          </div>

          {/* Right Column: Technical Spec Table */}
          <div className="modal-info-col">
            <div className="modal-meta-row">
              <span className="brand-badge">[{product.brand?.toUpperCase()}]</span>
              <span className="cat-badge">{product.category?.toUpperCase()}</span>
            </div>

            <h2 className="modal-product-title">{product.name}</h2>

            <div className="modal-price-box">
              <span className="price-title">RETAIL PRICE (ALL TAXES INCLUDED):</span>
              <span className="price-big">₹{formatPrice(product.price)}</span>
            </div>

            {/* Technical Specification Table */}
            <div className="spec-table-box">
              <div className="spec-table-row">
                <span className="spec-col-key">RATING INDEX</span>
                <span className="spec-col-val">{Number(product.rating || 0).toFixed(1)} / 5.0 (VERIFIED)</span>
              </div>
              <div className="spec-table-row">
                <span className="spec-col-key">POPULARITY</span>
                <span className="spec-col-val">{product.popularity}% USER AFFINITY</span>
              </div>
              <div className="spec-table-row">
                <span className="spec-col-key">TAG SIGNATURE</span>
                <span className="spec-col-val">{product.tags || 'ANIME|POP-CULTURE'}</span>
              </div>
              <div className="spec-table-row">
                <span className="spec-col-key">DISPATCH CARRIER</span>
                <span className="spec-col-val">SPEED POST / BLUEDART (24-48H)</span>
              </div>
            </div>

            {/* Size Selector for Clothing */}
            {isClothing && (
              <div className="modal-size-block">
                <label className="size-label">SELECT SIZE [UNISEX FIT]:</label>
                <div className="size-options-row">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`size-square-btn ${selectedSize === s ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="modal-qty-block">
              <label className="qty-label">LOADOUT QUANTITY:</label>
              <div className="qty-stepper-row">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} strokeWidth={3} />
                </button>
                <span className="qty-value-box">{quantity}</span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Add to Loadout Button */}
            <div className="modal-action-row">
              <button
                type="button"
                className={`modal-submit-add-btn ${justAdded ? 'added' : ''}`}
                onClick={handleAdd}
                disabled={isAdding}
              >
                {justAdded ? (
                  <>
                    <Check size={16} strokeWidth={3} />
                    <span>LOADOUT UPDATED ✓</span>
                  </>
                ) : isAdding ? (
                  <span>DISPATCHING TO CART...</span>
                ) : (
                  <span>[+ ADD TO LOADOUT MANIFEST]</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Related Drops Sector Row */}
        {relatedProducts.length > 0 && (
          <div className="modal-related-strip">
            <div className="related-title-bar">[RELATED SECTOR DROPS]</div>
            <div className="related-items-row">
              {relatedProducts.map((rel) => (
                <button
                  key={rel.id}
                  type="button"
                  className="related-item-cell"
                  onClick={() => onOpenProduct(rel.id)}
                >
                  <span className="rel-id">ITEM 0{rel.id}</span>
                  <span className="rel-name">{rel.name}</span>
                  <span className="rel-price">₹{formatPrice(rel.price)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
