'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname && pathname.includes('/map')) return null;

  return (
    <footer className="border-t border-amber-500/10 bg-[#111827] py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="/images/logo-13parban.jpg" alt="13 Parban Logo" className="w-8 h-8 rounded-md object-contain" />
              <span className="font-bold text-lg gold-text">13 PARBAN</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your complete digital companion for Durga Puja &amp; Kali Puja in Kolkata and West
              Bengal.
            </p>
            <p className="text-gray-600 text-xs mt-3">শুভো পুজো 🎊 शुभो पूजो</p>
          </div>
          <div>
            <h4 className="font-semibold text-amber-400 mb-3 text-xs uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                ['/', 'Home'],
                ['/pandals', 'Pandal Directory'],
                ['/map', 'Live Map'],
                ['/guide', 'Festival Guide'],
                ['/ai-guide', 'Purohit-mosai AI'],
                ['/checklist', 'Checklist'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-amber-400 text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-red-400 mb-3 text-xs uppercase tracking-wider">
              Emergency Contacts
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>🚨 Police: <span className="text-white font-semibold">100</span></li>
              <li>🏥 Ambulance: <span className="text-white font-semibold">108</span></li>
              <li>🚒 Fire: <span className="text-white font-semibold">101</span></li>
              <li>👮 Women Helpline: <span className="text-white font-semibold">1091</span></li>
              <li>🏥 SSKM Hospital: <span className="text-white font-semibold">033-2223-3800</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            © 2026 13 PARBAN. Made with ❤️ for the people of West Bengal.
          </p>
          <p className="text-gray-600 text-xs">
            Data sourced from Anandabazar Patrika, KolkataPuja.com &amp; verified community reports.
          </p>
        </div>
      </div>
    </footer>
  );
}
