import { useEffect, useState } from 'react';
import { Settings, Grid, Heart, Bookmark, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user: authUser, logout } = useAuth();
  const [videos, setVideos] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'videos' | 'liked'>('videos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      fetch(`/api/users/${authUser.uid}/videos`)
        .then(res => res.json())
        .then(data => {
          setVideos(data.videos || []);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [authUser]);

  if (loading || !authUser) {
    return (
      <div className="flex items-center justify-center h-full bg-black text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-black text-white flex flex-col pt-safe overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sticky top-0 bg-black/80 backdrop-blur-md z-10">
        <h1 className="text-xl font-bold">{authUser.displayName || 'User'}</h1>
        <button onClick={logout} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-red-400">
          <LogOut size={24} />
        </button>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center px-4 py-6 gap-4">
        <div className="w-24 h-24 rounded-full border-2 border-zinc-800 overflow-hidden bg-zinc-800">
          {authUser.photoURL ? (
            <img src={authUser.photoURL} alt={authUser.displayName || 'User'} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-zinc-500">
              {(authUser.displayName || 'U')[0].toUpperCase()}
            </div>
          )}
        </div>
        <h2 className="text-lg font-semibold">@{authUser.email?.split('@')[0] || 'user'}</h2>
        
        <div className="flex items-center gap-8 mt-2">
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg">0</span>
            <span className="text-xs text-zinc-500">Following</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg">0</span>
            <span className="text-xs text-zinc-500">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg">
              {videos.reduce((acc: number, v: any) => acc + v.likes, 0)}
            </span>
            <span className="text-xs text-zinc-500">Likes</span>
          </div>
        </div>

        <div className="flex gap-2 w-full mt-4">
          <button className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md font-medium text-sm transition-colors">
            Edit Profile
          </button>
          <button className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors">
            <Bookmark size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 sticky top-16 bg-black z-10">
        <button 
          onClick={() => setActiveTab('videos')}
          className={cn(
            "flex-1 py-3 flex justify-center border-b-2 transition-colors",
            activeTab === 'videos' ? "border-white text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
          )}
        >
          <Grid size={20} />
        </button>
        <button 
          onClick={() => setActiveTab('liked')}
          className={cn(
            "flex-1 py-3 flex justify-center border-b-2 transition-colors",
            activeTab === 'liked' ? "border-white text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
          )}
        >
          <Heart size={20} />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-[1px] bg-zinc-900 pb-16">
        {videos.map((video: any) => (
          <div key={video.id} className="aspect-[3/4] bg-zinc-800 relative group cursor-pointer">
            <img src={video.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
            <div className="absolute bottom-1 left-1 flex items-center gap-1 text-white text-xs font-medium drop-shadow-md">
              <Heart size={12} fill="currentColor" />
              {video.likes}
            </div>
          </div>
        ))}
        {videos.length === 0 && (
          <div className="col-span-3 py-20 text-center text-zinc-500">
            No videos yet
          </div>
        )}
      </div>
    </div>
  );
}
