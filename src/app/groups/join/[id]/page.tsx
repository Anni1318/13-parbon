'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Users, UserPlus } from 'lucide-react';

const COLORS = [
  '#F59E0B', '#10B981', '#EF4444', '#8B5CF6',
  '#EC4899', '#3B82F6', '#F97316', '#14B8A6',
];

export default function JoinGroupPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [group, setGroup] = useState<any>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if they are already in this group
    const savedGroupId = localStorage.getItem('pujaGroupId');
    if (savedGroupId === id) {
      router.push('/groups');
      return;
    }

    // Fetch group details
    fetch(`/api/groups/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Group not found');
        return res.json();
      })
      .then(data => {
        setGroup(data);
        setLoading(false);
      })
      .catch(() => {
        setError("This group doesn't exist or the link has expired.");
        setLoading(false);
      });
  }, [id, router]);

  const handleJoin = async () => {
    if (!name.trim()) return;
    setJoining(true);
    
    try {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const res = await fetch(`/api/groups/${id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), color }),
      });
      
      if (res.ok) {
        localStorage.setItem('pujaGroupId', id);
        router.push('/groups');
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to join group');
        setJoining(false);
      }
    } catch (e) {
      setError('A network error occurred.');
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-amber-500 font-bold animate-pulse">Finding Group...</p>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="min-h-screen py-20 px-4 text-center">
        <Users size={48} className="mx-auto text-gray-600 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Group Not Found</h1>
        <p className="text-gray-400 mb-8">{error}</p>
        <button 
          onClick={() => router.push('/groups')}
          className="px-6 py-3 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-colors"
        >
          Go to Groups
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-md mx-auto bg-[#1F2937] border border-amber-500/20 rounded-3xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Users size={32} className="text-amber-500" />
        </div>
        
        <h1 className="text-2xl font-extrabold text-white mb-2">You've been invited!</h1>
        <p className="text-gray-400 text-sm mb-8">
          Join <strong className="text-amber-400">{group.name}</strong> to plan your pandal hopping together.
        </p>

        <div className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            placeholder="Enter your name to join"
            className="w-full bg-black/30 border border-amber-500/30 rounded-xl px-4 py-4 text-center text-white placeholder-gray-500 font-semibold outline-none focus:border-amber-500/70 transition-colors"
            autoFocus
          />
          
          <button
            onClick={handleJoin}
            disabled={!name.trim() || joining}
            className="w-full flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold rounded-xl transition-all"
          >
            {joining ? (
              <span className="animate-pulse">Joining...</span>
            ) : (
              <>
                <UserPlus size={20} /> Join Group
              </>
            )}
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-6">
          Currently {group.members?.length || 0} members in this group
        </p>
      </div>
    </div>
  );
}
