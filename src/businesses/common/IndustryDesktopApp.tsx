import React, { useState } from 'react';
import {
  Package,
  Boxes,
  DollarSign,
  TrendingUp,
  Plus,
  Trash2,
  Download,
  Search,
  Truck,
  BarChart3,
  X,
  MessageCircle,
  MapPin,
  Shirt,
} from 'lucide-react';
import { BusinessIndustryConfig, BusinessProduct, BusinessOrder, LanguageCode } from '../types';
import { businessStorage } from '../registry';
import { jsPDF } from 'jspdf';
import {
  CASUAL_STORE_INFO,
  UI_TRANSLATIONS,
  STUDIO_IMAGE_PRESETS,
} from '../../data/casualAlgeriaData';

interface IndustryDesktopAppProps {
  config: BusinessIndustryConfig;
  products: BusinessProduct[];
  orders: BusinessOrder[];
  onRefreshData: () => void;
  activeView: 'stock' | 'stats' | 'orders' | 'settings';
  setActiveView: (view: 'stock' | 'stats' | 'orders' | 'settings') => void;
  lang: LanguageCode;
  themeMode?: 'light' | 'dark';
}

const DEFAULT_STUDIO_IMAGE = STUDIO_IMAGE_PRESETS[0].url;

export const IndustryDesktopApp: React.FC<IndustryDesktopAppProps> = ({
  config,
  products,
  orders,
  onRefreshData,
  activeView,
  setActiveView,
  lang,
  themeMode = 'light',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const [newProdName, setNewProdName] = useState('');
  const [newProdNameAr, setNewProdNameAr] = useState('');
  const [newProdSku, setNewProdSku] = useState(`AH-${Math.floor(100 + Math.random() * 900)}`);
  const [newProdCategory, setNewProdCategory] = useState(
    config.categories[1] || 'Costumes & Blazers'
  );
  const [newProdPrice, setNewProdPrice] = useState(4500);
  const [newProdCost, setNewProdCost] = useState(2400);
  const [newProdStock, setNewProdStock] = useState(12);
  const [newProdSizes, setNewProdSizes] = useState('M, L, XL, XXL');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState(DEFAULT_STUDIO_IMAGE);

  const t = UI_TRANSLATIONS[lang];
  const isRTL = lang === 'ar';
  const isDark = themeMode === 'dark';
  const stats = businessStorage.getStats(config.id);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.nameAr && p.nameAr.includes(searchQuery)) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStock =
      stockFilter === 'all'
        ? true
        : stockFilter === 'low'
        ? p.stock > 0 && p.stock <= 5
        : p.stock === 0;
    return matchesSearch && matchesStock;
  });

  const handleInlineStockDelta = (productId: string, delta: number) => {
    businessStorage.updateStock(config.id, productId, delta);
    onRefreshData();
  };

  const handleInlinePriceChange = (productId: string, newPrice: number) => {
    businessStorage.updatePrice(config.id, productId, newPrice);
    onRefreshData();
  };

  const handleDeleteProduct = (productId: string) => {
    if (
      confirm(
        lang === 'ar'
          ? 'هل أنت متأكد من حذف هذا المنتج من المخزون؟'
          : 'Supprimer cet article de la base magasin ALLURE HOMME ?'
      )
    ) {
      businessStorage.deleteProduct(config.id, productId);
      onRefreshData();
    }
  };

  const handleSaveNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const sizesArray = newProdSizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const newProduct: BusinessProduct = {
      id: `ah-${Date.now()}`,
      sku: newProdSku,
      name: newProdName,
      nameAr: newProdNameAr || newProdName,
      subtitle: 'Nouvel arrivage ALLURE HOMME Sidi Bel Abbès',
      category: newProdCategory,
      price: Number(newProdPrice),
      costPrice: Number(newProdCost),
      stock: Number(newProdStock),
      sizes: sizesArray.length > 0 ? sizesArray : ['M', 'L', 'XL'],
      images: [newProdImage || DEFAULT_STUDIO_IMAGE],
      description: newProdDesc || 'Article sélectionné pour la collection ALLURE HOMME.',
      specs: {
        Origine: 'Arrivage ALLURE HOMME Sidi Bel Abbès (22)',
        Standard: 'Qualité Contrôlée',
      },
      highlights: ['Disponible en magasin', 'Livraison 58 wilayas'],
      rating: 5.0,
      reviewsCount: 1,
      badge: 'Nouveauté 2026',
    };

    businessStorage.addProduct(config.id, newProduct);
    setIsAddModalOpen(false);
    setNewProdName('');
    setNewProdNameAr('');
    setNewProdSku(`AH-${Math.floor(100 + Math.random() * 900)}`);
    onRefreshData();
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    status: BusinessOrder['fulfillmentStatus']
  ) => {
    businessStorage.updateOrderStatus(config.id, orderId, status);
    onRefreshData();
  };

  const handleChatWithCustomer = (order: BusinessOrder) => {
    const cleanPhone = order.customerPhone.replace(/\s+/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? `213${cleanPhone.slice(1)}` : cleanPhone;
    const msg = `Salam ${order.customerName}, nous vous contactons depuis la boutique ALLURE HOMME Sidi Bel Abbès concernant votre commande ${order.orderNumber} d'un montant de ${order.totalAmount.toLocaleString()} DA. Êtes-vous disponible pour confirmer la livraison à ${order.customerWilaya} ?`;
    window.open(`https://wa.me/${intlPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleExportPDFReport = () => {
    setIsExportingPDF(true);
    setTimeout(() => {
      try {
        const doc = new jsPDF();

        doc.setFillColor(20, 20, 19);
        doc.rect(0, 0, 210, 42, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(212, 175, 55);
        doc.setFontSize(18);
        doc.text('ALLURE HOMME SIDI BEL ABBÈS - GESTION DE STOCK & AUDIT', 14, 18);

        doc.setFontSize(9);
        doc.setTextColor(210, 210, 210);
        doc.text('AUDIT FINANCIER & ÉTAT DES STOCKS MAGASIN', 14, 26);
        doc.text(
          `Date d'export : ${new Date().toLocaleDateString()} • Magasin : Sidi Bel Abbès (22)`,
          14,
          33
        );

        doc.setTextColor(30, 41, 59);
        doc.setFontSize(12);
        doc.text('1. APERÇU FINANCIER GLOBAL (DZD)', 14, 52);

        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        doc.text(`• Chiffre d'Affaires Brut : ${stats.grossRevenue.toLocaleString()} DA`, 14, 62);
        doc.text(`• Marge Nette Estimée : ${stats.netProfit.toLocaleString()} DA`, 14, 70);
        doc.text(`• Nombre de Commandes Enregistrées : ${stats.orderCount}`, 14, 78);
        doc.text(
          `• Panier Moyen Client : ${
            stats.orderCount > 0
              ? Math.round(stats.grossRevenue / stats.orderCount).toLocaleString()
              : 0
          } DA`,
          14,
          86
        );

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('2. SANTÉ DU STOCK EN MAGASIN (SBA 22)', 14, 102);

        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        doc.text(
          `• Total des Pièces Physiques en Stock : ${stats.totalUnitsInStock} unités`,
          14,
          112
        );
        doc.text(
          `• Articles en Alerte Stock Faible (<= 5 pièces) : ${stats.lowStockCount} articles`,
          14,
          120
        );

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('3. ARTICLES DU CATALOGUE & NIVEAUX DE STOCK', 14, 136);

        let yPos = 146;
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');

        products.forEach((p, idx) => {
          if (yPos > 265) {
            doc.addPage();
            yPos = 20;
          }
          const line = `${idx + 1}. [${p.sku}] ${p.name.substring(0, 45)} | Stock: ${p.stock} pcs | Prix: ${p.price.toLocaleString()} DA`;
          doc.text(line, 14, yPos);
          yPos += 7;
        });

        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text(
          'Document certifié par ALLURE HOMME Sidi Bel Abbès • Système Gestion de Stock',
          14,
          285
        );

        doc.save(`Rapport_Stock_ALLUREHOMME_${new Date().toISOString().split('T')[0]}.pdf`);
      } catch (err) {
        console.error('PDF export error', err);
      } finally {
        setIsExportingPDF(false);
      }
    }, 350);
  };

  // Compute live category breakdown from products inventory value & orders
  const footwearSales = orders.reduce((acc, o) => {
    const shoeTotal = o.items
      .filter((i) => i.sku.includes('MOC') || i.sku.includes('SNK'))
      .reduce((s, i) => s + i.price * i.quantity, 0);
    return acc + shoeTotal;
  }, 0);
  const totalItemSales = orders.reduce(
    (acc, o) => acc + o.items.reduce((s, i) => s + i.price * i.quantity, 0),
    0
  );
  const apparelSales = Math.max(0, totalItemSales - footwearSales);
  const apparelPct = totalItemSales > 0 ? Math.round((apparelSales / totalItemSales) * 100) : 70;
  const footwearPct = totalItemSales > 0 ? 100 - apparelPct : 30;

  return (
    <div
      className={`space-y-6 ${isRTL ? 'text-right font-arabic' : 'text-left'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E1D6] dark:border-[#252932]">
        <div className="space-y-0.5">
          <h2 className="font-display text-xl sm:text-2xl font-semibold">
            {t.dashboardTitle}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Magasin Rue Mohamed Khemisti (22) · Suivi stock et expéditions Yalidine 58 Wilayas
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              isDark
                ? 'bg-[#F4F1EA] text-[#141413] hover:bg-white'
                : 'bg-[#141413] text-[#FAF8F5] hover:bg-[#292826]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addNewProduct}</span>
          </button>

          <button
            onClick={handleExportPDFReport}
            disabled={isExportingPDF}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              isDark
                ? 'bg-[#13151A] hover:bg-[#1B1E25] text-stone-200 border-[#252932]'
                : 'bg-white hover:bg-[#F2EFE9] text-[#141413] border-[#E6E1D6]'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-[#9A6E1C] dark:text-[#D4AF37]" />
            <span>{isExportingPDF ? 'Export...' : 'Rapport PDF'}</span>
          </button>
        </div>
      </div>

      {/* Flat Single-Elevation 4-Column KPI Strip with Tabular Numerals */}
      <div
        className={`grid grid-cols-2 lg:grid-cols-4 border rounded-xl divide-y lg:divide-y-0 sm:divide-x ${
          isDark
            ? 'bg-[#13151A] border-[#252932] divide-[#252932]'
            : 'bg-white border-[#E6E1D6] divide-[#E6E1D6]'
        }`}
      >
        <div className="p-4 sm:p-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>{t.kpiGrossRevenue}</span>
            <DollarSign className="w-3.5 h-3.5 text-[#9A6E1C] dark:text-[#D4AF37]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums">
            {stats.grossRevenue.toLocaleString()} DA
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Encours boutique & COD</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>{t.kpiNetProfit}</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            {stats.netProfit.toLocaleString()} DA
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400">
            Marge estimée sur coût d'achat
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>{t.kpiOrders}</span>
            <Truck className="w-3.5 h-3.5 text-[#9A6E1C] dark:text-[#D4AF37]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums">
            {orders.length}
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400">
            Expéditions 58 Wilayas
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>{t.kpiStock}</span>
            <Boxes className="w-3.5 h-3.5 text-stone-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums">
            {stats.totalUnitsInStock}{' '}
            <span className="text-xs font-normal text-stone-400">pcs</span>
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium tabular-nums">
            {stats.lowStockCount} articles en stock faible
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b gap-6 overflow-x-auto scrollbar-none border-[#E6E1D6] dark:border-[#252932]">
        {[
          { id: 'stock', label: `${t.tabStock} (${products.length})`, icon: Package },
          { id: 'orders', label: `${t.tabOrders} (${orders.length})`, icon: Truck },
          { id: 'stats', label: t.tabStats, icon: BarChart3 },
          { id: 'settings', label: t.tabSettings, icon: MapPin },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center gap-2 pb-3 text-xs font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                active
                  ? 'border-[#141413] dark:border-[#F4F1EA] text-[#141413] dark:text-[#F4F1EA] font-semibold'
                  : 'border-transparent text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PRODUCTS & INVENTORY TABLE */}
      {activeView === 'stock' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-3.5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par article ou SKU..."
                className={`w-full py-2.5 pl-10 pr-3.5 rounded-lg border text-xs focus:outline-none focus:border-[#B48327] ${
                  isDark
                    ? 'bg-[#13151A] border-[#252932] text-white'
                    : 'bg-white border-[#E6E1D6] text-[#141413]'
                }`}
              />
            </div>

            <div
              className={`flex items-center gap-1 p-1 rounded-lg border text-xs shrink-0 ${
                isDark ? 'bg-[#13151A] border-[#252932]' : 'bg-white border-[#E6E1D6]'
              }`}
            >
              {[
                { id: 'all', label: 'Tous' },
                { id: 'low', label: 'Stock Faible (<= 5)' },
                { id: 'out', label: 'Rupture (0)' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStockFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    stockFilter === f.id
                      ? isDark
                        ? 'bg-[#F4F1EA] text-[#141413] font-semibold'
                        : 'bg-[#141413] text-[#FAF8F5] font-semibold'
                      : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`rounded-xl border overflow-hidden ${
              isDark ? 'border-[#252932] bg-[#13151A]' : 'border-[#E6E1D6] bg-white'
            }`}
          >
            {filteredProducts.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <p className="text-sm font-medium">Aucun article trouvé</p>
                <p className="text-xs text-stone-500">Modifiez votre filtre ou ajoutez un article.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead
                    className={`border-b text-[11px] uppercase tracking-wider font-medium ${
                      isDark
                        ? 'bg-[#0E1014] border-[#252932] text-stone-400'
                        : 'bg-[#F2EFE9] border-[#E6E1D6] text-stone-600'
                    }`}
                  >
                    <tr>
                      <th className="py-3 px-4">Article</th>
                      <th className="py-3 px-4">Catégorie</th>
                      <th className="py-3 px-4">Tailles</th>
                      <th className="py-3 px-4 text-right">Prix (DA)</th>
                      <th className="py-3 px-4 text-right">Stock</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE8DE] dark:divide-[#22252D]">
                    {filteredProducts.map((p) => (
                      <tr
                        key={p.id}
                        className="hover:bg-[#FAF8F5] dark:hover:bg-[#191C22] transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images[0]}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-9 h-12 rounded object-cover bg-[#EFECE4] shrink-0 border border-[#E6E1D6] dark:border-[#252932]"
                            />
                            <div className="min-w-0">
                              <div className="font-semibold line-clamp-1">{p.name}</div>
                              <div className="text-[11px] text-stone-400 font-mono">{p.sku}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-stone-600 dark:text-stone-300 whitespace-nowrap">
                          {p.category}
                        </td>

                        <td className="py-3 px-4 font-mono text-[11px] text-stone-500">
                          {p.sizes.join(' · ')}
                        </td>

                        <td className="py-3 px-4 text-right font-mono tabular-nums">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            <input
                              type="number"
                              defaultValue={p.price}
                              onBlur={(e) => handleInlinePriceChange(p.id, Number(e.target.value))}
                              className={`w-20 px-2 py-1 rounded border text-right font-semibold tabular-nums focus:outline-none focus:border-[#B48327] ${
                                isDark
                                  ? 'bg-[#0E1014] border-[#252932] text-[#D4AF37]'
                                  : 'bg-[#FAF8F5] border-[#E6E1D6] text-[#141413]'
                              }`}
                            />
                            <span className="text-stone-400 text-[10px]">DA</span>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center justify-end gap-2">
                            <div
                              className={`inline-flex items-center border rounded ${
                                isDark
                                  ? 'border-[#252932] bg-[#0E1014]'
                                  : 'border-[#E6E1D6] bg-[#FAF8F5]'
                              }`}
                            >
                              <button
                                onClick={() => handleInlineStockDelta(p.id, -1)}
                                className="px-2 py-1 text-stone-500 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                              >
                                -
                              </button>
                              <span
                                className={`px-2 font-mono font-semibold tabular-nums ${
                                  p.stock <= 5
                                    ? 'text-amber-600 dark:text-amber-400'
                                    : ''
                                }`}
                              >
                                {p.stock}
                              </span>
                              <button
                                onClick={() => handleInlineStockDelta(p.id, 1)}
                                className="px-2 py-1 text-stone-500 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 rounded text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Supprimer l'article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS & WILAYA FULFILLMENT */}
      {activeView === 'orders' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className={`p-5 rounded-xl border space-y-3.5 ${
                isDark ? 'bg-[#13151A] border-[#252932]' : 'bg-white border-[#E6E1D6]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="font-mono font-bold text-[#9A6E1C] dark:text-[#D4AF37]">
                    {o.orderNumber}
                  </span>
                  <span aria-hidden="true" className="text-stone-400">·</span>
                  <span className="font-mono tabular-nums text-stone-500">{o.date}</span>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                    o.fulfillmentStatus === 'delivered'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                      : o.fulfillmentStatus === 'shipped_yalidine'
                      ? 'bg-blue-500/15 text-blue-700 dark:text-blue-400'
                      : o.fulfillmentStatus === 'confirmed_phone'
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {o.fulfillmentStatus === 'delivered'
                    ? 'Livré & Encaissé'
                    : o.fulfillmentStatus === 'shipped_yalidine'
                    ? 'Expédié Yalidine'
                    : o.fulfillmentStatus === 'confirmed_phone'
                    ? 'Confirmé par tél'
                    : o.fulfillmentStatus === 'cancelled'
                    ? 'Annulé'
                    : 'En attente'}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{o.customerName}</span>
                  <button
                    onClick={() => handleChatWithCustomer(o)}
                    className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono tabular-nums hover:underline cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{o.customerPhone}</span>
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
                  <MapPin className="w-3.5 h-3.5 text-[#9A6E1C] dark:text-[#D4AF37] shrink-0" />
                  <span>
                    {o.customerWilaya} {o.customerCommune && `· ${o.customerCommune}`}
                  </span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-[#EDE8DE] dark:border-[#22252D] space-y-1.5 text-xs">
                {o.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between gap-2 text-stone-600 dark:text-stone-300">
                    <span className="truncate">
                      {i.name} ({i.selectedSize || 'M'}) ×{i.quantity}
                    </span>
                    <span className="font-mono tabular-nums shrink-0">
                      {(i.price * i.quantity).toLocaleString()} DA
                    </span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-[#EDE8DE] dark:border-[#22252D] font-bold">
                  <span>Total Cash (COD)</span>
                  <span className="font-mono tabular-nums text-[#9A6E1C] dark:text-[#D4AF37]">
                    {o.totalAmount.toLocaleString()} DA
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <select
                  value={o.fulfillmentStatus}
                  onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs focus:outline-none focus:border-[#B48327] cursor-pointer ${
                    isDark
                      ? 'bg-[#0E1014] border-[#252932] text-white'
                      : 'bg-[#FAF8F5] border-[#E6E1D6] text-[#141413]'
                  }`}
                >
                  <option value="unfulfilled">En attente de confirmation</option>
                  <option value="confirmed_phone">Confirmé par téléphone</option>
                  <option value="shipped_yalidine">Expédié Yalidine Express</option>
                  <option value="delivered">Livré & Encaissé</option>
                  <option value="cancelled">Annulé</option>
                </select>

                <button
                  onClick={() => handleChatWithCustomer(o)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: ANALYTICS */}
      {activeView === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={`p-5 rounded-xl border space-y-4 ${
              isDark ? 'bg-[#13151A] border-[#252932]' : 'bg-white border-[#E6E1D6]'
            }`}
          >
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#9A6E1C] dark:text-[#D4AF37]" />
              <span>Répartition du Chiffre d'Affaires</span>
            </h3>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-500 dark:text-stone-400">
                    Prêt-à-porter & Blazers
                  </span>
                  <span className="font-mono font-semibold tabular-nums">
                    {apparelSales.toLocaleString()} DA ({apparelPct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden bg-[#EDE8DE] dark:bg-[#22252D]">
                  <div
                    className="h-full bg-[#141413] dark:bg-[#F4F1EA] rounded-full"
                    style={{ width: `${apparelPct}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-500 dark:text-stone-400">
                    Chaussures & Mocassins
                  </span>
                  <span className="font-mono font-semibold tabular-nums">
                    {footwearSales.toLocaleString()} DA ({footwearPct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden bg-[#EDE8DE] dark:bg-[#22252D]">
                  <div
                    className="h-full bg-[#B48327] dark:bg-[#D4AF37] rounded-full"
                    style={{ width: `${footwearPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className={`p-5 rounded-xl border space-y-3 ${
              isDark ? 'bg-[#13151A] border-[#252932]' : 'bg-white border-[#E6E1D6]'
            }`}
          >
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#9A6E1C] dark:text-[#D4AF37]" />
              <span>Commandes Récentes par Wilaya</span>
            </h3>
            <div className="divide-y divide-[#EDE8DE] dark:divide-[#22252D] text-xs">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="py-2.5 flex items-center justify-between">
                  <span className="truncate max-w-[210px]">{o.customerWilaya}</span>
                  <span className="font-mono font-semibold tabular-nums text-[#9A6E1C] dark:text-[#D4AF37]">
                    {o.totalAmount.toLocaleString()} DA
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STORE SETTINGS */}
      {activeView === 'settings' && (
        <div
          className={`p-6 rounded-xl border max-w-2xl space-y-5 ${
            isDark ? 'bg-[#13151A] border-[#252932]' : 'bg-white border-[#E6E1D6]'
          }`}
        >
          <div className="space-y-1">
            <h3 className="font-display text-lg font-semibold">{CASUAL_STORE_INFO.name}</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Boutique de prêt-à-porter masculin · Sidi Bel Abbès (22)
            </p>
          </div>

          <div className="divide-y divide-[#EDE8DE] dark:divide-[#22252D] text-xs">
            <div className="py-3 flex justify-between gap-4">
              <span className="text-stone-500 dark:text-stone-400">Adresse Physique</span>
              <span className="font-medium text-right">{CASUAL_STORE_INFO.location}</span>
            </div>
            <div className="py-3 flex justify-between gap-4">
              <span className="text-stone-500 dark:text-stone-400">Téléphone & WhatsApp</span>
              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                {CASUAL_STORE_INFO.phoneFormatted}
              </span>
            </div>
            <div className="py-3 flex justify-between gap-4">
              <span className="text-stone-500 dark:text-stone-400">Instagram Officiel</span>
              <a
                href={CASUAL_STORE_INFO.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[#9A6E1C] dark:text-[#D4AF37] hover:underline"
              >
                @{CASUAL_STORE_INFO.instagramHandle}
              </a>
            </div>
            <div className="py-3 flex justify-between gap-4">
              <span className="text-stone-500 dark:text-stone-400">Google Maps</span>
              <a
                href={CASUAL_STORE_INFO.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium hover:underline"
              >
                Ouvrir la localisation
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW PRODUCT MODAL */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-lg rounded-2xl border p-6 space-y-4 text-left my-auto shadow-2xl ${
              isDark
                ? 'bg-[#13151A] border-[#252932] text-[#F4F1EA]'
                : 'bg-white border-[#E6E1D6] text-[#141413]'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-[#EDE8DE] dark:border-[#22252D]">
              <h3 className="font-display text-lg font-semibold">
                Ajouter un Article au Catalogue
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewProduct} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-medium">Nom de l'Article (Français) *</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="Ex: Polo Old Money Tricot Col Blanc"
                  className={`w-full p-2.5 rounded-lg border focus:outline-none focus:border-[#B48327] ${
                    isDark
                      ? 'bg-[#0E1014] border-[#252932] text-white'
                      : 'bg-[#FAF8F5] border-[#E6E1D6] text-[#141413]'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium">Nom en Arabe (Optionnel)</label>
                <input
                  type="text"
                  value={newProdNameAr}
                  onChange={(e) => setNewProdNameAr(e.target.value)}
                  placeholder="مثال: بولو أولد موني راقي"
                  className={`w-full p-2.5 rounded-lg border focus:outline-none focus:border-[#B48327] text-right font-arabic ${
                    isDark
                      ? 'bg-[#0E1014] border-[#252932] text-white'
                      : 'bg-[#FAF8F5] border-[#E6E1D6] text-[#141413]'
                  }`}
                  dir="rtl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium">Catégorie *</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border focus:outline-none focus:border-[#B48327] cursor-pointer ${
                      isDark
                        ? 'bg-[#0E1014] border-[#252932] text-white'
                        : 'bg-[#FAF8F5] border-[#E6E1D6] text-[#141413]'
                    }`}
                  >
                    {config.categories
                      .filter((c) => !c.toLowerCase().includes('all') && !c.includes('Tous'))
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium">Tailles *</label>
                  <input
                    type="text"
                    value={newProdSizes}
                    onChange={(e) => setNewProdSizes(e.target.value)}
                    placeholder="M, L, XL, XXL"
                    className={`w-full p-2.5 rounded-lg border font-mono ${
                      isDark
                        ? 'bg-[#0E1014] border-[#252932] text-white'
                        : 'bg-[#FAF8F5] border-[#E6E1D6] text-[#141413]'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div className="space-y-1">
                  <label className="font-medium">Prix Vente (DA) *</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className={`w-full p-2.5 rounded-lg border font-semibold font-mono tabular-nums ${
                      isDark
                        ? 'bg-[#0E1014] border-[#252932] text-[#D4AF37]'
                        : 'bg-[#FAF8F5] border-[#E6E1D6] text-[#141413]'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium">Coût Achat (DA)</label>
                  <input
                    type="number"
                    value={newProdCost}
                    onChange={(e) => setNewProdCost(Number(e.target.value))}
                    className={`w-full p-2.5 rounded-lg border font-mono tabular-nums ${
                      isDark
                        ? 'bg-[#0E1014] border-[#252932] text-white'
                        : 'bg-[#FAF8F5] border-[#E6E1D6] text-[#141413]'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium">Stock Initial *</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className={`w-full p-2.5 rounded-lg border font-mono tabular-nums ${
                      isDark
                        ? 'bg-[#0E1014] border-[#252932] text-white'
                        : 'bg-[#FAF8F5] border-[#E6E1D6] text-[#141413]'
                    }`}
                  />
                </div>
              </div>

              {/* Quick Studio Photo Preset Picker */}
              <div className="space-y-1.5">
                <label className="font-medium">Visuel Studio</label>
                <div className="flex flex-wrap gap-1.5">
                  {STUDIO_IMAGE_PRESETS.map((preset) => (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => setNewProdImage(preset.url)}
                      className={`px-2.5 py-1 rounded text-[11px] border cursor-pointer transition-colors ${
                        newProdImage === preset.url
                          ? 'border-[#B48327] bg-[#B48327]/15 font-semibold'
                          : 'border-[#E6E1D6] dark:border-[#252932] text-stone-500'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className={`w-full p-2 rounded-lg border text-[11px] font-mono ${
                    isDark
                      ? 'bg-[#0E1014] border-[#252932] text-white'
                      : 'bg-[#FAF8F5] border-[#E6E1D6] text-[#141413]'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EDE8DE] dark:border-[#22252D]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#E6E1D6] dark:border-[#252932] text-stone-600 dark:text-stone-300 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-lg font-semibold cursor-pointer ${
                    isDark ? 'bg-[#F4F1EA] text-[#141413]' : 'bg-[#141413] text-[#FAF8F5]'
                  }`}
                >
                  Enregistrer l'Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
