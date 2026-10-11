import React, { useState, useEffect, useRef } from 'react'
import { Search, ShoppingCart, User, LogOut, ChevronDown, Menu, X, ArrowRight } from 'lucide-react'

export default function Navbar({
  searchTerm,
  setSearchTerm,
  onSearch,
  searching,
  userId,
  userName,
  onOpenAuth,
  onLogout,
  cartCount,
  onOpenCart,
  onSelectCategory,
  activeCategory,
  onGoHome,
  onScrollToSection
}) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const searchInputRef = useRef(null)

  const categories = [
    { name: 'All Drops', id: 'all' },
    { name: 'Clothing (280 GSM)', id: 'Clothing' },
    { name: 'Accessories (Tactical)', id: 'Accessories' },
    { name: 'Jewellery (Sterling Silver)', id: 'Jewellery' },
    { name: 'Collectibles (Scale Figures)', id: 'Collectibles' },
    { name: 'Decor (Neo RGB Mats)', id: 'Decor' }
  ]

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    function handleKeyDown(e) {
      if (
        e.key === '/' &&
        document.activeElement !== searchInputRef.current &&
        !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)
      ) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        setIsCategoryOpen(false)
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  function handleSearchSubmit(e) {
    e.preventDefault()
    onSearch()
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="brutalist-header-root">
      {/* 1. Thin Black Announcement Strip */}
      <div className="announcement-strip" role="region" aria-label="Store Announcement">
        <div className="announcement-inner">
          <span className="announcement-tag">[MANIFEST]</span>
          <span className="announcement-text">
            FREE SPEED POST DISPATCH ACROSS INDIA OVER ₹999 // VOUCHER CODE: <strong>SHINOBI20</strong> FOR 20% OFF // DISPATCH IN 24H
          </span>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <nav className="brutalist-nav" aria-label="Main Navigation">
        <div className="nav-container">
          {/* Brand Wordmark */}
          <div className="nav-brand-cell">
            <button
              type="button"
              className="brand-logo-btn"
              onClick={onGoHome}
              aria-label="ShopSmart Home"
            >
              <span className="brand-logo-text">SHOPSMART</span>
              <span className="brand-sub-badge">[RAW/V2]</span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="nav-links-cell">
            {/* Category Dropdown */}
            <div className="nav-dropdown-wrapper">
              <button
                type="button"
                className={`nav-link-btn ${activeCategory !== 'all' ? 'active' : ''}`}
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                aria-expanded={isCategoryOpen}
                aria-haspopup="true"
              >
                <span>01 / CATEGORIES</span>
                <ChevronDown size={14} strokeWidth={2.5} />
              </button>

              {isCategoryOpen && (
                <div className="dropdown-menu" role="menu">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      role="menuitem"
                      className={`dropdown-item ${activeCategory === cat.id ? 'active' : ''}`}
                      onClick={() => {
                        onSelectCategory(cat.id)
                        setIsCategoryOpen(false)
                      }}
                    >
                      <span>{cat.name}</span>
                      {activeCategory === cat.id && <span className="item-tick">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className="nav-link-btn"
              onClick={() => onScrollToSection('new-arrivals')}
            >
              02 / NEW ARRIVALS
            </button>

            <button
              type="button"
              className="nav-link-btn"
              onClick={() => onScrollToSection('best-sellers')}
            >
              03 / BEST SELLERS
            </button>

            <button
              type="button"
              className="nav-link-btn"
              onClick={() => onScrollToSection('dsa-recommendations')}
            >
              04 / DSA SPEC
            </button>
          </div>

          {/* Search Cell */}
          <form className="nav-search-cell" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="SEARCH CATALOGUE... [/]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="brutalist-search-input"
                aria-label="Search anime catalogue"
              />
              <button
                type="submit"
                className="search-submit-btn"
                disabled={searching}
                aria-label="Execute search"
              >
                <Search size={14} strokeWidth={2.5} />
                <span>FIND</span>
              </button>
            </div>
          </form>

          {/* User Account / Auth Cell */}
          <div className="nav-action-cell">
            {userId ? (
              <div className="user-logged-box">
                <span className="user-id-badge">ID: #{userId}</span>
                <span className="user-name-text">{userName || 'OPERATOR'}</span>
                <button
                  type="button"
                  className="logout-icon-btn"
                  onClick={onLogout}
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut size={14} strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="auth-trigger-btn"
                onClick={onOpenAuth}
                aria-label="Account Login or Signup"
              >
                <User size={14} strokeWidth={2.5} />
                <span>LOGIN</span>
              </button>
            )}

            {/* Cart Trigger with Square Bordered Number */}
            <button
              type="button"
              className="cart-trigger-btn"
              onClick={onOpenCart}
              aria-label={`Open Cart with ${cartCount} items`}
            >
              <ShoppingCart size={15} strokeWidth={2.5} />
              <span>CART</span>
              <span className="cart-counter-box">[{cartCount}]</span>
            </button>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              type="button"
              className="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={18} strokeWidth={2.5} /> : <Menu size={18} strokeWidth={2.5} />}
            </button>
          </div>
        </div>

        {/* 3. Mobile Full-Width Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="mobile-drawer" role="dialog" aria-label="Mobile Navigation">
            <div className="mobile-search-row">
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', width: '100%' }}>
                <input
                  type="text"
                  placeholder="SEARCH CATALOGUE..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="brutalist-search-input"
                  style={{ flex: 1, borderRight: 'none' }}
                />
                <button type="submit" className="search-submit-btn">
                  <Search size={14} />
                </button>
              </form>
            </div>

            <div className="mobile-links-stack">
              <div className="mobile-section-label">[NAVIGATION]</div>
              <button
                type="button"
                className="mobile-stack-btn"
                onClick={() => {
                  onSelectCategory('all')
                  setIsMobileMenuOpen(false)
                }}
              >
                <span>01 / ALL DROPS</span>
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                className="mobile-stack-btn"
                onClick={() => {
                  onScrollToSection('new-arrivals')
                  setIsMobileMenuOpen(false)
                }}
              >
                <span>02 / NEW ARRIVALS</span>
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                className="mobile-stack-btn"
                onClick={() => {
                  onScrollToSection('best-sellers')
                  setIsMobileMenuOpen(false)
                }}
              >
                <span>03 / BEST SELLERS</span>
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                className="mobile-stack-btn"
                onClick={() => {
                  onScrollToSection('dsa-recommendations')
                  setIsMobileMenuOpen(false)
                }}
              >
                <span>04 / DSA RECOMMENDATIONS</span>
                <ArrowRight size={14} />
              </button>

              <div className="mobile-section-label" style={{ marginTop: '12px' }}>[CATEGORIES]</div>
              {categories.filter(c => c.id !== 'all').map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`mobile-stack-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => {
                    onSelectCategory(cat.id)
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <span>{cat.name}</span>
                  <span className="cat-arrow">→</span>
                </button>
              ))}

              <div className="mobile-auth-row">
                {userId ? (
                  <button
                    type="button"
                    className="mobile-stack-btn"
                    onClick={() => {
                      onLogout()
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <span>LOGOUT USER #{userId}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="mobile-stack-btn active"
                    onClick={() => {
                      onOpenAuth()
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <span>SIGN IN / REGISTER</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
