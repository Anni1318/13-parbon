'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, MessageSquare, Activity, BarChart2, MapPin, Battery, BatteryFull, BatteryLow, Navigation } from 'lucide-react';
import { GroupTab } from '@/types/group';
import { mockMembers, mockChat, mockActivity } from './MockGroupData';

interface GroupPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GroupPanel({ isOpen, onClose }: GroupPanelProps) {
  const [activeTab, setActiveTab] = useState<GroupTab>('Members');
  const [message, setMessage] = useState('');
  const [isLocationShared, setIsLocationShared] = useState(false);

  const handleEnableLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocationShared(true);
        },
        (error) => {
          console.error("Error obtaining location", error);
          alert("Could not access location. Please check your permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const tabs: { id: GroupTab; icon: React.ElementType; label: string }[] = [
    { id: 'Members', icon: Users, label: 'Members' },
    { id: 'Chat', icon: MessageSquare, label: 'Chat' },
    { id: 'Activity', icon: Activity, label: 'Activity' },
    { id: 'Summary', icon: BarChart2, label: 'Summary' },
  ];

  const getBatteryIcon = (level?: number) => {
    if (level === undefined) return null;
    if (level > 50) return <BatteryFull size={14} className="text-emerald-400" />;
    if (level > 20) return <Battery size={14} className="text-amber-400" />;
    return <BatteryLow size={14} className="text-red-500" />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full md:w-[400px] h-full bg-[#111827] shadow-2xl z-[160] flex flex-col border-l border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 bg-[#1F2937]">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-amber-400">👥</span> Your Group
                </h2>
                <p className={`text-xs mt-1 flex items-center gap-1 ${isLocationShared ? 'text-emerald-400' : 'text-gray-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${isLocationShared ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`} />
                  Live Sync {isLocationShared ? 'Active' : 'Inactive'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex bg-[#1a2333] border-b border-white/5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 flex flex-col items-center justify-center gap-1 text-xs font-semibold relative transition-colors ${
                      isActive ? 'text-amber-400' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#0B0F19]">
              {/* Members Tab */}
              {activeTab === 'Members' && (
                <div className="space-y-4">
                  {mockMembers.map((member) => (
                    <div key={member.id} className="bg-[#1F2937] border border-white/5 rounded-xl p-4 flex gap-4">
                      {/* Avatar */}
                      <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${member.avatarBgColor}`}>
                        {member.avatarInitials}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-white text-sm flex items-center gap-2">
                            {member.name}
                            {member.isCurrentUser && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400">You</span>
                            )}
                          </h3>
                          {member.batteryLevel !== undefined && (
                            <div className="flex items-center gap-1 text-[10px] text-gray-400">
                              {getBatteryIcon(member.batteryLevel)} {member.batteryLevel}%
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-gray-400 mt-1">{member.status}</p>

                        <div className="mt-3 p-2 bg-black/30 rounded-lg border border-white/5">
                          <p className="text-xs text-gray-300 flex items-center gap-1.5 truncate">
                            <MapPin size={12} className="text-amber-500 shrink-0" />
                            {member.locationName}
                          </p>
                          {member.distance && (
                            <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                              <span className="flex items-center gap-1"><Navigation size={10} /> {member.distance} away</span>
                              {member.walkTime && <span>🚶 {member.walkTime}</span>}
                              {member.carTime && <span>🚗 {member.carTime}</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Empty State / Invite Button */}
                  <div className="mt-6 border-t border-white/5 pt-6 text-center">
                    <p className="text-sm text-gray-400 mb-4">Invite friends to your group to share live locations and plan your tour together.</p>
                    <button className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all">
                      Invite Friends
                    </button>
                    {!isLocationShared ? (
                      <button 
                        onClick={handleEnableLocation}
                        className="w-full mt-3 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all"
                      >
                        Enable Location Sharing
                      </button>
                    ) : (
                      <div className="w-full mt-3 py-3 bg-emerald-500/10 text-emerald-400 font-semibold rounded-xl border border-emerald-500/20 text-center flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Location Sharing Active
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Chat Tab */}
              {activeTab === 'Chat' && (
                <div className="h-full flex flex-col">
                  <div className="flex-1 space-y-4 overflow-y-auto pb-4">
                    {mockChat.length > 0 ? mockChat.map((msg) => (
                      <div key={msg.id} className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}>
                        {!msg.isSelf && <span className="text-[10px] text-gray-500 mb-1 ml-1">{msg.sender}</span>}
                        <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${
                          msg.isSelf 
                            ? 'bg-amber-500 text-black rounded-tr-sm' 
                            : 'bg-[#1F2937] text-white rounded-tl-sm'
                        }`}>
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-gray-500 mt-1">{msg.time}</span>
                      </div>
                    )) : (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                        <MessageSquare size={32} className="text-gray-500 mb-2" />
                        <p className="text-sm text-gray-400">No messages yet.</p>
                        <p className="text-xs text-gray-500 mt-1">Start the conversation!</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-auto relative">
                    <input 
                      type="text" 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full bg-[#1F2937] border border-white/10 rounded-full pl-4 pr-12 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black hover:bg-amber-400 transition-colors">
                      <Navigation size={14} className="rotate-90 ml-[-2px]" />
                    </button>
                  </div>
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === 'Activity' && (
                <div className="space-y-6">
                  {mockActivity.length > 0 ? (
                    <div className="relative border-l border-white/10 ml-4 space-y-6 pb-4">
                      {mockActivity.map((act) => (
                        <div key={act.id} className="relative pl-6">
                          <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-amber-500" />
                          <p className="text-sm text-white">{act.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{act.time}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center pt-10 text-center opacity-50">
                      <Activity size={32} className="text-gray-500 mb-2" />
                      <p className="text-sm text-gray-400">No recent activity.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Summary Tab */}
              {activeTab === 'Summary' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1F2937] p-4 rounded-xl border border-white/5 text-center">
                      <p className="text-3xl font-bold text-white mb-1">1</p>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Member</p>
                    </div>
                    <div className="bg-[#1F2937] p-4 rounded-xl border border-white/5 text-center">
                      <p className="text-3xl font-bold text-amber-500 mb-1">0</p>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Pandals Visited</p>
                    </div>
                  </div>
                  <div className="bg-[#1F2937] p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center py-8 opacity-60">
                    <MapPin size={24} className="text-gray-500 mb-2" />
                    <h3 className="font-bold text-white text-sm mb-1">Tour Not Started</h3>
                    <p className="text-xs text-gray-400">Add members to plan your route</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
