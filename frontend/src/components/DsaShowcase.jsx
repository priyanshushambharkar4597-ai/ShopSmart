import React from 'react'
import { LogIn } from 'lucide-react'
import ProductCard from './ProductCard'

export default function DsaShowcase({
  userId,
  userName,
  recommendations = [],
  allProducts = [],
  onOpenProduct,
  onAddToCart,
  formatPrice,
  onOpenAuth
}) {
  // Fallback demo picks if user is logged in but recommendations empty
  const defaultRecs = allProducts.slice(0, 4)
  const displayRecs = (recommendations && recommendations.length > 0)
    ? recommendations.map(r => r.product || r)
    : defaultRecs

  return (
    <section id="dsa-recommendations" className="brutalist-dsa-section" aria-label="Algorithmic Recommendation Engine">
      <div className="dsa-section-header">
        <div className="dsa-title-group">
          <span className="section-index">[04/RECOMMENDATION MATRIX]</span>
          <h2 className="dsa-title-headline">ALGORITHMIC SPECIFICATION</h2>
        </div>
        <div className="dsa-engine-stamp">
          <span>ENGINE: C11 / NATIVE GCC // COMPILED RELEASE</span>
        </div>
      </div>

      {/* Compact 4-Row Numbered Data Structure Blueprint (Requested by prompt) */}
      <div className="dsa-four-row-spec-grid">
        <div className="dsa-spec-row">
          <span className="row-num">[01]</span>
          <span className="row-name">BST (BINARY SEARCH TREE)</span>
          <span className="row-desc">Lexicographical product catalog indexing for O(log n) instant search.</span>
        </div>
        <div className="dsa-spec-row">
          <span className="row-num">[02]</span>
          <span className="row-name">CHAINED HASH TABLE</span>
          <span className="row-desc">O(1) constant-time direct dereference for instant cart resolution.</span>
        </div>
        <div className="dsa-spec-row">
          <span className="row-num">[03]</span>
          <span className="row-name">INTERACTION LINKED LIST</span>
          <span className="row-desc">Chronological user behavior tracking (Views, Wishlists, Add-to-cart).</span>
        </div>
        <div className="dsa-spec-row">
          <span className="row-num">[04]</span>
          <span className="row-name">MAX HEAP PRIORITY QUEUE</span>
          <span className="row-desc">Multi-objective candidate scoring (Content + User + Popularity + Rating).</span>
        </div>
      </div>

      {/* Logged In vs Logged Out State */}
      {userId ? (
        <div className="dsa-authenticated-container">
          <div className="dsa-user-active-bar">
            <div className="user-status-text">
              <span className="live-pill">[LIVE SQLITE STREAM]</span>
              <strong>ACTIVE USER #{userId}: {userName?.toUpperCase() || 'OPERATOR'}</strong>
              <span className="stream-detail">// PRIORITY QUEUE EXTRACTED TOP RECOMMENDATIONS:</span>
            </div>
          </div>

          <div className="dsa-recommendations-grid">
            {displayRecs.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpen={onOpenProduct}
                onAddToCart={onAddToCart}
                formatPrice={formatPrice}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="dsa-unauthenticated-box">
          <div className="unauth-header-strip">
            <span>[RECOMMENDATION ENGINE OFFLINE]</span>
            <span>STATUS: AWAITING USER AUTHENTICATION</span>
          </div>
          <div className="unauth-body">
            <h3 className="unauth-title">USER PROFILE VECTOR NOT DETECTED</h3>
            <p className="unauth-desc">
              ShopSmart's Max-Heap engine requires an authenticated user identity to compute weighted preference scores against your interaction history. Sign in with a demo profile or register to view your tailored drops.
            </p>
            <div className="unauth-btn-row">
              <button
                type="button"
                className="brutalist-primary-btn"
                onClick={onOpenAuth}
              >
                <LogIn size={15} strokeWidth={2.5} />
                <span>SIGN IN / INITIALIZE VECTOR</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
