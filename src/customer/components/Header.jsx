import React, { useState, useEffect } from 'react'
import { ShoppingBag, Menu, X, Flame, Search, Clock, ArrowRight, ChefHat } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Header({ onOpenTrackOrder, onSwitchToKitchen }) {
  const { totalItems, subtotal, setIsCartOpen } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-amber-100/80 py-3'
          : 'bg-white/80 backdrop-blur-sm border-b border-amber-100/50 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Name */}
          <a
            href="#"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg p-1"
            aria-label="Rasoi Kitchen Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-stone-900 group-hover:text-amber-700 transition-colors">
                Rasoi Kitchen
              </span>
              <span className="block text-[10px] tracking-widest font-semibold uppercase text-amber-600">
                Fresh Cloud Kitchen
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            <a
              href="#menu"
              className="text-stone-700 hover:text-amber-600 font-medium text-sm transition-colors"
            >
              Menu
            </a>
            <a
              href="#why-us"
              className="text-stone-700 hover:text-amber-600 font-medium text-sm transition-colors"
            >
              Why Rasoi
            </a>
            <a
              href="#track-order"
              onClick={(e) => {
                if (onOpenTrackOrder) {
                  e.preventDefault()
                  onOpenTrackOrder()
                }
              }}
              className="text-stone-700 hover:text-amber-600 font-medium text-sm transition-colors flex items-center gap-1.5"
            >
              <Clock className="w-4 h-4 text-amber-600" />
              Track Order
            </a>
            <a
              href="#about"
              className="text-stone-700 hover:text-amber-600 font-medium text-sm transition-colors"
            >
              About
            </a>
          </nav>

          {/* Actions: Cart button & Mobile menu toggle */}
          <div className="flex items-center gap-3">
            {/* Quick Track order pill on desktop */}
            <a
              href="#track-order"
              onClick={(e) => {
                if (onOpenTrackOrder) {
                  e.preventDefault()
                  onOpenTrackOrder()
                }
              }}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-100/60 hover:bg-amber-100 rounded-full border border-amber-200 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live Order Status
            </a>

            {/* Kitchen Dashboard Switcher Button */}
            {onSwitchToKitchen && (
              <button
                onClick={onSwitchToKitchen}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-full border border-stone-300 transition-colors"
                title="Switch to Kitchen Staff Dashboard"
              >
                <ChefHat className="w-3.5 h-3.5 text-amber-600" />
                <span>Kitchen Staff</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm shadow-md shadow-amber-600/25 transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              aria-label={`Shopping cart with ${totalItems} items`}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-semibold">
                {totalItems === 0 ? 'Cart' : `₹${subtotal}`}
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-700 hover:text-stone-900 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-amber-100 mt-3 animate-fadeIn">
            <div className="flex flex-col gap-3">
              <a
                href="#menu"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-stone-800 hover:bg-amber-50 font-medium text-base transition-colors"
              >
                Browse Menu
              </a>
              <a
                href="#why-us"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-stone-800 hover:bg-amber-50 font-medium text-base transition-colors"
              >
                Why Rasoi Kitchen
              </a>
              <a
                href="#track-order"
                onClick={(e) => {
                  setMobileMenuOpen(false)
                  if (onOpenTrackOrder) {
                    e.preventDefault()
                    onOpenTrackOrder()
                  }
                }}
                className="px-3 py-2 rounded-lg text-amber-700 bg-amber-50 font-medium text-base flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Track Live Order
                </span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-stone-800 hover:bg-amber-50 font-medium text-base transition-colors"
              >
                About Our Cloud Kitchen
              </a>
              {onSwitchToKitchen && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onSwitchToKitchen()
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-amber-900 bg-amber-100/70 border border-amber-300 font-bold text-base flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-amber-700" />
                    Kitchen Staff Dashboard
                  </span>
                  <ArrowRight className="w-4 h-4 text-amber-700" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
