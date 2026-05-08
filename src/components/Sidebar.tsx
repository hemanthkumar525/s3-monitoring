import React from 'react';
import { 
  LayoutDashboard, 
  Database, 
  ShieldCheck, 
  Settings, 
  Cloud, 
  LogOut
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/' },
  { icon: Database, label: 'S3 Operations', path: '/operations' },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 h-full border-r border-white/5 bg-brand-sidebar flex flex-col hidden lg:flex">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded flex items-center justify-center shadow-lg shadow-orange-500/10">
          <Cloud size={18} className="text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight text-white">AWS <span className="text-orange-500 font-black">MCP</span></span>
      </div>

      <nav className="flex-1 px-4 space-y-1 pt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group cursor-pointer",
              isActive 
                ? "bg-white/10 text-white shadow-sm" 
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon size={18} className={cn("opacity-80 transition-transform group-hover:scale-105")} />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5">
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-3">
          <p className="text-[10px] uppercase tracking-widest text-blue-400 font-bold mb-1">System Health</p>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>MCP Agent Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
