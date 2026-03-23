import { useEffect, useState } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import { useAuth } from '../contexts/AuthContext';

export default function Feed() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    fetch(`/api/videos?userId=${user.uid}`)
      .then(res => res.json())
      .then(data => {
        setVideos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch videos:', err);
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-black text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black text-white gap-4">
        <p className="text-xl font-medium">No videos yet</p>
        <p className="text-zinc-500">Be the first to upload!</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full snap-y snap-mandatory overflow-y-scroll bg-black">
      {videos.map((video: any) => (
        <div key={video.id} className="h-full w-full snap-start relative">
          <VideoPlayer video={video} />
        </div>
      ))}
    </div>
  );
}
