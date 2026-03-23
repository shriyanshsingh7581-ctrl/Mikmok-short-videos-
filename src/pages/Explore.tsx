import { Search, TrendingUp, Hash } from 'lucide-react';

export default function Explore() {
  return (
    <div className="h-full w-full bg-black text-white flex flex-col pt-safe overflow-y-auto">
      <div className="p-4 sticky top-0 bg-black/80 backdrop-blur-md z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input 
            type="text" 
            placeholder="Search creators, videos..." 
            className="w-full bg-zinc-900 rounded-full py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-zinc-700 transition-shadow"
          />
        </div>
      </div>

      <div className="flex-1 p-4 pb-20">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-red-500" size={20} />
          <h2 className="text-lg font-bold">Trending Now</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[3/4] bg-zinc-800 rounded-lg relative overflow-hidden group cursor-pointer">
              <img src={`https://picsum.photos/seed/trending${i}/400/600`} alt="Trending" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 left-2 text-xs font-medium drop-shadow-md">
                @creator_{i}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Hash className="text-blue-500" size={20} />
          <h2 className="text-lg font-bold">Popular Hashtags</h2>
        </div>

        <div className="flex flex-col gap-3">
          {['#dance', '#comedy', '#learning', '#music'].map((tag) => (
            <div key={tag} className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                  <Hash size={20} className="text-zinc-400" />
                </div>
                <div>
                  <p className="font-semibold">{tag}</p>
                  <p className="text-xs text-zinc-500">{(Math.random() * 10).toFixed(1)}M views</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
