import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'

const CartContext = createContext(null)

const CART_STORAGE_KEY = 'rasoi_kitchen_cart_v1'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [isCartOpen, setIsCartOpen] = useState(false)

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (err) {
      console.warn('Could not persist cart to localStorage', err)
    }
  }, [items])

  /**
   * Add item to cart. If already present, increment quantity.
   */
  const addToCart = (dish) => {
    if (!dish || dish.isAvailable === false) return

    setItems((prev) => {
      const existing = prev.find((item) => item.id === dish.id)
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [
        ...prev,
        {
          id: dish.id,
          menuItemId: dish.id,
          name: dish.name,
          price: dish.price,
          category: dish.category,
          isVeg: dish.isVeg,
          image: dish.image,
          quantity: 1,
        },
      ]
    })
  }

  /**
   * Update quantity of an item. Removes if qty <= 0.
   */
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    )
  }

  /**
   * Remove item completely from cart
   */
  const removeFromCart = (itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  /**
   * Clear all items in cart
   */
  const clearCart = () => {
    setItems([])
  }

  // Calculated totals
  const totalItems = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0)
  }, [items])

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  }, [items])

  // Free delivery over ₹300, else flat ₹30
  const deliveryFee = useMemo(() => {
    if (subtotal === 0) return 0
    return subtotal >= 300 ? 0 : 30
  }, [subtotal])

  // 5% GST
  const taxes = useMemo(() => {
    if (subtotal === 0) return 0
    return Math.round(subtotal * 0.05)
  }, [subtotal])

  const grandTotal = useMemo(() => {
    if (subtotal === 0) return 0
    return subtotal + deliveryFee + taxes
  }, [subtotal, deliveryFee, taxes])

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        deliveryFee,
        taxes,
        grandTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
