import React, { useState } from 'react'
import { CheckCircle2, Clock, Copy, Check, ArrowRight, MapPin, Phone, ChefHat, Sparkles } from 'lucide-react'
import { STATUS_DETAILS } from '../constants/orderStatus'

export default function OrderConfirmation({ order, onTrackOrder, onClose }) {
  const [copied, setCopied] = useState(false)

  if (!order) return null

  const handleCopyId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(order.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const statusConfig = STATUS_DETAILS[order.status] || STATUS_DETAILS.Placed

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-title"
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-fadeIn">
        {/* Celebration Header */}
        <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-xl" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shadow-xl mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h2 id="confirmation-title" className="text-2xl sm:text-3xl font-serif font-bold">
              Order Placed with Rasoi Kitchen!
            </h2>
            <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-md">
              Your kitchen ticket has been dispatched. Our chefs are preparing your fresh meal.
            </p>
          </div>
        </div>

        {/* Order Details Body */}
        <div className="p-6 space-y-6">
          {/* Order ID & Status Banner */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                Order Reference
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg font-mono font-bold text-stone-900">{order.id}</span>
                <button
                  onClick={handleCopyId}
                  className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded text-xs transition-colors"
                  title="Copy Order ID"
                  aria-label="Copy Order ID"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>Status: {order.status}</span>
            </div>
          </div>

          {/* Shared Schema Items Summary */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Ordered Items
            </h3>
            <div className="border border-stone-200 rounded-2xl divide-y divide-stone-100 overflow-hidden">
              {order.items.map((item, index) => (
                <div key={index} className="p-3 sm:p-3.5 flex items-center justify-between bg-stone-50/30">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center">
                      {item.quantity}×
                    </span>
                    <span className="font-medium text-sm text-stone-800">{item.name}</span>
                  </div>
                  <span className="font-bold text-sm text-stone-900">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
              <div className="p-3 sm:p-3.5 bg-stone-50 flex items-center justify-between font-bold text-sm text-stone-900">
                <span>Total Amount (Paid via Delivery)</span>
                <span className="text-base text-amber-800">₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Customer Delivery Summary */}
          {order.customer && (
            <div className="p-4 rounded-2xl border border-stone-200 bg-white space-y-2 text-xs text-stone-600">
              <h4 className="font-bold uppercase tracking-wider text-stone-500 mb-1">
                Delivering To
              </h4>
              <p className="font-semibold text-stone-900 text-sm">{order.customer.name}</p>
              <p className="flex items-center gap-1.5 text-stone-600">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span>+91 {order.customer.phone}</span>
              </p>
              <p className="flex items-start gap-1.5 text-stone-600">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <span>{order.customer.address}</span>
              </p>
              {order.customer.instructions && (
                <p className="text-stone-500 italic mt-1 pt-1 border-t border-stone-100">
                  Note: "{order.customer.instructions}"
                </p>
              )}
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => onTrackOrder(order.id)}
              className="w-full sm:w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold text-sm shadow-lg shadow-orange-600/25 flex items-center justify-center gap-2 transition-all"
            >
              <Clock className="w-4 h-4" />
              <span>Track Live Order Status</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-1/3 py-3.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-semibold text-sm transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
