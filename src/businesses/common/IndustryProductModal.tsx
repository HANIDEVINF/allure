import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  MessageCircle,
  Shirt,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { BusinessProduct, BusinessIndustryConfig, LanguageCode } from '../types';
import { UI_TRANSLATIONS } from '../../data/casualAlgeriaData';

interface IndustryProductModalProps {
  product: BusinessProduct | null;
  config: BusinessIndustryConfig;
  onClose: () => void;
  onAddToCart: (product: BusinessProduct, quantity: number, selectedSize?: string) => void;
  lang: LanguageCode;
  themeMode?: 'light' | 'dark';
}

export const IndustryProductModal: React.FC<IndustryProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  lang,
  themeMode = 'light',
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || 'M');
      setActiveImageIdx(0);
      setQuantity(1);
      setFailedImages({});
    }
  }, [product]);

  if (!product) return null;

  const t = UI_TRANSLATIONS[lang];
  const isRTL = lang === 'ar';
  const isDark = themeMode === 'dark';
  const isOutOfStock = product.stock === 0;

  const displayName = lang === 'ar' && product.nameAr ? product.nameAr : product.name;
  const displaySubtitle = lang === 'ar' && product.subtitleAr ? product.subtitleAr : product.subtitle;
  const displayDesc = lang === 'ar' && product.descriptionAr ? product.descriptionAr : product.description;
  const displayCategory = lang === 'ar' && product.categoryAr ? product.categoryAr : product.category;
  const displayBadge = lang === 'ar' && product.badgeAr ? product.badgeAr : product.badge;

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedSize);
    onClose();
  };

  const handleWhatsAppOrder = () => {
    const text =
      lang === 'ar'
        ? `سلام، أريد طلب هذا المنتج من متجر ألور هوم (سيدي بلعباس):\n- المنتج: ${displayName}\n- المقاس: ${selectedSize}\n- الكمية: ${quantity}\n- السعر: ${(product.price * quantity).toLocaleString()} دج\nيرجى تأكيد التوصيل.`
        : `Salam, je souhaite commander depuis la boutique ALLURE HOMME Sidi Bel Abbès :\n- Produit : ${displayName}\n- Taille : ${selectedSize}\n- Quantité : ${quantity}\n- Prix Total : ${(product.price * quantity).toLocaleString()} DA\nMerci de me confirmer la disponibilité et la livraison.`;

    window.open(`https://wa.me/213557064156?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto ${
        isRTL ? 'text-right font-arabic' : 'text-left'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-4xl rounded-2xl border shadow-2xl my-auto max-h-[92vh] overflow-y-auto transition-colors ${
          isDark
            ? 'bg-[#13151A] border-[#252932] text-[#F4F1EA]'
            : 'bg-white border-[#E6E1D6] text-[#141413]'
        }`}
      >
        {/* Unboxed Header Bar */}
        <div
          className={`sticky top-0 z-10 flex items-center justify-between px-5 sm:px-7 py-4 border-b backdrop-blur-md ${
            isDark
              ? 'bg-[#13151A]/95 border-[#252932]'
              : 'bg-white/95 border-[#EDE8DE]'
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs text-stone-500 dark:text-stone-400">
            <span className="uppercase tracking-wider font-medium text-[#9A6E1C] dark:text-[#D4AF37]">
              {displayCategory}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{product.sku}</span>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'text-stone-400 hover:text-white hover:bg-[#1B1E25]' : 'text-stone-500 hover:text-black hover:bg-[#F2EFE9]'
            }`}
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contiguous PDP Body */}
        <div className="p-5 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
            {/* Left Gallery Column */}
            <div className="md:col-span-6 space-y-3">
              <div
                className={`aspect-[3/4] rounded-xl overflow-hidden border relative ${
                  isDark ? 'bg-[#191C22] border-[#252932]' : 'bg-[#F2EFE9] border-[#E6E1D6]'
                }`}
              >
                {failedImages[activeImageIdx] ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <Shirt className="w-10 h-10 text-[#B48327] mb-2 opacity-70" />
                    <span className="text-xs font-medium">{displayName}</span>
                  </div>
                ) : (
                  <img
                    src={product.images[activeImageIdx] || product.images[0]}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setFailedImages((prev) => ({ ...prev, [activeImageIdx]: true }))
                    }
                    className="w-full h-full object-cover object-center"
                  />
                )}
                {displayBadge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/70 text-white text-[10px] font-medium tracking-wide">
                    {displayBadge}
                  </span>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-2.5">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-16 aspect-[3/4] rounded-lg overflow-hidden border transition-all cursor-pointer ${
                        activeImageIdx === idx
                          ? 'border-[#B48327] dark:border-[#D4AF37] ring-1 ring-[#B48327]'
                          : 'border-[#E6E1D6] dark:border-[#252932] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Contiguous Purchase Module */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Rating */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-0.5 text-[#B48327] dark:text-[#D4AF37]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-mono font-semibold tabular-nums">{product.rating.toFixed(1)}</span>
                  <span className="text-stone-500 dark:text-stone-400">
                    ({product.reviewsCount} {t.reviews})
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-1.5">
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold leading-snug [text-wrap:balance]">
                    {displayName}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#9A6E1C] dark:text-[#D4AF37] font-medium">
                    {displaySubtitle}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 py-2 border-y border-[#EDE8DE] dark:border-[#22252D]">
                  <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums">
                    {product.price.toLocaleString()} DA
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm font-mono tabular-nums text-stone-400 line-through">
                      {product.compareAtPrice.toLocaleString()} DA
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                  {displayDesc}
                </p>

                {/* Size Selector */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold">{t.selectSize}</span>
                    <span className="font-mono font-semibold text-[#9A6E1C] dark:text-[#D4AF37]">
                      {selectedSize}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-mono font-semibold border transition-colors cursor-pointer ${
                          selectedSize === s
                            ? isDark
                              ? 'bg-[#F4F1EA] text-[#141413] border-[#F4F1EA]'
                              : 'bg-[#141413] text-[#FAF8F5] border-[#141413]'
                            : isDark
                            ? 'bg-[#191C22] text-stone-300 border-[#252932] hover:border-stone-500'
                            : 'bg-[#FAF8F5] text-stone-700 border-[#E6E1D6] hover:border-stone-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity & Stock */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                      {lang === 'ar' ? 'الكمية :' : 'Quantité :'}
                    </span>
                    <div
                      className={`inline-flex items-center border rounded-lg ${
                        isDark ? 'border-[#252932] bg-[#191C22]' : 'border-[#E6E1D6] bg-[#FAF8F5]'
                      }`}
                    >
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2.5 text-stone-500 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                        aria-label="Diminuer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-mono font-bold tabular-nums">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="p-2.5 text-stone-500 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                        aria-label="Augmenter"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <span className="text-xs font-mono tabular-nums text-stone-500 dark:text-stone-400">
                    {product.stock} {t.stockLeft}
                  </span>
                </div>
              </div>

              {/* Action Stack */}
              <div className="space-y-2.5 pt-4 border-t border-[#EDE8DE] dark:border-[#22252D]">
                <button
                  onClick={handleAdd}
                  disabled={isOutOfStock}
                  className={`w-full py-3.5 px-5 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-40 ${
                    isDark
                      ? 'bg-[#F4F1EA] text-[#141413] hover:bg-white'
                      : 'bg-[#141413] text-[#FAF8F5] hover:bg-[#292826]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t.addToCart} · {(product.price * quantity).toLocaleString()} DA</span>
                </button>

                <button
                  onClick={handleWhatsAppOrder}
                  className={`w-full py-3 px-5 rounded-lg border font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    isDark
                      ? 'border-[#252932] text-emerald-400 hover:bg-[#1B1E25]'
                      : 'border-[#D9D2C5] text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.orderOnWhatsApp}</span>
                </button>

                <div className="flex items-center justify-center gap-5 pt-2 text-[11px] text-stone-500 dark:text-stone-400">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#9A6E1C] dark:text-[#D4AF37]" />
                    <span>58 Wilayas Yalidine</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Paiement Cash (COD)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Hairline Specifications Table */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="border-t pt-6 border-[#EDE8DE] dark:border-[#22252D] space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {lang === 'ar' ? 'المواصفات والنسيج' : 'Fiche Technique & Matière'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div
                    key={key}
                    className="flex justify-between gap-4 py-2.5 border-b border-[#EDE8DE] dark:border-[#22252D]"
                  >
                    <span className="text-stone-500 dark:text-stone-400">{key}</span>
                    <span className="font-medium text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
