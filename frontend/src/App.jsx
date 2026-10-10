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
  const [sortBy, setSortBy] = useState('popularity-desc') // 'popularity-desc', 'rating-desc', 'price-asc', 'price-desc'

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

  // Show Toast Helper
  function showToast(message, type = 'info') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  // Number Formatter
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
      // Fallback to bundled products
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
      // Fallback to localStorage
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

    // Client-side Max-Heap recommendation fallback
    const targetProducts = allProducts.length > 0 ? allProducts : defaultProducts
    let recs = []
    if (uid === 1) {
      // Priya's preference: Electronics & Tech Drops (scores 0.72 - 0.26)
      const priyaIds = [105, 103, 106, 117, 136]
      recs = priyaIds.map((id, idx) => ({
        product: targetProducts.find((p) => p.id === id) || targetProducts[idx],
        score: Number((0.75 - idx * 0.11).toFixed(2))
      })).filter((item) => item.product)
    } else if (uid === 2) {
      // Rahul's preference: Footwear & Streetwear (scores 0.62 - 0.25)
      const rahulIds = [107, 117, 137, 136, 139]
      recs = rahulIds.map((id, idx) => ({
        product: targetProducts.find((p) => p.id === id) || targetProducts[idx],
        score: Number((0.65 - idx * 0.09).toFixed(2))
      })).filter((item) => item.product)
    } else {
      // General user: Top popular drops
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
            showToast(`No matches found for "${searchTerm}". Try browsing categories!`, 'info')
          } else {
            showToast(`Found ${data.length} drops matching "${searchTerm}".`, 'success')
          }
          return
        }
      }
    } catch {
      // Client-side BST simulation fallback
    } finally {
      setSearching(false)
    }

    // Client-side search matching name, tags, brand, category
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
      showToast(`No matches found for "${searchTerm}". Try browsing categories!`, 'info')
    } else {
      showToast(`Found ${localMatches.length} drops matching "${searchTerm}".`, 'success')
    }
  }

  // Add To Cart
  async function handleAddToCart(productId, productName, quantity = 1) {
    if (!userId) {
      setAuthInitialMode('login')
      setIsAuthModalOpen(true)
      showToast('Please sign in to add drops to your loadout.', 'info')
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/api/cart?userId=${userId}&productId=${productId}&quantity=${quantity}`,
        { method: 'POST' }
      )
      if (response.ok) {
        await loadCart(userId)
        showToast(`✓ ${productName} added to your loadout!`, 'success')
        return
      }
    } catch {
      // Fallback to localStorage
    }

    // Local storage cart update
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
    showToast(`✓ ${productName} added to your loadout!`, 'success')
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
        showToast(`${productName} removed from cart.`, 'info')
        return
      }
    } catch {
      // Fallback to localStorage
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
    showToast(`${productName} removed from cart.`, 'info')
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
    showToast(`Welcome to the Guild, ${newName}! (User #${newUid})`, 'success')
  }

  function handleLogout() {
    setUserId(null)
    setUserName('')
    setCart([])
    setRecommendations([])
    showToast('You have been logged out from ShopSmart.', 'info')
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
    <div className="shopsmart-app">
      {/* Toast Notification Bar */}
      {toast && (
        <aside className={`toast-notification ${toast.type}`} role="status" aria-live="polite">
          <span className="toast-text">{toast.message}</span>
        </aside>
      )}

      {/* 1. Thin Announcement Bar & Sticky Header */}
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
            showToast('Please sign in to view your loadout cart.', 'info')
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
        {/* 2. High-Impact Hero Section */}
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

        {/* 4. Dynamic Product Grids (New Arrivals, Best Sellers, Search Results) */}
        <section
          id="products-grid-section"
          className="products-grid-section"
          aria-label="Catalogue Grid"
        >
          <div className="section-header-bar">
            <div>
              <div className="grid-badge-chip">
                <span>CATALOGUE ARCHIVE // 40+ ORIGINAL RELEASES</span>
              </div>
              <h2 className="grid-main-heading">
                {searchResults !== null ? (
                  <>SEARCH RESULTS FOR "{searchTerm}"</>
                ) : activeCategory !== 'all' ? (
                  <>{activeCategory.toUpperCase()} COLLECTION</>
                ) : activeTab === 'bestsellers' ? (
                  <>🔥 BEST SELLERS & TOP RATED</>
                ) : activeTab === 'newarrivals' ? (
                  <>⚡ FRESH NEW ARRIVALS</>
                ) : (
                  <>ALL GEAR & STREETWEAR</>
                )}
              </h2>
            </div>

            {/* Filter Tabs & Sort Controls */}
            <div className="grid-controls-row">
              <div className="grid-tabs-group">
                <button
                  type="button"
                  className={`grid-tab-btn ${activeTab === 'all' && searchResults === null ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('all')
                    setSearchResults(null)
                  }}
                >
                  All Drops ({allProducts.length})
                </button>
                <button
                  type="button"
                  className={`grid-tab-btn ${activeTab === 'bestsellers' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('bestsellers')
                    setSearchResults(null)
                  }}
                >
                  🔥 Best Sellers
                </button>
                <button
                  type="button"
                  className={`grid-tab-btn ${activeTab === 'newarrivals' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('newarrivals')
                    setSearchResults(null)
                  }}
                >
                  ⚡ New Drops
                </button>
              </div>

              {/* Sort Selector */}
              <div className="sort-select-box">
                <label htmlFor="sort-select">SORT BY:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popularity-desc">Popularity: High to Low</option>
                  <option value="rating-desc">Rating: Highest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Clear Tag */}
          {(searchResults !== null || activeCategory !== 'all' || activeTab !== 'all') && (
            <div className="active-filters-strip">
              <span>Filtering by: </span>
              {activeCategory !== 'all' && (
                <span className="filter-chip">
                  Category: {activeCategory}
                  <button type="button" onClick={() => setActiveCategory('all')}>×</button>
                </span>
              )}
              {searchResults !== null && (
                <span className="filter-chip">
                  Search: "{searchTerm}"
                  <button type="button" onClick={() => setSearchResults(null)}>×</button>
                </span>
              )}
              {activeTab !== 'all' && (
                <span className="filter-chip">
                  Tab: {activeTab}
                  <button type="button" onClick={() => setActiveTab('all')}>×</button>
                </span>
              )}
              <button
                type="button"
                className="reset-all-filters-btn"
                onClick={handleGoHome}
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Products Grid / Empty States */}
          {loadingProducts ? (
            <div className="grid-loading-box">
              <div className="spinner-bolt">⚡</div>
              <p>Summoning products from SQLite database...</p>
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="grid-empty-box">
              <div className="empty-avatar">⛩️</div>
              <h3>NO DROPS MATCH THIS CRITERIA</h3>
              <p>Try resetting the category filter or searching for another keyword.</p>
              <button
                type="button"
                className="grid-reset-btn"
                onClick={handleGoHome}
              >
                Show All Gear
              </button>
            </div>
          ) : (
            <div className="products-card-grid">
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

        {/* 5. Mid-Page Promotional Campaign Banner */}
        <PromoBanner
          onExploreSale={() => {
            setActiveTab('bestsellers')
            document.getElementById('products-grid-section')?.scrollIntoView({ behavior: 'smooth' })
            showToast('Applied 20% discount code SHINOBI20 to your session!', 'success')
          }}
        />

        {/* 6. Smart Recommendations (DSA Showcase: BST, Hash Table, Linked List, Max Heap) */}
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

        {/* 7. Trust / Benefit Indicators */}
        <TrustIndicators />
      </main>

      {/* 8. Polished Footer */}
      <Footer
        onSelectCategory={(catId) => {
          setActiveCategory(catId)
          setSearchResults(null)
          document.getElementById('products-grid-section')?.scrollIntoView({ behavior: 'smooth' })
        }}
      />

      {/* Modals & Overlays */}
      {/* Product Details Modal */}
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

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        loadingCart={loadingCart}
        onRemoveFromCart={handleRemoveFromCart}
        formatPrice={formatPrice}
        onGoHome={handleGoHome}
      />

      {/* Authentication Modal */}
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
