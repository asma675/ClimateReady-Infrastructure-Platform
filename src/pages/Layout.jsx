
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Map, 
  Building2, 
  DollarSign, 
  FileText, 
  Menu, 
  X,
  Shield,
  Leaf
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const navigation = [
  { name: 'Dashboard', page: 'Dashboard', icon: LayoutDashboard },
  { name: 'Live Monitoring', page: 'LiveMonitoring', icon: Shield, badge: 'LIVE' },
  { name: 'Risk Map', page: 'RiskMap', icon: Map },
  { name: 'Assets', page: 'Assets', icon: Building2 },
  { name: 'Investments', page: 'Investments', icon: DollarSign },
  { name: 'Methodology', page: 'Methodology', icon: FileText },
];

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (pageName) => {
    return currentPageName === pageName;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={createPageUrl('Dashboard')} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-slate-900 leading-tight">
                  ClimateReady
                </h1>
                <p className="text-xs text-slate-500 -mt-0.5">Infrastructure Platform</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.page);
                return (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.page)}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Government Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
              <Shield className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-medium text-slate-600">GC Compliant</span>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-200 bg-white"
            >
              <div className="px-4 py-3 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.page);
                  return (
                    <Link
                      key={item.name}
                      to={createPageUrl(item.page)}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        active
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                      {item.badge && (
                        <span className="ml-auto px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-medium text-slate-700">ClimateReady Platform</span>
              </div>
              <span className="text-sm text-slate-400">|</span>
              <span className="text-sm text-slate-500">
                Evidence-based infrastructure planning
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span>WCAG 2.1 AA Compliant</span>
              <span>•</span>
              <span>Bilingual Ready (EN/FR)</span>
              <span>•</span>
              <span>Privacy-First Architecture</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
