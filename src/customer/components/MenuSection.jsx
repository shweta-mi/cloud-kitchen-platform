import React, { useState, useMemo, useEffect } from 'react'
import { Search, Filter, RotateCcw, UtensilsCrossed, Sparkles } from 'lucide-react'
import MenuItemCard from './MenuItemCard'
import { MENU_ITEMS, CATEGORIES } from '../data/menuData'
import { menuService } from '../services/menuService'

export default function MenuSection() {
  const [menuItems, setMenuItems] = useState(MENU_ITEMS)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [vegOnly, setVegOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Subscribe to live menu updates from Kitchen Dashboard
  useEffect(() => {
    const unsubscribe = menuService.subscribe((updatedItems) => {
      setMenuItems(updatedItems)
    })
    menuService.getMenuItems().then(setMenuItems).catch((err) => console.error('Could not load menu', err))
    return () => unsubscribe()
  }, [])

  // Simulate sensible initial loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 350)
    return () => clearTimeout(timer)
  }, [])

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return menuItems.filter((dish) => {
      // Category match
      const matchesCategory =
        selectedCategory === 'All' || dish.category === selectedCategory

      // Search match
      const query = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !query ||
        dish.name.toLowerCase().includes(query) ||
        dish.description.toLowerCase().includes(query) ||
        dish.category.toLowerCase().includes(query)

      // Veg only match
      const matchesVeg = !vegOnly || dish.isVeg

      return matchesCategory && matchesSearch && matchesVeg
    })
  }, [menuItems, selectedCategory, searchQuery, vegOnly])

  const handleResetFilters = () => {
    setSelectedCategory('All')
    setSearchQuery('')
    setVegOnly(false)
  }

  return (
    <section id="menu" className="py-16 bg-white/60 border-t border-amber-100/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Our Fresh Menu</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            Homestyle Delicacies, Made to Order
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base">
            Every dish is prepared upon order with authentic regional recipes and cold-pressed spices.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes (e.g., Paneer Roll, Biryani, Chai)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-stone-50/50"
                aria-label="Search dishes"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400 hover:text-stone-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Veg Only Toggle */}
            <div className="flex items-center gap-3 shrink-0">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-stone-700 select-none">
                <input
                  type="checkbox"
                  checked={vegOnly}
                  onChange={(e) => setVegOnly(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-9 h-5 rounded-full transition-colors relative ${
                    vegOnly ? 'bg-emerald-600' : 'bg-stone-300'
                  }`}
                >
                  <span
                    className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 ${
                      vegOnly ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 border border-emerald-600 rounded-sm flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  </span>
                  <span>Pure Veg Only</span>
                </div>
              </label>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat
              const count =
                cat === 'All'
                  ? menuItems.length
                  : menuItems.filter((i) => i.category === cat).length

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                  aria-pressed={isActive}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-amber-700 text-amber-100' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-stone-500 mb-6 px-1">
          <span>
            Showing <strong className="text-stone-800">{filteredDishes.length}</strong> delicious items
          </span>
          {(selectedCategory !== 'All' || searchQuery || vegOnly) && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-800 font-semibold hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Loading Skeleton State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="rounded-2xl border border-stone-200 bg-white overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-stone-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-stone-200 rounded w-3/4" />
                  <div className="h-4 bg-stone-100 rounded w-full" />
                  <div className="h-4 bg-stone-100 rounded w-2/3" />
                  <div className="pt-4 flex justify-between items-center">
                    <div className="h-6 bg-stone-200 rounded w-16" />
                    <div className="h-9 bg-stone-200 rounded-xl w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDishes.length > 0 ? (
          /* Dish Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((dish) => (
              <MenuItemCard key={dish.id} dish={dish} />
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-stone-200/80 shadow-sm max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">
              No Dishes Found
            </h3>
            <p className="text-stone-500 text-sm max-w-md mx-auto mb-6">
              We couldn't find any dishes matching "{searchQuery}" in category "{selectedCategory}". Try adjusting your keywords or clearing your filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white font-semibold text-sm hover:bg-amber-700 shadow-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
