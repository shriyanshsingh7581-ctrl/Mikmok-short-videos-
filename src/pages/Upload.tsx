import React, { useState, useRef } from 'react';
import { Upload as UploadIcon, X, Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

export default function Upload() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type.startsWith('video/')) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    } else {
      alert('Please select a valid video file.');
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('video', file);
    formData.append('caption', caption);
    formData.append('userId', user.uid);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      if (data.success) {
        navigate('/profile');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to upload video. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="h-full w-full bg-zinc-950 text-white flex flex-col pt-safe">
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-zinc-800 rounded-full transition-colors">
          <X size={24} />
        </button>
        <h1 className="text-lg font-semibold">New Post</h1>
        <button 
          onClick={handleUpload} 
          disabled={!file || uploading}
          className={cn(
            "px-4 py-1.5 rounded-full font-medium transition-colors flex items-center gap-2",
            file && !uploading ? "bg-red-500 hover:bg-red-600 text-white" : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
          )}
        >
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
          Post
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        {!previewUrl ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-[9/16] max-h-[60vh] border-2 border-dashed border-zinc-700 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-zinc-500 hover:bg-zinc-900/50 transition-all"
          >
            <div className="p-4 rounded-full bg-zinc-800">
              <UploadIcon size={32} className="text-zinc-400" />
            </div>
            <div className="text-center">
              <p className="font-medium text-lg">Select Video</p>
              <p className="text-sm text-zinc-500 mt-1">MP4 or WebM (up to 30s)</p>
            </div>
          </div>
        ) : (
          <div className="relative w-full aspect-[9/16] max-h-[60vh] rounded-2xl overflow-hidden bg-black">
            <video 
              src={previewUrl} 
              className="w-full h-full object-contain"
              controls
              autoPlay
              loop
              muted
            />
            <button 
              onClick={() => {
                setFile(null);
                setPreviewUrl(null);
              }}
              className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <input 
          type="file" 
          accept="video/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden shrink-0">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=mikmok_creator" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Describe your video... #hashtags"
            className="w-full bg-transparent border-none outline-none resize-none text-base placeholder:text-zinc-500 min-h-[100px]"
            maxLength={150}
          />
        </div>
      </div>
    </div>
  );
}
