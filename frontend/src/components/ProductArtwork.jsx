import React from 'react'

export default function ProductArtwork({ product, size = 'default' }) {
  const category = (product?.category || '').toLowerCase()
  const tags = (product?.tags || '').toLowerCase()
  const id = Number(product?.id || 101)

  const isLarge = size === 'large'
  const height = isLarge ? 320 : 220

  // Category archetype configuration (strict brutalist: black, white, signal red)
  let catCode = 'APP-01'
  let glyph = 'APPAREL'
  let spec = '280 GSM / COMBED COTTON'

  if (category.includes('clothing') || tags.includes('hoodie') || tags.includes('tshirt')) {
    catCode = 'HVY-280'
    glyph = 'WEAR'
    spec = '280 GSM BIO-WASH // RELAXED FIT'
  } else if (category.includes('accessories') || tags.includes('bag') || tags.includes('pin') || tags.includes('cap')) {
    catCode = 'TAC-02'
    glyph = 'EQUIP'
    spec = 'CORDURA 1000D // ENAMEL ALLOY'
  } else if (category.includes('jewellery') || tags.includes('ring') || tags.includes('pendant')) {
    catCode = 'MET-03'
    glyph = 'CURSE'
    spec = '925 STERLING SILVER // OBSIDIAN'
  } else if (category.includes('collectibles') || tags.includes('figure') || tags.includes('katana')) {
    catCode = 'FIG-04'
    glyph = 'SCALE'
    spec = '1/8 PVC COLD CAST // DAMASCUS STEEL'
  } else if (category.includes('decor') || tags.includes('lamp') || tags.includes('deskmat')) {
    catCode = 'DCR-05'
    glyph = 'SPACE'
    spec = 'NEO ACRYLIC // RGB MICROWEAVE'
  } else if (category.includes('electronics') || tags.includes('audio')) {
    catCode = 'SYS-06'
    glyph = 'AUDIO'
    spec = 'LOW LATENCY // MECHANICAL SWITCH'
  }

  // Accent highlights (signal red #FF2A00 accents on black and white)
  const isRedAccented = id % 3 === 0
  const isReverseBlack = id % 2 === 0

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: `${height}px`,
        backgroundColor: isReverseBlack ? '#000000' : '#F2F2F2',
        color: isReverseBlack ? '#FFFFFF' : '#000000',
        borderBottom: '2px solid #000000',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '12px',
        userSelect: 'none'
      }}
      aria-hidden="true"
    >
      {/* Background Graphic: Manga Speed Lines or Halftone Grid Pattern */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: isReverseBlack ? 0.18 : 0.12,
          pointerEvents: 'none'
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={`dot-grid-${id}`} width="14" height="14" patternUnits="userSpaceOnUse">
            <rect width="2" height="2" fill={isReverseBlack ? '#FFFFFF' : '#000000'} />
          </pattern>
          <pattern id={`lines-${id}`} width="20" height="20" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="20" stroke={isReverseBlack ? '#FFFFFF' : '#000000'} strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id % 2 === 0 ? `dot-grid-${id}` : `lines-${id}`})`} />
      </svg>

      {/* Top Header Strip */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
          fontFamily: "'Space Mono', monospace",
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.05em'
        }}
      >
        <span
          style={{
            backgroundColor: isRedAccented ? '#FF2A00' : isReverseBlack ? '#FFFFFF' : '#000000',
            color: isRedAccented ? '#FFFFFF' : isReverseBlack ? '#000000' : '#FFFFFF',
            padding: '2px 6px',
            lineHeight: 1.2
          }}
        >
          {catCode}
        </span>
        <span style={{ opacity: 0.7 }}>REF #{id}</span>
      </div>

      {/* Center Hero Artwork Glyph & Blueprint Framing */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          margin: 'auto 0'
        }}
      >
        {/* Oversized Typographic Monogram Stamp */}
        <div
          style={{
            border: `2px solid ${isReverseBlack ? '#FFFFFF' : '#000000'}`,
            padding: isLarge ? '16px 28px' : '10px 18px',
            backgroundColor: isReverseBlack ? '#000000' : '#FFFFFF',
            position: 'relative'
          }}
        >
          {isRedAccented && (
            <div
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                width: '12px',
                height: '12px',
                backgroundColor: '#FF2A00'
              }}
            />
          )}
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: isLarge ? '48px' : '28px',
              lineHeight: 1,
              letterSpacing: '-0.05em',
              display: 'block'
            }}
          >
            {glyph}
          </span>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '9px',
              letterSpacing: '0.12em',
              marginTop: '4px',
              display: 'block',
              opacity: 0.8
            }}
          >
            SPEC // {category.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Bottom Technical Spec Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          position: 'relative',
          zIndex: 1,
          borderTop: `1px solid ${isReverseBlack ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)'}`,
          paddingTop: '6px',
          fontFamily: "'Space Mono', monospace",
          fontSize: '9px',
          lineHeight: 1.3
        }}
      >
        <span style={{ maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {spec}
        </span>
        <span
          style={{
            color: isRedAccented ? '#FF2A00' : 'inherit',
            fontWeight: 700
          }}
        >
          [QC: PASS]
        </span>
      </div>
    </div>
  )
}
