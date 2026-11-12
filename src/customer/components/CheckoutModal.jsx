import React, { useState } from 'react'
import { X, CheckCircle2, AlertCircle, Loader2, MapPin, Phone, User, FileText, ShieldAlert } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { orderService } from '../services/orderService'

export default function CheckoutModal({ isOpen, onClose, onOrderSuccess }) {
  const { items, grandTotal, clearCart } = useCart()

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    instructions: '',
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generalError, setGeneralError] = useState('')

  if (!isOpen) return null

  // Validate individual field
  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Customer name is required'
        if (value.trim().length < 2) return 'Name must be at least 2 characters'
        return ''
      case 'phone':
        if (!value.trim()) return 'Mobile number is required'
        // Validate 10-digit Indian phone number
        const cleanPhone = value.replace(/\D/g, '')
        if (cleanPhone.length !== 10) return 'Please enter a valid 10-digit phone number'
        if (!/^[6-9]\d{9}$/.test(cleanPhone)) return 'Phone number must start with 6, 7, 8, or 9'
        return ''
      case 'address':
        if (!value.trim()) return 'Delivery address is required'
        if (value.trim().length < 10) return 'Please provide a full address (at least 10 characters)'
        return ''
      default:
        return ''
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (touched[field]) {
      const err = validateField(field, value)
      setErrors((prev) => ({ ...prev, [field]: err }))
    }
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const err = validateField(field, formData[field])
    setErrors((prev) => ({ ...prev, [field]: err }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGeneralError('')

    // Validate all fields
    const newErrors = {
      name: validateField('name', formData.name),
      phone: validateField('phone', formData.phone),
      address: validateField('address', formData.address),
    }

    setErrors(newErrors)
    setTouched({ name: true, phone: true, address: true })

    const hasError = Object.values(newErrors).some((err) => Boolean(err))
    if (hasError) {
      return
    }

    if (items.length === 0) {
      setGeneralError('Your basket is empty. Please add items before checking out.')
      return
    }

    setIsSubmitting(true)
    try {
      const createdOrder = await orderService.createOrder({
        items,
        total: grandTotal,
        customer: formData,
      })

      // Clear cart
      clearCart()
      setIsSubmitting(false)
      onOrderSuccess(createdOrder)
    } catch (err) {
      setIsSubmitting(false)
      setGeneralError('Failed to transmit order to kitchen. Please try again.')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-fadeIn">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-amber-50/50">
          <div>
            <h2 id="checkout-title" className="font-serif font-bold text-xl text-stone-900">
              Delivery Details
            </h2>
            <p className="text-xs text-stone-500">
              Where should we deliver your hot food from Rasoi Kitchen?
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* General alert / error */}
          {generalError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Customer Name */}
          <div>
            <label
              htmlFor="customer-name"
              className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5"
            >
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="customer-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder="e.g. Priya Sharma"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                  errors.name && touched.name
                    ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-400'
                    : 'border-stone-200 focus:ring-amber-500 focus:border-transparent'
                }`}
                aria-required="true"
                aria-invalid={Boolean(errors.name && touched.name)}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
            </div>
            {errors.name && touched.name && (
              <p id="name-error" className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Customer Phone */}
          <div>
            <label
              htmlFor="customer-phone"
              className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5"
            >
              Mobile Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-stone-500 text-sm font-medium border-r border-stone-200 pr-2">
                <span>+91</span>
              </div>
              <input
                id="customer-phone"
                type="tel"
                maxLength={10}
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                placeholder="9876543210"
                className={`w-full pl-16 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                  errors.phone && touched.phone
                    ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-400'
                    : 'border-stone-200 focus:ring-amber-500 focus:border-transparent'
                }`}
                aria-required="true"
                aria-invalid={Boolean(errors.phone && touched.phone)}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
            </div>
            {errors.phone && touched.phone && (
              <p id="phone-error" className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Delivery Address */}
          <div>
            <label
              htmlFor="delivery-address"
              className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5"
            >
              Delivery Address (House/Flat, Street, Area) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <textarea
                id="delivery-address"
                rows={3}
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                onBlur={() => handleBlur('address')}
                placeholder="e.g. Flat 304, Maple Woods Apartments, 12th Main Road, Sector 4"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 resize-none ${
                  errors.address && touched.address
                    ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-400'
                    : 'border-stone-200 focus:ring-amber-500 focus:border-transparent'
                }`}
                aria-required="true"
                aria-invalid={Boolean(errors.address && touched.address)}
                aria-describedby={errors.address ? 'address-error' : undefined}
              />
            </div>
            {errors.address && touched.address && (
              <p id="address-error" className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.address}
              </p>
            )}
          </div>

          {/* Delivery Instructions (Optional) */}
          <div>
            <label
              htmlFor="delivery-notes"
              className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5"
            >
              Special Instructions <span className="text-stone-400 font-normal lowercase">(optional)</span>
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="delivery-notes"
                type="text"
                value={formData.instructions}
                onChange={(e) => handleChange('instructions', e.target.value)}
                placeholder="e.g. Please do not ring bell / leave at security"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Order Summary Snapshot */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2">
            <div className="flex justify-between items-center text-xs text-stone-500">
              <span>Items in Order:</span>
              <span className="font-semibold text-stone-800">
                {items.map((i) => `${i.name} (×${i.quantity})`).join(', ')}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-stone-900 pt-2 border-t border-stone-200/80">
              <span>Grand Total:</span>
              <span className="text-amber-800 text-base">₹{grandTotal}</span>
            </div>
            <div className="text-[11px] text-amber-900 bg-amber-100/70 p-2 rounded-lg flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                Payment Mode: <strong>Pay on Delivery (Simulated)</strong>. No actual payment is collected.
              </span>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-1/3 py-3 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-semibold text-sm transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-2/3 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold text-sm shadow-lg shadow-orange-600/25 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Transmitting to Kitchen...</span>
                </>
              ) : (
                <span>Confirm & Place Order (₹{grandTotal})</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
