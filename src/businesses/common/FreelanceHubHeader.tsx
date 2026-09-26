import React, { useState } from 'react';
import {
  ShoppingBag,
  Store,
  LayoutDashboard,
  MessageCircle,
  Instagram,
  MapPin,
  Sun,
  Moon,
  Menu,
  X,
  Phone,
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
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = UI_TRANSLATIONS[lang];
  const isDark = themeMode === 'dark';

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-xl border-b text-xs transition-colors duration-200 shadow-sm w-full max-w-full overflow-hidden ${
        isDark
          ? 'bg-[#0a0b0e]/95 border-zinc-800 text-zinc-200'
          : 'bg-white/95 border-zinc-200 text-zinc-800'
      }`}
    >
      {/* Top Algerian Delivery Announcement Strip */}
      <div
        className={`border-b px-2 sm:px-6 py-1.5 flex items-center justify-between text-[11px] transition-colors duration-200 w-full overflow-hidden ${
          isDark
            ? 'bg-gradient-to-r from-amber-600/20 via-zinc-900 to-amber-600/20 border-amber-500/20 text-zinc-300'
            : 'bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 border-amber-200/80 text-zinc-800'
        }`}
      >
        <div className="flex items-center gap-1.5 mx-auto sm:mx-0 overflow-hidden text-ellipsis whitespace-nowrap max-w-full px-1">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
          <span className={`font-medium truncate ${isDark ? 'text-amber-200' : 'text-amber-900 font-semibold'}`}>
            {t.deliveryBanner}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-[11px] shrink-0">
          <a
            href={GK_STORE_INFO.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1 transition-colors ${
              isDark ? 'text-zinc-400 hover:text-amber-400' : 'text-zinc-600 hover:text-amber-700'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.mascaraLocation}</span>
          </a>
          <span className={isDark ? 'text-zinc-600' : 'text-zinc-300'}>•</span>
          <a
            href={GK_STORE_INFO.whatsappDirect}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline text-emerald-600 font-semibold"
          >
            <Phone className="w-3 h-3 text-emerald-500" />
            <span>{GK_STORE_INFO.phoneFormatted}</span>
          </a>
        </div>
      </div>

      {/* Main Navigation Bar - Guaranteed 0-overflow on all phone widths */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between gap-1.5 sm:gap-4 w-full min-w-0">
        {/* Brand & Boutique Identity */}
        <div className="flex items-center gap-2 min-w-0 shrink">
          <div
            onClick={() => setViewMode('storefront')}
            className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group min-w-0"
          >
            {/* ALLURE HOMME Official Badge */}
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex flex-col items-center justify-center shrink-0 shadow-sm transition-all ${
                isDark
                  ? 'bg-gradient-to-br from-zinc-800 to-zinc-950 border-amber-400/50 group-hover:border-amber-400'
                  : 'bg-gradient-to-br from-zinc-900 to-black border-amber-500/60 shadow-md'
              }`}
            >
              <span className="text-[10px] sm:text-xs font-serif font-black tracking-tighter text-amber-300 leading-none">AH</span>
              <span className="text-[5px] sm:text-[6px] font-sans font-bold tracking-widest text-zinc-300 uppercase leading-none">HOMME</span>
            </div>

            <div className="min-w-0 max-w-[130px] sm:max-w-none">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className={`text-xs sm:text-base font-bold tracking-tight font-display truncate ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  {GK_STORE_INFO.name}
                </span>
                <span className={`px-1 py-0.2 rounded text-[8px] sm:text-[10px] font-mono font-bold shrink-0 ${
                  isDark ? 'bg-zinc-800 text-amber-300 border border-amber-400/20' : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  22 SBA
                </span>
              </div>
              <p className={`text-[10px] hidden sm:block italic truncate ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                "{GK_STORE_INFO.tagline}"
              </p>
            </div>
          </div>
        </div>

        {/* Center: Switcher Mode (Boutique Client vs Gestion de Stock - desktop only) */}
        <div className={`hidden md:flex items-center p-1 rounded-2xl border transition-colors shrink-0 ${
          isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
        }`}>
          <button
            onClick={() => setViewMode('storefront')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-medium transition-all text-xs cursor-pointer ${
              viewMode === 'storefront'
                ? isDark
                  ? 'bg-amber-400 text-black font-bold shadow-md'
                  : 'bg-white text-zinc-900 font-bold shadow-sm border border-zinc-200'
                : isDark
                ? 'text-zinc-400 hover:text-white'
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>{t.navStore}</span>
          </button>

          <button
            onClick={() => setViewMode('desktop_app')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-medium transition-all text-xs cursor-pointer ${
              viewMode === 'desktop_app'
                ? isDark
                  ? 'bg-zinc-800 text-amber-300 font-bold border border-amber-400/30 shadow-md'
                  : 'bg-amber-500 text-black font-bold shadow-sm'
                : isDark
                ? 'text-zinc-400 hover:text-white'
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{t.navDashboard}</span>
          </button>
        </div>

        {/* Right Tools: Theme Toggle, Language Switcher, Cart, Menu - Carefully sized for mobile viewports */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer ${
              isDark
                ? 'bg-zinc-900 text-amber-400 border-zinc-800 hover:bg-zinc-800'
                : 'bg-zinc-100 text-amber-600 border-zinc-200 hover:bg-zinc-200'
            }`}
            title={isDark ? t.themeLight : t.themeDark}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {/* Language Switcher (FR / AR / EN) */}
          <div className={`flex items-center p-0.5 rounded-xl border text-[9px] sm:text-[11px] ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
          }`}>
            <button
              onClick={() => onSelectLang('fr')}
              className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                lang === 'fr'
                  ? 'bg-amber-400 text-black'
                  : isDark
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => onSelectLang('ar')}
              className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg font-bold transition-colors cursor-pointer font-arabic ${
                lang === 'ar'
                  ? 'bg-amber-400 text-black'
                  : isDark
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              عربي
            </button>
            <button
              onClick={() => onSelectLang('en')}
              className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                lang === 'en'
                  ? 'bg-amber-400 text-black'
                  : isDark
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              EN
            </button>
          </div>

          {/* Direct WhatsApp Contact Button - Desktop */}
          <a
            href={GK_STORE_INFO.whatsappDirect}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isDark
                ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-600/30'
                : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
            }`}
            title="Contacter ALLURE HOMME sur WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>WhatsApp</span>
          </a>

          {/* Shopping Bag Button with Counter */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs shadow-sm hover:from-amber-300 hover:to-amber-400 transition-all cursor-pointer shrink-0"
            aria-label="Ouvrir le panier"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline text-xs">Panier</span>
            {cartCount > 0 && (
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-black text-amber-300 text-[8px] sm:text-[10px] font-bold flex items-center justify-center shadow-inner">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-1.5 rounded-xl transition-colors ${
              isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
            }`}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden border-t p-3 space-y-3 animate-fadeIn w-full overflow-hidden ${
          isDark ? 'border-zinc-800 bg-[#0d0e12]' : 'border-zinc-200 bg-white shadow-xl'
        }`}>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setViewMode('storefront');
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'storefront'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : isDark
                  ? 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                  : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>{t.navStore}</span>
            </button>

            <button
              onClick={() => {
                setViewMode('desktop_app');
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'desktop_app'
                  ? isDark
                    ? 'bg-zinc-800 text-amber-300 border border-amber-400/40'
                    : 'bg-amber-500 text-black shadow-sm'
                  : isDark
                  ? 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                  : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t.navDashboard}</span>
            </button>
          </div>

          <div className={`pt-2 border-t flex items-center justify-around text-xs ${
            isDark ? 'border-zinc-800' : 'border-zinc-200'
          }`}>
            <a
              href={GK_STORE_INFO.whatsappDirect}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-600 font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <a
              href={GK_STORE_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-pink-600 font-semibold"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@{GK_STORE_INFO.instagramHandle}</span>
            </a>

            <a
              href={GK_STORE_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-amber-600 font-semibold"
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
