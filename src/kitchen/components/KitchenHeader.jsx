import React, { useState, useEffect } from 'react'
import { Flame, Clock, ExternalLink, ChefHat, AlertCircle, CheckCircle2 } from 'lucide-react'
import { KITCHEN_STATUS, KITCHEN_STATUS_CONFIG } from '../constants/kitchenStatus'

export default function KitchenHeader({
  kitchenStatus,
  onStatusChange,
  activeCount = 0,
  newOrdersCount = 0,
  onSwitchToCustomer,
}) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const currentConfig = KITCHEN_STATUS_CONFIG[kitchenStatus] || KITCHEN_STATUS_CONFIG[KITCHEN_STATUS.OPEN]

  return (
    <header className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left: Branding & Kitchen Live Indicator */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-lg sm:text-xl text-white tracking-tight">
                  Rasoi Kitchen
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  KDS Dashboard
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Cloud Kitchen Display & Order Fulfilment System
              </p>
            </div>
          </div>

          {/* Right Controls: Kitchen Status, Clock & Customer View Link */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Live Clock */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-stone-400 bg-stone-800/80 px-3 py-1.5 rounded-xl border border-stone-700/60 font-mono">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>

            {/* Kitchen Status Control (Open / Busy / Closed) */}
            <div className="flex items-center gap-2 bg-stone-800/90 p-1 rounded-xl border border-stone-700">
              <span className="text-[11px] font-bold text-stone-400 pl-2 hidden sm:inline">
                Status:
              </span>
              <div className="flex items-center gap-1">
                {Object.values(KITCHEN_STATUS).map((status) => {
                  const isActive = kitchenStatus === status
                  const config = KITCHEN_STATUS_CONFIG[status]

                  let activeClasses = ''
                  if (isActive) {
                    if (status === KITCHEN_STATUS.OPEN) activeClasses = 'bg-emerald-600 text-white shadow-sm'
                    else if (status === KITCHEN_STATUS.BUSY) activeClasses = 'bg-amber-600 text-white shadow-sm'
                    else activeClasses = 'bg-rose-600 text-white shadow-sm'
                  } else {
                    activeClasses = 'text-stone-400 hover:text-white hover:bg-stone-700'
                  }

                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => onStatusChange(status)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${activeClasses}`}
                      title={config.desc}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isActive ? 'bg-white animate-pulse' : config.dotColor
                        }`}
                      />
                      <span>{status}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Switch to Customer Website Button */}
            <button
              onClick={onSwitchToCustomer}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/40 font-semibold text-xs transition-all shadow-xs"
              title="Switch to customer ordering website"
            >
              <span>Customer Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
