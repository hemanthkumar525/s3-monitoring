import React from 'react';
import { ArrowRight, Server, Globe, Cpu, Database, Activity } from 'lucide-react';

export const ArchitectureBanner = () => {
  const steps = [
    { icon: Globe, label: 'Frontend' },
    { icon: Server, label: 'API Gateway' },
    { icon: Cpu, label: 'Lambda AI' },
    { icon: Database, label: 'S3 / CloudTrail' },
  ];

  return (
    <div className="bg-slate-900/40 rounded-xl p-6 border border-white/5 mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
         <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] -rotate-90 origin-left">Pipeline</span>
         <div className="flex items-center gap-6 text-[10px] text-slate-400 overflow-x-auto pb-2 scrollbar-none">
           <div className="flex flex-col items-center gap-1 shrink-0">
             <div className="px-3 py-2 bg-white/5 rounded border border-white/5 font-medium tracking-tight">Frontend</div>
           </div>
           
           <ArrowRight size={12} className="text-slate-700 shrink-0" />
           
           <div className="flex flex-col items-center gap-1 shrink-0">
             <div className="px-3 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded font-medium tracking-tight">API Gateway</div>
           </div>
           
           <ArrowRight size={12} className="text-slate-700 shrink-0" />
           
           <div className="flex flex-col items-center gap-1 shrink-0">
             <div className="px-3 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded font-medium tracking-tight">Lambda AI Assistant</div>
           </div>
           
           <ArrowRight size={12} className="text-slate-700 shrink-0" />
           
           <div className="flex flex-col items-center gap-1 shrink-0">
             <div className="px-3 py-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded font-medium tracking-tight">AWS MCP Tools</div>
           </div>
           
           <ArrowRight size={12} className="text-slate-700 shrink-0" />
           
           <div className="flex flex-col items-center gap-1 shrink-0">
             <div className="px-3 py-2 bg-white/5 rounded border border-white/5 font-medium tracking-tight">CloudTrail / S3</div>
           </div>
         </div>
      </div>
    </div>
  );
};
