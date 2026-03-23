import { useEffect, useRef, useState } from 'react';
import { Heart, MessageCircle, Share2, Music } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

interface Video {
  id: string;
  videoUrl: string;
  caption: string;
  username: string;
  profileImage: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

export default function VideoPlayer({ video }: { video: Video }) {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(video.isLiked);
  const [likesCount, setLikesCount] = useState(video.likes);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(console.error);
          setIsPlaying(true);
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLike = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/videos/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId: video.id, userId: user.uid }),
      });
      const data = await res.json();
      setIsLiked(data.liked);
      setLikesCount(prev => data.liked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('Failed to like video:', error);
    }
  };

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="w-full h-full object-cover"
        loop
        playsInline
        onClick={togglePlay}
      />
      
      {/* Right Sidebar Actions */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6">
        <div className="relative w-12 h-12 rounded-full border-2 border-white overflow-hidden">
          <img src={video.profileImage} alt={video.username} className="w-full h-full object-cover" />
        </div>
        
        <button onClick={handleLike} className="flex flex-col items-center gap-1">
          <div className={cn("p-3 rounded-full bg-black/40 backdrop-blur-sm transition-colors", isLiked ? "text-red-500" : "text-white")}>
            <Heart size={28} fill={isLiked ? "currentColor" : "none"} />
          </div>
          <span className="text-xs font-semibold drop-shadow-md">{likesCount}</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-white">
          <div className="p-3 rounded-full bg-black/40 backdrop-blur-sm">
            <MessageCircle size={28} />
          </div>
          <span className="text-xs font-semibold drop-shadow-md">{video.comments}</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-white">
          <div className="p-3 rounded-full bg-black/40 backdrop-blur-sm">
            <Share2 size={28} />
          </div>
          <span className="text-xs font-semibold drop-shadow-md">Share</span>
        </button>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-4 left-4 right-20 text-white">
        <h3 className="font-bold text-lg drop-shadow-md">@{video.username}</h3>
        <p className="text-sm mt-2 line-clamp-2 drop-shadow-md">{video.caption}</p>
        <div className="flex items-center gap-2 mt-3 text-sm font-medium drop-shadow-md">
          <Music size={16} className="animate-spin-slow" />
          <span>Original Audio - @{video.username}</span>
        </div>
      </div>
    </div>
  );
}
