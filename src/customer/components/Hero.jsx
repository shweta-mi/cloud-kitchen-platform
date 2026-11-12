import React from 'react'
import { ArrowDown, Flame, Sparkles, Clock, ShieldCheck, Star } from 'lucide-react'

export default function Hero({ onOpenTrackOrder }) {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-gradient-to-br from-amber-200/40 to-orange-200/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gradient-to-tr from-amber-100/50 to-yellow-100/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Announcement */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-xs sm:text-sm font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Authentic Homestyle Indian Cloud Kitchen</span>
            </div>

            {/* Welcoming Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-[1.15]">
              Real Spice, Pure Taste.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                Fresh From Rasoi
              </span>{' '}
              to Your Table.
            </h1>

            {/* Short Description */}
            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Experience the aroma of authentic slow-simmered gravies, hand-rolled laccha parathas, and fragrant biryanis. Prepared in hygienic small batches and delivered hot within 30 minutes.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#menu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold text-base shadow-lg shadow-orange-600/25 transition-all transform active:scale-95"
              >
                <span>View Menu</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </a>

              <a
                href="#track-order"
                onClick={(e) => {
                  if (onOpenTrackOrder) {
                    e.preventDefault()
                    onOpenTrackOrder()
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-stone-50 text-stone-800 font-semibold text-base border border-stone-200 shadow-sm transition-all"
              >
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Track Live Order</span>
              </a>
            </div>

            {/* Feature Highlights */}
            <div className="pt-8 border-t border-amber-200/60 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-xl sm:text-2xl font-bold text-stone-900">30 Min</span>
                <span className="text-xs text-stone-500 font-medium">Express Delivery</span>
              </div>
              <div className="flex flex-col items-center lg:items-start border-x border-stone-200 px-2 sm:px-4">
                <span className="text-xl sm:text-2xl font-bold text-stone-900">100%</span>
                <span className="text-xs text-stone-500 font-medium">Fresh Ingredients</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-xl sm:text-2xl font-bold text-stone-900">4.9 ★</span>
                <span className="text-xs text-stone-500 font-medium">Over 2,500 Reviews</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Food Card Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Visual Image Card */}
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <div className="relative h-72 sm:h-80 w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80"
                    alt="Authentic Indian Dal Makhani and Curries from Rasoi Kitchen"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 uppercase tracking-wide mb-1">
                      Chef Special
                    </span>
                    <h3 className="text-lg font-serif font-bold">Paneer Roll & Dal Makhani</h3>
                    <p className="text-xs text-amber-200">Slow cooked with royal spices & churned butter</p>
                  </div>
                </div>

                {/* Sub-card banner */}
                <div className="p-4 bg-amber-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900">FSSAI Certified Cloud Kitchen</p>
                      <p className="text-[11px] text-stone-500">Contactless sanitized delivery</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                    Starting ₹45
                  </span>
                </div>
              </div>

              {/* Floating Badge 1: Top Right */}
              <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-amber-100 flex items-center gap-3 animate-bounce [animation-duration:3s]">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                  🔥
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">Paneer Roll</p>
                  <p className="text-[11px] text-amber-700 font-semibold">₹120 only</p>
                </div>
              </div>

              {/* Floating Badge 2: Bottom Left */}
              <div className="absolute -bottom-5 -left-4 bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-amber-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                  <Star className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">Top Rated</p>
                  <p className="text-[11px] text-stone-500">Pure Ghee & Spices</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
