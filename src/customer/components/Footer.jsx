import React from 'react'
import { Flame, Phone, MapPin, Mail, Clock, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer id="about" className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-serif font-bold text-white">Rasoi Kitchen</span>
                <span className="block text-[10px] tracking-widest font-semibold uppercase text-amber-500">
                  Cloud Kitchen Platform
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              Crafting traditional Indian homestyle favorites with wholesome ingredients, prepared in dedicated sanitized cloud kitchens and delivered hot.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-400">
              <li>
                <a href="#menu" className="hover:text-amber-400 transition-colors">
                  Our Menu & Specials
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-amber-400 transition-colors">
                  The Rasoi Promise
                </a>
              </li>
              <li>
                <a href="#track-order" className="hover:text-amber-400 transition-colors">
                  Live Order Tracker
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-amber-400 transition-colors">
                  Sanitation Standards
                </a>
              </li>
            </ul>
          </div>

          {/* Kitchen Hours */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Operating Hours
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-stone-400">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Daily Service</p>
                  <p>Lunch: 11:30 AM – 4:00 PM</p>
                  <p>Dinner: 6:30 PM – 11:30 PM</p>
                </div>
              </div>
              <p className="text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 p-2 rounded-lg">
                ● Kitchen is currently accepting online orders
              </p>
            </div>
          </div>

          {/* Kitchen Contact & Location */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Cloud Kitchen Hub
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-stone-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Central Cloud Hub, Phase 2, Industrial Culinary Zone, Delivery Radius 10km</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>+91 (011) 4920-8800</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>orders@rasoikitchen.local</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Companion Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Rasoi Kitchen Cloud Kitchen Platform. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>Customer Website Component</span>
            <span>•</span>
            <span className="text-stone-400">Companion to Kitchen Staff Dashboard</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
