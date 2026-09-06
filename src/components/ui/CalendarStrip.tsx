'use client';

import { useContext } from 'react';
import { FestivalContext } from '@/context/FestivalContext';
import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/lib/formatters';

export default function CalendarStrip() {
  const { calendarDays, isLoading } = useContext(FestivalContext);
  const { t, i18n } = useTranslation();

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={16} className="text-amber-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
            {t('calendar.title', 'Panjika Calendar')}
          </h3>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="shrink-0 w-44 h-28 bg-[#1F2937] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!calendarDays || !calendarDays.length) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Calendar size={16} className="text-amber-400" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
          {t('calendar.title', 'Panjika Calendar')}
        </h3>
      </div>
      <div className="flex overflow-x-auto pb-4 pt-4 px-4 -mx-4 hide-scrollbar group/deck">
        {calendarDays.map((day, i) => {
          const date = new Date(day.calendarDate);
          date.setHours(0, 0, 0, 0);
          const isToday = today.getTime() === date.getTime();
          const isPast = date < today;

          // Note: In a fully scaled app, you'd pick `day.dayNameBn` based on `i18n.language` if available.
          const dayNameKey = `calendar_days.${day.dayName.toLowerCase().replace(/ /g, '_')}`;
          const trans = t(dayNameKey);
          const dayName = trans !== dayNameKey ? trans : day.dayName;
          const details = day.auspiciousTimings;

          return (
            <div
              key={day.id}
              className={`shrink-0 w-44 rounded-2xl glass p-5 transition-all duration-300 transform-gpu 
                hover:-translate-y-6 hover:rotate-3 hover:scale-110 hover:z-30 cursor-pointer
                ${i !== 0 ? '-ml-12' : ''} group-hover/deck:ml-4
                ${
                day.isCountdownTarget
                  ? 'border-saffron border-t-2 border-l-2 shadow-[20px_20px_50px_rgba(249,115,22,0.4)] z-20'
                  : isToday
                  ? 'border-electric border-t-2 border-l-2 shadow-[20px_20px_50px_rgba(217,70,239,0.4)] z-20'
                  : isPast
                  ? 'opacity-70 hover:opacity-100 z-0'
                  : 'z-10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold bg-gradient-to-r from-saffron to-yellow-400 bg-clip-text text-transparent">
                  {formatDate(day.calendarDate, i18n.language, { month: 'short', day: 'numeric' })}
                </span>
                {isToday && (
                  <span className="text-[10px] bg-electric text-white px-2 py-0.5 rounded-full font-black shadow-[0_0_10px_rgba(217,70,239,0.8)]">
                    {t('calendar.today', 'TODAY')}
                  </span>
                )}
                {day.isCountdownTarget && !isToday && (
                  <span className="text-[10px] bg-saffron text-black px-2 py-0.5 rounded-full font-black shadow-[0_0_10px_rgba(249,115,22,0.8)]">
                    START
                  </span>
                )}
              </div>
              <p className="font-black text-lg text-white leading-tight mb-2 tracking-tight">{dayName}</p>
              {details && (
                <p className="text-[11px] text-gray-300 line-clamp-2 leading-snug font-medium">
                  {details}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
