import React, { useState } from 'react'
import { X, Trash2, ArrowRight } from 'lucide-react'

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
  const [appliedDiscount, setAppliedDiscount] = useState(0)
  const [promoFeedback, setPromoFeedback] = useState('')

  if (!isOpen) return null

  const subtotal = cart.reduce((sum, item) => sum + Number(item.total || item.price * (item.quantity || 1) || 0), 0)
  const discountAmount = subtotal * (appliedDiscount / 100)
  const freeShippingThreshold = 999
  const isFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0
  const deliveryFee = isFreeShipping ? 0 : 99
  const totalAmount = Math.max(0, subtotal - discountAmount + deliveryFee)
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal)

  function applyPromo(e) {
    e.preventDefault()
    const code = promoCodeInput.trim().toUpperCase()
    if (code === 'SHINOBI20') {
      setAppliedDiscount(20)
      setPromoFeedback('✓ 20% SHINOBI DISCOUNT APPLIED')
    } else {
      setPromoFeedback('INVALID CODE. USE: SHINOBI20')
    }
  }

  return (
    <div
      className="brutalist-drawer-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Loadout Manifest"
    >
      <div className="brutalist-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Top Header */}
        <div className="drawer-header-strip">
          <div className="drawer-title-box">
            <span className="drawer-main-title">LOADOUT MANIFEST</span>
            <span className="drawer-count-badge">[{cart.length} ITEMS]</span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close cart drawer"
          >
            <X size={16} strokeWidth={3} />
          </button>
        </div>

        {/* Free Shipping Calculation Box */}
        <div className="drawer-shipping-indicator">
          {isFreeShipping ? (
            <div className="shipping-met-text">
              [SPEED POST FREE DISPATCH GRANTED // ORDERS OVER ₹999]
            </div>
          ) : (
            <div className="shipping-need-text">
              ADD ₹{formatPrice(amountNeeded)} MORE FOR FREE SPEED POST DELIVERY
            </div>
          )}
        </div>

        {/* Cart Item List */}
        <div className="drawer-items-scroll">
          {loadingCart ? (
            <div className="drawer-empty-msg">
              <span>SYNCING SQLITE CART STATE...</span>
            </div>
          ) : cart.length === 0 ? (
            <div className="drawer-empty-state">
              <span className="empty-title">[MANIFEST IS EMPTY]</span>
              <p className="empty-subtext">No drops committed to user session.</p>
              <button
                type="button"
                className="brutalist-primary-btn"
                onClick={() => {
                  onClose()
                  onGoHome()
                }}
              >
                <span>EXPLORE ARCHIVE DROPS</span>
                <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <div className="drawer-items-table">
              {cart.map((item, idx) => {
                const itemTotal = Number(item.total || (item.price * (item.quantity || 1)) || 0)
                const pid = item.product_id || item.id

                return (
                  <div key={`${pid}-${idx}`} className="drawer-item-row">
                    <div className="item-details-col">
                      <div className="item-meta-strip">
                        <span className="item-ref">ITEM 0{pid}</span>
                        <span className="item-cat">{item.category?.toUpperCase() || 'MERCH'}</span>
                      </div>
                      <h4 className="item-name">{item.name}</h4>
                      <div className="item-qty-price-row">
                        <span className="item-qty">QTY: {item.quantity || 1}</span>
                        <span className="item-calc">₹{formatPrice(itemTotal)}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="item-remove-btn"
                      onClick={() => onRemoveFromCart(pid, item.name)}
                      aria-label={`Remove ${item.name}`}
                      title="Remove from loadout"
                    >
                      <Trash2 size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout Calculation */}
        {cart.length > 0 && (
          <div className="drawer-summary-footer">
            {/* Promo Code Form */}
            <form className="drawer-promo-form" onSubmit={applyPromo}>
              <input
                type="text"
                placeholder="VOUCHER CODE (SHINOBI20)"
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
                className="promo-code-input"
              />
              <button type="submit" className="promo-apply-btn">
                [APPLY]
              </button>
            </form>
            {promoFeedback && (
              <div className={`promo-feedback-text ${appliedDiscount > 0 ? 'valid' : 'invalid'}`}>
                {promoFeedback}
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="summary-calc-table">
              <div className="calc-row">
                <span>MANIFEST SUBTOTAL</span>
                <span>₹{formatPrice(subtotal)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="calc-row discount-row">
                  <span>DISCOUNT ({appliedDiscount}%)</span>
                  <span>-₹{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="calc-row">
                <span>SPEED POST DISPATCH</span>
                <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              <div className="calc-row total-row">
                <span>NET PAYABLE</span>
                <span>₹{formatPrice(totalAmount)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              type="button"
              className="drawer-checkout-btn"
              onClick={() => {
                alert(`Order manifested successfully for ₹${formatPrice(totalAmount)}! Dispatched via Speed Post in 24 hours.`)
              }}
            >
              <span>[CONFIRM LOADOUT & DISPATCH →]</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
