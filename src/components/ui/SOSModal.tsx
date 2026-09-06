'use client';

import { X, Phone, AlertTriangle } from 'lucide-react';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const emergencyContacts = [
  { label: 'Police', number: '100', icon: '👮' },
  { label: 'Ambulance', number: '108', icon: '🚑' },
  { label: 'Fire Brigade', number: '101', icon: '🚒' },
  { label: 'Women Helpline', number: '1091', icon: '🛡️' },
  { label: 'Child Helpline', number: '1098', icon: '👶' },
  { label: 'SSKM Hospital', number: '033-2223-3800', icon: '🏥' },
  { label: 'Disaster Mgmt', number: '1070', icon: '⚠️' },
  { label: 'Tourist Helpline', number: '1800-111-363', icon: '✈️' },
];

export default function SOSModal({ isOpen, onClose }: SOSModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#1F2937] border border-red-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-red-600/20 rounded-full">
            <AlertTriangle size={24} className="text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Emergency Contacts</h2>
            <p className="text-sm text-gray-400">Kolkata & West Bengal — Tap to call</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {emergencyContacts.map((c) => (
            <a
              key={c.number}
              href={`tel:${c.number}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/30 transition-all"
            >
              <span className="text-2xl">{c.icon}</span>
              <div>
                <p className="text-xs text-gray-400 leading-none">{c.label}</p>
                <p className="font-bold text-white text-sm flex items-center gap-1 mt-0.5">
                  <Phone size={10} className="text-red-400" />
                  {c.number}
                </p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-400 text-center">
            📍 Share your location when calling — tap and hold your position on the map
          </p>
        </div>
      </div>
    </div>
  );
}
