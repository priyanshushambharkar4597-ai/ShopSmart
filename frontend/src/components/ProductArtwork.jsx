import React from 'react'

export default function ProductArtwork({ product, size = 'default' }) {
  const category = (product?.category || '').toLowerCase()
  const tags = (product?.tags || '').toLowerCase()

  // Determine accent color and theme based on category
  let theme = {
    gradientStart: '#9d4edd',
    gradientEnd: '#ff2a85',
    glow: 'rgba(157, 78, 221, 0.4)',
    kanji: '特級',
    label: 'STREETWEAR'
  }

  if (category.includes('clothing') || tags.includes('hoodie') || tags.includes('tshirt')) {
    theme = {
      gradientStart: '#9d4edd',
      gradientEnd: '#ec4899',
      glow: 'rgba(157, 78, 221, 0.5)',
      kanji: '衣服',
      label: 'APPAREL'
    }
  } else if (category.includes('accessories') || tags.includes('bag') || tags.includes('pin') || tags.includes('cap')) {
    theme = {
      gradientStart: '#00f5a0',
      gradientEnd: '#00f2fe',
      glow: 'rgba(0, 245, 160, 0.45)',
      kanji: '装備',
      label: 'TACTICAL'
    }
  } else if (category.includes('jewellery') || tags.includes('ring') || tags.includes('pendant') || tags.includes('necklace')) {
    theme = {
      gradientStart: '#ff2a85',
      gradientEnd: '#a855f7',
      glow: 'rgba(255, 42, 133, 0.5)',
      kanji: '宝玉',
      label: 'TALISMAN'
    }
  } else if (category.includes('collectibles') || tags.includes('figure') || tags.includes('katana') || tags.includes('standee')) {
    theme = {
      gradientStart: '#00f2fe',
      gradientEnd: '#3b82f6',
      glow: 'rgba(0, 242, 254, 0.45)',
      kanji: '神話',
      label: 'MYTHIC'
    }
  } else if (category.includes('decor') || tags.includes('lamp') || tags.includes('deskmat') || tags.includes('tapestry')) {
    theme = {
      gradientStart: '#ff7b25',
      gradientEnd: '#ff2a85',
      glow: 'rgba(255, 123, 37, 0.45)',
      kanji: '空間',
      label: 'NEO-SANCTUM'
    }
  } else if (category.includes('electronics') || tags.includes('audio') || tags.includes('gaming')) {
    theme = {
      gradientStart: '#6366f1',
      gradientEnd: '#00f2fe',
      glow: 'rgba(99, 102, 241, 0.45)',
      kanji: '電脳',
      label: 'CYBER-TECH'
    }
  }

  const isLarge = size === 'large'
  const height = isLarge ? 340 : 200

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: `${height}px`,
        overflow: 'hidden',
        borderRadius: isLarge ? '16px' : '12px',
        background: `radial-gradient(circle at 50% 30%, ${theme.glow.replace('0.4', '0.15').replace('0.5', '0.2')}, #0d101a 80%)`,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none'
      }}
      aria-hidden="true"
    >
      {/* Background Cyber Grid Lines */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.25,
          pointerEvents: 'none'
        }}
      >
        <defs>
          <pattern id={`grid-${product?.id || 0}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${product?.id || 0})`} />
      </svg>

      {/* Kanji Watermark */}
      <div
        style={{
          position: 'absolute',
          right: '12px',
          bottom: '8px',
          fontFamily: "'Outfit', sans-serif",
          fontSize: isLarge ? '68px' : '44px',
          fontWeight: 900,
          color: 'rgba(255, 255, 255, 0.04)',
          lineHeight: 1,
          pointerEvents: 'none',
          letterSpacing: '-2px'
        }}
      >
        {theme.kanji}
      </div>

      {/* Corner Bracket Cyber Accents */}
      <div
        style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          width: '10px',
          height: '10px',
          borderTop: `2px solid ${theme.gradientStart}`,
          borderLeft: `2px solid ${theme.gradientStart}`,
          opacity: 0.8
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          width: '10px',
          height: '10px',
          borderBottom: `2px solid ${theme.gradientEnd}`,
          borderRight: `2px solid ${theme.gradientEnd}`,
          opacity: 0.8
        }}
      />

      {/* Center Thematic Graphic */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        {/* Glowing Orb */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isLarge ? '140px' : '90px',
            height: isLarge ? '140px' : '90px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.glow}, transparent 70%)`,
            filter: 'blur(10px)',
            pointerEvents: 'none'
          }}
        />

        {/* Dynamic Category SVG Symbol */}
        <svg
          width={isLarge ? 100 : 64}
          height={isLarge ? 100 : 64}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: `drop-shadow(0 4px 14px ${theme.glow})`,
            transition: 'transform 0.3s ease'
          }}
        >
          {category.includes('clothing') || tags.includes('hoodie') || tags.includes('tshirt') ? (
            /* T-Shirt / Hoodie Streetwear Silhouette */
            <g>
              <path
                d="M16 16 L24 8 L32 14 L40 8 L48 16 L56 26 L48 32 L44 26 L44 56 L20 56 L20 26 L16 32 L8 26 Z"
                fill="url(#grad-icon)"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1.5"
              />
              <path d="M26 24 L32 20 L38 24" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="32" cy="38" r="6" stroke="#ffffff" strokeWidth="1" strokeDasharray="2 2" />
              <path d="M29 38 L35 38" stroke="#ffffff" strokeWidth="1.5" />
            </g>
          ) : category.includes('accessories') || tags.includes('bag') || tags.includes('pin') ? (
            /* Tactical Sling / Shield Emblem */
            <g>
              <polygon
                points="32,8 54,18 46,50 32,58 18,50 10,18"
                fill="url(#grad-icon)"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1.5"
              />
              <path d="M32 18 L32 48" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              <path d="M22 28 L42 28" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              <circle cx="32" cy="28" r="4" fill="#ffffff" />
            </g>
          ) : category.includes('jewellery') || tags.includes('ring') || tags.includes('pendant') ? (
            /* Cursed Talisman / Faceted Gem */
            <g>
              <polygon
                points="32,6 52,22 42,56 22,56 12,22"
                fill="url(#grad-icon)"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="1.5"
              />
              <line x1="12" y1="22" x2="52" y2="22" stroke="#ffffff" strokeWidth="1.2" />
              <line x1="32" y1="6" x2="32" y2="56" stroke="#ffffff" strokeWidth="1.2" />
              <line x1="32" y1="22" x2="22" y2="56" stroke="#ffffff" strokeWidth="1" />
              <line x1="32" y1="22" x2="42" y2="56" stroke="#ffffff" strokeWidth="1" />
            </g>
          ) : category.includes('collectibles') || tags.includes('figure') || tags.includes('katana') ? (
            /* Damascus Katana / Sovereign Crest */
            <g>
              <path
                d="M12 52 L48 16"
                stroke="url(#grad-icon)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M10 54 L18 46"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="20" cy="44" r="3" fill="#ffffff" />
              <path
                d="M44 12 L52 20"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <polygon points="50,14 54,18 48,24 44,20" fill="#ffffff" />
            </g>
          ) : category.includes('decor') || tags.includes('lamp') || tags.includes('deskmat') ? (
            /* Neo-Tokyo Sun & Cyber Wave */
            <g>
              <circle cx="32" cy="28" r="16" fill="url(#grad-icon)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
              <line x1="18" y1="28" x2="46" y2="28" stroke="#0d101a" strokeWidth="2" />
              <line x1="20" y1="34" x2="44" y2="34" stroke="#0d101a" strokeWidth="2" />
              <path d="M12 48 Q 22 42 32 48 T 52 48" stroke="#ffffff" strokeWidth="2" fill="none" />
              <path d="M16 54 Q 24 50 32 54 T 48 54" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" />
            </g>
          ) : (
            /* Cyber Tech Headset / Gadget */
            <g>
              <rect x="18" y="18" width="28" height="28" rx="6" fill="url(#grad-icon)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
              <path d="M26 32 L38 32 M32 26 L32 38" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              <circle cx="32" cy="32" r="8" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 2" />
            </g>
          )}

          <defs>
            <linearGradient id="grad-icon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={theme.gradientStart} />
              <stop offset="100%" stopColor={theme.gradientEnd} />
            </linearGradient>
          </defs>
        </svg>

        {/* Sub-label */}
        <div
          style={{
            marginTop: '8px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: isLarge ? '12px' : '10px',
            fontWeight: 700,
            letterSpacing: '1.8px',
            color: 'rgba(255, 255, 255, 0.75)',
            textTransform: 'uppercase'
          }}
        >
          {theme.label}
        </div>
      </div>
    </div>
  )
}
