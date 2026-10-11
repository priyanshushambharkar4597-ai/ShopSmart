import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function PromoBanner({ onExploreSale }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard?.writeText('SHINOBI20')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="brutalist-promo-section" aria-label="Campaign Dispatch Poster">
      <div className="promo-poster-frame">
        <div className="poster-top-strip">
          <span>[CAMPAIGN: DISPATCH ORDER 04]</span>
          <span>SPECIAL ISSUE // NEW DELHI HQ</span>
          <span>STOCK RESTRICTION: ACTIVE</span>
        </div>

        <div className="poster-main-content">
          <div className="poster-left-text">
            <h2 className="poster-headline">
              SEASON 04 SURPLUS DISPATCH.
              <br />
              FLAT 20% OFF ALL MERCHANDISE.
            </h2>

            <p className="poster-body-copy">
              Valid on all 280 GSM graphic tees, katanas, silver talismans, and desk mats.
              No minimum quantity drama. Dispatched across all Indian pin codes via Speed Post & BlueDart within 24 hours.
            </p>

            <div className="poster-terms-fineprint">
              TERMS: CODE VALID ONCE PER USER ACCOUNT FOR ORDERS EXCEEDING ₹1,499. ACID DATABASE TRANSACTIONS ENSURE INVENTORY INTEGRITY. NO REFUNDS FOR POOR TASTE.
            </div>
          </div>

          <div className="poster-right-action">
            <div className="promo-voucher-box">
              <span className="voucher-title">[DISCOUNT VOUCHER]</span>
              <div className="voucher-code-display">SHINOBI20</div>
              <button
                type="button"
                className="voucher-copy-btn"
                onClick={handleCopy}
                aria-label="Copy voucher code SHINOBI20"
              >
                {copied ? (
                  <>
                    <Check size={14} strokeWidth={3} />
                    <span>CODE COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} strokeWidth={2.5} />
                    <span>COPY CODE</span>
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              className="poster-claim-btn"
              onClick={onExploreSale}
            >
              <span>CLAIM DISCOUNT →</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
