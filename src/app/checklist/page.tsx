'use client';

import { useState, useContext } from 'react';
import { Check, Plus, Trash2, ListChecks } from 'lucide-react';
import { FestivalContext } from '@/context/FestivalContext';

const DEFAULT_CATEGORIES: Record<string, { label: string; emoji: string; items: string[] }> = {
  essentials: {
    label: 'Essentials',
    emoji: '🔑',
    items: [
      'Fully charged phone',
      'Power bank (10000mAh+)',
      'Cash (₹3000–5000)',
      'UPI apps (Paytm/PhonePe)',
      'Photo ID card copy',
    ],
  },
  clothing: {
    label: 'Clothing',
    emoji: '👗',
    items: [
      'Comfortable cotton traditional wear',
      'Flat walking shoes / sneakers',
      'Light jacket (nights get cool)',
      'Raincoat / compact umbrella',
      'Small backpack',
    ],
  },
  health: {
    label: 'Health & Safety',
    emoji: '🏥',
    items: [
      'Water bottle (reusable)',
      'ORS sachets / electrolytes',
      'Small first-aid kit',
      'Hand sanitizer',
      'Antacid tablets (all that street food!)',
      'Paracetamol for crowds & heat',
    ],
  },
  puja: {
    label: 'Puja Rituals',
    emoji: '🙏',
    items: [
      'White handkerchief for Pushpanjali',
      'Dhoti/Saree (for traditional Pushpanjali)',
      'Flower garlands (buy near pandals)',
      'Agarbatti packet',
      'Small amount of loose change for dakshina',
    ],
  },
  tech: {
    label: 'Photography',
    emoji: '📸',
    items: [
      'Camera with charged battery + spare',
      'Earphones (for PUJA GUIDE dhak music)',
      'Offline maps downloaded',
      'Memory cards with space',
    ],
  },
};

type CheckedMap = Record<string, Record<string, boolean>>;

export default function ChecklistPage() {
  const { selectedFestival } = useContext(FestivalContext);
  const [checked, setChecked] = useState<CheckedMap>({});
  const [customItems, setCustomItems] = useState<Record<string, string[]>>({});
  const [newItemText, setNewItemText] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggle = (cat: string, item: string) => {
    setChecked((prev) => ({
      ...prev,
      [cat]: { ...(prev[cat] ?? {}), [item]: !(prev[cat]?.[item]) },
    }));
  };

  const addItem = (cat: string) => {
    const text = newItemText.trim();
    if (!text) return;
    setCustomItems((prev) => ({ ...prev, [cat]: [...(prev[cat] ?? []), text] }));
    setNewItemText('');
    setActiveCategory(null);
  };

  const removeCustom = (cat: string, item: string) => {
    setCustomItems((prev) => ({
      ...prev,
      [cat]: (prev[cat] ?? []).filter((i) => i !== item),
    }));
  };

  const totalItems = Object.values(DEFAULT_CATEGORIES).reduce((acc, c) => acc + c.items.length, 0) +
    Object.values(customItems).reduce((acc, arr) => acc + arr.length, 0);
  const totalChecked = Object.values(checked).reduce(
    (acc, cat) => acc + Object.values(cat).filter(Boolean).length,
    0
  );
  const progress = totalItems > 0 ? Math.round((totalChecked / totalItems) * 100) : 0;

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <ListChecks size={28} className="text-amber-400" />
          <div>
            <h1 className="text-3xl font-extrabold text-white">Festival Checklist</h1>
            <p className="text-gray-400 text-sm">
              Get ready for {selectedFestival?.name ?? 'your festival'}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-[#1F2937] border border-amber-500/10 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-white">
              {totalChecked} / {totalItems} items packed
            </span>
            <span className="text-amber-400 font-bold">{progress}%</span>
          </div>
          <div className="h-2 bg-black/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {progress === 100 && (
            <p className="text-emerald-400 text-sm font-bold mt-2 text-center">
              🎉 You're all packed! Enjoy the festival!
            </p>
          )}
        </div>

        {/* Categories */}
        <div className="space-y-4">
          {Object.entries(DEFAULT_CATEGORIES).map(([catKey, cat]) => {
            const allItems = [...cat.items, ...(customItems[catKey] ?? [])];
            const catChecked = allItems.filter((i) => checked[catKey]?.[i]).length;
            return (
              <div
                key={catKey}
                className="bg-[#1F2937] border border-amber-500/10 rounded-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cat.emoji}</span>
                    <span className="font-bold text-white">{cat.label}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {catChecked}/{allItems.length}
                  </span>
                </div>
                <div className="border-t border-white/5">
                  {allItems.map((item) => {
                    const isCustom = !cat.items.includes(item);
                    return (
                      <div
                        key={item}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-white/3 transition-colors"
                      >
                        <button
                          onClick={() => toggle(catKey, item)}
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                            checked[catKey]?.[item]
                              ? 'bg-emerald-500 border-emerald-500'
                              : 'border-gray-600 hover:border-amber-500'
                          }`}
                        >
                          {checked[catKey]?.[item] && <Check size={11} className="text-white" />}
                        </button>
                        <span
                          className={`text-sm flex-1 ${
                            checked[catKey]?.[item] ? 'line-through text-gray-500' : 'text-gray-200'
                          }`}
                        >
                          {item}
                        </span>
                        {isCustom && (
                          <button
                            onClick={() => removeCustom(catKey, item)}
                            className="text-gray-600 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                  {/* Add item */}
                  {activeCategory === catKey ? (
                    <div className="flex gap-2 px-5 py-3 border-t border-white/5">
                      <input
                        autoFocus
                        type="text"
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addItem(catKey)}
                        placeholder="Add custom item..."
                        className="flex-1 bg-black/20 border border-amber-500/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none"
                      />
                      <button
                        onClick={() => addItem(catKey)}
                        className="px-3 py-2 bg-amber-500 text-black rounded-lg text-sm font-bold"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => { setActiveCategory(null); setNewItemText(''); }}
                        className="px-3 py-2 bg-white/5 text-gray-400 rounded-lg text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveCategory(catKey)}
                      className="flex items-center gap-1.5 px-5 py-3 text-xs text-gray-500 hover:text-amber-400 transition-colors w-full border-t border-white/5"
                    >
                      <Plus size={12} /> Add custom item
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
