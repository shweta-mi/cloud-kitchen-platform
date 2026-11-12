import React, { useState } from 'react'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import Hero from './components/Hero'
import MenuSection from './components/MenuSection'
import WhyUs from './components/WhyUs'
import OrderTracking from './components/OrderTracking'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import CheckoutModal from './components/CheckoutModal'
import OrderConfirmation from './components/OrderConfirmation'

function CustomerAppContent() {
  const [activeOrderIdToTrack, setActiveOrderIdToTrack] = useState('order-123')
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState(null)

  const handleOpenTrackOrder = () => {
    const el = document.getElementById('track-order')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleProceedToCheckout = () => {
    setIsCheckoutOpen(true)
  }

  const handleOrderSuccess = (createdOrder) => {
    setIsCheckoutOpen(false)
    setConfirmedOrder(createdOrder)
    setActiveOrderIdToTrack(createdOrder.id)
  }

  const handleTrackFromConfirmation = (orderId) => {
    setConfirmedOrder(null)
    setActiveOrderIdToTrack(orderId)
    setTimeout(() => {
      const el = document.getElementById('track-order')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/30 selection:bg-amber-500 selection:text-white">
      {/* 1. Brand Header */}
      <Header onOpenTrackOrder={handleOpenTrackOrder} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 2. Welcoming Hero Section */}
        <Hero onOpenTrackOrder={handleOpenTrackOrder} />

        {/* 3 & 4. Menu Section with Categories & Filters */}
        <MenuSection />

        {/* Brand Story & Quality Highlights */}
        <WhyUs />

        {/* 8. Order Tracking Section */}
        <OrderTracking initialOrderId={activeOrderIdToTrack} />
      </main>

      {/* Footer */}
      <Footer />

      {/* 5. Cart Drawer (Slide-out) */}
      <CartDrawer onProceedToCheckout={handleProceedToCheckout} />

      {/* 6. Checkout Modal with Form Validation */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* 7. Order Confirmation Modal */}
      <OrderConfirmation
        order={confirmedOrder}
        onTrackOrder={handleTrackFromConfirmation}
        onClose={() => setConfirmedOrder(null)}
      />
    </div>
  )
}

export default function CustomerApp() {
  return (
    <CartProvider>
      <CustomerAppContent />
    </CartProvider>
  )
}
