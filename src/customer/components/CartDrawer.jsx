import React, { useEffect } from 'react'
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function CartDrawer({ onProceedToCheckout }) {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    subtotal,
    deliveryFee,
    taxes,
    grandTotal,
  } = useCart()

  // Handle ESC key to close cart
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCartOpen, setIsCartOpen])

  // Prevent body scroll when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isCartOpen])

  if (!isCartOpen) return null

  const freeDeliveryThreshold = 300
  const amountForFreeDelivery = freeDeliveryThreshold - subtotal

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Shopping Cart">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full animate-slideInRight">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-stone-900">Your Basket</h2>
                <p className="text-xs text-stone-500 font-medium">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} from Rasoi Kitchen
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-stone-400 hover:text-rose-600 font-medium px-2 py-1 rounded hover:bg-rose-50 transition-colors"
                  title="Clear Cart"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Delivery Promo Banner */}
          {items.length > 0 && (
            <div className="bg-amber-50 px-4 py-2.5 border-b border-amber-100/80 text-xs text-amber-900 flex items-center justify-between">
              {amountForFreeDelivery > 0 ? (
                <span>
                  Add <strong className="font-bold">₹{amountForFreeDelivery}</strong> more for{' '}
                  <strong className="text-emerald-700">Free Delivery</strong>!
                </span>
              ) : (
                <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Yay! You unlocked FREE Delivery!
                </span>
              )}
              <span className="font-bold text-[11px] bg-amber-200/80 px-2 py-0.5 rounded-full">
                30 Mins
              </span>
            </div>
          )}

          {/* Cart Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              /* Empty Cart State */
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-4 border border-amber-200/60 shadow-inner">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <h3 className="font-serif font-bold text-xl text-stone-900 mb-1">
                  Your basket is empty
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 max-w-xs mb-6">
                  Good food is always cooking at Rasoi Kitchen. Explore our curries, rolls, and snacks!
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false)
                    const el = document.getElementById('menu')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="px-6 py-3 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-md shadow-amber-600/25 transition-all"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              /* Itemized List */
              <ul className="space-y-3 divide-y divide-stone-100" role="list">
                {items.map((item) => (
                  <li key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                    {/* Item Image */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 border border-emerald-600 rounded-xs flex items-center justify-center shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        </span>
                        <h4 className="font-medium text-sm text-stone-900 truncate">
                          {item.name}
                        </h4>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">₹{item.price} each</p>
                    </div>

                    {/* Quantity Modifier */}
                    <div className="flex items-center gap-2 bg-stone-100 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded bg-white text-stone-700 hover:bg-stone-200 flex items-center justify-center text-xs font-bold shadow-xs active:scale-90"
                        aria-label={`Reduce quantity of ${item.name}`}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded bg-white text-stone-700 hover:bg-stone-200 flex items-center justify-center text-xs font-bold shadow-xs active:scale-90"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Line Total & Delete */}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-stone-900">
                        ₹{item.price * item.quantity}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-rose-600 text-xs p-1"
                        aria-label={`Remove ${item.name} from basket`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer Bill & Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/70 space-y-4">
              {/* Bill Details */}
              <div className="space-y-1.5 text-xs sm:text-sm text-stone-600">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-stone-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-semibold uppercase text-xs">
                        FREE
                      </span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & Restaurant GST (5%)</span>
                  <span>₹{taxes}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-bold text-stone-900">
                  <span>To Pay</span>
                  <span className="text-amber-800 text-lg">₹{grandTotal}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false)
                  if (onProceedToCheckout) onProceedToCheckout()
                }}
                className="w-full flex items-center justify-between px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold text-base shadow-lg shadow-orange-600/20 active:scale-98 transition-all"
              >
                <div className="flex flex-col text-left">
                  <span className="text-xs uppercase tracking-wider text-amber-200 font-bold">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'}
                  </span>
                  <span className="text-lg font-bold">₹{grandTotal}</span>
                </div>
                <span className="inline-flex items-center gap-1.5 font-bold">
                  Checkout
                  <ArrowRight className="w-5 h-5" />
                </span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Simulated Order • No real payment required</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
