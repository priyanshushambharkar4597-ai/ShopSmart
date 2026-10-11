import React, { useState, useEffect, useMemo } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CategoryRow from './components/CategoryRow'
import ProductCard from './components/ProductCard'
import PromoBanner from './components/PromoBanner'
import DsaShowcase from './components/DsaShowcase'
import TrustIndicators from './components/TrustIndicators'
import ProductDetailsModal from './components/ProductDetailsModal'
import CartDrawer from './components/CartDrawer'
import AuthModal from './components/AuthModal'
import Footer from './components/Footer'
import defaultProducts from './data/products.json'
import './App.css'

const API_URL = ''

export default function App() {
  // Products and Search State
  const [allProducts, setAllProducts] = useState([])
  const [searchResults, setSearchResults] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searching, setSearching] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(true)

  // Filters & Tabs
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('all') // 'all', 'bestsellers', 'newarrivals'
  const [sortBy, setSortBy] = useState('popularity-desc')

  // Selected Product for Details Modal
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Shopping Cart State
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [loadingCart, setLoadingCart] = useState(false)

  // Authentication State
  const [userId, setUserId] = useState(null)
  const [userName, setUserName] = useState('')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authInitialMode, setAuthInitialMode] = useState('login')

  // Recommendations State
  const [recommendations, setRecommendations] = useState([])

  // Toast Notification State
  const [toast, setToast] = useState(null)

  function showToast(message, type = 'info') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  function formatPrice(price) {
    return Number(price || 0).toLocaleString('en-IN', {
      maximumFractionDigits: 2
    })
  }

  // Initial Load: Fetch All Products
  useEffect(() => {
    async function loadInitialProducts() {
      setLoadingProducts(true)
      try {
        const response = await fetch(`${API_URL}/api/products`)
        if (response.ok) {
          const data = await response.json()
          if (Array.isArray(data) && data.length > 0) {
            setAllProducts(data)
            return
          }
        }
      } catch (err) {
        console.warn('API unavailable; loading bundled catalogue:', err)
      } finally {
        setLoadingProducts(false)
      }
      setAllProducts(defaultProducts)
    }
    loadInitialProducts()
  }, [])

  // Sync Cart whenever user changes
  useEffect(() => {
    if (userId) {
      loadCart(userId)
      loadRecommendations(userId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  // Load User Cart from SQLite / LocalStorage fallback
  async function loadCart(uid = userId) {
    if (!uid) return
    setLoadingCart(true)
    try {
      const response = await fetch(`${API_URL}/api/cart/${uid}`)
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          setCart(data)
          return
        }
      }
    } catch {
      // Fallback below
    } finally {
      setLoadingCart(false)
    }

    try {
      const saved = localStorage.getItem(`shopsmart_cart_${uid}`)
      if (saved) {
        setCart(JSON.parse(saved))
        return
      }
    } catch (e) {
      console.warn(e)
    }
    setCart([])
  }

  // Load Recommendations (Backend MaxHeap with client-side fallback)
  async function loadRecommendations(uid = userId) {
    if (!uid) return
    try {
      const response = await fetch(`${API_URL}/api/recommendations/${uid}`)
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data) && data.length > 0) {
          setRecommendations(data)
          return
        }
      }
    } catch {
      // Fallback below
    }

    const targetProducts = allProducts.length > 0 ? allProducts : defaultProducts
    let recs = []
    if (uid === 1) {
      const priyaIds = [105, 103, 106, 117, 136]
      recs = priyaIds.map((id, idx) => ({
        product: targetProducts.find((p) => p.id === id) || targetProducts[idx],
        score: Number((0.75 - idx * 0.11).toFixed(2))
      })).filter((item) => item.product)
    } else if (uid === 2) {
      const rahulIds = [107, 117, 137, 136, 139]
      recs = rahulIds.map((id, idx) => ({
        product: targetProducts.find((p) => p.id === id) || targetProducts[idx],
        score: Number((0.65 - idx * 0.09).toFixed(2))
      })).filter((item) => item.product)
    } else {
      const sorted = [...targetProducts].sort((a, b) => Number(b.popularity || 0) - Number(a.popularity || 0))
      recs = sorted.slice(0, 5).map((p, idx) => ({
        product: p,
        score: Number((0.85 - idx * 0.08).toFixed(2))
      }))
    }
    setRecommendations(recs)
  }

  // Search API Call with BST client fallback
  async function handleSearch() {
    if (!searchTerm.trim()) {
      setSearchResults(null)
      return
    }

    setSearching(true)
    const term = searchTerm.trim().toLowerCase()
    try {
      const response = await fetch(
        `${API_URL}/api/products/search?q=${encodeURIComponent(term)}`
      )
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          setSearchResults(data)
          setActiveCategory('all')
          document.getElementById('products-grid-section')?.scrollIntoView({ behavior: 'smooth' })
          if (data.length === 0) {
            showToast(`NO CATALOGUE ENTRIES MATCH "${searchTerm}".`, 'info')
          } else {
            showToast(`IDENTIFIED ${data.length} SPEC ENTRIES MATCHING "${searchTerm}".`, 'success')
          }
          return
        }
      }
    } catch {
      // Fallback
    } finally {
      setSearching(false)
    }

    const pool = allProducts.length > 0 ? allProducts : defaultProducts
    const localMatches = pool.filter((p) => {
      const nameMatch = (p.name || '').toLowerCase().includes(term)
      const tagsMatch = (p.tags || '').toLowerCase().includes(term)
      const catMatch = (p.category || '').toLowerCase().includes(term)
      const brandMatch = (p.brand || '').toLowerCase().includes(term)
      return nameMatch || tagsMatch || catMatch || brandMatch
    })
    setSearchResults(localMatches)
    setActiveCategory('all')
    document.getElementById('products-grid-section')?.scrollIntoView({ behavior: 'smooth' })
    if (localMatches.length === 0) {
      showToast(`NO CATALOGUE ENTRIES MATCH "${searchTerm}".`, 'info')
    } else {
      showToast(`IDENTIFIED ${localMatches.length} SPEC ENTRIES MATCHING "${searchTerm}".`, 'success')
    }
  }

  // Add To Cart
  async function handleAddToCart(productId, productName, quantity = 1) {
    if (!userId) {
      setAuthInitialMode('login')
      setIsAuthModalOpen(true)
      showToast('USER IDENTITY REQUIRED TO ACCESS SQLITE CART.', 'info')
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/api/cart?userId=${userId}&productId=${productId}&quantity=${quantity}`,
        { method: 'POST' }
      )
      if (response.ok) {
        await loadCart(userId)
        showToast(`[COMMITTED] ${productName} ADDED TO LOADOUT`, 'success')
        return
      }
    } catch {
      // Fallback to localStorage
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product_id === productId || item.id === productId)
      let updated = []
      if (existing) {
        updated = prev.map((item) =>
          item.product_id === productId || item.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        const pool = allProducts.length > 0 ? allProducts : defaultProducts
        const prod = pool.find((p) => p.id === productId) || {}
        updated = [
          ...prev,
          {
            product_id: productId,
            id: productId,
            name: productName || prod.name,
            price: prod.price || 999,
            category: prod.category || 'Merch',
            quantity: quantity
          }
        ]
      }
      try {
        localStorage.setItem(`shopsmart_cart_${userId}`, JSON.stringify(updated))
      } catch (e) {
        console.warn(e)
      }
      return updated
    })
    showToast(`[COMMITTED] ${productName} ADDED TO LOADOUT`, 'success')
  }

  // Remove From Cart
  async function handleRemoveFromCart(productId, productName) {
    if (!userId) return
    try {
      const response = await fetch(
        `${API_URL}/api/cart/${userId}/${productId}`,
        { method: 'DELETE' }
      )
      if (response.ok) {
        await loadCart(userId)
        showToast(`[DELETED] ${productName} EXPUNGED FROM MANIFEST`, 'info')
        return
      }
    } catch {
      // Fallback
    }

    setCart((prev) => {
      const updated = prev.filter(
        (item) => item.product_id !== productId && item.id !== productId
      )
      try {
        localStorage.setItem(`shopsmart_cart_${userId}`, JSON.stringify(updated))
      } catch (e) {
        console.warn(e)
      }
      return updated
    })
    showToast(`[DELETED] ${productName} EXPUNGED FROM MANIFEST`, 'info')
  }

  // Open Product Details Modal
  async function handleOpenProduct(productId) {
    try {
      const response = await fetch(`${API_URL}/api/products/${productId}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedProduct(data)
      } else {
        const found = allProducts.find((p) => p.id === productId)
        if (found) setSelectedProduct(found)
      }
    } catch {
      const found = allProducts.find((p) => p.id === productId)
      if (found) setSelectedProduct(found)
    }
  }

  // Auth Callbacks
  function handleAuthSuccess({ userId: newUid, name: newName }) {
    setUserId(newUid)
    setUserName(newName)
    showToast(`OPERATOR SESSION INITIALIZED // USER #${newUid} (${newName.toUpperCase()})`, 'success')
  }

  function handleLogout() {
    setUserId(null)
    setUserName('')
    setCart([])
    setRecommendations([])
    showToast('SESSION TERMINATED. USER DISENGAGED.', 'info')
  }

  function handleGoHome() {
    setSearchResults(null)
    setSearchTerm('')
    setActiveCategory('all')
    setActiveTab('all')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function scrollToSection(sectionId) {
    if (sectionId === 'new-arrivals') {
      setActiveTab('newarrivals')
      setActiveCategory('all')
      setSearchResults(null)
      document.getElementById('products-grid-section')?.scrollIntoView({ behavior: 'smooth' })
    } else if (sectionId === 'best-sellers') {
      setActiveTab('bestsellers')
      setActiveCategory('all')
      setSearchResults(null)
      document.getElementById('products-grid-section')?.scrollIntoView({ behavior: 'smooth' })
    } else if (sectionId === 'dsa-recommendations') {
      document.getElementById('dsa-recommendations')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Filtered and Sorted Products computation
  const displayedProducts = useMemo(() => {
    let list = searchResults !== null ? [...searchResults] : [...allProducts]

    // Category Filter
    if (activeCategory && activeCategory !== 'all') {
      list = list.filter(
        (p) => (p.category || '').toLowerCase() === activeCategory.toLowerCase()
      )
    }

    // Tab Filter
    if (activeTab === 'bestsellers') {
      list = list.filter((p) => Number(p.popularity || 0) >= 85 || Number(p.rating || 0) >= 4.7)
    } else if (activeTab === 'newarrivals') {
      list = list.filter((p) => Number(p.id || 0) >= 116)
    }

    // Sort order
    list.sort((a, b) => {
      if (sortBy === 'popularity-desc') {
        return Number(b.popularity || 0) - Number(a.popularity || 0)
      } else if (sortBy === 'rating-desc') {
        return Number(b.rating || 0) - Number(a.rating || 0)
      } else if (sortBy === 'price-asc') {
        return Number(a.price || 0) - Number(b.price || 0)
      } else if (sortBy === 'price-desc') {
        return Number(b.price || 0) - Number(a.price || 0)
      }
      return 0
    })

    return list
  }, [allProducts, searchResults, activeCategory, activeTab, sortBy])

  const totalCartItems = cart.reduce(
    (count, item) => count + Number(item.quantity || 1),
    0
  )

  const featuredProduct = allProducts.find((p) => p.id === 116) || allProducts[0]

  return (
    <div className="shopsmart-app brutalist-root">
      {/* Toast Notification Box */}
      {toast && (
        <aside className={`brutalist-toast ${toast.type}`} role="status" aria-live="polite">
          <span className="toast-tag">[{toast.type.toUpperCase()}]</span>
          <span className="toast-text">{toast.message}</span>
        </aside>
      )}

      {/* 1. Header & Navigation */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
        searching={searching}
        userId={userId}
        userName={userName}
        onOpenAuth={() => {
          setAuthInitialMode('login')
          setIsAuthModalOpen(true)
        }}
        onLogout={handleLogout}
        cartCount={totalCartItems}
        onOpenCart={() => {
          if (!userId) {
            setAuthInitialMode('login')
            setIsAuthModalOpen(true)
            showToast('SIGN IN TO INSPECT SQLITE LOADOUT CART.', 'info')
          } else {
            setIsCartOpen(true)
          }
        }}
        onSelectCategory={(catId) => {
          setActiveCategory(catId)
          setSearchResults(null)
          document.getElementById('products-grid-section')?.scrollIntoView({ behavior: 'smooth' })
        }}
        activeCategory={activeCategory}
        onGoHome={handleGoHome}
        onScrollToSection={scrollToSection}
      />

      {/* Main Content Sections */}
      <main>
        {/* 2. Hero Section */}
        <Hero
          onExploreDrops={() => {
            document.getElementById('products-grid-section')?.scrollIntoView({ behavior: 'smooth' })
          }}
          onExploreDsa={() => {
            document.getElementById('dsa-recommendations')?.scrollIntoView({ behavior: 'smooth' })
          }}
          featuredProduct={featuredProduct}
          onAddToCart={handleAddToCart}
        />

        {/* 3. Category Discovery Row */}
        <CategoryRow
          activeCategory={activeCategory}
          onSelectCategory={(catId) => {
            setActiveCategory(catId)
            setSearchResults(null)
            document.getElementById('products-grid-section')?.scrollIntoView({ behavior: 'smooth' })
          }}
          products={allProducts}
        />

        {/* 4. Catalogue Grid Section */}
        <section
          id="products-grid-section"
          className="brutalist-catalogue-section"
          aria-label="Catalogue Grid"
        >
          <div className="catalogue-header-bar">
            <div className="cat-header-info">
              <span className="section-index">[03/CATALOGUE ARCHIVE]</span>
              <h2 className="catalogue-title">
                {searchResults !== null ? (
                  `SEARCH SPEC: "${searchTerm.toUpperCase()}"`
                ) : activeCategory !== 'all' ? (
                  `SECTOR: ${activeCategory.toUpperCase()}`
                ) : activeTab === 'bestsellers' ? (
                  'SECTOR: BEST SELLERS & HIGH AFFINITY'
                ) : activeTab === 'newarrivals' ? (
                  'SECTOR: SEASON 04 NEW ARRIVALS'
                ) : (
                  'ALL RELEASES // FULL SPEC SHEET'
                )}
              </h2>
            </div>

            {/* Filter Tabs & Sort Controls */}
            <div className="catalogue-controls-bar">
              <div className="catalogue-tab-group">
                <button
                  type="button"
                  className={`tab-block-btn ${activeTab === 'all' && searchResults === null ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('all')
                    setSearchResults(null)
                  }}
                >
                  [01] ALL DROPS ({allProducts.length})
                </button>
                <button
                  type="button"
                  className={`tab-block-btn ${activeTab === 'bestsellers' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('bestsellers')
                    setSearchResults(null)
                  }}
                >
                  [02] BEST SELLERS
                </button>
                <button
                  type="button"
                  className={`tab-block-btn ${activeTab === 'newarrivals' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('newarrivals')
                    setSearchResults(null)
                  }}
                >
                  [03] NEW ARRIVALS
                </button>
              </div>

              {/* Sort Selector */}
              <div className="catalogue-sort-box">
                <label htmlFor="sort-select">SORT:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="brutalist-select"
                >
                  <option value="popularity-desc">POPULARITY: MAX FIRST</option>
                  <option value="rating-desc">RATING: MAX FIRST</option>
                  <option value="price-asc">PRICE: ASCENDING</option>
                  <option value="price-desc">PRICE: DESCENDING</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Strip */}
          {(searchResults !== null || activeCategory !== 'all' || activeTab !== 'all') && (
            <div className="active-filter-strip">
              <span className="filter-label">[ACTIVE FILTERS]:</span>
              {activeCategory !== 'all' && (
                <span className="filter-tag">
                  SECTOR: {activeCategory.toUpperCase()}
                  <button type="button" onClick={() => setActiveCategory('all')}>[×]</button>
                </span>
              )}
              {searchResults !== null && (
                <span className="filter-tag">
                  QUERY: "{searchTerm.toUpperCase()}"
                  <button type="button" onClick={() => setSearchResults(null)}>[×]</button>
                </span>
              )}
              {activeTab !== 'all' && (
                <span className="filter-tag">
                  TAB: {activeTab.toUpperCase()}
                  <button type="button" onClick={() => setActiveTab('all')}>[×]</button>
                </span>
              )}
              <button
                type="button"
                className="reset-filters-btn"
                onClick={handleGoHome}
              >
                [RESET ALL]
              </button>
            </div>
          )}

          {/* Products Grid / States */}
          {loadingProducts ? (
            <div className="catalogue-loading-state">
              <span className="loading-badge">[I/O BUSY]</span>
              <p>LOADING SPECIFICATION MATRIX FROM SQLITE DATABASE...</p>
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="catalogue-empty-state">
              <span className="empty-badge">[NULL RESULT]</span>
              <h3>NO DROPS MATCH THE SPECIFIED QUERY CRITERIA</h3>
              <p>Re-evaluate keyword string or reset category filter.</p>
              <button
                type="button"
                className="brutalist-primary-btn"
                onClick={handleGoHome}
              >
                <span>SHOW COMPLETE ARCHIVE</span>
              </button>
            </div>
          ) : (
            <div className="catalogue-spreadsheet-grid">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpen={handleOpenProduct}
                  onAddToCart={handleAddToCart}
                  formatPrice={formatPrice}
                />
              ))}
            </div>
          )}
        </section>

        {/* 5. Promotional Campaign Poster */}
        <PromoBanner
          onExploreSale={() => {
            setActiveTab('bestsellers')
            document.getElementById('products-grid-section')?.scrollIntoView({ behavior: 'smooth' })
            showToast('CODE SHINOBI20 COMMITTED TO SESSION.', 'success')
          }}
        />

        {/* 6. Smart DSA Recommendations Showcase */}
        <DsaShowcase
          userId={userId}
          userName={userName}
          recommendations={recommendations}
          allProducts={allProducts}
          onOpenProduct={handleOpenProduct}
          onAddToCart={handleAddToCart}
          formatPrice={formatPrice}
          onOpenAuth={() => {
            setAuthInitialMode('login')
            setIsAuthModalOpen(true)
          }}
        />

        {/* 7. System Infrastructure Guarantees */}
        <TrustIndicators />
      </main>

      {/* 8. Spec Sheet Footer */}
      <Footer
        onSelectCategory={(catId) => {
          setActiveCategory(catId)
          setSearchResults(null)
          document.getElementById('products-grid-section')?.scrollIntoView({ behavior: 'smooth' })
        }}
      />

      {/* Modals & Overlays */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          formatPrice={formatPrice}
          allProducts={allProducts}
          onOpenProduct={handleOpenProduct}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        loadingCart={loadingCart}
        onRemoveFromCart={handleRemoveFromCart}
        formatPrice={formatPrice}
        onGoHome={handleGoHome}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authInitialMode}
        onAuthSuccess={handleAuthSuccess}
        apiUrl={API_URL}
      />
    </div>
  )
}
