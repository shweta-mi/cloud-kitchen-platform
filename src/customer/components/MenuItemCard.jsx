import React from 'react'
import { Plus, Minus, Star, AlertCircle, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function MenuItemCard({ dish }) {
  const { items, addToCart, updateQuantity } = useCart()

  const cartItem = items.find((i) => i.id === dish.id)
  const quantityInCart = cartItem ? cartItem.quantity : 0

  return (
    <article
      className={`group rounded-2xl bg-white border transition-all duration-300 flex flex-col overflow-hidden ${
        dish.isAvailable
          ? 'border-stone-200/80 shadow-sm hover:shadow-xl hover:border-amber-300 hover:-translate-y-1'
          : 'border-stone-200 opacity-75 bg-stone-50/50'
      }`}
      aria-label={`${dish.name}, ₹${dish.price}, ${dish.category}`}
    >
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-stone-100">
        <img
          src={dish.image}
          alt={dish.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 ${
            dish.isAvailable ? 'group-hover:scale-105' : 'grayscale-[40%]'
          }`}
          onError={(e) => {
            // Graceful fallback to colored stylized plate if external image doesn't load
            e.currentTarget.style.display = 'none'
            e.currentTarget.parentElement.classList.add(
              'bg-gradient-to-br',
              'from-amber-100',
              'to-orange-100',
              'flex',
              'items-center',
              'justify-center'
            )
          }}
        />

        {/* Unavailable overlay badge */}
        {!dish.isAvailable && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center p-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg">
              <AlertCircle className="w-3.5 h-3.5" />
              Sold Out Today
            </span>
          </div>
        )}

        {/* Badges on Top */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Veg Indicator */}
          <div className="w-5 h-5 rounded-sm bg-white/95 backdrop-blur-sm border border-emerald-600 flex items-center justify-center shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          </div>

          {/* Promotional Tag */}
          {dish.badge && dish.isAvailable && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-sm">
              {dish.badge}
            </span>
          )}
        </div>

        {/* Category Pill at bottom left of image */}
        <div className="absolute bottom-2 left-3">
          <span className="px-2 py-0.5 rounded-md bg-stone-900/80 backdrop-blur-sm text-stone-200 text-[10px] font-semibold tracking-wide uppercase">
            {dish.category}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Rating */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 leading-snug group-hover:text-amber-800 transition-colors">
              {dish.name}
            </h3>
            {dish.rating && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-xs font-bold shrink-0">
                <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                <span>{dish.rating}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-stone-500 line-clamp-2 leading-relaxed mb-4">
            {dish.description}
          </p>
        </div>

        {/* Price & Action Button Footer */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-stone-400 block font-medium">Price</span>
            <span className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
              ₹{dish.price}
            </span>
          </div>

          {/* Add to cart / Quantity controls */}
          <div>
            {!dish.isAvailable ? (
              <button
                disabled
                className="px-3.5 py-2 rounded-xl bg-stone-200 text-stone-400 font-semibold text-xs cursor-not-allowed"
                aria-disabled="true"
              >
                Unavailable
              </button>
            ) : quantityInCart > 0 ? (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-xl p-1 shadow-inner">
                <button
                  onClick={() => updateQuantity(dish.id, quantityInCart - 1)}
                  className="w-7 h-7 rounded-lg bg-white text-stone-700 hover:text-amber-700 hover:bg-amber-100 flex items-center justify-center font-bold text-sm shadow-sm transition-colors active:scale-90"
                  aria-label={`Decrease quantity of ${dish.name}`}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center font-bold text-sm text-amber-950">
                  {quantityInCart}
                </span>
                <button
                  onClick={() => addToCart(dish)}
                  className="w-7 h-7 rounded-lg bg-amber-600 text-white hover:bg-amber-700 flex items-center justify-center font-bold text-sm shadow-sm transition-colors active:scale-90"
                  aria-label={`Increase quantity of ${dish.name}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(dish)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-amber-600/20 active:scale-95 transition-all"
                aria-label={`Add ${dish.name} to cart`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
