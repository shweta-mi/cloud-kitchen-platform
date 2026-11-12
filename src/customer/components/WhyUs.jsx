import React from 'react'
import { Flame, ShieldCheck, Clock, Award, Leaf, Package } from 'lucide-react'

export default function WhyUs() {
  const highlights = [
    {
      icon: Flame,
      title: 'Tandoor & Dum Specials',
      desc: 'Cooked in authentic clay ovens with slow wood-fire heat to retain natural juices and smoky flavor.',
    },
    {
      icon: Leaf,
      title: '100% Cold-Pressed Oils',
      desc: 'Pure desi ghee and cold-pressed mustard & groundnut oils. Zero trans-fats and zero artificial food colorings.',
    },
    {
      icon: Clock,
      title: 'Piping Hot in 30 Mins',
      desc: 'Smart kitchen dispatch algorithms ensure your order is packed fresh off the stove right as rider arrives.',
    },
    {
      icon: Package,
      title: 'Eco-Friendly Insulation',
      desc: '100% biodegradable spill-proof containers that lock in temperature and steam without getting soggy.',
    },
    {
      icon: ShieldCheck,
      title: 'FSSAI Certified Hygiene',
      desc: 'Daily medical health checks for kitchen crew, UV air purifiers, and 5-stage RO water purification.',
    },
    {
      icon: Award,
      title: 'Legacy Family Recipes',
      desc: 'Spice blends ground fresh every sunrise following centuries-old North & South Indian culinary secrets.',
    },
  ]

  return (
    <section id="why-us" className="py-20 bg-stone-900 text-white relative overflow-hidden scroll-mt-20">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500 block mb-2">
            The Rasoi Promise
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
            Why Food Lovers Choose Rasoi Kitchen
          </h2>
          <p className="mt-3 text-stone-400 text-sm sm:text-base">
            We are not an ordinary delivery joint. We are a specialized cloud kitchen engineered around food quality, safety, and authentic culinary passion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="rounded-3xl p-6 bg-stone-800/60 border border-stone-700/60 hover:border-amber-500/50 hover:bg-stone-800 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center mb-5 shadow-lg shadow-orange-600/20 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-white mb-2 group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
