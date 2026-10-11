import React from 'react'
import { Shirt, Shield, Gem, Sword, Palette, ArrowRight } from 'lucide-react'

export default function CategoryRow({ activeCategory, onSelectCategory, products = [] }) {
  function getCount(catName) {
    return products.filter((p) => p.category?.toLowerCase() === catName.toLowerCase()).length
  }

  const categoryList = [
    {
      id: 'Clothing',
      num: '01',
      title: 'CLOTHING',
      subtitle: '280 GSM Heavyweight Tees & Acid-Wash',
      icon: Shirt,
      count: getCount('Clothing') || 6
    },
    {
      id: 'Accessories',
      num: '02',
      title: 'ACCESSORIES',
      subtitle: 'Tactical Bags, Alloy Pins & Snapbacks',
      icon: Shield,
      count: getCount('Accessories') || 7
    },
    {
      id: 'Jewellery',
      num: '03',
      title: 'JEWELLERY',
      subtitle: '925 Sterling Silver & Obsidian Talismans',
      icon: Gem,
      count: getCount('Jewellery') || 5
    },
    {
      id: 'Collectibles',
      num: '04',
      title: 'COLLECTIBLES',
      subtitle: '1/8 Scale Figures & Damascus Steel Blades',
      icon: Sword,
      count: getCount('Collectibles') || 5
    },
    {
      id: 'Decor',
      num: '05',
      title: 'DECOR',
      subtitle: 'RGB Neo-Mats, Acrylic Lamps & Scrolls',
      icon: Palette,
      count: getCount('Decor') || 5
    }
  ]

  return (
    <section className="brutalist-category-section" aria-label="Category Discovery">
      <div className="category-section-header">
        <div className="cat-header-left">
          <span className="section-index">[02/DISCOVERY]</span>
          <h2 className="cat-header-title">ARCHIVE SECTOR INDEX</h2>
        </div>

        {activeCategory && activeCategory !== 'all' && (
          <button
            type="button"
            className="cat-reset-btn"
            onClick={() => onSelectCategory('all')}
          >
            <span>SHOW ALL SECTORS ({products.length})</span>
            <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* 5-Cell Spreadsheet Table Grid */}
      <div className="category-spreadsheet-grid">
        {categoryList.map((cat) => {
          const isSelected = activeCategory === cat.id
          const IconComp = cat.icon

          return (
            <button
              key={cat.id}
              type="button"
              className={`category-cell ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
              aria-label={`Filter by ${cat.title}`}
            >
              <div className="cell-top-bar">
                <span className="cell-num">[{cat.num}]</span>
                <span className="cell-count">{cat.count} DROPS</span>
              </div>

              <div className="cell-center">
                <IconComp size={32} strokeWidth={2} className="cell-icon" />
                <h3 className="cell-name">{cat.title}</h3>
                <p className="cell-desc">{cat.subtitle}</p>
              </div>

              <div className="cell-bottom-bar">
                <span>{isSelected ? '[ACTIVE FILTER]' : '[FILTER SECTOR →]'}</span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
