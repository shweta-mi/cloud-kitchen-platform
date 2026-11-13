import React, { useState, useEffect } from 'react'
import {
  Layers,
  ChefHat,
  UtensilsCrossed,
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sliders,
} from 'lucide-react'
import KitchenHeader from './components/KitchenHeader'
import OverviewTab from './components/OverviewTab'
import OrderQueueTab from './components/OrderQueueTab'
import MenuManagementTab from './components/MenuManagementTab'
import InventoryTab from './components/InventoryTab'
import ConfirmationModal from './components/ConfirmationModal'
import KitchenLogin from './components/KitchenLogin'
import { authService } from './services/authService'

import { orderService } from '../customer/services/orderService'
import { menuService } from '../customer/services/menuService'
import { kitchenService } from './services/kitchenService'
import { inventoryService } from './services/inventoryService'
import { ORDER_STATUS } from '../customer/constants/orderStatus'
import { KITCHEN_STATUS } from './constants/kitchenStatus'

function KitchenDashboardContent({ onSwitchToCustomer, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'orders' | 'menu' | 'inventory'

  // Live state
  const [orders, setOrders] = useState([])
  const [kitchenStatus, setKitchenStatus] = useState(KITCHEN_STATUS.OPEN)
  const [menuItems, setMenuItems] = useState([])
  const [inventory, setInventory] = useState([])

  // Toast / Status notification
  const [toastMessage, setToastMessage] = useState('')

  // Confirmation Modals
  const [cancelOrderTarget, setCancelOrderTarget] = useState(null)
  const [deleteDishTarget, setDeleteDishTarget] = useState(null)
  const [deleteInventoryTarget, setDeleteInventoryTarget] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3500)
  }

  // Load and subscribe to live data
  useEffect(() => {
    // Orders
    orderService.getOrders().then(setOrders)
    kitchenService.getStatus().then(setKitchenStatus)
    menuService.getMenuItems().then(setMenuItems)
    inventoryService.getInventory().then(setInventory)
    const unsubOrders = orderService.subscribe((updatedOrders) => {
      setOrders(updatedOrders)
    })

    // Kitchen Status
    const unsubStatus = kitchenService.subscribe((updatedStatus) => {
      setKitchenStatus(updatedStatus)
    })

    // Menu
    const unsubMenu = menuService.subscribe((updatedMenu) => {
      setMenuItems(updatedMenu)
    })

    // Inventory
    const unsubInventory = inventoryService.subscribe((updatedInv) => {
      setInventory(updatedInv)
    })

    return () => {
      unsubOrders()
      unsubStatus()
      unsubMenu()
      unsubInventory()
    }
  }, [])

  // Handlers for Orders
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const updated = await orderService.updateOrderStatus(orderId, newStatus)
      showToast(`Order ${orderId} status set to "${newStatus}"`)
    } catch (err) {
      console.error(err)
    }
  }

  const handleAdvanceOrder = async (orderId) => {
    try {
      const updated = await orderService.advanceNextStatus(orderId)
      if (updated) {
        showToast(`Order ${orderId} moved to "${updated.status}"`)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleConfirmCancelOrder = async () => {
    if (!cancelOrderTarget) return
    try {
      await orderService.cancelOrder(cancelOrderTarget.id)
      showToast(`Order ${cancelOrderTarget.id} has been cancelled`)
    } catch (err) {
      console.error(err)
    } finally {
      setCancelOrderTarget(null)
    }
  }

  // Handlers for Kitchen Status
  const handleKitchenStatusChange = async (newStatus) => {
    try {
      await kitchenService.setStatus(newStatus)
      showToast(`Kitchen status updated to "${newStatus}"`)
    } catch (err) { console.error(err); showToast('Could not update kitchen status') }
  }

  // Handlers for Menu
  const handleToggleMenuAvailability = async (id) => {
    try {
      const item = await menuService.toggleAvailability(id)
      if (item) {
      showToast(`"${item.name}" marked as ${item.isAvailable ? 'In Stock' : 'Sold Out'}`)
      }
    } catch (err) { console.error(err); showToast('Could not update menu availability') }
  }

  const handleAddDish = async (dish) => {
    try { const created = await menuService.addMenuItem(dish); showToast(`Dish "${created.name}" added to menu catalog`) }
    catch (err) { console.error(err); showToast('Could not add dish') }
  }

  const handleUpdateDish = async (id, updates) => {
    try { const updated = await menuService.updateMenuItem(id, updates); showToast(`Dish "${updated.name}" updated successfully`) }
    catch (err) { console.error(err); showToast('Could not update dish') }
  }

  const handleConfirmDeleteDish = async () => {
    if (!deleteDishTarget) return
    try { await menuService.deleteMenuItem(deleteDishTarget.id); showToast(`Dish "${deleteDishTarget.name}" deleted from menu`) }
    catch (err) { console.error(err); showToast('Could not delete dish') }
    finally { setDeleteDishTarget(null) }
  }

  // Handlers for Inventory
  const handleAdjustInventory = async (id, delta) => {
    try { await inventoryService.adjustQuantity(id, delta) } catch (err) { console.error(err); showToast('Could not update inventory') }
  }

  const handleUpdateInventoryQty = async (id, qty) => {
    try { await inventoryService.updateQuantity(id, qty); showToast('Inventory quantity updated') }
    catch (err) { console.error(err); showToast('Could not update inventory') }
  }

  const handleAddInventory = async (item) => {
    try { const created = await inventoryService.addItem(item); showToast(`Item "${created.name}" added to inventory`) }
    catch (err) { console.error(err); showToast('Could not add inventory item') }
  }

  const handleConfirmDeleteInventory = async () => {
    if (!deleteInventoryTarget) return
    try { await inventoryService.deleteItem(deleteInventoryTarget.id); showToast(`Item "${deleteInventoryTarget.name}" removed from inventory`) }
    catch (err) { console.error(err); showToast('Could not delete inventory item') }
    finally { setDeleteInventoryTarget(null) }
  }

  // Badges & Counters
  const newOrdersCount = orders.filter((o) => o.status === ORDER_STATUS.PLACED).length
  const activeOrdersCount = orders.filter((o) =>
    [ORDER_STATUS.ACCEPTED, ORDER_STATUS.PREPARING, ORDER_STATUS.READY].includes(o.status)
  ).length
  const lowStockCount = inventory.filter((i) => i.quantity <= i.minThreshold).length

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans">
      {/* 1. Header */}
      <KitchenHeader
        kitchenStatus={kitchenStatus}
        onStatusChange={handleKitchenStatusChange}
        activeCount={activeOrdersCount}
        newOrdersCount={newOrdersCount}
        onSwitchToCustomer={onSwitchToCustomer}
        onLogout={onLogout}
      />

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-2 text-xs font-semibold animate-slideInRight">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {/* Navigation Tabs Bar */}
        <div className="bg-white rounded-2xl p-1.5 border border-stone-200 shadow-xs mb-8 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {/* Tab 1: Overview */}
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Overview</span>
          </button>

          {/* Tab 2: Orders Queue */}
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Order Queue</span>
            {(newOrdersCount > 0 || activeOrdersCount > 0) && (
              <span
                className={`text-[11px] font-bold px-2 py-0.2 rounded-full ${
                  activeTab === 'orders'
                    ? 'bg-amber-800 text-white'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                {newOrdersCount + activeOrdersCount}
              </span>
            )}
          </button>

          {/* Tab 3: Menu Management */}
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'menu'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Menu & Recipes</span>
            <span
              className={`text-[11px] font-bold px-2 py-0.2 rounded-full ${
                activeTab === 'menu'
                  ? 'bg-amber-800 text-white'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              {menuItems.length}
            </span>
          </button>

          {/* Tab 4: Inventory */}
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'inventory'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Inventory</span>
            {lowStockCount > 0 && (
              <span
                className={`text-[11px] font-bold px-2 py-0.2 rounded-full ${
                  activeTab === 'inventory'
                    ? 'bg-rose-800 text-white'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {lowStockCount} alert
              </span>
            )}
          </button>
        </div>

        {/* Tab Content Rendering */}
        {activeTab === 'overview' && (
          <OverviewTab
            orders={orders}
            kitchenStatus={kitchenStatus}
            onStatusChange={handleKitchenStatusChange}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onAdvanceOrder={handleAdvanceOrder}
            onCancelClick={(order) => setCancelOrderTarget(order)}
            lowStockCount={lowStockCount}
          />
        )}

        {activeTab === 'orders' && (
          <OrderQueueTab
            orders={orders}
            onUpdateStatus={handleUpdateStatus}
            onAdvanceOrder={handleAdvanceOrder}
            onCancelClick={(order) => setCancelOrderTarget(order)}
          />
        )}

        {activeTab === 'menu' && (
          <MenuManagementTab
            menuItems={menuItems}
            onToggleAvailability={handleToggleMenuAvailability}
            onAddDish={handleAddDish}
            onUpdateDish={handleUpdateDish}
            onDeleteClick={(dish) => setDeleteDishTarget(dish)}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryTab
            inventory={inventory}
            onAdjustQuantity={handleAdjustInventory}
            onUpdateQuantity={handleUpdateInventoryQty}
            onAddItem={handleAddInventory}
            onDeleteItem={(item) => setDeleteInventoryTarget(item)}
          />
        )}
      </div>

      {/* Confirmation Modal: Cancel Order */}
      <ConfirmationModal
        isOpen={Boolean(cancelOrderTarget)}
        title={`Cancel Order #${cancelOrderTarget?.id}?`}
        message={`Are you sure you want to cancel this order for customer ${
          cancelOrderTarget?.customer?.name || 'Guest'
        }? The customer order tracking screen will immediately display "Cancelled".`}
        confirmText="Yes, Cancel Order"
        cancelText="Keep Order"
        isDanger={true}
        onConfirm={handleConfirmCancelOrder}
        onCancel={() => setCancelOrderTarget(null)}
      />

      {/* Confirmation Modal: Delete Menu Item */}
      <ConfirmationModal
        isOpen={Boolean(deleteDishTarget)}
        title={`Delete "${deleteDishTarget?.name}"?`}
        message={`Are you sure you want to remove "${deleteDishTarget?.name}" from the active Rasoi Kitchen menu catalog? Customers will no longer be able to view or order this item.`}
        confirmText="Yes, Delete Dish"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={handleConfirmDeleteDish}
        onCancel={() => setDeleteDishTarget(null)}
      />

      {/* Confirmation Modal: Delete Inventory Item */}
      <ConfirmationModal
        isOpen={Boolean(deleteInventoryTarget)}
        title={`Delete "${deleteInventoryTarget?.name}"?`}
        message={`Are you sure you want to remove "${deleteInventoryTarget?.name}" from raw material tracking?`}
        confirmText="Yes, Delete Material"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={handleConfirmDeleteInventory}
        onCancel={() => setDeleteInventoryTarget(null)}
      />
    </div>
  )
}

export default function KitchenDashboard({ onSwitchToCustomer }) {
  const [authState, setAuthState] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    authService.getSession()
      .then(({ authenticated }) => setAuthState(authenticated ? 'authenticated' : 'anonymous'))
      .catch((err) => { setError(err.message); setAuthState('anonymous') })
  }, [])

  const login = async (password) => {
    await authService.login(password)
    setAuthState('authenticated')
  }
  const logout = async () => {
    await authService.logout()
    setAuthState('anonymous')
  }

  if (authState === 'loading') return <main className="min-h-[70vh] grid place-items-center text-stone-600">Checking staff session…</main>
  if (authState !== 'authenticated') return <><KitchenLogin onLogin={login} />{error && <p className="pb-6 text-center text-sm text-rose-700">{error}</p>}</>
  return <KitchenDashboardContent onSwitchToCustomer={onSwitchToCustomer} onLogout={logout} />
}
