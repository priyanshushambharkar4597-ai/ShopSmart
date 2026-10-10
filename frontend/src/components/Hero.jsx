import React from 'react'
import { Sparkles, Flame, ArrowRight, Zap, Terminal } from 'lucide-react'
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
    <section className="hero-section" aria-label="Hero Showcase">
      <div className="hero-grid">
        {/* Left Hero Content */}
        <div className="hero-text-content">
          <div className="hero-eyebrow-chip">
            <span className="pulse-dot" />
            <Sparkles size={13} className="sparkle-icon" />
            <span>SEASON 04 DROPS // ARCHIVE UNLOCKED</span>
          </div>

          <h1 className="hero-main-heading">
            LEVEL UP YOUR <span className="text-gradient-purple">AESTHETIC.</span>
            <br />
            WEAR THE <span className="text-gradient-pink">LEGEND.</span>
          </h1>

          <p className="hero-supporting-text">
            Engineered with algorithmic precision. Shop authentic, anime-inspired heavyweight streetwear, handcrafted cursed jewellery, and mythic scale collectibles straight from the multiverse.
          </p>

          <div className="hero-cta-group">
            <button
              type="button"
              className="hero-primary-btn"
              onClick={onExploreDrops}
            >
              <span>SHOP THE DROPS</span>
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              className="hero-secondary-btn"
              onClick={onExploreDsa}
            >
              <Terminal size={15} />
              <span>EXPLORE DSA ENGINE</span>
            </button>
          </div>

          {/* Social Proof / Engineering Metrics */}
          <div className="hero-trust-metrics">
            <div className="metric-item">
              <span className="metric-number">40+</span>
              <span className="metric-caption">Original Merch</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-number">O(1)</span>
              <span className="metric-caption">Hash Retrieval</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-number">4.8★</span>
              <span className="metric-caption">Average Rating</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-number">100%</span>
              <span className="metric-caption">Authentic Anime Gear</span>
            </div>
          </div>
        </div>

        {/* Right Hero Visual Showcase Card */}
        <div className="hero-visual-container">
          <div className="hero-hologram-card">
            {/* Holographic Glowing Header */}
            <div className="holo-card-top">
              <span className="holo-grade-badge">
                <Flame size={12} />
                <span>FEATURED DROP OF THE WEEK</span>
              </span>
              <span className="holo-kanji-stamp">特級呪物</span>
            </div>

            {/* Visual Artwork Box */}
            <div className="holo-artwork-box">
              <ProductArtwork product={sampleFeatured} size="large" />
            </div>

            {/* Product Meta */}
            <div className="holo-card-body">
              <div className="holo-card-meta">
                <span className="holo-brand">{sampleFeatured.brand}</span>
                <span className="holo-tag">280 GSM HEAVYWEIGHT</span>
              </div>

              <h2 className="holo-title">{sampleFeatured.name}</h2>

              <div className="holo-details-row">
                <div className="holo-price-box">
                  <span className="holo-currency">₹</span>
                  <span className="holo-price">
                    {Number(sampleFeatured.price).toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  type="button"
                  className="holo-quick-add-btn"
                  onClick={() => onAddToCart(sampleFeatured.id, sampleFeatured.name)}
                  aria-label={`Quick add ${sampleFeatured.name} to cart`}
                >
                  <Zap size={14} />
                  <span>CLAIM DROP</span>
                </button>
              </div>
            </div>

            {/* Corner Cyber Decors */}
            <div className="cyber-bracket top-left" />
            <div className="cyber-bracket bottom-right" />
          </div>
        </div>
      </div>
    </section>
  )
}
