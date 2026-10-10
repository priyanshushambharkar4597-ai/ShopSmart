import React from 'react'
import { Shirt, Shield, Gem, Sword, Palette, ArrowRight } from 'lucide-react'

export default function CategoryRow({ activeCategory, onSelectCategory, products = [] }) {
  // Count items per category
  function getCount(catName) {
    return products.filter((p) => p.category?.toLowerCase() === catName.toLowerCase()).length
  }

  const categoryList = [
    {
      id: 'Clothing',
      title: 'Clothing',
      subtitle: 'Oversized Tees & Heavy Hoodies',
      kanji: '衣服',
      icon: Shirt,
      color: '#9d4edd',
      glow: 'rgba(157, 78, 221, 0.4)',
      bgGradient: 'linear-gradient(135deg, rgba(157, 78, 221, 0.12), rgba(12, 14, 21, 0.95))',
      count: getCount('Clothing') || 5
    },
    {
      id: 'Accessories',
      title: 'Accessories',
      subtitle: 'Tactical Bags, Pins & Caps',
      kanji: '装備',
      icon: Shield,
      color: '#00f5a0',
      glow: 'rgba(0, 245, 160, 0.35)',
      bgGradient: 'linear-gradient(135deg, rgba(0, 245, 160, 0.12), rgba(12, 14, 21, 0.95))',
      count: getCount('Accessories') || 5
    },
    {
      id: 'Jewellery',
      title: 'Jewellery',
      subtitle: 'Silver Rings & Cursed Pendants',
      kanji: '宝石',
      icon: Gem,
      color: '#ff2a85',
      glow: 'rgba(255, 42, 133, 0.35)',
      bgGradient: 'linear-gradient(135deg, rgba(255, 42, 133, 0.12), rgba(12, 14, 21, 0.95))',
      count: getCount('Jewellery') || 5
    },
    {
      id: 'Collectibles',
      title: 'Collectibles',
      subtitle: 'Scale Figures, Acrylics & Katana',
      kanji: '神話',
      icon: Sword,
      color: '#00f2fe',
      glow: 'rgba(0, 242, 254, 0.35)',
      bgGradient: 'linear-gradient(135deg, rgba(0, 242, 254, 0.12), rgba(12, 14, 21, 0.95))',
      count: getCount('Collectibles') || 5
    },
    {
      id: 'Decor',
      title: 'Decor',
      subtitle: 'RGB Mats, Neon Lamps & Scrolls',
      kanji: '空間',
      icon: Palette,
      color: '#ff7b25',
      glow: 'rgba(255, 123, 37, 0.35)',
      bgGradient: 'linear-gradient(135deg, rgba(255, 123, 37, 0.12), rgba(12, 14, 21, 0.95))',
      count: getCount('Decor') || 5
    }
  ]

  return (
    <section className="category-discovery-section" aria-label="Category Discovery">
      <div className="section-header-row">
        <div>
          <span className="section-tag-eyebrow">DISCOVER BY UNIVERSE</span>
          <h2 className="section-title-large">POP-CULTURE CATEGORIES</h2>
        </div>
        {activeCategory && activeCategory !== 'all' && (
          <button
            type="button"
            className="clear-cat-btn"
            onClick={() => onSelectCategory('all')}
          >
            <span>Show All Gear ({products.length})</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      <div className="category-cards-grid">
        {categoryList.map((cat) => {
          const isSelected = activeCategory === cat.id
          const IconComponent = cat.icon

          return (
            <div
              key={cat.id}
              className={`category-feature-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
              role="button"
              tabIndex={0}
              aria-label={`Filter by ${cat.title} category`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelectCategory(isSelected ? 'all' : cat.id)
                }
              }}
              style={{
                '--cat-color': cat.color,
                '--cat-glow': cat.glow,
                background: cat.bgGradient
              }}
            >
              {/* Kanji Background Watermark */}
              <span className="cat-kanji-watermark">{cat.kanji}</span>

              {/* Icon Container with Radiant Glow */}
              <div className="cat-icon-circle">
                <IconComponent size={24} color={cat.color} strokeWidth={2.2} />
              </div>

              {/* Text Info */}
              <div className="cat-card-body">
                <div className="cat-title-row">
                  <h3 className="cat-title">{cat.title}</h3>
                  <span className="cat-count-pill">{cat.count} DROPS</span>
                </div>
                <p className="cat-subtitle">{cat.subtitle}</p>
              </div>

              {/* Active selection dot / indicator */}
              <div className="cat-select-indicator">
                <span>{isSelected ? '✓ ACTIVE FILTER' : 'EXPLORE →'}</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
