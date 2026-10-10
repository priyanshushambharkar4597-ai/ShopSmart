import React, { useState, useEffect, useRef } from 'react'
import {
  Search,
  ShoppingCart,
  User,
  LogOut,
  Zap,
  Flame,
  Cpu,
  Layers,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  X
} from 'lucide-react'

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
  const [copiedCode, setCopiedCode] = useState(false)
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)
  const [announcementIndex, setAnnouncementIndex] = useState(0)
  const searchInputRef = useRef(null)

  const announcements = [
    { text: '⚡ FREE AIR-EXPRESS SHIPPING ON ORDERS OVER ₹999 | CODE: SHINOBI20 (20% OFF)', code: 'SHINOBI20' },
    { text: '🔥 DROP ALERT: 25+ NEW ORIGINAL ANIME GRAPHIC HOODIES & SWORD REPLICAS LIVE NOW', code: 'SHINOBI20' },
    { text: '🧠 DSA SHOWCASE: REAL-TIME MAX-HEAP RECOMMENDATIONS POWERED BY C BACKEND', code: 'SHINOBI20' }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [announcements.length])

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === '/' && document.activeElement !== searchInputRef.current && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  function handleCopyPromo(e) {
    e.stopPropagation()
    navigator.clipboard?.writeText('SHINOBI20')
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const categories = [
    { name: 'All Gear', id: 'all' },
    { name: 'Clothing', id: 'Clothing', badge: 'HOT' },
    { name: 'Accessories', id: 'Accessories' },
    { name: 'Jewellery', id: 'Jewellery' },
    { name: 'Collectibles', id: 'Collectibles', badge: 'MYTHIC' },
    { name: 'Decor', id: 'Decor' }
  ]

  return (
    <header className="site-header">
      {/* 1. Thin High-Energy Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-content">
          <span className="announcement-pill">FLASH DEAL</span>
          <p className="announcement-text">{announcements[announcementIndex].text}</p>
          <button
            type="button"
            className="copy-code-chip"
            onClick={handleCopyPromo}
            title="Click to copy coupon code"
            aria-label="Copy code SHINOBI20"
          >
            {copiedCode ? (
              <>
                <Check size={12} />
                <span>COPIED!</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>CODE: SHINOBI20</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Main Sticky Navigation Bar */}
      <nav className="main-navbar" aria-label="Main Navigation">
        <div className="navbar-container">
          {/* Brand Logo with Anime Cyber Badge */}
          <div
            className="navbar-brand"
            onClick={onGoHome}
            role="button"
            tabIndex={0}
            aria-label="ShopSmart Home"
            onKeyDown={(e) => {
              if (e.key === 'Enter') onGoHome()
            }}
          >
            <div className="brand-logo-icon">
              <Zap size={22} className="bolt-icon" />
            </div>
            <div className="brand-text-group">
              <span className="brand-title">
                SHOPSMART<span className="brand-dot">.</span>
              </span>
              <span className="brand-subtitle">スマート // OTAKU GEAR</span>
            </div>
          </div>

          {/* Quick Nav Links (Desktop) */}
          <div className="nav-links-desktop">
            {/* Categories Dropdown */}
            <div
              className="dropdown-wrapper"
              onMouseEnter={() => setIsCategoryMenuOpen(true)}
              onMouseLeave={() => setIsCategoryMenuOpen(false)}
            >
              <button
                type="button"
                className={`nav-link-item ${activeCategory && activeCategory !== 'all' ? 'active' : ''}`}
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                aria-expanded={isCategoryMenuOpen}
              >
                <Layers size={14} />
                <span>Categories</span>
                <ChevronDown size={12} className={`chevron ${isCategoryMenuOpen ? 'open' : ''}`} />
              </button>

              {isCategoryMenuOpen && (
                <div className="category-dropdown-menu">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`dropdown-item ${activeCategory === cat.id ? 'selected' : ''}`}
                      onClick={() => {
                        onSelectCategory(cat.id)
                        setIsCategoryMenuOpen(false)
                      }}
                    >
                      <span>{cat.name}</span>
                      {cat.badge && <span className="cat-mini-badge">{cat.badge}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className="nav-link-item"
              onClick={() => onScrollToSection('new-arrivals')}
            >
              <Sparkles size={14} className="accent-lime" />
              <span>New Arrivals</span>
            </button>

            <button
              type="button"
              className="nav-link-item"
              onClick={() => onScrollToSection('best-sellers')}
            >
              <Flame size={14} className="accent-pink" />
              <span>Best Sellers</span>
            </button>

            <button
              type="button"
              className="nav-link-item"
              onClick={() => onScrollToSection('dsa-recommendations')}
            >
              <Cpu size={14} className="accent-purple" />
              <span>Smart DSA</span>
            </button>
          </div>

          {/* Search Box with Realtime / Trigger Support */}
          <div className="navbar-search-wrapper">
            <form
              className="search-form"
              onSubmit={(e) => {
                e.preventDefault()
                onSearch()
              }}
            >
              <Search size={16} className="search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search anime drops, hoodies, katanas... (/ to focus)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search product catalogue"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="submit"
                className="search-submit-btn"
                disabled={searching}
                aria-label="Submit search"
              >
                {searching ? '...' : 'FIND'}
              </button>
            </form>
          </div>

          {/* User Account & Cart Controls */}
          <div className="navbar-actions">
            {userId ? (
              <div className="user-profile-pill">
                <div className="avatar-circle">
                  <User size={14} />
                </div>
                <div className="user-info-text">
                  <span className="user-name">{userName || `User #${userId}`}</span>
                  <span className="user-id-sub">ID: #{userId}</span>
                </div>
                <button
                  type="button"
                  className="logout-icon-btn"
                  onClick={onLogout}
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="auth-cta-btn"
                onClick={onOpenAuth}
                aria-label="Sign in or create account"
              >
                <User size={15} />
                <span>SIGN IN</span>
              </button>
            )}

            {/* Cart Button with Animated Badge */}
            <button
              type="button"
              className="cart-trigger-btn"
              onClick={onOpenCart}
              aria-label={`View shopping cart with ${cartCount} items`}
            >
              <div className="cart-icon-container">
                <ShoppingCart size={18} />
                {cartCount > 0 && <span className="cart-dynamic-badge">{cartCount}</span>}
              </div>
              <span className="cart-text-desktop">CART</span>
            </button>
          </div>
        </div>

        {/* Mobile Category Quick Bar */}
        <div className="mobile-categories-strip">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`mobile-cat-pill ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>
    </header>
  )
}
