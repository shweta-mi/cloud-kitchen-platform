import React, { useState, useEffect } from 'react'
import CustomerApp from './customer/CustomerApp'
import KitchenDashboard from './kitchen/KitchenDashboard'
import { orderService } from './customer/services/orderService'
import { kitchenService } from './kitchen/services/kitchenService'
import { ORDER_STATUS } from './customer/constants/orderStatus'
import { KITCHEN_STATUS, KITCHEN_STATUS_CONFIG } from './kitchen/constants/kitchenStatus'
import { ChefHat, ShoppingBag, ArrowRightLeft, Sparkles } from 'lucide-react'

export default function App() {
  // Determine initial view from URL query param ?view=kitchen or hash #kitchen
  const getInitialView = () => {
    if (typeof window === 'undefined') return 'customer'
    const params = new URLSearchParams(window.location.search)
    const viewParam = params.get('view')
    if (viewParam === 'kitchen' || window.location.hash === '#kitchen') {
      return 'kitchen'
    }
    return 'customer'
  }

  const [currentView, setCurrentView] = useState(getInitialView)
  const [newOrdersCount, setNewOrdersCount] = useState(0)
  const [kitchenStatus, setKitchenStatus] = useState(KITCHEN_STATUS.OPEN)

  // Keep URL in sync without full reload
  const setView = (view) => {
    setCurrentView(view)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('view', view)
      window.history.pushState({}, '', url.toString())
    }
  }

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const v = params.get('view')
      if (v === 'kitchen' || window.location.hash === '#kitchen') {
        setCurrentView('kitchen')
      } else {
        setCurrentView('customer')
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Subscribe to live orders count for notification badge
  useEffect(() => {
    const updateCounts = (ordersList) => {
      const count = ordersList.filter((o) => o.status === ORDER_STATUS.PLACED).length
      setNewOrdersCount(count)
    }

    orderService.getOrders().then(updateCounts)
    const unsubOrders = orderService.subscribe(updateCounts)
    const unsubStatus = kitchenService.subscribe(setKitchenStatus)
    kitchenService.getStatus().then(setKitchenStatus).catch((err) => console.error('Could not load kitchen status', err))

    return () => {
      unsubOrders()
      unsubStatus()
    }
  }, [])

  const currentKitchenCfg =
    KITCHEN_STATUS_CONFIG[kitchenStatus] || KITCHEN_STATUS_CONFIG[KITCHEN_STATUS.OPEN]

  return (
    <div className="relative min-h-screen">
      {/* Persistent Platform Switcher Bar */}
      <div className="bg-stone-950 text-white border-b border-stone-800 text-xs py-2 px-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-wider uppercase text-[11px] text-amber-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Rasoi Kitchen Platform
            </span>
            <span className="text-stone-600 hidden sm:inline">•</span>
            <div className="hidden sm:flex items-center gap-1.5 text-stone-400">
              <span className={`w-2 h-2 rounded-full ${currentKitchenCfg.dotColor} animate-pulse`} />
              <span>Status: <strong className="text-stone-200">{kitchenStatus}</strong></span>
            </div>
          </div>

          {/* Quick View Toggle Controls */}
          <div className="flex items-center gap-2">
            <div className="bg-stone-900 p-1 rounded-xl border border-stone-800 flex items-center gap-1">
              {/* Customer View Button */}
              <button
                onClick={() => setView('customer')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                  currentView === 'customer'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Customer Site</span>
              </button>

              {/* Kitchen View Button */}
              <button
                onClick={() => setView('kitchen')}
                className={`relative flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                  currentView === 'kitchen'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                <ChefHat className="w-3.5 h-3.5" />
                <span>Kitchen Dashboard</span>
                {newOrdersCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute -top-0.5 -right-0.5" />
                )}
                {newOrdersCount > 0 && (
                  <span className="ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-600 text-white">
                    {newOrdersCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Switcher Viewport */}
      {currentView === 'customer' ? (
        <CustomerApp onSwitchToKitchen={() => setView('kitchen')} />
      ) : (
        <KitchenDashboard onSwitchToCustomer={() => setView('customer')} />
      )}
    </div>
  )
}
