import React from 'react'
import { ArrowRight, Terminal } from 'lucide-react'
import ProductArtwork from './ProductArtwork'

export default function Hero({ onExploreDrops, onExploreDsa, featuredProduct, onAddToCart }) {
  const sampleFeatured = featuredProduct || {
    id: 116,
    name: 'Phantom Shogun Oversized Tee',
    category: 'Clothing',
    brand: 'KitsuneThreads',
    price: 999,
    rating: 4.8,
    popularity: 95,
    tags: 'anime|oversized|streetwear|tshirt'
  }

  return (
    <section className="brutalist-hero-section" aria-label="Hero Showcase">
      <div className="hero-table-grid">
        {/* Left Column: Asymmetric Bold Typography */}
        <div className="hero-text-block">
          <div className="hero-meta-label">
            <span className="section-index">[01/MANIFESTO]</span>
            <span className="spec-stamp">EST. 2026 // NEW DELHI // ACID COMPLIANT</span>
          </div>

          <h1 className="hero-headline">
            OTAKU GRADE GOODS.
            <br />
            NO COMPROMISE.
            <br />
            <span className="headline-accent">BUILT IN BHARAT.</span>
          </h1>

          <p className="hero-statement">
            Heavyweight 280 GSM cotton, cold-cast resin, and obsidian talisman jewelry.
            Every drop indexed via in-memory Binary Search Trees and ranked by C-level Max Heaps.
            Zero dropshipping drama. Zero filler merch.
          </p>

          <div className="hero-btn-row">
            <button
              type="button"
              className="brutalist-primary-btn"
              onClick={onExploreDrops}
            >
              <span>SHOP ALL DROPS</span>
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>

            <button
              type="button"
              className="brutalist-secondary-btn"
              onClick={onExploreDsa}
            >
              <Terminal size={15} strokeWidth={2.5} />
              <span>DSA SPEC SHEET</span>
            </button>
          </div>

          {/* Technical Spec Matrix Bar */}
          <div className="hero-spec-strip">
            <div className="spec-cell">
              <span className="spec-val">40+</span>
              <span className="spec-key">VERIFIED DROPS</span>
            </div>
            <div className="spec-cell">
              <span className="spec-val">O(1)</span>
              <span className="spec-key">HASH LOOKUP</span>
            </div>
            <div className="spec-cell">
              <span className="spec-val">280</span>
              <span className="spec-key">GSM COMBED COTTON</span>
            </div>
            <div className="spec-cell">
              <span className="spec-val">24H</span>
              <span className="spec-key">SPEED POST DISPATCH</span>
            </div>
          </div>
        </div>

        {/* Right Column: Colliding Blueprint / Featured Drop Spec Box */}
        <div className="hero-graphic-block">
          <div className="featured-spec-box">
            <div className="spec-box-header">
              <span className="box-title">[FEATURED DROP // ARCHIVE REF #{sampleFeatured.id}]</span>
              <span className="box-kanji">特級呪物</span>
            </div>

            <div className="spec-box-artwork">
              <ProductArtwork product={sampleFeatured} size="large" />
            </div>

            <div className="spec-box-body">
              <div className="spec-box-meta">
                <span className="spec-brand">{sampleFeatured.brand?.toUpperCase()}</span>
                <span className="spec-category">{sampleFeatured.category?.toUpperCase()}</span>
              </div>

              <h2 className="spec-item-title">{sampleFeatured.name}</h2>

              <div className="spec-box-actions">
                <div className="spec-price-tag">
                  <span className="currency">₹</span>
                  <span className="amount">{Number(sampleFeatured.price).toLocaleString('en-IN')}</span>
                </div>

                <button
                  type="button"
                  className="spec-add-btn"
                  onClick={() => onAddToCart(sampleFeatured.id, sampleFeatured.name)}
                  aria-label={`Claim drop ${sampleFeatured.name}`}
                >
                  <span>[+ ADD TO LOADOUT]</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
