import React, { useState, useEffect } from 'react';
import {
  Search,
  Star,
  ShoppingBag,
  ShieldCheck,
  Eye,
  MessageCircle,
  Truck,
  MapPin,
  Instagram,
  Phone,
  ArrowRight,
  Shirt,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BusinessIndustryConfig, BusinessProduct, LanguageCode } from '../types';
import {
  GK_STORE_INFO,
  UI_TRANSLATIONS,
  CASUAL_CATEGORIES_FR,
  CASUAL_CATEGORIES_AR,
  HERO_ATELIER_IMAGE,
} from '../../data/casualAlgeriaData';

interface IndustryStorefrontProps {
  config: BusinessIndustryConfig;
  products: BusinessProduct[];
  onAddToCart: (product: BusinessProduct, quantity?: number, selectedSize?: string) => void;
  onOpenProductDetail: (product: BusinessProduct) => void;
  lang: LanguageCode;
  themeMode?: 'light' | 'dark';
  externalCategory?: string;
}

export const IndustryStorefront: React.FC<IndustryStorefrontProps> = ({
  products,
  onAddToCart,
  onOpenProductDetail,
  lang,
  themeMode = 'light',
  externalCategory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');
  const [activeSizeFilter, setActiveSizeFilter] = useState<string>('all');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (externalCategory) {
      setSelectedCategory(externalCategory);
    }
  }, [externalCategory]);

  const t = UI_TRANSLATIONS[lang];
  const isRTL = lang === 'ar';
  const isDark = themeMode === 'dark';

  const categories = lang === 'ar' ? CASUAL_CATEGORIES_AR : CASUAL_CATEGORIES_FR;

  // Filter products
  const filteredProducts = products.filter((p) => {
    let matchesCategory = true;
    if (
      selectedCategory !== 'All' &&
      !selectedCategory.toLowerCase().includes('tous') &&
      !selectedCategory.toLowerCase().includes('all') &&
      !selectedCategory.includes('كل')
    ) {
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

  const handleQuickWhatsAppBuy = (p: BusinessProduct) => {
    const defaultSize = p.sizes[0] || 'Standard';
    const text =
      lang === 'ar'
        ? `سلام، أريد طلب هذا المنتج من متجر ألور هوم (سيدي بلعباس):\n- المنتج: ${p.nameAr || p.name}\n- المقاس: ${defaultSize}\n- السعر: ${p.price.toLocaleString()} دج\nيرجى تأكيد التوصيل إلى ولايتي.`
        : `Salam, je souhaite commander cet article depuis la boutique ALLURE HOMME Sidi Bel Abbès :\n- Produit : ${p.name}\n- Taille : ${defaultSize}\n- Prix : ${p.price.toLocaleString()} DA\nMerci de me confirmer la livraison.`;

    window.open(`https://wa.me/213557064156?text=${encodeURIComponent(text)}`, '_blank');
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('collection-catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className={`space-y-12 sm:space-y-16 pb-16 w-full max-w-full ${
        isRTL ? 'text-right font-arabic' : 'text-left'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* SECTION 1: SPLIT EDITORIAL HERO + FULL-WIDTH ATELIER TRUST STRIP */}
      <section className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className={`grid grid-cols-1 lg:grid-cols-12 items-stretch rounded-2xl overflow-hidden border ${
            isDark
              ? 'bg-[#13151A] border-[#252932]'
              : 'bg-white border-[#E6E1D6]'
          }`}
        >
          {/* Left Editorial Column */}
          <div className="lg:col-span-6 p-7 sm:p-10 lg:p-12 flex flex-col justify-between gap-8">
            <div className="space-y-5">
              {/* Quiet Editorial Kicker (Unboxed) */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs tracking-wide text-[#9A6E1C] dark:text-[#D4AF37] font-medium">
                <span>Sidi Bel Abbès (22)</span>
                <span aria-hidden="true" className="opacity-40">·</span>
                <span>Rue Mohamed Khemisti</span>
                <span aria-hidden="true" className="opacity-40">·</span>
                <a
                  href={GK_STORE_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  @{GK_STORE_INFO.instagramHandle}
                </a>
              </div>

              {/* Balanced Editorial Headline */}
              <h1
                className={`font-display font-semibold tracking-tight leading-[1.12] [text-wrap:balance] text-[clamp(2rem,3.6vw,3.35rem)] ${
                  isDark ? 'text-[#F4F1EA]' : 'text-[#141413]'
                }`}
              >
                {lang === 'ar' ? (
                  <>
                    أناقة الرجل الكلاسيكية
                    <span className="block italic font-normal text-[#9A6E1C] dark:text-[#D4AF37] mt-1">
                      بإطلالة سارتوريال متقنة
                    </span>
                  </>
                ) : lang === 'en' ? (
                  <>
                    Sartorial Menswear,
                    <span className="block italic font-normal text-[#9A6E1C] dark:text-[#D4AF37] mt-1">
                      Tailored for Modern Elegance
                    </span>
                  </>
                ) : (
                  <>
                    L'Élégance Masculine,
                    <span className="block italic font-normal text-[#9A6E1C] dark:text-[#D4AF37] mt-1">
                      Allure Sartoriale & Old Money
                    </span>
                  </>
                )}
              </h1>

              {/* Editorial Description */}
              <p
                className={`text-sm sm:text-base leading-relaxed max-w-xl ${
                  isDark ? 'text-stone-300' : 'text-stone-600'
                }`}
              >
                {lang === 'ar'
                  ? 'تشكيلة مختارة بعناية من البليزر السارتوريال، بولو تريكو فاخر، سراويل كلاسيك بكسرات وأحذية موكاسين من الجلد الطبيعي مع التوصيل السريع لـ 58 ولاية.'
                  : 'Maison de prêt-à-porter masculin à Sidi Bel Abbès : blazers structurés, polos maille tricot, pantalons à pinces et mocassins en cuir véritable. Livraison 58 Wilayas avec paiement cash à la réception.'}
              </p>
            </div>

            {/* Single Dominant Primary CTA + Quiet Secondary Links */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={scrollToCatalog}
                  className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isDark
                      ? 'bg-[#F4F1EA] text-[#141413] hover:bg-white'
                      : 'bg-[#141413] text-[#FAF8F5] hover:bg-[#292826]'
                  }`}
                >
                  <span>
                    {lang === 'ar'
                      ? 'استكشف التشكيلة'
                      : lang === 'en'
                      ? 'Explore Collection'
                      : 'Découvrir la Collection'}
                  </span>
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </button>

                <a
                  href={GK_STORE_INFO.whatsappDirect}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg border text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                    isDark
                      ? 'border-[#2A2E39] text-stone-200 hover:bg-[#1B1E25]'
                      : 'border-[#D9D2C5] text-[#141413] hover:bg-[#F2EFE9]'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>WhatsApp · {GK_STORE_INFO.phoneFormatted}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Editorial Photography Column (Full-Height Balanced Split) */}
          <div className="lg:col-span-6 relative aspect-[4/3] lg:aspect-auto lg:min-h-[460px] bg-[#EAE4D8] dark:bg-[#181A20] overflow-hidden">
            {failedImages['hero'] ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#EFEAE0] to-[#DFD6C5] dark:from-[#16181F] dark:to-[#0E1014]">
                <Shirt className="w-10 h-10 text-[#B48327] mb-3 opacity-70" />
                <span className="font-serif-luxury text-lg font-semibold">ALLURE HOMME</span>
                <span className="text-xs text-stone-500 mt-1">Collection Sartoriale · Sidi Bel Abbès</span>
              </div>
            ) : (
              <img
                src={HERO_ATELIER_IMAGE}
                alt="Collection Sartoriale ALLURE HOMME Sidi Bel Abbès"
                referrerPolicy="no-referrer"
                onError={() => setFailedImages((prev) => ({ ...prev, hero: true }))}
                className="w-full h-full object-cover object-center"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-white">
              <div>
                <p className="text-[11px] tracking-widest uppercase text-amber-200/90 font-medium">
                  {lang === 'ar' ? 'تشكيلة الموسم' : 'Édition Sartoriale 2026'}
                </p>
                <p className="font-serif-luxury text-base sm:text-lg font-medium mt-0.5">
                  {lang === 'ar'
                    ? 'بليزر كحلي، بولو تريكو وسراويل بكسرات'
                    : 'Blazer Marine, Maille Écru & Pantalon à Pinces'}
                </p>
              </div>
              <a
                href={GK_STORE_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-white/90 hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 underline underline-offset-4"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'موقع المحل' : 'Voir en Boutique'}</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Full-Width 4-Column Atelier Trust Strip (Clean Hairline Dividers, Zero Nested Cards) */}
        <div
          className={`grid grid-cols-2 lg:grid-cols-4 border rounded-xl divide-y sm:divide-y-0 sm:divide-x ${
            isDark
              ? 'bg-[#13151A] border-[#252932] divide-[#252932]'
              : 'bg-white border-[#E6E1D6] divide-[#E6E1D6]'
          }`}
        >
          <div className="p-4 sm:p-5 flex items-start gap-3">
            <Truck className="w-4 h-4 text-[#9A6E1C] dark:text-[#D4AF37] mt-0.5 shrink-0" />
            <div>
              <h3 className="text-xs sm:text-sm font-semibold">
                {lang === 'ar' ? 'توصيل 58 ولاية' : 'Livraison 58 Wilayas'}
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {lang === 'ar' ? 'ياليدين للمنزل أو المكتب' : 'Yalidine Express & Stop Desk'}
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-xs sm:text-sm font-semibold">
                {lang === 'ar' ? 'الدفع عند الاستلام' : 'Paiement Cash (COD)'}
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {lang === 'ar' ? 'افحص طلبك قبل الدفع' : 'Vérification avant règlement'}
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex items-start gap-3">
            <MapPin className="w-4 h-4 text-[#9A6E1C] dark:text-[#D4AF37] mt-0.5 shrink-0" />
            <div>
              <h3 className="text-xs sm:text-sm font-semibold">
                {lang === 'ar' ? 'محل سيدي بلعباس' : 'Boutique Sidi Bel Abbès'}
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {lang === 'ar' ? 'شارع محمد خميستي (22)' : 'Rue Mohamed Khemisti (22)'}
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex items-start gap-3">
            <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-xs sm:text-sm font-semibold">
                {lang === 'ar' ? 'استشارة المقاس' : 'Conseil Taille Direct'}
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 mt-0.5 font-mono tabular-nums">
                {GK_STORE_INFO.phoneFormatted}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CURATED COLLECTION & FILTERING */}
      <section id="collection-catalog" className="space-y-6 scroll-mt-24">
        {/* Section Header + Search & Sort */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b pb-5 border-[#E6E1D6] dark:border-[#252932]">
          <div className="space-y-1">
            <p className="text-xs font-medium tracking-wider uppercase text-[#9A6E1C] dark:text-[#D4AF37]">
              {lang === 'ar' ? 'الكتالوج الكامل' : 'Catalogue de la Maison'}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
              {lang === 'ar' ? 'تشكيلة ألور هوم' : 'Pièces Choisies'}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto lg:min-w-[460px]">
            <div className="relative flex-1">
              <Search
                className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 text-stone-400 ${
                  isRTL ? 'right-3.5' : 'left-3.5'
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className={`w-full py-2.5 rounded-lg border text-xs focus:outline-none focus:border-[#B48327] dark:focus:border-[#D4AF37] transition-colors ${
                  isDark
                    ? 'bg-[#13151A] border-[#252932] text-[#F4F1EA] placeholder-stone-500'
                    : 'bg-white border-[#E6E1D6] text-[#141413] placeholder-stone-400'
                } ${isRTL ? 'pr-10 pl-3.5' : 'pl-10 pr-3.5'}`}
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`py-2.5 px-3.5 rounded-lg border text-xs font-medium focus:outline-none focus:border-[#B48327] cursor-pointer shrink-0 ${
                isDark
                  ? 'bg-[#13151A] border-[#252932] text-stone-200'
                  : 'bg-white border-[#E6E1D6] text-stone-800'
              }`}
            >
              <option value="featured">{lang === 'ar' ? 'المقترحات المميزة' : 'Sélection Vedette'}</option>
              <option value="price_low">{lang === 'ar' ? 'السعر: الأقل أولاً' : 'Prix croissant'}</option>
              <option value="price_high">{lang === 'ar' ? 'السعر: الأعلى أولاً' : 'Prix décroissant'}</option>
              <option value="rating">{lang === 'ar' ? 'الأعلى تقييماً' : 'Mieux notés'}</option>
            </select>
          </div>
        </div>

        {/* Category Segmented Tabs + Size Quick Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="w-full overflow-x-auto scrollbar-none pb-1">
            <div className="flex items-center gap-1.5 min-w-max">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  selectedCategory === 'All'
                    ? isDark
                      ? 'bg-[#F4F1EA] text-[#141413] font-semibold'
                      : 'bg-[#141413] text-[#FAF8F5] font-semibold'
                    : isDark
                    ? 'text-stone-400 hover:text-stone-100 hover:bg-[#181B22]'
                    : 'text-stone-600 hover:text-[#141413] hover:bg-[#EFECE4]'
                }`}
              >
                {t.filterAll} ({products.length})
              </button>

              {categories
                .filter((cat) => !cat.includes('Tous') && !cat.includes('كل'))
                .map((cat, idx) => {
                  const isSelected =
                    selectedCategory === cat ||
                    (lang === 'ar' && CASUAL_CATEGORIES_FR[idx + 1] === selectedCategory);
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        isSelected
                          ? isDark
                            ? 'bg-[#F4F1EA] text-[#141413] font-semibold'
                            : 'bg-[#141413] text-[#FAF8F5] font-semibold'
                          : isDark
                          ? 'text-stone-400 hover:text-stone-100 hover:bg-[#181B22]'
                          : 'text-stone-600 hover:text-[#141413] hover:bg-[#EFECE4]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Size quick filter */}
          <div className="flex items-center gap-1 shrink-0 text-xs">
            <span className="text-stone-500 dark:text-stone-400 text-[11px] mr-1 whitespace-nowrap">
              {lang === 'ar' ? 'المقاس:' : 'Taille :'}
            </span>
            {['all', 'M', 'L', 'XL', '42'].map((sz) => (
              <button
                key={sz}
                onClick={() => setActiveSizeFilter(sz)}
                className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  activeSizeFilter === sz
                    ? 'bg-[#B48327] text-white font-semibold'
                    : isDark
                    ? 'text-stone-400 hover:bg-[#181B22]'
                    : 'text-stone-600 hover:bg-[#EFECE4]'
                }`}
              >
                {sz === 'all' ? (lang === 'ar' ? 'الكل' : 'Tout') : sz}
              </button>
            ))}
          </div>
        </div>

        {/* Result Count Line */}
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <span className="tabular-nums">
            {sortedProducts.length}{' '}
            {lang === 'ar' ? 'قطع معروضة' : 'pièces disponibles'}
          </span>
          <span>
            {lang === 'ar' ? 'الأسعار بالدينار الجزائري (دج)' : 'Tarifs directs boutique · DZD'}
          </span>
        </div>

        {/* Empty Filter State */}
        {sortedProducts.length === 0 ? (
          <div
            className={`py-16 px-6 rounded-2xl border text-center space-y-3 ${
              isDark ? 'bg-[#13151A] border-[#252932]' : 'bg-white border-[#E6E1D6]'
            }`}
          >
            <p className="font-display text-lg font-medium">
              {lang === 'ar'
                ? 'لم يتم العثور على منتجات مطابقة'
                : 'Aucune pièce ne correspond à votre recherche'}
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {lang === 'ar'
                ? 'جرب تغيير التصنيف أو إعادة ضبط الفلتر.'
                : 'Essayez de réinitialiser les filtres pour afficher toute la collection.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setActiveSizeFilter('all');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                isDark ? 'bg-[#F4F1EA] text-[#141413]' : 'bg-[#141413] text-[#FAF8F5]'
              }`}
            >
              {lang === 'ar' ? 'عرض كل المنتجات' : 'Afficher toute la collection'}
            </button>
          </div>
        ) : (
          /* Uniform 3-Column Editorial Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
            <AnimatePresence>
              {sortedProducts.map((product) => {
                const displayName = lang === 'ar' && product.nameAr ? product.nameAr : product.name;
                const displaySubtitle =
                  lang === 'ar' && product.subtitleAr ? product.subtitleAr : product.subtitle;
                const displayCategory =
                  lang === 'ar' && product.categoryAr ? product.categoryAr : product.category;
                const isLowStock = product.stock > 0 && product.stock <= 5;
                const isOutOfStock = product.stock === 0;
                const imgBroken = failedImages[product.id];

                return (
                  <motion.article
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`group rounded-xl border overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 ${
                      isDark
                        ? 'bg-[#13151A] border-[#252932] hover:border-[#3A3F4D]'
                        : 'bg-white border-[#E6E1D6] hover:border-[#C9BFA9] hover:shadow-md'
                    }`}
                  >
                    {/* Studio Image Frame (~70% card weight, uniform 3:4 aspect) */}
                    <div
                      className="relative aspect-[3/4] w-full bg-[#EFECE4] dark:bg-[#191C22] overflow-hidden cursor-pointer"
                      onClick={() => onOpenProductDetail(product)}
                    >
                      {imgBroken ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#F2EFE9] to-[#E5DFD2] dark:from-[#181B22] dark:to-[#111318]">
                          <Shirt className="w-8 h-8 text-[#B48327] mb-2 opacity-70" />
                          <span className="text-xs font-medium text-stone-600 dark:text-stone-300 line-clamp-2">
                            {displayName}
                          </span>
                        </div>
                      ) : (
                        <img
                          src={product.images[0]}
                          alt={displayName}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setFailedImages((prev) => ({ ...prev, [product.id]: true }))
                          }
                          className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                          loading="lazy"
                        />
                      )}

                      {/* Single subtle editorial corner tag (at most 1) */}
                      {isOutOfStock ? (
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-red-900/90 text-white text-[10px] font-semibold tracking-wide">
                          {lang === 'ar' ? 'نفذت الكمية' : 'Épuisé'}
                        </span>
                      ) : isLowStock ? (
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/75 text-amber-200 text-[10px] font-medium tracking-wide">
                          {lang === 'ar' ? `متبقي ${product.stock}` : `Stock limité · ${product.stock}`}
                        </span>
                      ) : product.badge ? (
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/65 backdrop-blur-sm text-white text-[10px] font-medium tracking-wide">
                          {lang === 'ar' && product.badgeAr ? product.badgeAr : product.badge}
                        </span>
                      ) : null}

                      {/* Hover Quick View Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenProductDetail(product);
                        }}
                        className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-white/95 dark:bg-[#141413]/90 text-[#141413] dark:text-[#F4F1EA] text-[11px] font-medium flex items-center gap-1.5 shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                        title={t.quickView}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'معاينة' : 'Aperçu'}</span>
                      </button>
                    </div>

                    {/* Clean Unboxed Card Content */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-1.5">
                        {/* Unboxed Metadata Line */}
                        <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                          <span className="uppercase tracking-wider truncate max-w-[190px]">
                            {displayCategory}
                          </span>
                          <span className="flex items-center gap-1 font-mono tabular-nums text-[#9A6E1C] dark:text-[#D4AF37] font-medium shrink-0">
                            <Star className="w-3 h-3 fill-current" />
                            <span>{product.rating.toFixed(1)}</span>
                          </span>
                        </div>

                        <h3
                          onClick={() => onOpenProductDetail(product)}
                          className="text-base font-semibold leading-snug line-clamp-1 cursor-pointer group-hover:text-[#9A6E1C] dark:group-hover:text-[#D4AF37] transition-colors"
                        >
                          {displayName}
                        </h3>

                        <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
                          {displaySubtitle}
                        </p>

                        {/* Clean Inline Sizes (No pill clutter) */}
                        <p className="text-[11px] font-mono text-stone-400 dark:text-stone-500 pt-0.5 truncate">
                          {product.sizes.join(' · ')}
                        </p>
                      </div>

                      {/* Price & Action Footer */}
                      <div className="pt-3 border-t border-[#EDE8DE] dark:border-[#22252D] space-y-3">
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-[15px] font-bold font-mono tabular-nums">
                              {product.price.toLocaleString()} DA
                            </span>
                            {product.compareAtPrice && (
                              <span className="text-xs font-mono tabular-nums text-stone-400 line-through">
                                {product.compareAtPrice.toLocaleString()} DA
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                            {isOutOfStock
                              ? lang === 'ar' ? 'غير متوفر' : 'Rupture'
                              : lang === 'ar' ? 'متوفر' : 'Disponible'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onAddToCart(product, 1, product.sizes[0])}
                            disabled={isOutOfStock}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-40 whitespace-nowrap ${
                              isDark
                                ? 'bg-[#F4F1EA] text-[#141413] hover:bg-white'
                                : 'bg-[#141413] text-[#FAF8F5] hover:bg-[#2B2A28]'
                            }`}
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>{lang === 'ar' ? 'أضف للسلة' : 'Ajouter au Panier'}</span>
                          </button>

                          <button
                            onClick={() => handleQuickWhatsAppBuy(product)}
                            className={`p-2.5 rounded-lg border transition-colors cursor-pointer shrink-0 ${
                              isDark
                                ? 'border-[#252932] text-emerald-400 hover:bg-[#1B1E25]'
                                : 'border-[#E6E1D6] text-emerald-700 hover:bg-emerald-50'
                            }`}
                            title="Commander sur WhatsApp"
                            aria-label="Commander sur WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* SECTION 3: LA MAISON ALLURE HOMME — SIDI BEL ABBÈS */}
      <section
        className={`rounded-2xl border p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
          isDark ? 'bg-[#13151A] border-[#252932]' : 'bg-[#F2EFE9] border-[#E6E1D6]'
        }`}
      >
        <div className="lg:col-span-7 space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-[#9A6E1C] dark:text-[#D4AF37]">
            {lang === 'ar' ? 'المحل الرسمي — سيدي بلعباس (22)' : 'La Boutique Physique · Sidi Bel Abbès (22)'}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight [text-wrap:balance]">
            {lang === 'ar'
              ? 'زورونا في شارع محمد خميستي أو تابعوا إطلالاتنا اليومية'
              : 'Essayages en boutique ou livraison directe chez vous'}
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl">
            {lang === 'ar'
              ? `محل حقيقي في ${GK_STORE_INFO.locationAr}. تصفح أحدث التنسيقات والريلز على حسابنا الرسمي @${GK_STORE_INFO.instagramHandle} أو تواصل معنا مباشرة لمساعدتك في اختيار المقاس المناسب.`
              : `Retrouvez toute la collection en magasin au ${GK_STORE_INFO.location}. Découvrez nos essayages réels et nouvelles arrivées sur Instagram @${GK_STORE_INFO.instagramHandle}.`}
          </p>
        </div>

        <div className="lg:col-span-5 flex flex-wrap lg:justify-end gap-3">
          <a
            href={GK_STORE_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg border text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
              isDark
                ? 'bg-[#1B1E25] border-[#2A2E39] text-[#F4F1EA] hover:border-[#D4AF37]'
                : 'bg-white border-[#D9D2C5] text-[#141413] hover:border-[#B48327]'
            }`}
          >
            <Instagram className="w-4 h-4 text-[#B48327] dark:text-[#D4AF37]" />
            <span>@{GK_STORE_INFO.instagramHandle}</span>
          </a>

          <a
            href={GK_STORE_INFO.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
              isDark
                ? 'bg-[#F4F1EA] text-[#141413] hover:bg-white'
                : 'bg-[#141413] text-[#FAF8F5] hover:bg-[#292826]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{lang === 'ar' ? 'فتح خرائط قوقل' : 'Itinéraire Maps'}</span>
          </a>
        </div>
      </section>
    </div>
  );
};
