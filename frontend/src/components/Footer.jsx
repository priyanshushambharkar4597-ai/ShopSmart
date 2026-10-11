import React from 'react'
import { ArrowUp } from 'lucide-react'

export default function Footer({ onSelectCategory }) {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="brutalist-footer-root" aria-label="Site Footer">
      {/* Top Giant Typographic Bar */}
      <div className="footer-giant-wordmark-strip">
        <div className="giant-brand-row">
          <span className="giant-wordmark">SHOPSMART</span>
          <button
            type="button"
            className="footer-scroll-top-btn"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
          >
            <span>[BACK TO TOP]</span>
            <ArrowUp size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Dense 3-Column Spec Grid */}
      <div className="footer-columns-grid">
        {/* Col 01: Catalogue Sectors */}
        <div className="footer-cell">
          <h4 className="footer-cell-header">[01 / ARCHIVE SECTORS]</h4>
          <ul className="footer-dense-list">
            <li>
              <button type="button" onClick={() => onSelectCategory('Clothing')}>
                → 01 CLOTHING (280 GSM HEAVYWEIGHT)
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onSelectCategory('Accessories')}>
                → 02 ACCESSORIES (TACTICAL GEAR & PINS)
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onSelectCategory('Jewellery')}>
                → 03 JEWELLERY (STERLING SILVER & TALISMANS)
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onSelectCategory('Collectibles')}>
                → 04 COLLECTIBLES (SCALE FIGURES & KATANAS)
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onSelectCategory('Decor')}>
                → 05 DECOR (RGB NEO-MATS & ACRYLIC LAMPS)
              </button>
            </li>
          </ul>
        </div>

        {/* Col 02: Logistics & Dispatch */}
        <div className="footer-cell">
          <h4 className="footer-cell-header">[02 / DISPATCH SPECIFICATIONS]</h4>
          <ul className="footer-dense-list static-text">
            <li>DISPATCH HUB: NEW DELHI, BHARAT</li>
            <li>CARRIER: SPEED POST & BLUEDART EXPRESS</li>
            <li>FREE DELIVERY THRESHOLD: ORDERS ≥ ₹999</li>
            <li>RETURN POLICY: 7-DAY DAMAGED EXCHANGE ONLY</li>
            <li>PACKAGING: WATERPROOF RIGID ARCHIVE MAILERS</li>
          </ul>
        </div>

        {/* Col 03: Core Architecture & DSA Credit */}
        <div className="footer-cell">
          <h4 className="footer-cell-header">[03 / SYSTEM ARCHITECTURE CREDITS]</h4>
          <ul className="footer-dense-list static-text">
            <li>ALGORITHMS: BST (SEARCH), HASH (ID), HEAP (RECS)</li>
            <li>BACKEND ENGINE: C11 + GNU MICROHTTPD 0.9</li>
            <li>DATA STORE: SQLITE3 RELATIONAL ACID ENGINE</li>
            <li>CLIENT ENGINE: REACT 19 + VITE + OXLINT</li>
            <li>DESIGN SYSTEM: RAW BRUTALISM // MONOSPACE SPEC</li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal / Disclaimer Strip */}
      <div className="footer-bottom-legal-strip">
        <div className="legal-left">
          <span>© {new Date().getFullYear()} SHOPSMART. ALL ORIGINAL CONCEPT DESIGNS AND TRADEMARKS PRESERVED.</span>
        </div>
        <div className="legal-right">
          <span>NO LOREM IPSUM // NO GENERATED TEMPLATES // REAL DATA STRUCTURES</span>
        </div>
      </div>
    </footer>
  )
}
