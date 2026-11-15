/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BusinessIndustryId, BusinessProduct, BusinessOrder, LanguageCode } from './businesses/types';
import { ALL_BUSINESSES, businessStorage } from './businesses/registry';
import { FreelanceHubHeader } from './businesses/common/FreelanceHubHeader';
import { IndustryStorefront } from './businesses/common/IndustryStorefront';
import { DesktopWindowFrame } from './businesses/common/DesktopWindowFrame';
import { IndustryDesktopApp } from './businesses/common/IndustryDesktopApp';
import { IndustryProductModal } from './businesses/common/IndustryProductModal';
import { IndustryCartDrawer, IndustryCartItem } from './businesses/common/IndustryCartDrawer';
import { GK_STORE_INFO, UI_TRANSLATIONS } from './data/casualAlgeriaData';
import {
  Store,
  LayoutDashboard,
  ShoppingBag,
  MessageCircle,
  MapPin,
  Instagram,
  Phone,
  ShieldCheck,
  Truck,
} from 'lucide-react';

export default function App() {
  const currentBusinessId: BusinessIndustryId = 'casual_men';

  // Light Mode & Dark Mode State (default light mode, synced with html.dark)
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  // Primary language: French by default (fr), with Arabic (ar) and English (en)
  const [lang, setLang] = useState<LanguageCode>('fr');

  // Dual View Mode: Client E-Commerce Storefront vs Stock Management Dashboard
  const [viewMode, setViewMode] = useState<'storefront' | 'desktop_app'>('storefront');

  // Optional category triggered from header navigation
  const [selectedNavCategory, setSelectedNavCategory] = useState<string | undefined>(undefined);

  // Desktop App Internal Tab
  const [desktopAppView, setDesktopAppView] = useState<'stock' | 'stats' | 'orders' | 'settings'>('stock');

  // Business Data Collections
  const [products, setProducts] = useState<BusinessProduct[]>([]);
  const [orders, setOrders] = useState<BusinessOrder[]>([]);

  // Shopping Bag State
  const [cartItems, setCartItems] = useState<IndustryCartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Selected Product for Quick Inspection Modal
  const [inspectedProduct, setInspectedProduct] = useState<BusinessProduct | null>(null);

  // Sync Tailwind .dark class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeMode === 'dark');
  }, [themeMode]);

  const loadBusinessData = () => {
    const p = businessStorage.getProducts(currentBusinessId);
    const o = businessStorage.getOrders(currentBusinessId);
    setProducts(p);
    setOrders(o);
  };

  useEffect(() => {
    loadBusinessData();
  }, []);

  const currentConfig = ALL_BUSINESSES[currentBusinessId];
  const t = UI_TRANSLATIONS[lang];
  const isRTL = lang === 'ar';
  const isDark = themeMode === 'dark';

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Cart operations
  const handleAddToCart = (product: BusinessProduct, quantity = 1, selectedSize?: string) => {
    const sizeToUse = selectedSize || product.sizes[0] || 'M';
    setCartItems((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id && i.selectedSize === sizeToUse);
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity = Math.min(product.stock, next[idx].quantity + quantity);
        return next;
      }
      return [...prev, { product, quantity: Math.min(product.stock, quantity), selectedSize: sizeToUse }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: Math.min(item.product.stock, nextQty) } : null;
          }
          return item;
        })
        .filter(Boolean) as IndustryCartItem[];
    });
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOrderPlaced = () => {
    loadBusinessData();
  };

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div
      className={`min-h-screen w-full max-w-full overflow-x-hidden flex flex-col transition-colors duration-200 ${
        isDark
          ? 'bg-[#0B0C0E] text-[#F4F1EA] selection:bg-[#D4AF37] selection:text-[#141413]'
          : 'bg-[#FAF8F5] text-[#141413] selection:bg-[#B48327] selection:text-white'
      } ${isRTL ? 'font-arabic text-right' : 'font-sans text-left'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Top Bar */}
      <FreelanceHubHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        lang={lang}
        onSelectLang={setLang}
        themeMode={themeMode}
        onToggleTheme={toggleTheme}
        onQuickSelectCategory={(cat) => setSelectedNavCategory(cat)}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full">
        {viewMode === 'storefront' && (
          <IndustryStorefront
            config={currentConfig}
            products={products}
            onAddToCart={handleAddToCart}
            onOpenProductDetail={(prod) => setInspectedProduct(prod)}
            lang={lang}
            themeMode={themeMode}
            externalCategory={selectedNavCategory}
          />
        )}

        {viewMode === 'desktop_app' && (
          <DesktopWindowFrame
            config={currentConfig}
            activeView={desktopAppView}
            setActiveView={setDesktopAppView}
            onRefreshData={loadBusinessData}
            themeMode={themeMode}
          >
            <IndustryDesktopApp
              config={currentConfig}
              products={products}
              orders={orders}
              onRefreshData={loadBusinessData}
              activeView={desktopAppView}
              setActiveView={setDesktopAppView}
              lang={lang}
              themeMode={themeMode}
            />
          </DesktopWindowFrame>
        )}
      </main>

      {/* Product Detail Modal */}
      <IndustryProductModal
        product={inspectedProduct}
        config={currentConfig}
        onClose={() => setInspectedProduct(null)}
        onAddToCart={handleAddToCart}
        lang={lang}
        themeMode={themeMode}
      />

      {/* Shopping Cart Drawer with Algerian 58-Wilayas Checkout */}
      <IndustryCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        config={currentConfig}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOrderPlaced={handleOrderPlaced}
        lang={lang}
        themeMode={themeMode}
      />

      {/* Compact Mobile Bottom Action Bar (<= 56px height) */}
      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 h-14 backdrop-blur-xl border-t px-2 flex items-center justify-around text-[11px] transition-colors w-full ${
          isDark
            ? 'bg-[#0B0C0E]/95 border-[#22252D] text-stone-300'
            : 'bg-[#FAF8F5]/95 border-[#E6E1D6] text-stone-700'
        }`}
        aria-label="Mobile quick actions"
      >
        <button
          onClick={() => setViewMode('storefront')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer py-1 px-3 ${
            viewMode === 'storefront' ? 'text-[#9A6E1C] dark:text-[#D4AF37] font-semibold' : ''
          }`}
        >
          <Store className="w-4 h-4" />
          <span>{t.navStore}</span>
        </button>

        <a
          href={GK_STORE_INFO.whatsappDirect}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-medium py-1 px-3"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-0.5 font-semibold py-1 px-3 cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#B48327] text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
                {totalCartCount}
              </span>
            )}
          </div>
          <span>{lang === 'ar' ? 'السلة' : 'Panier'}</span>
        </button>

        <button
          onClick={() => setViewMode('desktop_app')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer py-1 px-3 ${
            viewMode === 'desktop_app' ? 'text-[#9A6E1C] dark:text-[#D4AF37] font-semibold' : ''
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>{lang === 'ar' ? 'المخزون' : 'Stock'}</span>
        </button>
      </nav>

      {/* Architectural Boutique Footer */}
      <footer
        className={`border-t py-12 text-xs transition-colors mt-auto pb-24 md:pb-12 w-full ${
          isDark
            ? 'border-[#22252D] bg-[#090A0C] text-stone-400'
            : 'border-[#E6E1D6] bg-white text-stone-600'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: Maison Identity */}
            <div className="space-y-3">
              <div className="font-serif-luxury text-lg font-semibold tracking-[0.14em] uppercase text-[#141413] dark:text-[#F4F1EA]">
                {GK_STORE_INFO.name}
              </div>
              <p className="text-xs italic text-[#9A6E1C] dark:text-[#D4AF37]">
                {GK_STORE_INFO.tagline}
              </p>
              <p className="text-xs leading-relaxed">
                Boutique de prêt-à-porter masculin et style sartorial à Sidi Bel Abbès (Rue Mohamed Khemisti). Blazers, polos tricot, pantalons à pinces, ensembles casual et mocassins en cuir.
              </p>
            </div>

            {/* Column 2: Delivery & Payment */}
            <div className="space-y-3">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-[#141413] dark:text-[#F4F1EA]">
                Livraison & Règlement
              </h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#9A6E1C] dark:text-[#D4AF37] shrink-0" />
                  <span>58 Wilayas d'Algérie (Yalidine Express / ZR)</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Paiement Cash à la Livraison (COD)</span>
                </li>
                <li className="text-stone-500 dark:text-stone-400">
                  Livraison rapide à domicile ou retrait Stop Desk
                </li>
              </ul>
            </div>

            {/* Column 3: Boutique Coordinates */}
            <div className="space-y-3">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-[#141413] dark:text-[#F4F1EA]">
                Boutique & Contact
              </h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#9A6E1C] dark:text-[#D4AF37] shrink-0" />
                  <span>{GK_STORE_INFO.location}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <a href={`tel:${GK_STORE_INFO.phone}`} className="hover:underline font-mono tabular-nums">
                    {GK_STORE_INFO.phoneFormatted}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Instagram className="w-3.5 h-3.5 text-[#9A6E1C] dark:text-[#D4AF37] shrink-0" />
                  <a
                    href={GK_STORE_INFO.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    @{GK_STORE_INFO.instagramHandle}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div
            className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] ${
              isDark ? 'border-[#22252D] text-stone-500' : 'border-[#EDE8DE] text-stone-500'
            }`}
          >
            <div>© 2026 ALLURE HOMME · Sidi Bel Abbès (22). Tous droits réservés.</div>
            <div className="flex items-center gap-4">
              <a href={GK_STORE_INFO.mapsUrl} target="_blank" rel="noreferrer" className="hover:text-[#9A6E1C] dark:hover:text-[#D4AF37] transition-colors">
                Google Maps
              </a>
              <span aria-hidden="true">·</span>
              <a href={GK_STORE_INFO.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-[#9A6E1C] dark:hover:text-[#D4AF37] transition-colors">
                Instagram
              </a>
              <span aria-hidden="true">·</span>
              <a href={GK_STORE_INFO.whatsappDirect} target="_blank" rel="noreferrer" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
