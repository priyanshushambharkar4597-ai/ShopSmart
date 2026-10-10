import React, { useState, useEffect } from 'react'
import { Flame, Copy, Check, Clock, ArrowRight, ShieldAlert } from 'lucide-react'

export default function PromoBanner({ onExploreSale }) {
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    hours: 7,
    minutes: 42,
    seconds: 19
  })

  // Live countdown timer ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return { hours: 12, minutes: 0, seconds: 0 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  function handleCopy() {
    navigator.clipboard?.writeText('SHINOBI20')
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const formatDigit = (num) => String(num).padStart(2, '0')

  return (
    <section className="promo-campaign-banner" aria-label="Limited Time Promotion">
      <div className="promo-banner-inner">
        {/* Decorative Anime Grid and Ambient Gradients */}
        <div className="promo-ambient-glow" />
        <span className="promo-kanji-bg">領域展開</span>

        {/* Content Box */}
        <div className="promo-content-grid">
          <div className="promo-info-col">
            <div className="promo-eyebrow">
              <Flame size={14} className="accent-pink" />
              <span>SPECIAL GRADE EVENT // LIMITED ARCHIVE ACCESS</span>
            </div>

            <h2 className="promo-heading">
              DOMAIN EXPANSION: <br />
              <span className="text-gradient-pink">THE MULTIVERSE DROP SALE</span>
            </h2>

            <p className="promo-description">
              Elevate your loadout. Buy any 2 Anime Heavyweight Graphic Hoodies or Streetwear Tees and receive an exclusive
              Damascus Steel Letter Opener or Acrylic Standee gift with code <strong className="promo-highlight-code">SHINOBI20</strong>.
            </p>

            <div className="promo-actions-row">
              {/* Copyable Code Container */}
              <div className="promo-code-container">
                <span className="code-label">PROMO CODE:</span>
                <span className="code-text">SHINOBI20</span>
                <button
                  type="button"
                  className="code-copy-btn"
                  onClick={handleCopy}
                  aria-label="Copy promo code SHINOBI20"
                >
                  {copied ? (
                    <>
                      <Check size={14} />
                      <span>COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>COPY</span>
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                className="promo-cta-btn"
                onClick={onExploreSale}
              >
                <span>CLAIM DEAL NOW</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Countdown Clock Display */}
          <div className="promo-clock-col">
            <div className="countdown-card">
              <div className="clock-header">
                <Clock size={15} />
                <span>OFFER TIME REMAINING</span>
              </div>

              <div className="timer-digits-row">
                <div className="timer-block">
                  <span className="timer-val">{formatDigit(timeLeft.hours)}</span>
                  <span className="timer-unit">HOURS</span>
                </div>
                <span className="timer-colon">:</span>
                <div className="timer-block">
                  <span className="timer-val">{formatDigit(timeLeft.minutes)}</span>
                  <span className="timer-unit">MINS</span>
                </div>
                <span className="timer-colon">:</span>
                <div className="timer-block">
                  <span className="timer-val">{formatDigit(timeLeft.seconds)}</span>
                  <span className="timer-unit">SECS</span>
                </div>
              </div>

              <div className="countdown-stock-alert">
                <ShieldAlert size={13} />
                <span>LIMITED RUN: ONLY 42 BUNDLES REMAINING IN REPOSITORY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
