import { useContext } from 'react';
import { BookOpen, Calendar, Utensils, Music, ShieldCheck, Heart } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import type { Festival } from '@/lib/types';

async function getDefaultFestival() {
  try {
    const festival = await prisma.festival.findUnique({
      where: { slug: 'durga-puja-2026' },
      include: { calendarDays: { orderBy: { orderIndex: 'asc' } } },
    });
    return festival;
  } catch {
    return null;
  }
}

export default async function GuidePage() {
  const festival = await getDefaultFestival();

  const sections = [
    {
      id: 'history',
      icon: Heart,
      color: 'amber',
      title: 'History & Significance',
      content: `Durga Puja is a 500+ year old tradition in Bengal, celebrating Goddess Durga's victory over the buffalo demon Mahishasur. It was during Raja Kangshanarayan's time in the 16th century that community (sarbojanin) pujas began. UNESCO recognized Durga Puja as an Intangible Cultural Heritage of Humanity in 2021.\n\nKolkata's Durga Puja is unique — it's both a religious festival and the world's largest open-air art installation, attracting 5–6 million visitors over 5 days.`,
    },
    {
      id: 'rituals',
      icon: Calendar,
      color: 'gold',
      title: 'Key Rituals & Timings',
      content: `**Maha Shashthi (Oct 15)** — Devi Bodhon: Awakening of the goddess at dusk. Pandals officially open.\n\n**Maha Saptami (Oct 16)** — Nabapatrika Snan: Ritual bathing of a plantain tree representing nine plants (a surrogate form of Durga).\n\n**Maha Ashtami (Oct 17)** — The grand day. Kumari Puja (worship of a young girl as the goddess), Pushpanjali flower offerings, and the climactic Sandhi Puja at 11:48 PM.\n\n**Maha Navami (Oct 18)** — Navami Havan (sacred fire), symbolic Balidan, final Navami Anjali.\n\n**Vijaya Dashami (Oct 19)** — Sindur Khela and the emotional immersion (bisarjan) processions.`,
    },
    {
      id: 'food',
      icon: Utensils,
      color: 'red',
      title: 'Festival Food Guide',
      content: `**Bhog (Free Prasad)**: Traditional pujas offer khichuri, labra (mixed vegetables), chutney, and payesh on Saptami morning.\n\n**Street Food Zones**:\n• Mohammad Ali Park area: Mughlai paratha, kathi rolls, seekh kebab\n• Hatibagan-Shyambazar belt: Phuchka, churmur, jhalmuri\n• Golpark-Gariahat: Fish fry, egg roll, biryani\n\n**Traditional Sweets**: Sandesh, mishti doi, rasgulla, nolen gurer sandesh (coconut jaggery sandesh — a winter specialty beginning in October).\n\n**Pro Tip**: Carry cash (₹500–₹1000/day for food). Most street vendors don't have card/UPI during peak days.`,
    },
    {
      id: 'music',
      icon: Music,
      color: 'purple',
      title: 'Sounds of the Festival',
      content: `**Dhak**: The quintessential Durga Puja instrument — large barrel drums played by dhakis (traditional drummers from Bankura). The dhak is played during Puja aarti and especially dramatically during Sandhi Puja.\n\n**Shankha (Conch Shell)**: Blown at the start of each puja ritual to mark the presence of the divine.\n\n**Mahalaya Radio Broadcast**: Every year since 1931, AIR Kolkata airs the legendary *Mahishasur Mardini* by Birendra Krishna Bhadra at 4 AM on Mahalaya (Oct 8, 2026).\n\n**Use this app**: Tap the floating audio bar to listen to dhak and shankha recordings while exploring pandals!`,
    },
    {
      id: 'safety',
      icon: ShieldCheck,
      color: 'emerald',
      title: 'Safety & Crowd Management',
      content: `**Crowd Management Tips**:\n• Visit famous pandals between 1 AM–5 AM for minimal crowds\n• Pandals like Sreebhumi & College Square crowd at 9 PM–2 AM\n• Use PUJA GUIDE's Live Map to see which areas are less congested\n\n**Safety Protocol**:\n• Always share live location with your group before leaving\n• Write your phone number on children's wrist in marker pen\n• Keep emergency numbers saved: Police 100, Ambulance 108, Women Helpline 1091\n• Police booths are placed every 200m near major pandals\n\n**Lost & Found**: Each major pandal has a public announcement system. Announce to police booth for lost family members.`,
    },
    {
      id: 'art',
      icon: BookOpen,
      color: 'amber',
      title: 'Pandal Art & Themes',
      content: `Modern Kolkata Durga Puja is as much an art exhibition as a religious event. Pandals compete for best theme, best idol, and best illumination.\n\n**Types of Pandals**:\n• **Traditional (Shastriya)**: Follows ancient Agama Shastra designs. Examples: Bagbazar Sarbojanin (200+ years old)\n• **Thematic**: Recreates international landmarks, social themes, or conceptual art. Examples: Sreebhumi (Bangkok Temple 2026), Santosh Mitra Square (Angkor Wat)\n• **Eco-Friendly**: Made from organic/recycled materials. Example: Suruchi Sangha\n\n**Idol Artists to Watch**: Sanatan Dinda (College Square), Mintu Pal (Sreebhumi), Bhabatosh Sutar (Santosh Mitra Square).`,
    },
  ];

  const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
    amber: { bg: 'border-amber-500/20', text: 'text-amber-400', iconBg: 'bg-amber-500/15' },
    gold: { bg: 'border-yellow-500/20', text: 'text-yellow-400', iconBg: 'bg-yellow-500/15' },
    red: { bg: 'border-red-500/20', text: 'text-red-400', iconBg: 'bg-red-500/15' },
    purple: { bg: 'border-purple-500/20', text: 'text-purple-400', iconBg: 'bg-purple-500/15' },
    emerald: { bg: 'border-emerald-500/20', text: 'text-emerald-400', iconBg: 'bg-emerald-500/15' },
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold gold-text mb-2">Festival Guide</h1>
          <p className="text-gray-400">
            Everything you need to know about{' '}
            {festival?.name ?? 'Durga Puja 2026'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Data sourced from Anandabazar Patrika, BeniMadhab Shil Panjika, and community experts
          </p>
        </div>

        {/* Calendar Days Summary */}
        {festival?.calendarDays && festival.calendarDays.length > 0 && (
          <div className="mb-10 bg-[#1F2937] border border-amber-500/10 rounded-2xl p-5">
            <h2 className="font-bold text-amber-400 mb-4 flex items-center gap-2">
              <Calendar size={16} />
              {festival.name} — Quick Calendar
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-white/5">
                    <th className="text-left pb-3 pr-4">Date</th>
                    <th className="text-left pb-3 pr-4">Day</th>
                    <th className="text-left pb-3">Timings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {festival.calendarDays.map((day) => (
                    <tr key={day.id} className="py-2">
                      <td className="py-3 pr-4 text-amber-400 font-semibold whitespace-nowrap">
                        {new Date(day.calendarDate).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-3 pr-4 text-white font-medium">{day.dayName}</td>
                      <td className="py-3 text-gray-400 text-xs">{day.auspiciousTimings ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Guide Sections */}
        <div className="space-y-6">
          {sections.map((section) => {
            const Icon = section.icon;
            const colors = colorMap[section.color];
            return (
              <div
                key={section.id}
                className={`bg-[#1F2937] border ${colors.bg} rounded-2xl p-6`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 ${colors.iconBg} rounded-xl`}>
                    <Icon size={18} className={colors.text} />
                  </div>
                  <h2 className={`text-xl font-bold ${colors.text}`}>{section.title}</h2>
                </div>
                <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {section.content
                    .split('\n')
                    .map((line, i) => (
                      <p key={i} className={line.startsWith('**') ? 'font-semibold text-white mt-3 first:mt-0' : 'mt-1'}>
                        {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                      </p>
                    ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center bg-gradient-to-br from-amber-900/30 to-[#1F2937] border border-amber-500/20 rounded-2xl p-8">
          <p className="text-white font-bold text-lg mb-3">
            🪔 Still have questions?
          </p>
          <p className="text-gray-400 text-sm mb-5">
            Ask Purohit-mosai — our AI guide knows everything about the festival
          </p>
          <Link
            href="/ai-guide"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-all"
          >
            Ask Purohit-mosai →
          </Link>
        </div>
      </div>
    </div>
  );
}
