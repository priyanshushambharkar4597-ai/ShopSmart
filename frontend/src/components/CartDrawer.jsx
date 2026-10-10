import React, { useState } from 'react'
import {
  X,
  Trash2,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react'
import ProductArtwork from './ProductArtwork'

export default function CartDrawer({
  isOpen,
  onClose,
  cart = [],
  loadingCart,
  onRemoveFromCart,
  formatPrice,
  onGoHome
}) {
  const [promoCodeInput, setPromoCodeInput] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0) // percentage
  const [promoFeedback, setPromoFeedback] = useState('')

  if (!isOpen) return null

  const subtotal = cart.reduce((sum, item) => sum + Number(item.total || 0), 0)
  const discountAmount = subtotal * (appliedDiscount / 100)
  const freeShippingThreshold = 999
  const isFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0
  const deliveryFee = isFreeShipping ? 0 : 99
  const totalAmount = Math.max(0, subtotal - discountAmount + deliveryFee)

  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100)
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)

  function applyPromo(e) {
    e.preventDefault()
    const code = promoCodeInput.trim().toUpperCase()
    if (code === 'SHINOBI20') {
      setAppliedDiscount(20)
      setPromoFeedback('✓ 20% Shinobi Discount Applied!')
    } else if (code === 'CHOSEN20') {
      setAppliedDiscount(20)
      setPromoFeedback('✓ 20% Domain Expansion Discount Applied!')
    } else {
      setPromoFeedback('Invalid code. Try SHINOBI20')
    }
  }

  return (
    <div
      className="modal-backdrop cart-drawer-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
    >
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="cart-title-row">
            <div className="cart-header-icon-circle">
              <ShoppingCart size={18} />
            </div>
            <div>
              <h2 className="cart-drawer-title">YOUR LOADOUT</h2>
              <span className="cart-items-counter">
                {cart.reduce((cnt, item) => cnt + Number(item.quantity || 1), 0)} items in SQLite Cart
              </span>
            </div>
          </div>

          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close cart drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="free-shipping-bar-box">
          <div className="shipping-text-row">
            {isFreeShipping ? (
              <span className="shipping-unlocked">
                <Sparkles size={14} className="accent-lime" />
                <span>UNLOCKED: FREE AIR-EXPRESS SHIPPING!</span>
              </span>
            ) : (
              <span>
                Add <strong>₹{formatPrice(amountNeededForFreeShipping)}</strong> more to unlock FREE Hyper-Delivery
              </span>
            )}
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Drawer Body: Items or Empty State */}
        <div className="cart-drawer-body">
          {loadingCart ? (
            <div className="cart-loading-state">
              <div className="spinner-bolt">⚡</div>
              <p>Synchronizing cart with SQLite database...</p>
            </div>
          ) : cart.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-cart-avatar">🛍️</div>
              <h3>YOUR CART IS EMPTY</h3>
              <p>You haven't equipped any anime streetwear or collectibles yet.</p>
              <button
                type="button"
                className="cart-shop-now-btn"
                onClick={() => {
                  onClose()
                  onGoHome()
                }}
              >
                <span>EXPLORE DROPS</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-line-item">
                  <div className="line-item-thumb">
                    <ProductArtwork product={item} />
                  </div>

                  <div className="line-item-details">
                    <div className="line-item-top">
                      <span className="line-item-brand">{item.brand}</span>
                      <button
                        type="button"
                        className="line-item-remove-btn"
                        onClick={() => onRemoveFromCart(item.id, item.name)}
                        title="Remove item"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <h4 className="line-item-title">{item.name}</h4>

                    <div className="line-item-pricing">
                      <div className="line-qty-pill">
                        <span>QTY: {item.quantity}</span>
                      </div>
                      <div className="line-total-box">
                        <strong className="line-total-price">₹{formatPrice(item.total)}</strong>
                        <small className="line-unit-price">(₹{formatPrice(item.price)} each)</small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer / Checkout Summary */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Promo Code Form */}
            <form onSubmit={applyPromo} className="promo-input-group">
              <input
                type="text"
                placeholder="Discount Code (e.g. SHINOBI20)"
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
                aria-label="Enter promotional discount code"
              />
              <button type="submit" className="apply-promo-btn">
                APPLY
              </button>
            </form>
            {promoFeedback && (
              <span className={`promo-feedback-note ${appliedDiscount > 0 ? 'success' : 'error'}`}>
                {promoFeedback}
              </span>
            )}

            {/* Calculations Breakdown */}
            <div className="summary-calculations">
              <div className="summary-calc-row">
                <span>Subtotal</span>
                <span>₹{formatPrice(subtotal)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="summary-calc-row discount-row">
                  <span>Shinobi Discount (20%)</span>
                  <span>-₹{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="summary-calc-row">
                <span>Air Express Delivery</span>
                <span>{isFreeShipping ? <strong className="accent-lime">FREE</strong> : `₹${deliveryFee}`}</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-total-row">
                <span>Total Amount</span>
                <span className="total-highlight">₹{formatPrice(totalAmount)}</span>
              </div>
            </div>

            {/* Proceed Button */}
            <button
              type="button"
              className="checkout-proceed-btn"
              onClick={() => {
                alert(`Order initiated for ₹${formatPrice(totalAmount)}! In this project, checkout demonstrates complete end-to-end SQLite cart calculations.`)
              }}
            >
              <span>PROCEED TO SECURE CHECKOUT</span>
              <ArrowRight size={17} />
            </button>

            <div className="checkout-trust-badge">
              <ShieldCheck size={14} className="accent-lime" />
              <span>ACID-Compliant SQLite Cart • 100% Encrypted</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
