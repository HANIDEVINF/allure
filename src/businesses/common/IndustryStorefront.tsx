import React, { useState } from 'react';
import {
  Search,
  Star,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Eye,
  MessageCircle,
  Truck,
  MapPin,
  Instagram,
  Phone,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BusinessIndustryConfig, BusinessProduct, LanguageCode } from '../types';
import { GK_STORE_INFO, UI_TRANSLATIONS, CASUAL_CATEGORIES_FR, CASUAL_CATEGORIES_AR } from '../../data/casualAlgeriaData';

interface IndustryStorefrontProps {
  config: BusinessIndustryConfig;
  products: BusinessProduct[];
  onAddToCart: (product: BusinessProduct, quantity?: number, selectedSize?: string) => void;
  onOpenProductDetail: (product: BusinessProduct) => void;
  lang: LanguageCode;
  themeMode?: 'light' | 'dark';
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85';

export const IndustryStorefront: React.FC<IndustryStorefrontProps> = ({
  config,
  products,
  onAddToCart,
  onOpenProductDetail,
  lang,
  themeMode = 'dark',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');
  const [activeSizeFilter, setActiveSizeFilter] = useState<string>('all');

  const t = UI_TRANSLATIONS[lang];
  const isRTL = lang === 'ar';
  const isDark = themeMode === 'dark';

  const categories = lang === 'ar' ? CASUAL_CATEGORIES_AR : CASUAL_CATEGORIES_FR;

  // Filter products
  const filteredProducts = products.filter((p) => {
    let matchesCategory = true;
    if (selectedCategory !== 'All' && !selectedCategory.toLowerCase().includes('all') && !selectedCategory.includes('كل')) {
      if (lang === 'ar') {
        matchesCategory = p.categoryAr === selectedCategory || p.category === selectedCategory;
      } else {
        matchesCategory = p.category.toLowerCase() === selectedCategory.toLowerCase();
      }
    }

    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.nameAr && p.nameAr.includes(searchQuery)) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSize =
      activeSizeFilter === 'all' || (p.sizes && p.sizes.includes(activeSizeFilter));

    return matchesCategory && matchesSearch && matchesSize;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  // WhatsApp quick buy helper
  const handleQuickWhatsAppBuy = (p: BusinessProduct) => {
    const defaultSize = p.sizes[0] || 'Standard';
    const text = lang === 'ar'
      ? `سلام، أريد طلب هذا المنتج من متجر ألور هوم (سيدي بلعباس):\n- المنتج: ${p.nameAr || p.name}\n- المقاس: ${defaultSize}\n- السعر: ${p.price.toLocaleString()} دج\nيرجى تأكيد التوصيل إلى ولايتي.`
      : `Salam, je souhaite commander cet article depuis la boutique ALLURE HOMME Sidi Bel Abbès :\n- Produit : ${p.name}\n- Taille : ${defaultSize}\n- Prix : ${p.price.toLocaleString()} DA\nMerci de me confirmer la livraison.`;
    
    window.open(`https://wa.me/213557064156?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className={`space-y-6 sm:space-y-10 pb-16 relative w-full max-w-full overflow-hidden ${isRTL ? 'text-right font-arabic' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Dynamic Ambient Background Aura Glows strictly clipped */}
      <div className="absolute top-0 left-0 right-0 h-80 overflow-hidden pointer-events-none -z-10">
        <div
          className="w-full max-w-md sm:max-w-xl mx-auto h-64 sm:h-80 blur-3xl opacity-15 rounded-full animate-warm-pulse"
          style={{
            background: `radial-gradient(circle, ${isDark ? config.theme.primary : '#d4af37'} 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Hero Banner with ALLURE HOMME Sidi Bel Abbès Context & Sartorial Aesthetic */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border p-4 sm:p-10 shadow-xl transition-colors duration-200 w-full max-w-full ${
          isDark
            ? 'border-zinc-800 bg-gradient-to-br from-[#12141a] via-[#0c0d11] to-[#16130d] text-white'
            : 'border-zinc-200 bg-gradient-to-br from-white via-amber-50/40 to-stone-100 text-zinc-900 shadow-amber-900/5'
        }`}
      >
        <div className="relative z-10 max-w-3xl space-y-4 sm:space-y-5">
          {/* Store Location & Instagram Badge */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold ${
              isDark
                ? 'bg-amber-400/10 text-amber-300 border border-amber-400/25'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}>
              <MapPin className="w-3 h-3 text-amber-500" />
              <span>{GK_STORE_INFO.location}</span>
            </span>

            <a
              href={GK_STORE_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold border transition-colors ${
                isDark
                  ? 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-pink-400'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:text-pink-600 shadow-sm'
              }`}
            >
              <Instagram className="w-3 h-3 text-pink-500" />
              <span>@{GK_STORE_INFO.instagramHandle}</span>
            </a>

            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium border ${
              isDark
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              <Truck className="w-3 h-3 text-emerald-500" />
              <span>58 Wilayas (Yalidine)</span>
            </span>
          </div>

          {/* Hero Titles */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight font-display leading-tight">
              {lang === 'ar' ? (
                <>
                  أناقة الرجل الكلاسيكية والعصرية <br />
                  <span className="text-amber-500 font-serif-luxury">{GK_STORE_INFO.taglineAr}</span>
                </>
              ) : (
                <>
                  L'Élégance Masculine Sartoriale <br />
                  <span className="text-amber-500 font-serif-luxury">ALLURE HOMME • Sidi Bel Abbès</span>
                </>
              )}
            </h1>
            <p className={`text-xs sm:text-base leading-relaxed max-w-2xl font-normal ${
              isDark ? 'text-zinc-300' : 'text-zinc-600'
            }`}>
              {lang === 'ar'
                ? 'تشكيلة راقية من البليزر السارتوريال، أطقم سبورت شيك، بولو تريكو فاخر، سراويل كلاسيك بكسرات، أحذية موكاسين جلد إيطالي وكاسكيت أنيقة مع الدفع عند الاستلام كاش.'
                : 'Boutique de prêt-à-porter masculin à Sidi Bel Abbès (Rue Mohamed Khemisti) : vestes blazers sartoriales, polos tricot Old Money, pantalons tailleurs à pinces, ensembles casual et mocassins en cuir véritable. Livraison 58 Wilayas avec paiement cash à la réception.'}
            </p>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <a
              href={GK_STORE_INFO.whatsappDirect}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.orderOnWhatsApp}</span>
            </a>

            <a
              href={GK_STORE_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isDark
                  ? 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                  : 'bg-white hover:bg-zinc-50 text-zinc-800 border-zinc-300 shadow-sm'
              }`}
            >
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>Localisation Google Maps</span>
            </a>
          </div>
        </div>
      </motion.section>

      {/* Featured Instagram Feed Spotlight */}
      <div className={`p-3.5 sm:p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 transition-colors w-full overflow-hidden ${
        isDark ? 'bg-zinc-900/70 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500 shrink-0">
            <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              <span>Feed Officiel Instagram</span>
              <a
                href={GK_STORE_INFO.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-pink-500 font-mono hover:underline truncate"
              >
                @{GK_STORE_INFO.instagramHandle}
              </a>
            </div>
            <p className={`text-[11px] truncate ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Découvrez les pièces portées : vestes sartoriales, polos tricot, ensembles casual, mocassins en cuir et casquettes Allure !
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap shrink-0">
          <button
            onClick={() => setSelectedCategory('Costumes & Blazers')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
            }`}
          >
            Costumes & Blazers
          </button>
          <button
            onClick={() => setSelectedCategory('Polos & Chemises')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
            }`}
          >
            Polos & Chemises
          </button>
          <button
            onClick={() => setSelectedCategory('Chaussures & Mocassins')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
            }`}
          >
            Mocassins & Sneakers
          </button>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="space-y-3 sm:space-y-4 w-full">
        {/* Search input & Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
          <div className="relative flex-1">
            <Search className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 text-zinc-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`w-full py-2 sm:py-2.5 rounded-2xl border text-xs focus:outline-none focus:border-amber-500 transition-colors ${
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500'
                  : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 shadow-sm'
              } ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'}`}
            />
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`py-2 sm:py-2.5 px-3 rounded-2xl border text-xs focus:outline-none focus:border-amber-500 cursor-pointer w-full sm:w-auto ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-700 shadow-sm'
              }`}
            >
              <option value="featured">✨ {lang === 'ar' ? 'المقترحات المميزة' : 'Articles Vedettes'}</option>
              <option value="price_low">⬇️ {lang === 'ar' ? 'السعر: من الأقل إلى الأعلى' : 'Prix : Moins cher au plus cher'}</option>
              <option value="price_high">⬆️ {lang === 'ar' ? 'السعر: من الأعلى إلى الأقل' : 'Prix : Plus cher au moins cher'}</option>
              <option value="rating">⭐ {lang === 'ar' ? 'أعلى تقييماً' : 'Mieux notés'}</option>
            </select>
          </div>
        </div>

        {/* Category Tabs - Contained with safe horizontal scroll */}
        <div className="w-full max-w-full overflow-x-auto pb-1">
          <div className="flex items-center gap-2 min-w-max">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-amber-400 text-black font-bold shadow-sm'
                  : isDark
                  ? 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                  : 'bg-white text-zinc-600 hover:text-black hover:bg-zinc-100 border border-zinc-200 shadow-sm'
              }`}
            >
              {t.filterAll} ({products.length})
            </button>

            {categories.map((cat, idx) => {
              const isSelected = selectedCategory === cat || (lang === 'ar' && CASUAL_CATEGORIES_FR[idx] === selectedCategory);
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-black font-bold shadow-sm'
                      : isDark
                      ? 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                      : 'bg-white text-zinc-600 hover:text-black hover:bg-zinc-100 border border-zinc-200 shadow-sm'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product Catalog Grid */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            {filteredProducts.length} {lang === 'ar' ? 'قطع معروضة' : 'articles disponibles en boutique'}
          </div>
          <div className="text-xs text-amber-500 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'أسعار مناسبة بالدينار الجزائري' : 'Prix direct magasin (DA)'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-6 w-full">
          <AnimatePresence>
            {sortedProducts.map((product) => {
              const displayName = lang === 'ar' && product.nameAr ? product.nameAr : product.name;
              const displaySubtitle = lang === 'ar' && product.subtitleAr ? product.subtitleAr : product.subtitle;
              const displayBadge = lang === 'ar' && product.badgeAr ? product.badgeAr : product.badge;

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className={`group relative rounded-2xl border overflow-hidden flex flex-col transition-all duration-300 shadow-sm hover:shadow-xl w-full ${
                    isDark
                      ? 'bg-[#121419] border-zinc-800/90 hover:border-amber-400/50'
                      : 'bg-white border-zinc-200 hover:border-amber-400/80 shadow-zinc-200/50'
                  }`}
                >
                  {/* Product Image Frame with fallback */}
                  <div
                    className="relative aspect-4/5 w-full bg-zinc-100 overflow-hidden cursor-pointer"
                    onClick={() => onOpenProductDetail(product)}
                  >
                    <img
                      src={product.images[0]}
                      alt={displayName}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                      }}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Gradient Overlay for legibility */}
                    <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-50 ${
                      isDark ? 'from-[#121419]' : 'from-black/40'
                    }`} />

                    {/* Badge */}
                    {displayBadge && (
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md border border-amber-400/40 text-[9px] sm:text-[10px] font-bold text-amber-300 uppercase tracking-wider shadow-sm">
                        {displayBadge}
                      </div>
                    )}

                    {/* Stock indicator badge */}
                    {product.stock <= 5 && (
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-red-900/90 border border-red-500/50 text-[9px] sm:text-[10px] font-semibold text-white">
                        {product.stock} {lang === 'ar' ? 'متبقي' : 'restants'}
                      </div>
                    )}

                    {/* Quick View Floating Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenProductDetail(product);
                      }}
                      className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-black/80 hover:bg-amber-400 hover:text-black text-white border border-zinc-700 transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 shadow-xl cursor-pointer"
                      title={t.quickView}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card Content Details */}
                  <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
                    <div className="space-y-1">
                      <div className={`flex items-center justify-between text-[11px] ${
                        isDark ? 'text-zinc-400' : 'text-zinc-500'
                      }`}>
                        <span className="truncate max-w-[140px]">{lang === 'ar' && product.categoryAr ? product.categoryAr : product.category}</span>
                        <span className="flex items-center gap-1 text-amber-500 font-semibold shrink-0">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{product.rating}</span>
                        </span>
                      </div>

                      <h3
                        onClick={() => onOpenProductDetail(product)}
                        className={`font-bold text-sm line-clamp-1 transition-colors cursor-pointer ${
                          isDark ? 'text-white group-hover:text-amber-300' : 'text-zinc-900 group-hover:text-amber-600'
                        }`}
                      >
                        {displayName}
                      </h3>

                      <p className={`text-xs line-clamp-2 leading-relaxed ${
                        isDark ? 'text-zinc-400' : 'text-zinc-500'
                      }`}>
                        {displaySubtitle}
                      </p>

                      {/* Sizes tags */}
                      <div className="flex flex-wrap items-center gap-1 pt-0.5">
                        {product.sizes.slice(0, 4).map((size) => (
                          <span
                            key={size}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                              isDark
                                ? 'bg-zinc-900 border-zinc-800 text-zinc-400'
                                : 'bg-zinc-100 border-zinc-200 text-zinc-600'
                            }`}
                          >
                            {size}
                          </span>
                        ))}
                        {product.sizes.length > 4 && (
                          <span className={`text-[10px] font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                            +{product.sizes.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Pricing & Order CTA buttons */}
                    <div className={`pt-2 border-t space-y-2 ${isDark ? 'border-zinc-800/80' : 'border-zinc-200'}`}>
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-1.5">
                          <span className={`text-base font-extrabold font-mono ${
                            isDark ? 'text-amber-400' : 'text-amber-600'
                          }`}>
                            {product.price.toLocaleString()} DA
                          </span>
                          {product.compareAtPrice && (
                            <span className="text-xs text-zinc-400 line-through font-mono">
                              {product.compareAtPrice.toLocaleString()} DA
                            </span>
                          )}
                        </div>
                        <span className={`text-[10px] font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                          {t.inStock}
                        </span>
                      </div>

                      {/* Primary Actions: WhatsApp Direct & Add to Bag */}
                      <div className="grid grid-cols-2 gap-2 pt-0.5">
                        <button
                          onClick={() => handleQuickWhatsAppBuy(product)}
                          className={`flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                            isDark
                              ? 'bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border-emerald-500/30'
                              : 'bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border-emerald-300'
                          }`}
                          title="Commander directement sur WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">WhatsApp</span>
                        </button>

                        <button
                          onClick={() => onAddToCart(product, 1, product.sizes[0])}
                          className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all shadow-sm cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                          <span>{lang === 'ar' ? 'السلة' : 'Panier'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Algerian Commerce Assurance Badges */}
      <section className={`rounded-2xl sm:rounded-3xl border p-5 sm:p-8 transition-colors w-full overflow-hidden ${
        isDark ? 'border-zinc-800 bg-[#101216]' : 'border-zinc-200 bg-white shadow-sm'
      }`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 text-center sm:text-left">
          <div className="space-y-1.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto sm:mx-0">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {lang === 'ar' ? 'توصيل لـ 58 ولاية' : 'Livraison 58 Wilayas'}
            </h4>
            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {lang === 'ar'
                ? 'شحن سريع عبر ياليدين إكسبريس مع خيار الاستلام من المكتب أو لباب المنزل.'
                : 'Envoi sécurisé via Yalidine Express avec choix de livraison à domicile ou stop desk.'}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mx-auto sm:mx-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {lang === 'ar' ? 'الدفع عند الاستلام كاش' : 'Paiement Cash à la Réception'}
            </h4>
            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {lang === 'ar'
                ? 'لا داعي لبطاقة بنكية، ادفع نقداً للناقل بعد فحص طردك والتأكد من المقاس.'
                : 'Vérifiez la taille et la qualité de vos vêtements avant de payer le livreur.'}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500 mx-auto sm:mx-0">
              <Instagram className="w-5 h-5" />
            </div>
            <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {lang === 'ar' ? 'حساب رسمي موثوق' : 'Boutique & Instagram Officiel'}
            </h4>
            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {lang === 'ar'
                ? `محل حقيقي في شارع محمد خميستي سيدي بلعباس مع فيديوهات وصور حقيقية على @${GK_STORE_INFO.instagramHandle}.`
                : `Magasin physique Rue Mohamed Khemisti à Sidi Bel Abbès et communauté active sur notre page @${GK_STORE_INFO.instagramHandle}.`}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mx-auto sm:mx-0">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {lang === 'ar' ? 'خدمة الزبائن والواتساب' : 'Service Client Dédié'}
            </h4>
            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {lang === 'ar'
                ? `فريق العمل جاهز للرد على استفساراتكم ومساعدتكم في اختيار المقاس عبر ${GK_STORE_INFO.phoneFormatted}.`
                : `Conseils personnalisés sur les mensurations et suivi de commande au ${GK_STORE_INFO.phoneFormatted}.`}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
