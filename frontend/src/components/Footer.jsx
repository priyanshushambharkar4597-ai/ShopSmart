import React from 'react'
import { Zap, Code2, ArrowUp } from 'lucide-react'

export default function Footer({ onSelectCategory }) {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="site-footer" aria-label="Site Footer">
      <div className="footer-top-strip">
        <div className="footer-container">
          <div className="brand-statement-group">
            <div className="footer-logo">
              <Zap size={20} className="accent-purple" />
              <span>SHOPSMART // スマート</span>
            </div>
            <p className="footer-tagline">
              Premium high-energy anime & pop-culture merchandise engineered with algorithmic excellence.
            </p>
          </div>

          <button
            type="button"
            className="back-to-top-btn"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
          >
            <span>BACK TO TOP</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>

      <div className="footer-main-grid footer-container">
        {/* Col 1: Shop Categories */}
        <div className="footer-col">
          <h4 className="footer-heading">MERCHANDISE CATEGORIES</h4>
          <ul className="footer-links-list">
            <li>
              <button type="button" onClick={() => onSelectCategory('Clothing')}>
                Clothing (Heavyweight Streetwear)
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onSelectCategory('Accessories')}>
                Accessories (Tactical Bags & Pins)
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onSelectCategory('Jewellery')}>
                Jewellery (Silver Rings & Talismans)
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onSelectCategory('Collectibles')}>
                Collectibles (Scale Figures & Katana)
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onSelectCategory('Decor')}>
                Decor (RGB Mats & Neon Lamps)
              </button>
            </li>
          </ul>
        </div>

        {/* Col 2: Customer Help & Policies */}
        <div className="footer-col">
          <h4 className="footer-heading">CUSTOMER DISPATCH & HELP</h4>
          <ul className="footer-links-list">
            <li><span>⚡ Free Express Delivery on orders over ₹999</span></li>
            <li><span>⛩️ 100% Authentic Original Anime Designs</span></li>
            <li><span>🛡️ 7-Day Hassle-Free Size Exchange</span></li>
            <li><span>📦 Real-time Dispatch Tracking</span></li>
            <li><span>📏 Anime Streetwear Fit & Size Guide</span></li>
          </ul>
        </div>

        {/* Col 3: Project & DSA Credits */}
        <div className="footer-col dsa-credits-col">
          <h4 className="footer-heading">PROJECT ARCHITECTURE & CREDITS</h4>
          <p className="dsa-credits-intro">
            Built as an advanced Full-Stack E-Commerce platform demonstrating core Data Structures & Algorithms:
          </p>
          <div className="dsa-tags-container">
            <span className="dsa-tech-tag">🌳 Binary Search Tree (O(log n))</span>
            <span className="dsa-tech-tag">⚡ Chained Hash Table (O(1))</span>
            <span className="dsa-tech-tag">🔗 Interaction Linked List</span>
            <span className="dsa-tech-tag">🏆 Max Heap Priority Queue</span>
            <span className="dsa-tech-tag">💾 C + SQLite Database</span>
            <span className="dsa-tech-tag">🌐 libmicrohttpd REST API</span>
            <span className="dsa-tech-tag">⚛️ React 19 + Vite</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar">
        <div className="footer-container bottom-bar-inner">
          <p className="copyright-text">
            © {new Date().getFullYear()} ShopSmart Inc. All original anime-inspired concept art and designs reserved.
          </p>
          <div className="made-with-badge">
            <span>Engineered with algorithmic precision</span>
            <Code2 size={13} className="accent-pink" />
          </div>
        </div>
      </div>
    </footer>
  )
}
