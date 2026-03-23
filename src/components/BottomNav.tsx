import { Home, Search, PlusSquare, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Explore', path: '/explore' },
    { icon: PlusSquare, label: 'Upload', path: '/upload' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="bg-black border-t border-zinc-800 pb-safe">
      <div className="flex justify-around items-center h-14">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
