import React, { useState } from 'react'
import {
  Cpu,
  Info,
  UserCheck,
  Zap
} from 'lucide-react'
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
  const [activeDsaTab, setActiveDsaTab] = useState('maxheap')
  const [demoUserMode, setDemoUserMode] = useState(1) // 1 = Priya, 2 = Rahul

  // Demo fallback recommendation sets if API returns empty or user is unauthenticated
  const priyaFavorites = allProducts.filter((p) =>
    [116, 117, 102, 104, 126].includes(p.id)
  )
  const rahulFavorites = allProducts.filter((p) =>
    [131, 133, 108, 109, 136].includes(p.id)
  )

  const activeRecs = (recommendations && recommendations.length > 0)
    ? recommendations
    : (demoUserMode === 1 ? priyaFavorites : rahulFavorites)

  const dsaFeatures = [
    {
      id: 'bst',
      name: 'Binary Search Tree (BST)',
      signature: 'BST::search(string name)',
      complexity: 'O(log n) Search',
      color: '#00f5a0',
      icon: '🌳',
      summary: 'Product Name Search Index',
      description:
        'The catalogue names are stored in a balanced Binary Search Tree. This allows the search bar to locate anime merchandise by title in logarithmic time (O(log n)), completely bypassing linear O(n) table scans.'
    },
    {
      id: 'hash',
      name: 'Chained Hash Table',
      signature: 'HashTable::search(int id)',
      complexity: 'O(1) Direct Lookup',
      color: '#00f2fe',
      icon: '⚡',
      summary: 'Instant Product ID Dereference',
      description:
        'A custom C hash table with modular hashing and linked buckets provides O(1) constant-time product lookups by ID. Powers instantaneous cart additions and checkout verification.'
    },
    {
      id: 'linkedlist',
      name: 'Interaction Linked List',
      signature: 'LinkedList::append(Interaction)',
      complexity: 'O(1) Append History',
      color: '#ff2a85',
      icon: '🔗',
      summary: 'Chronological User Behavior',
      description:
        'Every user action (Views weight: 1.0, Wishlists: 4.0, Cart Adds: 5.0) is stored sequentially in a Singly Linked List to model temporal preference shifts and calculate user history vectors.'
    },
    {
      id: 'maxheap',
      name: 'Recommendation Max Heap',
      signature: 'MaxHeap::extractMax()',
      complexity: 'O(k log n) Top Ranking',
      color: '#9d4edd',
      icon: '🏆',
      summary: 'Priority Queue Scoring Engine',
      description:
        'Computes composite recommendation scores (Content Match 60% + User History 25% + Popularity 10% + Rating 5%) and inserts candidates into a Max Heap. Top recommendations are extracted in strict priority order.'
    }
  ]

  return (
    <section id="dsa-recommendations" className="dsa-showcase-section" aria-label="Smart DSA Recommendations">
      {/* Section Header */}
      <div className="dsa-header-wrapper">
        <div className="dsa-header-left">
          <div className="dsa-badge-chip">
            <Cpu size={14} className="accent-purple" />
            <span>ALGORITHMIC RECOMMENDATION ENGINE // C + DATA STRUCTURES</span>
          </div>

          <h2 className="dsa-main-title">
            SMART PICKS TAILORED <span className="text-gradient-purple">TO YOU.</span>
          </h2>

          <p className="dsa-subtitle">
            Powered by a custom Binary Search Tree, Chained Hash Table, Interaction Linked List, and Max Heap priority queue.
          </p>
        </div>

        {/* User Context Badge / Demo Switcher */}
        <div className="dsa-user-status-card">
          {userId ? (
            <div className="dsa-logged-in-box">
              <div className="dsa-user-icon-circle">
                <UserCheck size={18} />
              </div>
              <div>
                <span className="dsa-status-label">ACTIVE ALGORITHMIC STREAM</span>
                <strong className="dsa-status-user">
                  {userName || `User #${userId}`} (Live SQLite Profile)
                </strong>
              </div>
            </div>
          ) : (
            <div className="dsa-demo-box">
              <div className="dsa-demo-header">
                <span className="dsa-status-label">GUEST DEMO SIMULATOR</span>
                <button
                  type="button"
                  className="dsa-login-prompt-btn"
                  onClick={onOpenAuth}
                >
                  <Zap size={12} />
                  <span>SIGN IN TO PERSONALIZE</span>
                </button>
              </div>
              <div className="dsa-demo-toggle-group">
                <button
                  type="button"
                  className={`demo-toggle-btn ${demoUserMode === 1 ? 'active' : ''}`}
                  onClick={() => setDemoUserMode(1)}
                >
                  Priya (Streetwear & Audio)
                </button>
                <button
                  type="button"
                  className={`demo-toggle-btn ${demoUserMode === 2 ? 'active' : ''}`}
                  onClick={() => setDemoUserMode(2)}
                >
                  Rahul (Collectibles & Gear)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Products Grid */}
      <div className="dsa-products-grid">
        {activeRecs.slice(0, 4).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onOpen={onOpenProduct}
            onAddToCart={onAddToCart}
            formatPrice={formatPrice}
          />
        ))}
      </div>

      {/* Visual Non-Cluttered DSA Architectural Breakdown */}
      <div className="dsa-architecture-card">
        <div className="arch-card-header">
          <div className="arch-badge">
            <Info size={14} />
            <span>HOW THE DSA ENGINE OPERATES</span>
          </div>
          <p className="arch-subtext">Click any data structure to inspect its algorithmic mechanics:</p>
        </div>

        <div className="dsa-tabs-row">
          {dsaFeatures.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`dsa-tab-btn ${activeDsaTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveDsaTab(item.id)}
              style={{
                '--tab-color': item.color
              }}
            >
              <span className="tab-icon">{item.icon}</span>
              <span className="tab-title">{item.name}</span>
              <span className="tab-complexity">{item.complexity}</span>
            </button>
          ))}
        </div>

        {/* Selected DSA Detail Display */}
        {(() => {
          const current = dsaFeatures.find((f) => f.id === activeDsaTab) || dsaFeatures[0]
          return (
            <div className="dsa-detail-panel" style={{ '--panel-accent': current.color }}>
              <div className="panel-code-strip">
                <span className="code-dot red" />
                <span className="code-dot yellow" />
                <span className="code-dot green" />
                <code className="panel-signature">{current.signature}</code>
                <span className="panel-complexity-chip">{current.complexity}</span>
              </div>

              <div className="panel-body">
                <h3 className="panel-summary">{current.summary}</h3>
                <p className="panel-desc">{current.description}</p>
              </div>

              {/* Math / Formula Breakdown for Max Heap */}
              {current.id === 'maxheap' && (
                <div className="formula-box">
                  <span className="formula-label">WEIGHTED SCORING FORMULA:</span>
                  <code className="formula-code">
                    FinalScore = (0.60 × ContentSimilarity) + (0.25 × UserPreference) + (0.10 × Popularity) + (0.05 × Rating)
                  </code>
                </div>
              )}
            </div>
          )
        })()}
      </div>
    </section>
  )
}
