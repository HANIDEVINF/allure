import React, { useState } from 'react';
import {
  ShoppingBag,
  Sun,
  Moon,
  Menu,
  X,
  MapPin,
  Phone,
  MessageCircle,
  Instagram,
} from 'lucide-react';
import { GK_STORE_INFO, UI_TRANSLATIONS } from '../../data/casualAlgeriaData';
import { LanguageCode } from '../types';

interface FreelanceHubHeaderProps {
  viewMode: 'storefront' | 'desktop_app';
  setViewMode: (mode: 'storefront' | 'desktop_app') => void;
  cartCount: number;
  onOpenCart: () => void;
  lang: LanguageCode;
  onSelectLang: (lang: LanguageCode) => void;
  themeMode: 'light' | 'dark';
  onToggleTheme: () => void;
  onQuickSelectCategory?: (category: string) => void;
}

export const FreelanceHubHeader: React.FC<FreelanceHubHeaderProps> = ({
  viewMode,
  setViewMode,
  cartCount,
  onOpenCart,
  lang,
  onSelectLang,
  themeMode,
  onToggleTheme,
  onQuickSelectCategory,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = UI_TRANSLATIONS[lang];
  const isDark = themeMode === 'dark';

  const handleNavCategory = (cat: string) => {
    setViewMode('storefront');
    if (onQuickSelectCategory) {
      onQuickSelectCategory(cat);
    }
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById('collection-catalog');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-200 w-full max-w-full ${
        isDark
          ? 'bg-[#0B0C0E]/92 border-[#22252D] text-[#F4F1EA]'
          : 'bg-[#FAF8F5]/92 border-[#E6E1D6] text-[#141413]'
      }`}
    >
      {/* Slim Top Atelier Strip (32px, desktop/tablet) */}
      <div
        className={`hidden sm:flex items-center justify-between max-w-7xl mx-auto px-6 lg:px-8 h-8 border-b text-[11px] tracking-wide transition-colors ${
          isDark
            ? 'border-[#1C1F26] text-stone-400'
            : 'border-[#EDE8DE] text-stone-600'
        }`}
      >
        <span className="truncate">{t.deliveryBanner}</span>

        <div className="flex items-center gap-4 shrink-0">
          <a
            href={GK_STORE_INFO.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#B48327] dark:hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0"
          >
            <MapPin className="w-3 h-3 text-[#B48327] dark:text-[#D4AF37]" />
            <span>{t.mascaraLocation}</span>
          </a>
          <span aria-hidden="true" className="opacity-30">|</span>
          <a
            href={GK_STORE_INFO.whatsappDirect}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono tabular-nums hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            <Phone className="w-3 h-3" />
            <span>{GK_STORE_INFO.phoneFormatted}</span>
          </a>
        </div>
      </div>

      {/* Main 3-Zone Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4 lg:gap-8 w-full">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          onClick={() => {
            setViewMode('storefront');
            if (onQuickSelectCategory) onQuickSelectCategory('All');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-serif-luxury text-lg sm:text-xl font-semibold tracking-[0.14em] uppercase whitespace-nowrap shrink-0 cursor-pointer hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B48327]"
        >
          {GK_STORE_INFO.name}
        </button>

        {/* Zone 2: Clean Single-Line Typography Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium">
          <button
            onClick={() => handleNavCategory('All')}
            className={`relative py-1 whitespace-nowrap shrink-0 cursor-pointer transition-colors hover:text-[#B48327] dark:hover:text-[#D4AF37] ${
              viewMode === 'storefront'
                ? 'text-[#141413] dark:text-[#F4F1EA] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-[#B48327] dark:after:bg-[#D4AF37]'
                : 'text-stone-500 dark:text-stone-400'
            }`}
          >
            {lang === 'ar' ? 'التشكيلة' : lang === 'en' ? 'Collection' : 'Collection'}
          </button>

          <button
            onClick={() => handleNavCategory(lang === 'ar' ? 'بذلات وسترات رسمية' : 'Costumes & Blazers')}
            className="py-1 whitespace-nowrap shrink-0 cursor-pointer text-stone-600 dark:text-stone-400 hover:text-[#141413] dark:hover:text-[#F4F1EA] transition-colors"
          >
            {lang === 'ar' ? 'بذلات وبليزر' : lang === 'en' ? 'Tailoring' : 'Blazers'}
          </button>

          <button
            onClick={() => handleNavCategory(lang === 'ar' ? 'بولو وقمصان كلاسيك' : 'Polos & Chemises')}
            className="py-1 whitespace-nowrap shrink-0 cursor-pointer text-stone-600 dark:text-stone-400 hover:text-[#141413] dark:hover:text-[#F4F1EA] transition-colors"
          >
            {lang === 'ar' ? 'بولو وقمصان' : lang === 'en' ? 'Knitwear' : 'Polos & Lin'}
          </button>

          <button
            onClick={() => setViewMode('desktop_app')}
            className={`relative py-1 whitespace-nowrap shrink-0 cursor-pointer transition-colors hover:text-[#B48327] dark:hover:text-[#D4AF37] ${
              viewMode === 'desktop_app'
                ? 'text-[#141413] dark:text-[#F4F1EA] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-[#B48327] dark:after:bg-[#D4AF37]'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            {t.navDashboard}
          </button>
        </nav>

        {/* Zone 3: Utilities + Primary Bag CTA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Switcher */}
          <div
            className={`hidden sm:flex items-center border rounded-lg p-0.5 text-[11px] font-medium ${
              isDark ? 'border-[#252932] bg-[#13151A]' : 'border-[#E6E1D6] bg-white'
            }`}
            role="group"
            aria-label="Language"
          >
            {(['fr', 'ar', 'en'] as LanguageCode[]).map((code) => (
              <button
                key={code}
                onClick={() => onSelectLang(code)}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  code === 'ar' ? 'font-arabic' : ''
                } ${
                  lang === code
                    ? isDark
                      ? 'bg-[#F4F1EA] text-[#141413] font-semibold'
                      : 'bg-[#141413] text-[#FAF8F5] font-semibold'
                    : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
                }`}
              >
                {code === 'ar' ? 'عربي' : code.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-lg border transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center ${
              isDark
                ? 'border-[#252932] bg-[#13151A] text-[#D4AF37] hover:bg-[#1B1E25]'
                : 'border-[#E6E1D6] bg-white text-[#9A6E1C] hover:bg-[#F2EFE9]'
            }`}
            title={isDark ? t.themeLight : t.themeDark}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Primary Action: Shopping Bag */}
          <button
            onClick={onOpenCart}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[38px] ${
              isDark
                ? 'bg-[#F4F1EA] text-[#141413] hover:bg-white'
                : 'bg-[#141413] text-[#FAF8F5] hover:bg-[#292826]'
            }`}
            aria-label="Ouvrir le panier"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'ar' ? 'السلة' : lang === 'en' ? 'Bag' : 'Panier'}</span>
            <span className={`font-mono tabular-nums text-[11px] px-1.5 py-0.2 rounded ${
              cartCount > 0
                ? 'bg-[#B48327] text-white'
                : isDark
                ? 'bg-stone-300 text-stone-800'
                : 'bg-stone-700 text-stone-200'
            }`}>
              {cartCount}
            </span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg border transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center ${
              isDark
                ? 'border-[#252932] text-stone-300 hover:bg-[#13151A]'
                : 'border-[#E6E1D6] text-stone-700 hover:bg-[#F2EFE9]'
            }`}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      {isMobileMenuOpen && (
        <div
          className={`md:hidden border-t px-4 py-4 space-y-4 ${
            isDark ? 'border-[#22252D] bg-[#0E1014]' : 'border-[#E6E1D6] bg-white'
          }`}
        >
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setViewMode('storefront');
                setIsMobileMenuOpen(false);
              }}
              className={`py-2.5 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                viewMode === 'storefront'
                  ? isDark
                    ? 'bg-[#F4F1EA] text-[#141413] border-[#F4F1EA]'
                    : 'bg-[#141413] text-[#FAF8F5] border-[#141413]'
                  : isDark
                  ? 'border-[#252932] text-stone-300'
                  : 'border-[#E6E1D6] text-stone-700'
              }`}
            >
              {t.navStore}
            </button>
            <button
              onClick={() => {
                setViewMode('desktop_app');
                setIsMobileMenuOpen(false);
              }}
              className={`py-2.5 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                viewMode === 'desktop_app'
                  ? isDark
                    ? 'bg-[#F4F1EA] text-[#141413] border-[#F4F1EA]'
                    : 'bg-[#141413] text-[#FAF8F5] border-[#141413]'
                  : isDark
                  ? 'border-[#252932] text-stone-300'
                  : 'border-[#E6E1D6] text-stone-700'
              }`}
            >
              {t.navDashboard}
            </button>
          </div>

          {/* Mobile Language Selector */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-stone-800">
            <span className="text-xs text-stone-500">Langue</span>
            <div className="flex items-center gap-1">
              {(['fr', 'ar', 'en'] as LanguageCode[]).map((code) => (
                <button
                  key={code}
                  onClick={() => onSelectLang(code)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    code === 'ar' ? 'font-arabic' : ''
                  } ${
                    lang === code
                      ? 'bg-[#B48327] text-white'
                      : 'text-stone-500 dark:text-stone-400'
                  }`}
                >
                  {code === 'ar' ? 'عربي' : code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-around pt-2 border-t border-stone-200 dark:border-stone-800 text-xs">
            <a
              href={GK_STORE_INFO.whatsappDirect}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
            <a
              href={GK_STORE_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300 font-medium"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@{GK_STORE_INFO.instagramHandle}</span>
            </a>
            <a
              href={GK_STORE_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#B48327] dark:text-[#D4AF37] font-medium"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Sidi Bel Abbès</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
