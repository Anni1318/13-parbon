'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, MapPin, Clock, Share2, Copy, LogOut } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface Member {
  id: string;
  name: string;
  color: string;
}

interface Group {
  id: string;
  name: string;
  members: Member[];
  meetPoint: string;
  meetTime: string;
}

const COLORS = [
  '#F59E0B', '#10B981', '#EF4444', '#8B5CF6',
  '#EC4899', '#3B82F6', '#F97316', '#14B8A6',
];

export default function GroupsPage() {
  const [group, setGroup] = useState<Group | null>(null);
  const [groupName, setGroupName] = useState('');
  const [memberName, setMemberName] = useState('');
  const [meetPoint, setMeetPoint] = useState('');
  const [meetTime, setMeetTime] = useState('');
  const [loading, setLoading] = useState(true);

  // Load group from local storage on mount
  useEffect(() => {
    const savedGroupId = localStorage.getItem('pujaGroupId');
    if (savedGroupId) {
      fetchGroup(savedGroupId);
    } else {
      setLoading(false);
    }
  }, []);

  // Poll for updates if in a group
  useEffect(() => {
    if (!group?.id) return;
    const interval = setInterval(() => {
      fetchGroup(group.id, false);
    }, 5000);
    return () => clearInterval(interval);
  }, [group?.id]);

  const fetchGroup = async (id: string, showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch(`/api/groups/${id}`);
      if (res.ok) {
        const data = await res.json();
        setGroup(data);
        setMeetPoint(data.meetPoint || '');
        setMeetTime(data.meetTime || '');
      } else {
        // Group no longer exists or error
        if (res.status === 404) {
          localStorage.removeItem('pujaGroupId');
          setGroup(null);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async () => {
    if (!groupName.trim() || !memberName.trim()) return;
    setLoading(true);
    try {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: groupName.trim(), memberName: memberName.trim(), color }),
      });
      if (res.ok) {
        const data = await res.json();
        setGroup(data);
        localStorage.setItem('pujaGroupId', data.id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateMeetup = async () => {
    if (!group) return;
    try {
      const res = await fetch(`/api/groups/${group.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetPoint, meetTime }),
      });
      if (res.ok) {
        const data = await res.json();
        setGroup(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const leaveGroup = () => {
    if (confirm("Are you sure you want to leave this group?")) {
      localStorage.removeItem('pujaGroupId');
      setGroup(null);
    }
  };

  const getJoinLink = () => {
    if (!group) return '';
    return `${window.location.origin}/groups/join/${group.id}`;
  };

  const shareGroup = () => {
    if (!group) return;
    const link = getJoinLink();
    const text = [
      `🪔 PUJA GUIDE — Group: ${group.name}`,
      `👥 Members: ${group.members.map((m) => m.name).join(', ')}`,
      group.meetPoint ? `📍 Meeting Point: ${group.meetPoint}` : '',
      group.meetTime ? `⏰ Meeting Time: ${group.meetTime}` : '',
      '',
      `🔗 Join here: ${link}`,
    ].filter(Boolean).join('\n');

    if (navigator.share) {
      navigator.share({ title: 'PUJA GUIDE Group', text, url: link }).catch(() => {
        navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'));
      });
    } else {
      navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'));
    }
  };

  if (loading && !group) {
    return <div className="min-h-screen flex items-center justify-center text-amber-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen py-10 px-4 pb-32">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Users size={28} className="text-amber-400" />
          <div>
            <h1 className="text-3xl font-extrabold text-white">Festival Groups</h1>
            <p className="text-gray-400 text-sm">Real-time group syncing and planning</p>
          </div>
        </div>

        {!group ? (
          /* Create Group */
          <div className="bg-[#1F2937] border border-amber-500/10 rounded-2xl p-6">
            <h2 className="font-bold text-amber-400 mb-4">Create a Group</h2>
            <div className="space-y-3">
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Group name (e.g. Pandal Hopping Crew)"
                className="w-full bg-black/30 border border-amber-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm outline-none focus:border-amber-500/50 transition-colors"
              />
              <input
                type="text"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createGroup()}
                placeholder="Your Name"
                className="w-full bg-black/30 border border-amber-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm outline-none focus:border-amber-500/50 transition-colors"
              />
              <button
                onClick={createGroup}
                disabled={!groupName.trim() || !memberName.trim() || loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold rounded-xl transition-all"
              >
                <Plus size={16} /> {loading ? 'Creating...' : 'Create Group'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Group Card */}
            <div className="bg-gradient-to-br from-amber-900/30 to-[#1F2937] border border-amber-500/20 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-xl text-white">🎊 {group.name}</h2>
                <button
                  onClick={shareGroup}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/25 transition-colors"
                >
                  <Share2 size={12} /> Share
                </button>
              </div>

              {/* Members */}
              <div className="mb-4">
                <h3 className="text-xs uppercase text-gray-500 font-bold mb-2">Members ({group.members.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {group.members.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold text-black"
                      style={{ backgroundColor: m.color }}
                    >
                      <span>{m.name[0].toUpperCase()}</span>
                      <span>{m.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* QR Code Sharing */}
            <div className="bg-[#1F2937] border border-blue-500/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
               <h3 className="font-bold text-blue-400 mb-2">Scan to Join</h3>
               <p className="text-gray-400 text-sm mb-6">Friends can scan this QR code with their camera to join the group instantly.</p>
               <div className="bg-white p-4 rounded-2xl shadow-xl">
                 <QRCodeSVG value={getJoinLink()} size={200} />
               </div>
               
               <button
                  onClick={() => {
                    navigator.clipboard.writeText(getJoinLink());
                    alert('Link copied to clipboard!');
                  }}
                  className="mt-6 flex items-center justify-center gap-2 py-2 px-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-semibold text-sm transition-colors"
                >
                  <Copy size={14} /> Copy Invite Link
                </button>
            </div>

            {/* Meeting Point */}
            <div className="bg-[#1F2937] border border-emerald-500/10 rounded-2xl p-5">
              <h3 className="font-bold text-emerald-400 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                <MapPin size={14} /> Meeting Point
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={meetPoint}
                  onChange={(e) => setMeetPoint(e.target.value)}
                  placeholder="e.g. Sreebhumi main gate, Deshapriya Park..."
                  className="w-full bg-black/30 border border-emerald-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm outline-none focus:border-emerald-500/50 transition-colors"
                />
                <div className="flex gap-3">
                  <input
                    type="time"
                    value={meetTime}
                    onChange={(e) => setMeetTime(e.target.value)}
                    className="bg-black/30 border border-emerald-500/20 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500/50 transition-colors"
                  />
                  <button
                    onClick={updateMeetup}
                    className="flex-1 py-3 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Update
                  </button>
                </div>
              </div>
              {(group.meetPoint || group.meetTime) && (
                <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm flex justify-between items-center">
                  <div>
                    {group.meetPoint && (
                      <p className="text-emerald-400">
                        📍 {group.meetPoint}
                      </p>
                    )}
                    {group.meetTime && (
                      <p className="text-emerald-400 mt-1">
                        ⏰ {group.meetTime}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="pt-4">
              <button
                onClick={leaveGroup}
                className="w-full flex items-center justify-center gap-2 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-semibold text-sm transition-colors"
              >
                <LogOut size={16} /> Leave Group
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
