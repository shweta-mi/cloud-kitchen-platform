import React, { useState, useMemo } from 'react'
import {
  Search,
  Filter,
  Clock,
  Phone,
  MapPin,
  CheckCircle2,
  ChefHat,
  PackageCheck,
  Bike,
  XCircle,
  AlertCircle,
  ArrowRight,
  FileText,
  User,
  RotateCcw,
} from 'lucide-react'
import { ORDER_STATUS, ORDER_STATUS_LIST, STATUS_DETAILS } from '../../customer/constants/orderStatus'

export default function OrderQueueTab({
  orders,
  onUpdateStatus,
  onAdvanceOrder,
  onCancelClick,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      const matchesStatus =
        statusFilter === 'ALL' || order.status === statusFilter

      // Search filter
      const q = searchQuery.trim().toLowerCase()
      const matchesQuery =
        !q ||
        order.id.toLowerCase().includes(q) ||
        (order.customer?.name && order.customer.name.toLowerCase().includes(q)) ||
        (order.customer?.phone && order.customer.phone.includes(q)) ||
        (order.items &&
          order.items.some((item) => item.name.toLowerCase().includes(q)))

      return matchesStatus && matchesQuery
    })
  }, [orders, statusFilter, searchQuery])

  // Get next step label
  const getNextAction = (status) => {
    switch (status) {
      case ORDER_STATUS.PLACED:
        return { label: 'Accept Order', nextStatus: ORDER_STATUS.ACCEPTED, color: 'bg-blue-600 hover:bg-blue-700' }
      case ORDER_STATUS.ACCEPTED:
        return { label: 'Start Preparing', nextStatus: ORDER_STATUS.PREPARING, color: 'bg-orange-600 hover:bg-orange-700' }
      case ORDER_STATUS.PREPARING:
        return { label: 'Mark Ready', nextStatus: ORDER_STATUS.READY, color: 'bg-purple-600 hover:bg-purple-700' }
      case ORDER_STATUS.READY:
        return { label: 'Mark Completed', nextStatus: ORDER_STATUS.COMPLETED, color: 'bg-emerald-600 hover:bg-emerald-700' }
      default:
        return null
    }
  }

  // Format relative elapsed time
  const getElapsedTime = (isoString) => {
    if (!isoString) return ''
    const diffMs = Date.now() - new Date(isoString).getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    return `${diffHours}h ${diffMins % 60}m ago`
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header controls: Search & Status Filters */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID (e.g. order-123), Customer Name, or Phone..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
              aria-label="Search orders"
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

          <div className="text-xs text-stone-500 font-medium shrink-0">
            Showing <strong className="text-stone-900">{filteredOrders.length}</strong> of{' '}
            {orders.length} tickets
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              statusFilter === 'ALL'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <span>All Orders</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${statusFilter === 'ALL' ? 'bg-stone-700 text-white' : 'bg-stone-200'}`}>
              {orders.length}
            </span>
          </button>

          {ORDER_STATUS_LIST.map((status) => {
            const count = orders.filter((o) => o.status === status).length
            const isActive = statusFilter === status
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <span>{status}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-amber-800 text-white' : 'bg-stone-200'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-900 mb-1">
            No Orders Found
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mb-4">
            No kitchen tickets match your search "{searchQuery}" or status filter "{statusFilter}".
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setStatusFilter('ALL')
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrders.map((order) => {
            const nextAction = getNextAction(order.status)
            const statusConfig = STATUS_DETAILS[order.status] || STATUS_DETAILS.Placed
            const isCompleted = order.status === ORDER_STATUS.COMPLETED
            const isCancelled = order.status === ORDER_STATUS.CANCELLED

            return (
              <div
                key={order.id}
                className={`bg-white rounded-3xl border transition-all duration-200 shadow-sm overflow-hidden flex flex-col justify-between ${
                  order.status === ORDER_STATUS.PLACED
                    ? 'border-amber-300 ring-2 ring-amber-100'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                {/* Order Card Top Bar */}
                <div className="p-5 border-b border-stone-100 bg-stone-50/50 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-lg text-stone-900">
                        {order.id}
                      </span>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${statusConfig.color}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-stone-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        Placed at{' '}
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : 'Recent'}
                      </span>
                      <span>•</span>
                      <span className="font-medium text-stone-600">
                        {getElapsedTime(order.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Total Bill Badge */}
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">
                      Total Bill
                    </span>
                    <span className="text-lg font-bold text-stone-900 font-mono">
                      ₹{order.total}
                    </span>
                  </div>
                </div>

                {/* Items & Ingredients To Prepare */}
                <div className="p-5 space-y-4 flex-1">
                  <div>
                    <h4 className="text-[11px] uppercase tracking-wider font-bold text-stone-400 mb-2">
                      Kitchen Items ({order.items.reduce((s, i) => s + (i.quantity || 1), 0)} items)
                    </h4>
                    <div className="border border-stone-100 rounded-2xl divide-y divide-stone-100 bg-stone-50/30 overflow-hidden text-xs">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0">
                              {item.quantity}×
                            </span>
                            <span className="font-semibold text-stone-800 text-sm">
                              {item.name}
                            </span>
                          </div>
                          <span className="font-mono text-stone-600 font-semibold">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Delivery Details */}
                  {order.customer && (
                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/60 text-xs text-stone-600 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-stone-900">
                          <User className="w-3.5 h-3.5 text-stone-400" />
                          <span>{order.customer.name}</span>
                        </div>
                        {order.customer.phone && (
                          <a
                            href={`tel:${order.customer.phone}`}
                            className="flex items-center gap-1 text-amber-700 hover:underline font-mono font-semibold"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{order.customer.phone}</span>
                          </a>
                        )}
                      </div>

                      {order.customer.address && (
                        <p className="flex items-start gap-1 text-stone-600 text-[11px] leading-relaxed">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                          <span>{order.customer.address}</span>
                        </p>
                      )}

                      {order.customer.instructions && (
                        <div className="p-2 rounded-lg bg-amber-100/60 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-1.5 mt-1">
                          <FileText className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                          <span>Chef note: <strong>"{order.customer.instructions}"</strong></span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Actions Bar */}
                <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50/70 flex flex-wrap items-center justify-between gap-3">
                  {/* Status Dropdown to switch to any status directly */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-stone-400 font-semibold text-[11px] hidden sm:inline">
                      Set Status:
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl border border-stone-300 bg-white text-stone-800 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                      aria-label="Change order status"
                    >
                      {ORDER_STATUS_LIST.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Primary Step Workflow Button */}
                  <div className="flex items-center gap-2">
                    {nextAction && (
                      <button
                        onClick={() => onUpdateStatus(order.id, nextAction.nextStatus)}
                        className={`px-4 py-2 rounded-xl text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 ${nextAction.color}`}
                      >
                        <span>{nextAction.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {!isCompleted && !isCancelled && (
                      <button
                        onClick={() => onCancelClick(order)}
                        className="px-3 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
