import React, { useState, useEffect } from 'react'
import {
  Clock,
  Search,
  CheckCircle2,
  ChefHat,
  PackageCheck,
  Bike,
  AlertCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react'
import { orderService } from '../services/orderService'
import { ORDER_STATUS, STATUS_DETAILS } from '../constants/orderStatus'

export default function OrderTracking({ initialOrderId }) {
  const [orderIdInput, setOrderIdInput] = useState(initialOrderId || '')
  const [currentOrder, setCurrentOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load orders list and default order
  const loadOrder = async (idToLoad) => {
    if (!idToLoad) return
    setLoading(true)
    setError('')
    try {
      const order = await orderService.getOrderById(idToLoad)
      if (order) {
        setCurrentOrder(order)
      } else {
        setCurrentOrder(null)
        setError(`No active order found with ID "${idToLoad}". Please verify your order number.`)
      }
    } catch (err) {
      setError('Could not retrieve order details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialOrderId) {
      setOrderIdInput(initialOrderId)
      loadOrder(initialOrderId)
    }
  }, [initialOrderId])

  useEffect(() => {
    if (!currentOrder?.id) return undefined
    return orderService.subscribeToOrder(currentOrder.id, (statusUpdate) => {
      setCurrentOrder((order) => order?.id === statusUpdate.id ? { ...order, status: statusUpdate.status, updatedAt: statusUpdate.updatedAt } : order)
    })
  }, [currentOrder?.id])

  const handleSearch = (e) => {
    e.preventDefault()
    if (orderIdInput.trim()) {
      loadOrder(orderIdInput.trim())
    }
  }

  // Normal steps progression
  const steps = [
    {
      status: ORDER_STATUS.PLACED,
      title: 'Order Placed',
      desc: 'Ticket received by kitchen',
      icon: Clock,
    },
    {
      status: ORDER_STATUS.ACCEPTED,
      title: 'Accepted',
      desc: 'Master Chef confirmed',
      icon: CheckCircle2,
    },
    {
      status: ORDER_STATUS.PREPARING,
      title: 'Preparing',
      desc: 'Sizzling on pan with fresh spices',
      icon: ChefHat,
    },
    {
      status: ORDER_STATUS.READY,
      title: 'Ready & Packed',
      desc: 'Thermal packaging sealed',
      icon: PackageCheck,
    },
    {
      status: ORDER_STATUS.COMPLETED,
      title: 'Delivered',
      desc: 'Delivered fresh & piping hot',
      icon: Bike,
    },
  ]

  const getCurrentStepIndex = () => {
    if (!currentOrder) return 0
    if (currentOrder.status === ORDER_STATUS.CANCELLED) return -1
    const idx = steps.findIndex((s) => s.status === currentOrder.status)
    return idx >= 0 ? idx : 0
  }

  const currentStepIndex = getCurrentStepIndex()
  const isCancelled = currentOrder?.status === ORDER_STATUS.CANCELLED

  return (
    <section id="track-order" className="py-16 bg-amber-50/40 border-t border-amber-100 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>Real-Time Order Tracking</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            Follow Your Food from the Tandoor
          </h2>
          <p className="mt-2 text-stone-600 text-sm">
            Enter your order number below to check instant live kitchen & delivery updates.
          </p>
        </div>

        {/* Lookup Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-md mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                placeholder="Enter the order ID from your confirmation"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                aria-label="Order ID to track"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Looking up...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Order</span>
                </>
              )}
            </button>
          </form>

        </div>

        {/* Error State */}
        {error && (
          <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 mb-8 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Order Not Found</p>
              <p className="text-xs text-rose-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Active Order Card */}
        {currentOrder && !error && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden animate-fadeIn">
            {/* Status Header */}
            <div className="p-6 sm:p-8 bg-stone-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono tracking-wider uppercase text-amber-400 font-semibold">
                    Live Order Tracker
                  </span>
                  <span className="text-stone-500">•</span>
                  <span className="text-xs text-stone-400">
                    Placed at {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-bold tracking-tight flex items-center gap-2">
                  <span>Order {currentOrder.id}</span>
                </h3>
              </div>

              {/* Status Pill */}
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wide border ${
                    STATUS_DETAILS[currentOrder.status]?.color || 'bg-amber-100 text-amber-900'
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      STATUS_DETAILS[currentOrder.status]?.dotColor || 'bg-amber-500'
                    } animate-pulse`}
                  />
                  {currentOrder.status}
                </span>
              </div>
            </div>

            {/* Cancelled Alert Banner */}
            {isCancelled && (
              <div className="bg-rose-50 border-b border-rose-200 p-4 text-center text-rose-900 flex items-center justify-center gap-2 text-sm font-semibold">
                <XCircle className="w-5 h-5 text-rose-600" />
                <span>This order was cancelled. If you have questions, please reach out to our kitchen.</span>
              </div>
            )}

            {/* Step Progress Bar (when not cancelled) */}
            {!isCancelled && (
              <div className="p-6 sm:p-8 border-b border-stone-100 bg-stone-50/40">
                <div className="relative">
                  {/* Connecting Line (Desktop) */}
                  <div className="hidden md:block absolute top-6 left-12 right-12 h-1 bg-stone-200 z-0">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-700"
                      style={{
                        width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Steps Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
                    {steps.map((step, idx) => {
                      const StepIcon = step.icon
                      const isPast = idx < currentStepIndex
                      const isCurrent = idx === currentStepIndex

                      return (
                        <div
                          key={step.status}
                          className="flex md:flex-col items-center md:text-center gap-4 md:gap-2"
                        >
                          {/* Step Icon Badge */}
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm shrink-0 ${
                              isPast
                                ? 'bg-emerald-600 text-white'
                                : isCurrent
                                ? 'bg-amber-500 text-white ring-4 ring-amber-200 animate-pulse'
                                : 'bg-stone-200 text-stone-400'
                            }`}
                          >
                            <StepIcon className="w-6 h-6" />
                          </div>

                          {/* Step Text */}
                          <div className="flex-1 md:flex-none">
                            <p
                              className={`text-sm font-bold ${
                                isCurrent
                                  ? 'text-amber-900'
                                  : isPast
                                  ? 'text-stone-900'
                                  : 'text-stone-400'
                              }`}
                            >
                              {step.title}
                            </p>
                            <p className="text-xs text-stone-500 leading-tight mt-0.5">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Order Items & Customer Details */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Items List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Order Summary
                </h4>
                <div className="border border-stone-200 rounded-2xl divide-y divide-stone-100 overflow-hidden">
                  {currentOrder.items.map((item, i) => (
                    <div key={i} className="p-3.5 flex items-center justify-between bg-stone-50/20">
                      <div>
                        <span className="font-semibold text-sm text-stone-800">
                          {item.name}
                        </span>
                        <span className="text-xs text-stone-400 ml-2">
                          (Qty: {item.quantity})
                        </span>
                      </div>
                      <span className="font-bold text-sm text-stone-900">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                  <div className="p-3.5 bg-stone-50 flex items-center justify-between font-bold text-sm text-stone-900">
                    <span>Grand Total</span>
                    <span className="text-base text-amber-800">₹{currentOrder.total}</span>
                  </div>
                </div>
              </div>

              {/* Private delivery details are available only to signed-in kitchen staff. */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">Delivery</h4>
                <p className="p-4 rounded-2xl border border-stone-200 bg-stone-50/30 text-xs text-stone-600">Your delivery details are kept private. The kitchen will contact you if they need anything.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
