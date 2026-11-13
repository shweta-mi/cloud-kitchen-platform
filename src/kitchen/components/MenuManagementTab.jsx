import React, { useState, useMemo } from 'react'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  RotateCcw,
  UtensilsCrossed,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'
import { CATEGORIES } from '../../customer/data/menuData'

export default function MenuManagementTab({
  menuItems,
  onToggleAvailability,
  onAddDish,
  onUpdateDish,
  onDeleteClick,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [stockFilter, setStockFilter] = useState('ALL') // ALL, IN_STOCK, SOLD_OUT

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDish, setEditingDish] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Main Course',
    price: '',
    isVeg: true,
    spiceLevel: 'Medium',
    isAvailable: true,
    badge: '',
    image: '',
  })
  const [formErrors, setFormErrors] = useState({})

  // Filter dishes
  const filteredDishes = useMemo(() => {
    return menuItems.filter((dish) => {
      // Category match
      const matchesCategory =
        categoryFilter === 'All' || dish.category === categoryFilter

      // Stock match
      const matchesStock =
        stockFilter === 'ALL'
          ? true
          : stockFilter === 'IN_STOCK'
          ? dish.isAvailable
          : !dish.isAvailable

      // Search match
      const q = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !q ||
        dish.name.toLowerCase().includes(q) ||
        dish.description.toLowerCase().includes(q) ||
        dish.category.toLowerCase().includes(q)

      return matchesCategory && matchesStock && matchesSearch
    })
  }, [menuItems, categoryFilter, stockFilter, searchQuery])

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingDish(null)
    setFormData({
      name: '',
      description: '',
      category: 'Main Course',
      price: '',
      isVeg: true,
      spiceLevel: 'Medium',
      isAvailable: true,
      badge: 'New',
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=700&q=80',
    })
    setFormErrors({})
    setIsModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEdit = (dish) => {
    setEditingDish(dish)
    setFormData({
      name: dish.name,
      description: dish.description,
      category: dish.category,
      price: dish.price.toString(),
      isVeg: dish.isVeg !== undefined ? dish.isVeg : true,
      spiceLevel: dish.spiceLevel || 'Medium',
      isAvailable: dish.isAvailable,
      badge: dish.badge || '',
      image: dish.image || '',
    })
    setFormErrors({})
    setIsModalOpen(true)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()

    const errors = {}
    if (!formData.name.trim()) errors.name = 'Dish name is required'
    if (!formData.description.trim()) errors.description = 'Description is required'
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      errors.price = 'Please enter a valid price in ₹'
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    const payload = {
      ...formData,
      price: Math.round(Number(formData.price)),
    }

    if (editingDish) {
      onUpdateDish(editingDish.id, payload)
    } else {
      onAddDish(payload)
    }

    setIsModalOpen(false)
  }

  const totalInStock = menuItems.filter((i) => i.isAvailable).length
  const totalSoldOut = menuItems.filter((i) => !i.isAvailable).length

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Bar with Add Dish Button & Stats */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-stone-900">
            Menu Dishes & Live Catalog
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage recipes, update prices in ₹, and toggle real-time kitchen availability
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Stats */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-stone-100">
            <span className="text-emerald-700">● {totalInStock} Available</span>
            <span className="text-stone-300">|</span>
            <span className="text-rose-700">● {totalSoldOut} Sold Out</span>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-amber-600/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Dish</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes by name, category, or ingredients..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
              aria-label="Search dishes"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400 hover:text-stone-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Availability Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setStockFilter('ALL')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                stockFilter === 'ALL'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All ({menuItems.length})
            </button>
            <button
              onClick={() => setStockFilter('IN_STOCK')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                stockFilter === 'IN_STOCK'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              In Stock ({totalInStock})
            </button>
            <button
              onClick={() => setStockFilter('SOLD_OUT')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                stockFilter === 'SOLD_OUT'
                  ? 'bg-white text-rose-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Sold Out ({totalSoldOut})
            </button>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = categoryFilter === cat
            const count =
              cat === 'All'
                ? menuItems.length
                : menuItems.filter((i) => i.category === cat).length

            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-amber-800 text-white' : 'bg-stone-200'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Dish Grid / List */}
      {filteredDishes.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-900 mb-1">
            No Dishes Found
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mb-4">
            No items match your search "{searchQuery}" in category "{categoryFilter}".
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setCategoryFilter('All')
              setStockFilter('ALL')
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map((dish) => (
            <div
              key={dish.id}
              className={`bg-white rounded-3xl border transition-all duration-200 shadow-sm overflow-hidden flex flex-col justify-between ${
                dish.isAvailable ? 'border-stone-200' : 'border-stone-200 bg-stone-50/60'
              }`}
            >
              {/* Dish Top Image & Status */}
              <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className={`w-full h-full object-cover transition-all ${
                    dish.isAvailable ? '' : 'grayscale-[40%] opacity-80'
                  }`}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="w-5 h-5 bg-white/95 rounded-sm border border-emerald-600 flex items-center justify-center shadow-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-900/80 backdrop-blur-xs text-white uppercase tracking-wider">
                    {dish.category}
                  </span>
                </div>

                {!dish.isAvailable && (
                  <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center">
                    <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-xs uppercase tracking-wider shadow-md">
                      Sold Out
                    </span>
                  </div>
                )}
              </div>

              {/* Dish Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-serif font-bold text-base text-stone-900 leading-snug">
                      {dish.name}
                    </h3>
                    <span className="font-mono font-bold text-base text-stone-900 shrink-0">
                      ₹{dish.price}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>
                </div>

                {/* Availability Toggle and Action Buttons */}
                <div className="pt-4 border-t border-stone-100 mt-4 space-y-3">
                  {/* Availability Toggle Row */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-700">
                      Kitchen Availability:
                    </span>
                    <button
                      onClick={() => onToggleAvailability(dish.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                        dish.isAvailable
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                      }`}
                      title="Click to toggle availability"
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          dish.isAvailable ? 'bg-emerald-600' : 'bg-rose-600'
                        }`}
                      />
                      <span>{dish.isAvailable ? 'In Stock' : 'Sold Out'}</span>
                    </button>
                  </div>

                  {/* Edit & Delete Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleOpenEdit(dish)}
                      className="flex-1 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Dish</span>
                    </button>
                    <button
                      onClick={() => onDeleteClick(dish)}
                      className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete dish"
                      aria-label={`Delete ${dish.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Dish Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-fadeIn">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-amber-50/50">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                {editingDish ? `Edit "${editingDish.name}"` : 'Add New Menu Dish'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {/* Dish Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Dish Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Tandoori Paneer Tikka"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {formErrors.name && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">{formErrors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Description *
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Appetizing description of ingredients and spices..."
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
                {formErrors.description && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">{formErrors.description}</p>
                )}
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="10"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="180"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                  {formErrors.price && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{formErrors.price}</p>
                  )}
                </div>
              </div>

              {/* Spice Level & Availability */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Spice Level
                  </label>
                  <select
                    value={formData.spiceLevel}
                    onChange={(e) => setFormData({ ...formData, spiceLevel: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="Mild">Mild</option>
                    <option value="Medium">Medium</option>
                    <option value="Spicy">Spicy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Initial Availability
                  </label>
                  <select
                    value={formData.isAvailable ? 'true' : 'false'}
                    onChange={(e) =>
                      setFormData({ ...formData, isAvailable: e.target.value === 'true' })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="true">In Stock</option>
                    <option value="false">Sold Out</option>
                  </select>
                </div>
              </div>

              {/* Image URL & Badge Tag */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Promo Tag (e.g. Bestseller)
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Chef Special"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
                >
                  {editingDish ? 'Update Dish' : 'Save Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
