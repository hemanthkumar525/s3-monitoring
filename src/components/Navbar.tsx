import React from 'react';
import { Bell, Search, User, Zap } from 'lucide-react';

export const Navbar = () => {
  return (
    <header className="h-16 border-b border-white/5 bg-[#0A0B10]/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-white">Enterprise AI Cloud Monitoring</h1>
        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 font-mono tracking-tighter">v2.4.0-PROD</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-1.5 bg-orange-600 hover:bg-orange-500 rounded text-sm font-medium transition-colors text-white ring-1 ring-orange-400/20 shadow-lg shadow-orange-600/20">
          <Zap size={14} className="fill-current" />
          Sync Data
        </button>
        
        <div className="w-px h-6 bg-white/10 mx-2" />
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-200">Admin Ops</p>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Global Architect</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border border-white/20 shadow-inner"></div>
        </div>
      </div>
    </header>
  );
};
