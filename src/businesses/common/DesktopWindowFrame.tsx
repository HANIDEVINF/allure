import React from 'react';
import { motion } from 'motion/react';
import { BusinessIndustryConfig } from '../types';

interface DesktopWindowFrameProps {
  config: BusinessIndustryConfig;
  children: React.ReactNode;
  activeView: 'stock' | 'stats' | 'orders' | 'settings';
  setActiveView: (view: 'stock' | 'stats' | 'orders' | 'settings') => void;
  onRefreshData?: () => void;
  themeMode?: 'light' | 'dark';
}

export const DesktopWindowFrame: React.FC<DesktopWindowFrameProps> = ({
  children,
  themeMode = 'light',
}) => {
  const isDark = themeMode === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      id="desktop-logiciel-window"
      className={`max-w-7xl mx-auto rounded-2xl overflow-hidden border transition-colors w-full ${
        isDark
          ? 'border-[#252932] bg-[#13151A] text-[#F4F1EA]'
          : 'border-[#E6E1D6] bg-white text-[#141413]'
      }`}
    >
      {/* Clean Workspace Breadcrumb Header (No fake macOS traffic lights or pulsing dots) */}
      <div
        className={`flex items-center justify-between px-5 sm:px-7 py-3.5 border-b text-xs ${
          isDark
            ? 'bg-[#0E1014] border-[#252932] text-stone-400'
            : 'bg-[#F2EFE9] border-[#E6E1D6] text-stone-600'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="font-serif-luxury font-semibold tracking-wider uppercase text-[#141413] dark:text-[#F4F1EA]">
            ALLURE HOMME
          </span>
          <span aria-hidden="true">/</span>
          <span>Gestion Boutique & Stock</span>
        </div>

        <span className="hidden sm:inline text-[11px] font-medium text-stone-500 dark:text-stone-400">
          Sidi Bel Abbès (22) · Rue Mohamed Khemisti
        </span>
      </div>

      {/* Main Workspace Canvas */}
      <div className={`p-5 sm:p-8 ${isDark ? 'bg-[#0E1014]' : 'bg-[#FAF8F5]'}`}>
        {children}
      </div>
    </motion.div>
  );
};
