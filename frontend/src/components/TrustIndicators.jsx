import React from 'react'
import { ShieldCheck, Cpu, Zap, ShoppingBag } from 'lucide-react'

export default function TrustIndicators() {
  const benefits = [
    {
      icon: ShieldCheck,
      color: '#00f5a0',
      title: 'Secure Account & SQLite',
      desc: 'Persistent authenticated user sessions backed by ACID-compliant SQLite storage.'
    },
    {
      icon: Cpu,
      color: '#9d4edd',
      title: 'Smart Recommendations',
      desc: 'Algorithmic Max-Heap and Linked List engine tailored to your aesthetic preferences.'
    },
    {
      icon: Zap,
      color: '#00f2fe',
      title: 'Fast BST Product Search',
      desc: 'Sub-millisecond title lookups powered by in-memory Binary Search Tree indexing.'
    },
    {
      icon: ShoppingBag,
      color: '#ff2a85',
      title: 'Persistent Shopping Cart',
      desc: 'Real-time database-synced cart preserving your chosen drops across devices.'
    }
  ]

  return (
    <section className="trust-indicators-section" aria-label="Why ShopSmart Trust & Performance">
      <div className="trust-grid">
        {benefits.map((item, idx) => {
          const IconComp = item.icon
          return (
            <div
              key={idx}
              className="trust-card"
              style={{ '--trust-color': item.color }}
            >
              <div className="trust-icon-box">
                <IconComp size={22} color={item.color} strokeWidth={2.2} />
              </div>
              <div className="trust-content">
                <h3 className="trust-title">{item.title}</h3>
                <p className="trust-desc">{item.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
