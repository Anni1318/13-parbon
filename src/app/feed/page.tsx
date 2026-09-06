'use client';

import { useState, useContext } from 'react';
import { FestivalContext } from '@/context/FestivalContext';
import { Camera, Heart, MessageCircle, Share2, Plus, Send } from 'lucide-react';

interface Post {
  id: string;
  author: string;
  avatar: string;
  time: string;
  pandal: string;
  content: string;
  likes: number;
  liked: boolean;
  photo?: string;
  tag: string;
}

const SAMPLE_POSTS: Post[] = [
  {
    id: '1',
    author: 'Priya Chatterjee',
    avatar: '👩',
    time: '2 min ago',
    pandal: 'Sreebhumi Sporting Club',
    content: 'The Bangkok Temple recreation is absolutely breathtaking! 😍 Queue is about 45 min right now. Come after 1 AM for shorter wait!',
    likes: 47,
    liked: false,
    tag: '🔥 Hot Right Now',
  },
  {
    id: '2',
    author: 'Arjun Bose',
    avatar: '👨',
    time: '15 min ago',
    pandal: 'College Square',
    content: 'Sanatan Dinda\'s idol is pure art this year 🎨 The Char Dham theme is stunning. Pushpanjali tomorrow at 6:14 AM — arrive by 5:30 AM!',
    likes: 89,
    liked: false,
    tag: '✨ Must Visit',
  },
  {
    id: '3',
    author: 'Sumedha Roy',
    avatar: '👩',
    time: '32 min ago',
    pandal: 'Deshapriya Park',
    content: 'The queue at Deshapriya is insane right now 🚶‍♀️🚶 Maybe 2 hour wait. But completely worth it! Sindur Khela vibes are everywhere already 💕',
    likes: 34,
    liked: false,
    tag: '👥 Crowd Report',
  },
  {
    id: '4',
    author: 'Tanmoy Das',
    avatar: '👨',
    time: '1 hr ago',
    pandal: 'Mohammad Ali Park',
    content: 'Bhog was amazing today at Bagbazar! Free khichuri + labra + chutney + payesh 😋 They ran out by 9 AM. Get there early tomorrow!',
    likes: 112,
    liked: false,
    tag: '🍚 Bhog Alert',
  },
  {
    id: '5',
    author: 'Ria Mukherjee',
    avatar: '👩',
    time: '2 hrs ago',
    pandal: 'Ekdalia Evergreen',
    content: 'Police confirmed road closure on Rashbehari from 8 PM. Take metro to Rabindra Sarobar and walk from there. Much easier! 🚇',
    likes: 203,
    liked: false,
    tag: '🚇 Transport Tip',
  },
];

export default function FeedPage() {
  const { selectedFestival } = useContext(FestivalContext);
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
  const [newPost, setNewPost] = useState('');
  const [showCompose, setShowCompose] = useState(false);

  const toggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      )
    );
  };

  const submitPost = () => {
    if (!newPost.trim()) return;
    setPosts((prev) => [
      {
        id: Date.now().toString(),
        author: 'You',
        avatar: '🧑',
        time: 'Just now',
        pandal: 'Unknown Pandal',
        content: newPost.trim(),
        likes: 0,
        liked: false,
        tag: '📢 Community',
      },
      ...prev,
    ]);
    setNewPost('');
    setShowCompose(false);
  };

  const TAG_COLORS: Record<string, string> = {
    '🔥 Hot Right Now': 'bg-red-500/15 text-red-400 border-red-500/20',
    '✨ Must Visit': 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    '👥 Crowd Report': 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    '🍚 Bhog Alert': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    '🚇 Transport Tip': 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    '📢 Community': 'bg-gray-500/15 text-gray-400 border-gray-500/20',
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white">📣 Community Feed</h1>
            <p className="text-gray-400 text-sm">
              Live updates from {selectedFestival?.name ?? 'Durga Puja 2026'} revellers
            </p>
          </div>
          <button
            onClick={() => setShowCompose(!showCompose)}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all text-sm"
          >
            <Plus size={14} /> Post
          </button>
        </div>

        {/* Compose */}
        {showCompose && (
          <div className="bg-[#1F2937] border border-amber-500/20 rounded-2xl p-4 mb-6">
            <h3 className="text-sm font-bold text-amber-400 mb-3">Share with the Community</h3>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share queue wait times, pandal tips, bhog alerts, crowd updates..."
              rows={3}
              className="w-full bg-black/30 border border-amber-500/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm outline-none focus:border-amber-500/30 transition-colors resize-none"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setShowCompose(false)}
                className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitPost}
                disabled={!newPost.trim()}
                className="flex items-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold rounded-xl text-sm transition-all"
              >
                <Send size={12} /> Share
              </button>
            </div>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-[#1F2937] border border-amber-500/5 rounded-2xl p-5 hover:border-amber-500/15 transition-colors"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">{post.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="font-bold text-white text-sm">{post.author}</span>
                    <span className="text-gray-500 text-xs">{post.time}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        TAG_COLORS[post.tag] ?? TAG_COLORS['📢 Community']
                      }`}
                    >
                      {post.tag}
                    </span>
                  </div>
                  <p className="text-xs text-amber-400/70 mt-0.5">📍 {post.pandal}</p>
                </div>
              </div>
              <p className="text-gray-200 text-sm leading-relaxed mb-4">{post.content}</p>
              <div className="flex items-center gap-4 text-gray-500">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 text-xs transition-colors ${
                    post.liked ? 'text-red-400' : 'hover:text-red-400'
                  }`}
                >
                  <Heart
                    size={14}
                    className={post.liked ? 'fill-red-400' : ''}
                  />
                  {post.likes}
                </button>
                <button className="flex items-center gap-1.5 text-xs hover:text-amber-400 transition-colors">
                  <MessageCircle size={14} /> Reply
                </button>
                <button className="flex items-center gap-1.5 text-xs hover:text-emerald-400 transition-colors ml-auto">
                  <Share2 size={14} /> Share
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-600">
            Community posts are moderated. Report inappropriate content to festival@pujaGuide.app
          </p>
        </div>
      </div>
    </div>
  );
}
