import React from 'react'
import { ShieldCheck, Cpu, Search, ShoppingBag } from 'lucide-react'

export default function TrustIndicators() {
  const benefits = [
    {
      num: '01',
      icon: ShieldCheck,
      title: 'SECURE SQLITE ACCOUNTS',
      desc: 'ACID-compliant relational persistence. Zero third-party telemetry or ad-trackers.'
    },
    {
      num: '02',
      icon: Cpu,
      title: 'PERSONALIZED RECOMMENDATIONS',
      desc: 'In-memory Max-Heap priority queue evaluating cosine content and history vectors.'
    },
    {
      num: '03',
      icon: Search,
      title: 'FAST BST SEARCH',
      desc: 'Sub-millisecond title lookups powered by in-memory Binary Search Tree indexing.'
    },
    {
      num: '04',
      icon: ShoppingBag,
      title: 'PERSISTENT CART STATE',
      desc: 'Chained hash table ID dereferencing ensuring real-time database state sync.'
    }
  ]

  return (
    <section className="brutalist-trust-section" aria-label="System Specifications & Guarantees">
      <div className="trust-section-header">
        <span className="section-index">[05/SYSTEM ASSURANCES]</span>
        <h2 className="trust-heading">CORE INFRASTRUCTURE GUARANTEES</h2>
      </div>

      <div className="trust-quad-grid">
        {benefits.map((item) => {
          const IconComp = item.icon
          return (
            <div key={item.num} className="trust-cell">
              <div className="trust-cell-header">
                <span className="cell-num">[{item.num}]</span>
                <IconComp size={20} strokeWidth={2} className="trust-icon" />
              </div>
              <h3 className="trust-cell-title">{item.title}</h3>
              <p className="trust-cell-desc">{item.desc}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
