import React, { useState, useMemo } from 'react'
import {
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Package,
  Minus,
  Edit3,
  Trash2,
  X,
  RotateCcw,
  TrendingDown,
  Layers,
} from 'lucide-react'

export default function InventoryTab({
  inventory,
  onAdjustQuantity,
  onUpdateQuantity,
  onAddItem,
  onDeleteItem,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMode, setFilterMode] = useState('ALL') // 'ALL' or 'LOW_STOCK'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    category: 'Produce',
    quantity: '',
    unit: 'kg',
    minThreshold: '5',
  })
  const [formErrors, setFormErrors] = useState({})

  // Filter items
  const filteredItems = useMemo(() => {
    return inventory.filter((item) => {
      const isLowStock = item.quantity <= item.minThreshold
      if (filterMode === 'LOW_STOCK' && !isLowStock) return false

      const q = searchQuery.trim().toLowerCase()
      if (!q) return true

      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.unit.toLowerCase().includes(q)
      )
    })
  }, [inventory, filterMode, searchQuery])

  const lowStockItems = inventory.filter((i) => i.quantity <= i.minThreshold)

  const handleOpenAdd = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      category: 'Produce',
      quantity: '',
      unit: 'kg',
      minThreshold: '5',
    })
    setFormErrors({})
    setIsAddModalOpen(true)
  }

  const handleOpenEdit = (item) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity.toString(),
      unit: item.unit,
      minThreshold: item.minThreshold.toString(),
    })
    setFormErrors({})
    setIsAddModalOpen(true)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const errors = {}
    if (!formData.name.trim()) errors.name = 'Item name is required'
    if (formData.quantity === '' || isNaN(Number(formData.quantity)) || Number(formData.quantity) < 0) {
      errors.quantity = 'Please enter a valid stock quantity'
    }
    if (
      formData.minThreshold === '' ||
      isNaN(Number(formData.minThreshold)) ||
      Number(formData.minThreshold) < 0
    ) {
      errors.minThreshold = 'Please enter a valid reorder threshold'
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      minThreshold: Number(formData.minThreshold),
    }

    if (editingItem) {
      onUpdateQuantity(editingItem.id, payload.quantity)
    } else {
      onAddItem(payload)
    }

    setIsAddModalOpen(false)
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Controls Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-stone-900">
            Kitchen Raw Materials & Inventory
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor real-time ingredients, dairy, packaging, and restock thresholds
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Low Stock Counter Badge */}
          <button
            onClick={() => setFilterMode(filterMode === 'LOW_STOCK' ? 'ALL' : 'LOW_STOCK')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
              filterMode === 'LOW_STOCK'
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                : lowStockItems.length > 0
                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                : 'bg-stone-100 text-stone-600 border-stone-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{lowStockItems.length} Low Stock Alerts</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-amber-600/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Stock Item</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ingredients, packaging, or categories..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
            aria-label="Search inventory"
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'ALL'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Items ({inventory.length})
          </button>
          <button
            onClick={() => setFilterMode('LOW_STOCK')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterMode === 'LOW_STOCK'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Low Stock ({lowStockItems.length})</span>
          </button>
        </div>
      </div>

      {/* Inventory Items List / Table */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-900 mb-1">
            No Inventory Items Found
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mb-4">
            No supplies match your search query or filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setFilterMode('ALL')
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset View</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-bold text-[11px]">
                <tr>
                  <th className="py-4 px-6">Item & Category</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4 text-right">In Stock</th>
                  <th className="py-4 px-4 text-right">Reorder Threshold</th>
                  <th className="py-4 px-6 text-center">Stock Adjustment</th>
                  <th className="py-4 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredItems.map((item) => {
                  const isLow = item.quantity <= item.minThreshold
                  const percentage = Math.min(
                    100,
                    Math.round((item.quantity / (item.minThreshold * 2.5)) * 100)
                  )

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-amber-50/30 transition-colors ${
                        isLow ? 'bg-rose-50/20' : ''
                      }`}
                    >
                      {/* Name & Category */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-stone-900 text-sm">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-stone-500 font-medium">
                          {item.category} • Last restocked: {item.lastRestocked || 'Recent'}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4 text-center">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Adequate
                          </span>
                        )}
                      </td>

                      {/* Current Quantity */}
                      <td className="py-4 px-4 text-right">
                        <div className="font-mono font-bold text-base text-stone-900">
                          {item.quantity}{' '}
                          <span className="text-xs font-normal text-stone-500">
                            {item.unit}
                          </span>
                        </div>
                        <div className="w-24 ml-auto h-1.5 bg-stone-100 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full ${
                              isLow ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </td>

                      {/* Reorder Threshold */}
                      <td className="py-4 px-4 text-right font-mono text-stone-500 text-xs">
                        Min: {item.minThreshold} {item.unit}
                      </td>

                      {/* Quick Adjust Buttons */}
                      <td className="py-4 px-6 text-center">
                        <div className="inline-flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl">
                          <button
                            onClick={() => onAdjustQuantity(item.id, -1)}
                            className="w-7 h-7 rounded-lg bg-white text-stone-700 hover:bg-stone-200 flex items-center justify-center font-bold text-xs shadow-xs active:scale-90"
                            title="Decrement stock"
                            aria-label={`Decrease ${item.name} quantity`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center font-bold font-mono text-xs text-stone-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onAdjustQuantity(item.id, 1)}
                            className="w-7 h-7 rounded-lg bg-white text-stone-700 hover:bg-stone-200 flex items-center justify-center font-bold text-xs shadow-xs active:scale-90"
                            title="Increment stock"
                            aria-label={`Increase ${item.name} quantity`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
                            title="Edit Stock Item"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteItem(item)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                            title="Delete Stock Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Inventory Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-fadeIn">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-amber-50/50">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                {editingItem ? `Update Stock for "${editingItem.name}"` : 'Add Raw Material / Supply'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  disabled={Boolean(editingItem)}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Kashmiri Chili Powder"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-stone-100"
                />
                {formErrors.name && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">{formErrors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Category
                  </label>
                  <select
                    disabled={Boolean(editingItem)}
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white disabled:bg-stone-100"
                  >
                    <option value="Dairy & Fresh">Dairy & Fresh</option>
                    <option value="Grains & Pulses">Grains & Pulses</option>
                    <option value="Bakery & Dough">Bakery & Dough</option>
                    <option value="Spices & Condiments">Spices & Condiments</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Beverage Ingredients">Beverage Ingredients</option>
                    <option value="Produce">Produce</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Unit of Measure
                  </label>
                  <select
                    disabled={Boolean(editingItem)}
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white disabled:bg-stone-100"
                  >
                    <option value="kg">kg (Kilograms)</option>
                    <option value="packs">packs</option>
                    <option value="units">units (boxes/glasses)</option>
                    <option value="tins">tins / cans</option>
                    <option value="bunches">bunches</option>
                    <option value="L">L (Litres)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Current Quantity *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="15"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                  {formErrors.quantity && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{formErrors.quantity}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Min Reorder Alert *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    disabled={Boolean(editingItem)}
                    value={formData.minThreshold}
                    onChange={(e) => setFormData({ ...formData, minThreshold: e.target.value })}
                    placeholder="5"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono disabled:bg-stone-100"
                  />
                  {formErrors.minThreshold && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{formErrors.minThreshold}</p>
                  )}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
                >
                  {editingItem ? 'Update Quantity' : 'Save Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
