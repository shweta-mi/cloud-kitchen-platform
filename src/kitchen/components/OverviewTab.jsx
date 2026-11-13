import React from 'react'
import {
  Bell,
  Clock,
  CheckCircle2,
  ChefHat,
  PackageCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Utensils,
  Layers,
} from 'lucide-react'
import { ORDER_STATUS } from '../../customer/constants/orderStatus'
import { KITCHEN_STATUS, KITCHEN_STATUS_CONFIG } from '../constants/kitchenStatus'

export default function OverviewTab({
  orders,
  kitchenStatus,
  onStatusChange,
  onNavigateTab,
  onAdvanceOrder,
  onCancelClick,
  lowStockCount = 0,
}) {
  // Counts
  const newOrders = orders.filter((o) => o.status === ORDER_STATUS.PLACED)
  const activeOrders = orders.filter((o) =>
    [ORDER_STATUS.ACCEPTED, ORDER_STATUS.PREPARING, ORDER_STATUS.READY].includes(o.status)
  )
  const completedOrders = orders.filter((o) => o.status === ORDER_STATUS.COMPLETED)
  const cancelledOrders = orders.filter((o) => o.status === ORDER_STATUS.CANCELLED)

  const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.total || 0), 0)

  const currentKitchenConfig =
    KITCHEN_STATUS_CONFIG[kitchenStatus] || KITCHEN_STATUS_CONFIG[KITCHEN_STATUS.OPEN]

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Alert if New Orders are waiting */}
      {newOrders.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Bell className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {newOrders.length} New {newOrders.length === 1 ? 'Order' : 'Orders'} Awaiting Kitchen Acceptance!
              </h3>
              <p className="text-xs text-amber-100">
                Customers are waiting for confirmation. Accept incoming tickets to start food preparation.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-5 py-2.5 rounded-xl bg-white text-stone-900 hover:bg-stone-100 font-bold text-xs uppercase tracking-wider shrink-0 transition-all flex items-center gap-2 shadow-sm"
          >
            <span>Open Order Queue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Low Stock Warning Banner */}
      {lowStockCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-xs sm:text-sm">
              <strong className="font-bold">{lowStockCount} raw materials / supplies</strong> are below reorder threshold.
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('inventory')}
            className="text-xs font-bold text-amber-800 hover:text-amber-950 underline shrink-0"
          >
            View Inventory →
          </button>
        </div>
      )}

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: New Orders */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              New Orders (Placed)
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold font-serif text-stone-900">
              {newOrders.length}
            </span>
            {newOrders.length > 0 && (
              <span className="text-xs font-semibold text-amber-600 animate-pulse">
                Needs Action
              </span>
            )}
          </div>
          <p className="text-xs text-stone-400 mt-2 flex items-center justify-between">
            <span>Incoming tickets</span>
            <span className="text-amber-600 group-hover:translate-x-1 transition-transform">
              View queue →
            </span>
          </p>
        </div>

        {/* Card 2: Active in Kitchen */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-orange-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Active in Kitchen
            </span>
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ChefHat className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold font-serif text-stone-900">
              {activeOrders.length}
            </span>
            <span className="text-xs font-semibold text-orange-600">
              On stoves / packing
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-2 flex items-center justify-between">
            <span>Accepted • Preparing • Ready</span>
            <span className="text-orange-600 group-hover:translate-x-1 transition-transform">
              Manage →
            </span>
          </p>
        </div>

        {/* Card 3: Completed Orders */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Completed Orders
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold font-serif text-stone-900">
              {completedOrders.length}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              Fulfilled
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-2 flex items-center justify-between">
            <span>Dispatched hot & fresh</span>
            <span className="text-emerald-600 group-hover:translate-x-1 transition-transform">
              History →
            </span>
          </p>
        </div>

        {/* Card 4: Kitchen Status */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Kitchen Operating Status
            </span>
            <span className={`w-3 h-3 rounded-full ${currentKitchenConfig.dotColor} animate-pulse`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-serif text-stone-900">
                {kitchenStatus}
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${currentKitchenConfig.color}`}
              >
                {currentKitchenConfig.badgeText}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1 line-clamp-1">
              {currentKitchenConfig.desc}
            </p>
          </div>
          <div className="pt-3 border-t border-stone-100 mt-3 flex items-center gap-1.5">
            {Object.values(KITCHEN_STATUS).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => onStatusChange(status)}
                className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                  kitchenStatus === status
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders In Progress Quick Feed & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Tickets Queue Preview */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-lg font-serif font-bold text-stone-900">
                Active Kitchen Orders ({newOrders.length + activeOrders.length})
              </h3>
              <p className="text-xs text-stone-500">
                Tickets requiring cooking, packaging, or customer delivery dispatch
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              <span>Full Order Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {newOrders.length === 0 && activeOrders.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-stone-800 text-sm">All Kitchen Orders Clear!</h4>
              <p className="text-xs text-stone-500 mt-1">
                No tickets currently waiting. The stoves and counters are prepped for new orders.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...newOrders, ...activeOrders].slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-amber-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-stone-900 text-sm">
                        {order.id}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                          order.status === ORDER_STATUS.PLACED
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : order.status === ORDER_STATUS.ACCEPTED
                            ? 'bg-blue-100 text-blue-900 border-blue-300'
                            : order.status === ORDER_STATUS.PREPARING
                            ? 'bg-orange-100 text-orange-900 border-orange-300'
                            : 'bg-purple-100 text-purple-900 border-purple-300'
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>

                    <div className="text-xs text-stone-700 font-medium">
                      {order.items.map((i) => `${i.name} (×${i.quantity})`).join(', ')}
                    </div>

                    {order.customer?.name && (
                      <p className="text-[11px] text-stone-500">
                        For: <strong className="text-stone-700">{order.customer.name}</strong> • ₹{order.total}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onAdvanceOrder(order.id)}
                      className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shadow-xs"
                    >
                      {order.status === ORDER_STATUS.PLACED
                        ? 'Accept Order'
                        : order.status === ORDER_STATUS.ACCEPTED
                        ? 'Start Preparing'
                        : order.status === ORDER_STATUS.PREPARING
                        ? 'Mark Ready'
                        : 'Dispatch'}
                    </button>
                    {order.status === ORDER_STATUS.PLACED && (
                      <button
                        onClick={() => onCancelClick(order)}
                        className="px-2.5 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Distribution & Kitchen Quick Stats */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>Status Distribution</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2 rounded-xl bg-amber-50">
                <span className="font-semibold text-amber-900">Placed (Pending)</span>
                <span className="font-bold text-amber-950 font-mono">{newOrders.length}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-blue-50">
                <span className="font-semibold text-blue-900">Accepted</span>
                <span className="font-bold text-blue-950 font-mono">
                  {orders.filter((o) => o.status === ORDER_STATUS.ACCEPTED).length}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-orange-50">
                <span className="font-semibold text-orange-900">Preparing</span>
                <span className="font-bold text-orange-950 font-mono">
                  {orders.filter((o) => o.status === ORDER_STATUS.PREPARING).length}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-purple-50">
                <span className="font-semibold text-purple-900">Ready for Delivery</span>
                <span className="font-bold text-purple-950 font-mono">
                  {orders.filter((o) => o.status === ORDER_STATUS.READY).length}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-emerald-50">
                <span className="font-semibold text-emerald-900">Completed</span>
                <span className="font-bold text-emerald-950 font-mono">{completedOrders.length}</span>
              </div>
              {cancelledOrders.length > 0 && (
                <div className="flex justify-between items-center p-2 rounded-xl bg-rose-50">
                  <span className="font-semibold text-rose-900">Cancelled</span>
                  <span className="font-bold text-rose-950 font-mono">{cancelledOrders.length}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-between items-center text-sm font-bold text-stone-900">
              <span>Total Platform Orders:</span>
              <span className="font-mono text-base">{orders.length}</span>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-stone-900 text-white rounded-3xl p-6 shadow-md space-y-3">
            <h4 className="font-serif font-bold text-base text-amber-400">
              Kitchen Shortcuts
            </h4>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => onNavigateTab('menu')}
                className="w-full text-left p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 transition-colors flex items-center justify-between"
              >
                <span>Manage Menu Dishes & Stock</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </button>
              <button
                onClick={() => onNavigateTab('inventory')}
                className="w-full text-left p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 transition-colors flex items-center justify-between"
              >
                <span>Raw Material Inventory</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
