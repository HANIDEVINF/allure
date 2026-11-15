import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  CheckCircle,
  Download,
  Truck,
  MessageCircle,
  Phone,
  ChevronRight,
  Shirt,
} from 'lucide-react';
import { BusinessIndustryConfig, BusinessProduct, BusinessOrder, LanguageCode } from '../types';
import { businessStorage } from '../registry';
import { jsPDF } from 'jspdf';
import { ALGERIAN_WILAYAS, UI_TRANSLATIONS } from '../../data/casualAlgeriaData';

export interface IndustryCartItem {
  product: BusinessProduct;
  quantity: number;
  selectedSize?: string;
}

interface IndustryCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: BusinessIndustryConfig;
  cartItems: IndustryCartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderPlaced: (order: BusinessOrder) => void;
  lang: LanguageCode;
  themeMode?: 'light' | 'dark';
}

export const IndustryCartDrawer: React.FC<IndustryCartDrawerProps> = ({
  isOpen,
  onClose,
  config,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced,
  lang,
  themeMode = 'light',
}) => {
  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountDA, setDiscountDA] = useState(0);
  const [promoMsg, setPromoMsg] = useState('');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedWilayaCode, setSelectedWilayaCode] = useState('22');
  const [customerCommune, setCustomerCommune] = useState('');
  const [deliveryType, setDeliveryType] = useState<'home' | 'stopdesk'>('home');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<BusinessOrder | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const t = UI_TRANSLATIONS[lang];
  const isRTL = lang === 'ar';
  const isDark = themeMode === 'dark';

  if (!isOpen) return null;

  const currentWilaya =
    ALGERIAN_WILAYAS.find((w) => w.code === selectedWilayaCode) || ALGERIAN_WILAYAS[21];
  const deliveryFeeDA =
    deliveryType === 'home' ? currentWilaya.deliveryHomeDZD : currentWilaya.deliveryStopDeskDZD;

  const itemsSubtotalDA = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const finalTotalDA = Math.max(
    0,
    itemsSubtotalDA - discountDA + (itemsSubtotalDA > 0 ? deliveryFeeDA : 0)
  );

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'ALLURE22' || code === 'SBA22' || code === 'ALLURE' || code === 'SBA') {
      const disc = Math.round(itemsSubtotalDA * 0.1);
      setDiscountDA(disc);
      setPromoMsg(
        lang === 'ar'
          ? 'تم تطبيق خصم 10% لزبائن ألور هوم'
          : '10% de réduction fidélité Allure appliquée.'
      );
    } else if (code === 'YALIDINE') {
      setDiscountDA(deliveryFeeDA);
      setPromoMsg(
        lang === 'ar' ? 'توصيل مجاني مع كود ياليدين' : 'Livraison offerte appliquée.'
      );
    } else {
      setPromoMsg(
        lang === 'ar' ? 'كود غير صحيح. جرب "ALLURE22"' : 'Code invalide. Essayez "ALLURE22".'
      );
    }
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const newOrder: BusinessOrder = {
        id: `ord-dz-${Date.now()}`,
        orderNumber: `AH-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerWilaya: `${currentWilaya.code} - ${currentWilaya.name}`,
        customerCommune: customerCommune.trim() || 'Centre',
        deliveryType,
        shippingCost: deliveryFeeDA,
        paymentMethod: 'cash_on_delivery',
        items: cartItems.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
          sku: i.product.sku,
          selectedSize: i.selectedSize || i.product.sizes[0],
        })),
        totalAmount: finalTotalDA,
        paymentStatus: 'pending',
        fulfillmentStatus: 'unfulfilled',
        date: new Date().toISOString().split('T')[0],
        notes: `Commande en ligne · Livraison ${
          deliveryType === 'home' ? 'à domicile' : 'Bureau Yalidine'
        }`,
      };

      businessStorage.addOrder(config.id, newOrder);

      cartItems.forEach((item) => {
        businessStorage.updateStock(config.id, item.product.id, -item.quantity);
      });

      setConfirmedOrder(newOrder);
      setIsProcessing(false);
      onOrderPlaced(newOrder);
      onClearCart();
    }, 450);
  };

  const handleConfirmOnWhatsApp = () => {
    const itemsList = cartItems
      .map(
        (i) =>
          `• ${i.product.name} (Taille: ${i.selectedSize || 'M'}) x${i.quantity} = ${(
            i.product.price * i.quantity
          ).toLocaleString()} DA`
      )
      .join('\n');

    const message =
      lang === 'ar'
        ? `سلام، أود تأكيد هذا الطلب من متجر ألور هوم (سيدي بلعباس):\n\n*الزبون:* ${
            customerName || 'زبون المتجر'
          }\n*الهاتف:* ${customerPhone || '0557064156'}\n*الولاية:* ${
            currentWilaya.nameAr
          }\n*العنوان:* ${customerCommune || 'المركز'}\n*طريقة الاستلام:* ${
            deliveryType === 'home' ? 'توصيل للمنزل' : 'مكتب ياليدين'
          }\n\n*المنتجات:*\n${itemsList}\n\n*المجموع الإجمالي مع التوصيل:* ${finalTotalDA.toLocaleString()} دج\n(الدفع عند الاستلام)`
        : `Salam, je souhaite valider ma commande chez ALLURE HOMME (Sidi Bel Abbès) :\n\n*Client :* ${
            customerName || 'Client'
          }\n*Téléphone :* ${customerPhone || '0557064156'}\n*Wilaya :* ${
            currentWilaya.name
          }\n*Adresse :* ${customerCommune || 'Centre'}\n*Mode :* ${
            deliveryType === 'home' ? 'Livraison à Domicile' : 'Bureau Yalidine'
          }\n\n*Articles :*\n${itemsList}\n\n*Total à régler à la livraison :* ${finalTotalDA.toLocaleString()} DA\n(Paiement Cash on Delivery)`;

    window.open(`https://wa.me/213557064156?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDownloadPDFReceipt = () => {
    if (!confirmedOrder) return;
    try {
      const doc = new jsPDF();

      doc.setFillColor(20, 20, 19);
      doc.rect(0, 0, 210, 42, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(212, 175, 55);
      doc.setFontSize(20);
      doc.text("ALLURE HOMME - SARTORIAL & MEN'S WEAR", 14, 18);

      doc.setFontSize(9);
      doc.setTextColor(220, 220, 220);
      doc.text(
        'Rue Mohamed Khemisti, Sidi Bel Abbès (22), Algérie • Tél: 0557064156 • Instagram: @allurehomme22',
        14,
        26
      );
      doc.text(
        `BON DE COMMANDE N° : ${confirmedOrder.orderNumber} • Date : ${confirmedOrder.date}`,
        14,
        34
      );

      doc.setTextColor(20, 24, 30);
      doc.setFontSize(12);
      doc.text('INFORMATIONS DESTINATAIRE (LIVRAISON)', 14, 52);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`• Nom & Prénom : ${confirmedOrder.customerName}`, 14, 60);
      doc.text(`• Numéro de Téléphone : ${confirmedOrder.customerPhone}`, 14, 67);
      doc.text(`• Wilaya de Destination : ${confirmedOrder.customerWilaya}`, 14, 74);
      doc.text(`• Commune / Adresse : ${confirmedOrder.customerCommune}`, 14, 81);
      doc.text(
        `• Mode de Réception : ${
          confirmedOrder.deliveryType === 'home'
            ? 'Livraison à Domicile'
            : 'Bureau Stop Desk Yalidine'
        }`,
        14,
        88
      );
      doc.text(`• Mode de Règlement : PAIEMENT CASH À LA LIVRAISON (COD)`, 14, 95);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('ARTICLES COMMANDÉS', 14, 110);

      doc.setFillColor(242, 239, 233);
      doc.rect(14, 116, 182, 8, 'F');
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      doc.text('Article & Taille', 16, 122);
      doc.text('Quantité', 110, 122);
      doc.text('Prix Unitaire', 135, 122);
      doc.text('Total (DA)', 170, 122);

      let y = 132;
      doc.setFont('helvetica', 'normal');
      confirmedOrder.items.forEach((item) => {
        doc.text(`${item.name} (Taille: ${item.selectedSize || 'Standard'})`, 16, y);
        doc.text(`x${item.quantity}`, 115, y);
        doc.text(`${item.price.toLocaleString()} DA`, 135, y);
        doc.text(`${(item.price * item.quantity).toLocaleString()} DA`, 170, y);
        y += 8;
      });

      y += 6;
      doc.setDrawColor(180, 131, 39);
      doc.line(14, y, 196, y);
      y += 10;

      doc.setFont('helvetica', 'bold');
      doc.text(`Frais de livraison (${confirmedOrder.customerWilaya}) :`, 110, y);
      doc.text(`${confirmedOrder.shippingCost.toLocaleString()} DA`, 170, y);
      y += 8;

      doc.setFontSize(12);
      doc.setTextColor(180, 131, 39);
      doc.text(`TOTAL NET À PAYER AU LIVREUR :`, 65, y);
      doc.text(`${confirmedOrder.totalAmount.toLocaleString()} DA`, 165, y);

      doc.setFontSize(8);
      doc.setTextColor(130, 130, 130);
      doc.text(
        'Merci de votre confiance en ALLURE HOMME (Sidi Bel Abbès). Vérifiez vos articles avant règlement.',
        14,
        280
      );

      doc.save(`Bon_Commande_${confirmedOrder.orderNumber}.pdf`);
    } catch (err) {
      console.error('Error generating PDF receipt', err);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-sm ${
        isRTL ? 'font-arabic text-right' : 'text-left'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md h-full flex flex-col shadow-2xl border-l transition-colors ${
          isDark
            ? 'bg-[#0E1014] border-[#252932] text-[#F4F1EA]'
            : 'bg-[#FAF8F5] border-[#E6E1D6] text-[#141413]'
        }`}
      >
        {/* Drawer Header */}
        <div
          className={`flex items-center justify-between px-5 py-4 border-b ${
            isDark ? 'bg-[#13151A] border-[#252932]' : 'bg-white border-[#E6E1D6]'
          }`}
        >
          <div className="space-y-0.5">
            <h2 className="font-display text-lg font-semibold">
              {confirmedOrder
                ? t.orderSuccessTitle
                : isCheckoutStep
                ? t.checkoutTitle
                : t.cartTitle}
            </h2>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono tabular-nums">
              {confirmedOrder
                ? `${t.orderNumber} : ${confirmedOrder.orderNumber}`
                : `${cartItems.reduce((acc, i) => acc + i.quantity, 0)} ${
                    lang === 'ar' ? 'منتجات' : 'articles'
                  }`}
            </p>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? 'text-stone-400 hover:text-white hover:bg-[#1B1E25]'
                : 'text-stone-500 hover:text-black hover:bg-[#F2EFE9]'
            }`}
            aria-label="Fermer le panier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {!confirmedOrder && cartItems.length > 0 && (
          <div
            className={`px-5 py-2.5 border-b flex items-center gap-3 text-[11px] font-medium ${
              isDark
                ? 'border-[#22252D] bg-[#111318] text-stone-400'
                : 'border-[#EDE8DE] bg-[#F2EFE9] text-stone-600'
            }`}
          >
            <span className={!isCheckoutStep ? 'text-[#9A6E1C] dark:text-[#D4AF37] font-semibold' : ''}>
              01. {lang === 'ar' ? 'السلة' : 'Panier'}
            </span>
            <span aria-hidden="true">·</span>
            <span className={isCheckoutStep ? 'text-[#9A6E1C] dark:text-[#D4AF37] font-semibold' : ''}>
              02. {lang === 'ar' ? 'التوصيل (58 ولاية)' : 'Livraison 58 Wilayas'}
            </span>
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {confirmedOrder ? (
            /* ORDER CONFIRMED */
            <div className="space-y-6 py-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-semibold">
                  {lang === 'ar'
                    ? 'شكراً لطلبك من متجر ألور هوم'
                    : 'Merci pour votre commande'}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto leading-relaxed">
                  {t.orderSuccessDesc}
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border space-y-2.5 text-xs ${
                  isDark ? 'bg-[#13151A] border-[#252932]' : 'bg-white border-[#E6E1D6]'
                }`}
              >
                <div className="flex justify-between">
                  <span className="text-stone-500 dark:text-stone-400">{t.orderNumber}</span>
                  <span className="font-mono font-bold text-[#9A6E1C] dark:text-[#D4AF37]">
                    {confirmedOrder.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 dark:text-stone-400">Client</span>
                  <span className="font-medium">
                    {confirmedOrder.customerName} ({confirmedOrder.customerPhone})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 dark:text-stone-400">Wilaya</span>
                  <span className="font-medium">{confirmedOrder.customerWilaya}</span>
                </div>
                <div className="flex justify-between pt-2.5 border-t border-[#EDE8DE] dark:border-[#22252D] text-sm font-bold">
                  <span>Total COD</span>
                  <span className="font-mono tabular-nums text-[#9A6E1C] dark:text-[#D4AF37]">
                    {confirmedOrder.totalAmount.toLocaleString()} DA
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={handleDownloadPDFReceipt}
                  className={`w-full py-3 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-[#13151A] hover:bg-[#1B1E25] text-[#F4F1EA] border-[#252932]'
                      : 'bg-white hover:bg-[#F2EFE9] text-[#141413] border-[#E6E1D6]'
                  }`}
                >
                  <Download className="w-4 h-4 text-[#9A6E1C] dark:text-[#D4AF37]" />
                  <span>{t.viewReceipt}</span>
                </button>

                <a
                  href={`https://wa.me/213557064156?text=${encodeURIComponent(
                    `Salam, je viens de passer la commande ${confirmedOrder.orderNumber} sur votre boutique en ligne ALLURE HOMME.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contacter la Boutique sur WhatsApp</span>
                </a>

                <button
                  onClick={() => {
                    setConfirmedOrder(null);
                    setIsCheckoutStep(false);
                    onClose();
                  }}
                  className="w-full py-2 text-xs text-stone-500 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                >
                  Continuer les achats
                </button>
              </div>
            </div>
          ) : isCheckoutStep ? (
            /* CHECKOUT FORM */
            <form onSubmit={handleConfirmOrder} className="space-y-4">
              <div
                className={`p-3 rounded-lg border text-xs flex items-center gap-2.5 ${
                  isDark
                    ? 'bg-[#13151A] border-[#252932] text-stone-300'
                    : 'bg-white border-[#E6E1D6] text-stone-700'
                }`}
              >
                <Truck className="w-4 h-4 shrink-0 text-[#9A6E1C] dark:text-[#D4AF37]" />
                <span>Paiement Cash à la Livraison après vérification du colis.</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">{t.fullName} *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: Mohamed Amine"
                  className={`w-full p-2.5 rounded-lg border text-xs focus:outline-none focus:border-[#B48327] ${
                    isDark
                      ? 'bg-[#13151A] border-[#252932] text-white'
                      : 'bg-white border-[#E6E1D6] text-[#141413]'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">{t.phoneLabel} *</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 left-3 text-stone-400" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="05 / 06 / 07 xx xx xx"
                    className={`w-full py-2.5 pl-9 pr-3 rounded-lg border text-xs font-mono focus:outline-none focus:border-[#B48327] ${
                      isDark
                        ? 'bg-[#13151A] border-[#252932] text-white'
                        : 'bg-white border-[#E6E1D6] text-[#141413]'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">{t.wilayaLabel} *</label>
                <select
                  value={selectedWilayaCode}
                  onChange={(e) => setSelectedWilayaCode(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border text-xs focus:outline-none focus:border-[#B48327] cursor-pointer ${
                    isDark
                      ? 'bg-[#13151A] border-[#252932] text-white'
                      : 'bg-white border-[#E6E1D6] text-[#141413]'
                  }`}
                >
                  {ALGERIAN_WILAYAS.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.name} ({deliveryType === 'home' ? w.deliveryHomeDZD : w.deliveryStopDeskDZD} DA)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">{t.communeLabel}</label>
                <input
                  type="text"
                  value={customerCommune}
                  onChange={(e) => setCustomerCommune(e.target.value)}
                  placeholder={t.communePlaceholder}
                  className={`w-full p-2.5 rounded-lg border text-xs focus:outline-none focus:border-[#B48327] ${
                    isDark
                      ? 'bg-[#13151A] border-[#252932] text-white'
                      : 'bg-white border-[#E6E1D6] text-[#141413]'
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium">{t.deliveryTypeLabel}</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('home')}
                    className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                      deliveryType === 'home'
                        ? 'border-[#B48327] dark:border-[#D4AF37] bg-[#B48327]/10 font-semibold'
                        : isDark
                        ? 'border-[#252932] bg-[#13151A] text-stone-400'
                        : 'border-[#E6E1D6] bg-white text-stone-600'
                    }`}
                  >
                    <div>{t.deliveryHome}</div>
                    <div className="text-[11px] text-[#9A6E1C] dark:text-[#D4AF37] font-mono tabular-nums mt-0.5">
                      {currentWilaya.deliveryHomeDZD} DA
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('stopdesk')}
                    className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                      deliveryType === 'stopdesk'
                        ? 'border-[#B48327] dark:border-[#D4AF37] bg-[#B48327]/10 font-semibold'
                        : isDark
                        ? 'border-[#252932] bg-[#13151A] text-stone-400'
                        : 'border-[#E6E1D6] bg-white text-stone-600'
                    }`}
                  >
                    <div>Bureau Yalidine</div>
                    <div className="text-[11px] text-[#9A6E1C] dark:text-[#D4AF37] font-mono tabular-nums mt-0.5">
                      {currentWilaya.deliveryStopDeskDZD} DA
                    </div>
                  </button>
                </div>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-[#EDE8DE] dark:border-[#22252D]">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-3.5 px-4 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-[#F4F1EA] text-[#141413] hover:bg-white'
                      : 'bg-[#141413] text-[#FAF8F5] hover:bg-[#292826]'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {isProcessing
                      ? 'Enregistrement...'
                      : `${t.confirmOrderBtn} · ${finalTotalDA.toLocaleString()} DA`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirmOnWhatsApp}
                  className={`w-full py-2.5 px-4 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    isDark
                      ? 'border-[#252932] text-emerald-400 hover:bg-[#1B1E25]'
                      : 'border-[#D9D2C5] text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Envoyer la commande sur WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCheckoutStep(false)}
                  className="w-full py-1.5 text-xs text-stone-500 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                >
                  ← Retour au panier
                </button>
              </div>
            </form>
          ) : cartItems.length === 0 ? (
            /* EMPTY CART */
            <div className="text-center py-16 space-y-4">
              <div
                className={`w-12 h-12 rounded-full border flex items-center justify-center mx-auto ${
                  isDark
                    ? 'bg-[#13151A] border-[#252932] text-stone-500'
                    : 'bg-white border-[#E6E1D6] text-stone-400'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">{t.cartEmpty}</p>
              <button
                onClick={onClose}
                className={`px-5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  isDark
                    ? 'bg-[#F4F1EA] text-[#141413]'
                    : 'bg-[#141413] text-[#FAF8F5]'
                }`}
              >
                {t.cartContinue}
              </button>
            </div>
          ) : (
            /* CART ITEMS */
            <div className="space-y-3">
              {cartItems.map((item) => {
                const imgBroken = failedImages[item.product.id];
                return (
                  <div
                    key={`${item.product.id}-${item.selectedSize}`}
                    className={`flex gap-3.5 p-3 rounded-xl border items-center justify-between ${
                      isDark ? 'bg-[#13151A] border-[#252932]' : 'bg-white border-[#E6E1D6]'
                    }`}
                  >
                    {imgBroken ? (
                      <div className="w-14 aspect-[3/4] rounded-lg bg-[#F2EFE9] dark:bg-[#191C22] flex items-center justify-center shrink-0">
                        <Shirt className="w-4 h-4 text-[#B48327]" />
                      </div>
                    ) : (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [item.product.id]: true }))
                        }
                        className="w-14 aspect-[3/4] rounded-lg object-cover shrink-0 bg-[#EFECE4]"
                      />
                    )}

                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-xs font-semibold truncate">{item.product.name}</h4>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500 dark:text-stone-400">
                        <span>{item.selectedSize || 'M'}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{item.product.price.toLocaleString()} DA</span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <div
                          className={`inline-flex items-center border rounded-md ${
                            isDark ? 'border-[#252932] bg-[#191C22]' : 'border-[#E6E1D6] bg-[#FAF8F5]'
                          }`}
                        >
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                            aria-label="Diminuer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                            aria-label="Augmenter"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-stone-400 hover:text-red-500 p-1.5 transition-colors cursor-pointer"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right font-mono font-semibold text-xs tabular-nums shrink-0">
                      {(item.product.price * item.quantity).toLocaleString()} DA
                    </div>
                  </div>
                );
              })}

              {/* Promo Code */}
              <div className="pt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Code Promo (ex: ALLURE22)"
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs uppercase focus:outline-none focus:border-[#B48327] font-mono ${
                      isDark
                        ? 'bg-[#13151A] border-[#252932] text-white'
                        : 'bg-white border-[#E6E1D6] text-[#141413]'
                    }`}
                  />
                  <button
                    onClick={handleApplyPromo}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      isDark
                        ? 'bg-[#1B1E25] border-[#252932] hover:bg-[#252932] text-stone-200'
                        : 'bg-white border-[#E6E1D6] hover:bg-[#F2EFE9] text-[#141413]'
                    }`}
                  >
                    Appliquer
                  </button>
                </div>
                {promoMsg && (
                  <p className="text-[11px] text-[#9A6E1C] dark:text-[#D4AF37] font-medium mt-1.5">
                    {promoMsg}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Summary Footer */}
        {cartItems.length > 0 && !confirmedOrder && !isCheckoutStep && (
          <div
            className={`p-5 border-t space-y-4 ${
              isDark ? 'border-[#252932] bg-[#13151A]' : 'border-[#E6E1D6] bg-white'
            }`}
          >
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-500 dark:text-stone-400">
                <span>{t.subtotal}</span>
                <span className="font-mono tabular-nums">{itemsSubtotalDA.toLocaleString()} DA</span>
              </div>
              {discountDA > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Remise Promo</span>
                  <span className="font-mono tabular-nums">-{discountDA.toLocaleString()} DA</span>
                </div>
              )}
              <div className="flex justify-between text-stone-500 dark:text-stone-400">
                <span>{t.deliveryFee} ({currentWilaya.code})</span>
                <span className="font-mono tabular-nums">{deliveryFeeDA} DA</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2.5 border-t border-[#EDE8DE] dark:border-[#22252D]">
                <span>{t.totalAmount}</span>
                <span className="font-mono tabular-nums text-[#9A6E1C] dark:text-[#D4AF37] text-base">
                  {finalTotalDA.toLocaleString()} DA
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCheckoutStep(true)}
              className={`w-full py-3.5 px-4 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                isDark
                  ? 'bg-[#F4F1EA] text-[#141413] hover:bg-white'
                  : 'bg-[#141413] text-[#FAF8F5] hover:bg-[#292826]'
              }`}
            >
              <span>{t.proceedCheckout}</span>
              <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
