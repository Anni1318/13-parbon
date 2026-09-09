'use client';

import { useState, useEffect, useContext } from 'react';
import { FestivalContext } from '@/context/FestivalContext';
import { useTranslation } from 'react-i18next';
import { formatNumber } from '@/lib/formatters';
import StickyMetrics from '@/components/ui/StickyMetrics';

export default function CountdownTimer() {
  const { selectedFestival, calendarDays } = useContext(FestivalContext);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLive, setIsLive] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!selectedFestival || calendarDays.length === 0) return;

    const targetDay = calendarDays.find((d: any) => d.isCountdownTarget) || calendarDays[0];
    const targetDate = new Date(targetDay.calendarDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setIsLive(true);
        clearInterval(interval);
      } else {
        setIsLive(false);
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedFestival, calendarDays]);

  if (!selectedFestival) return null;

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-sm tracking-[0.2em] uppercase text-gray-300 mt-12 mb-6">
        {(() => {
          const key = `festivals.${selectedFestival.slug.replace('-2026', '')}`;
          const trans = t(key);
          const name = trans !== key ? trans : selectedFestival.name.replace(' 2026', '');
          return `${name} ${formatNumber(selectedFestival.year, i18n.language)}`;
        })()}{' '}
        {isLive ? t('countdown.is_live_now', 'IS LIVE NOW!') : t('countdown.begins_in', 'BEGINS IN')}
      </p>

      {!isLive && (
        <div className="flex flex-wrap gap-2 sm:gap-4 items-center justify-center">
          {[
            { label: t('countdown.days', 'DAYS'), value: timeLeft.days },
            { label: t('countdown.hours', 'HOURS'), value: timeLeft.hours },
            { label: t('countdown.minutes', 'MINS'), value: timeLeft.minutes },
            { label: t('countdown.seconds', 'SECS'), value: timeLeft.seconds },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center justify-center w-14 h-16 sm:w-24 sm:h-28 rounded-2xl bg-black/30 backdrop-blur-md border border-white/20 shadow-xl">
              <span className="text-2xl sm:text-4xl font-bold text-white drop-shadow-md">
                {formatNumber(item.value, i18n.language)}
              </span>
              <span className="text-[10px] tracking-widest text-amber-500 uppercase mt-2">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
