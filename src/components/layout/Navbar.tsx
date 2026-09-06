'use client';

import { useState, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Flame,
  Map,
  MapPin,
  ListChecks,
  Users,
  Rss,
  BookOpen,
  Sparkles,
  PhoneCall,
  Menu,
  X,
  ChevronDown,
  Eye,
} from 'lucide-react';
import { LanguageContext } from '@/context/LanguageContext';
import { FestivalContext } from '@/context/FestivalContext';
import SOSModal from '@/components/ui/SOSModal';
import Magnetic from '@/components/ui/Magnetic';
import GroupPanel from '@/components/groups/GroupPanel';

const navItems = [
  { href: '/', label: 'Home', labelBn: 'হোম', labelHi: 'होम', icon: Flame },
  { href: '/pandals', label: 'Pandals', labelBn: 'পান্ডেল', labelHi: 'पंडाल', icon: MapPin },
  { href: '/map', label: 'Live Map', labelBn: 'মানচিত্র', labelHi: 'नक्शा', icon: Map },
  { href: '/plan', label: 'Plan Tour', labelBn: 'ট্যুর', labelHi: 'यात्रा', icon: ListChecks },
  { href: '/checklist', label: 'Checklist', labelBn: 'তালিকা', labelHi: 'सूची', icon: ListChecks },
  { href: '/groups', label: 'Groups', labelBn: 'দল', labelHi: 'समूह', icon: Users },
  { href: '/feed', label: 'Feed', labelBn: 'ফিড', labelHi: 'फ़ीड', icon: Rss },
  { href: '/guide', label: 'Guide', labelBn: 'গাইড', labelHi: 'गाइड', icon: BookOpen },
  { href: '/ai-guide', label: 'AI Guide', labelBn: 'পুরোহিত', labelHi: 'पुरोहित', icon: Sparkles },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);
  const [groupPanelOpen, setGroupPanelOpen] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, t } = useContext(LanguageContext);
  const { selectedFestival } = useContext(FestivalContext);

  const getLabel = (item: (typeof navItems)[0]) => {
    // We stored the nav items under 'navbar.' in translation.json based on their label
    const key = `navbar.${item.label.toLowerCase().replace(' ', '_')}`;
    const translated = t(key);
    return translated !== key ? translated : item.label;
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[100] bg-gradient-to-b from-black/90 via-black/50 to-transparent">
        <div className="max-w-7xl mx-auto px-2 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left side: Logo & Home */}
            <div className="flex items-center gap-2 sm:gap-6">
              {/* Logo */}
              <Link href="/" className="flex items-center shrink-0">
                <img 
                  src="/images/logo-13parban.jpg" 
                  alt="13 Parban Logo" 
                  className="h-8 sm:h-10 w-auto rounded-md object-contain"
                />
              </Link>

              {/* Home Link */}
              <Magnetic amount={0.2}>
                {(() => {
                  const HomeIcon = navItems[0].icon;
                  return (
                    <Link
                      href={navItems[0].href}
                      className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                        pathname === navItems[0].href
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <HomeIcon size={13} />
                      {getLabel(navItems[0])}
                    </Link>
                  );
                })()}
              </Magnetic>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Desktop Groups Button */}
              <button
                onClick={() => setGroupPanelOpen(true)}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 shrink-0"
              >
                <Users size={14} className="w-3 h-3 sm:w-4 sm:h-4" />
                Groups
              </button>

              {/* Language Selector */}
              <div className="flex items-center gap-0.5 bg-white/5 rounded-lg p-0.5 border border-white/10">
                {(['en', 'bn', 'hi'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-semibold transition-all ${
                      language === lang
                        ? 'bg-amber-500 text-black'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {lang === 'en' ? 'EN' : lang === 'bn' ? 'বাং' : 'हि'}
                  </button>
                ))}
              </div>

              {/* SOS Button */}
              <button
                onClick={() => setSosOpen(true)}
                className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[10px] sm:text-xs font-bold transition-all shrink-0"
              >
                <PhoneCall size={12} className="w-3 h-3 sm:w-auto sm:h-auto" />
                SOS
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="lg:hidden border-t border-amber-500/10 bg-[#111827] px-4 py-4">
            <div className="grid grid-cols-3 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                if (item.label === 'Groups') {
                  return (
                    <button
                      key={item.href}
                      onClick={() => {
                        setMenuOpen(false);
                        setGroupPanelOpen(true);
                      }}
                      className="flex flex-col items-center gap-1 px-3 py-3 rounded-xl text-xs font-medium transition-all text-gray-400 hover:text-white hover:bg-white/5"
                    >
                      <Icon size={18} />
                      {getLabel(item)}
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl text-xs font-medium transition-all ${
                      active
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={18} />
                    {getLabel(item)}
                  </Link>
                );
              })}
            </div>
            <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <Link
                  href="/select-festival"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center px-3 py-2 rounded-lg border border-amber-500/30 text-amber-400 text-xs font-semibold"
                >
                  Switch Festival
                </Link>
                <div className="flex items-center gap-0.5 bg-white/5 rounded-lg p-0.5 border border-white/10">
                  {(['en', 'bn', 'hi'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        language === lang ? 'bg-amber-500 text-black' : 'text-gray-400'
                      }`}
                    >
                      {lang === 'en' ? 'EN' : lang === 'bn' ? 'বাং' : 'हि'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      <GroupPanel isOpen={groupPanelOpen} onClose={() => setGroupPanelOpen(false)} />
      <SOSModal isOpen={sosOpen} onClose={() => setSosOpen(false)} />
    </>
  );
}
