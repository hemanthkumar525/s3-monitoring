import React from 'react';
import { Bot, Sparkles, BrainCircuit } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';

interface AIAnalysisProps {
  analysis: string;
  bucketCount: number;
  metricCount: number;
}

export const AIAnalysis = ({ analysis, bucketCount, metricCount }: AIAnalysisProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden group shadow-2xl ring-1 ring-blue-500/20"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <Bot size={20} />
        </div>
        <h3 className="font-semibold text-slate-100 flex items-center gap-2">
          AI Operational Insights
          <Sparkles size={14} className="text-blue-400 animate-pulse" />
        </h3>
      </div>

      <div className="bg-slate-900/50 rounded-xl p-6 border border-blue-500/10 text-slate-300 text-sm leading-relaxed relative z-10 font-medium overflow-y-auto max-h-[400px] scrollbar-thin">
        <div className="markdown-body prose prose-invert prose-sm max-w-none">
          <ReactMarkdown>{analysis}</ReactMarkdown>
        </div>
      </div>
      
      <div className="mt-4 flex gap-8">
        <div className="text-center px-4 border-r border-white/5">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">S3 Buckets</p>
          <p className="text-xl font-bold text-white">{bucketCount}</p>
        </div>
        <div className="text-center px-4 border-r border-white/5">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">CloudWatch</p>
          <p className="text-xl font-bold text-orange-400">{metricCount.toLocaleString()}</p>
        </div>
        <div className="text-center px-4">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Security Score</p>
          <p className="text-xl font-bold text-emerald-400">98%</p>
        </div>
      </div>

      <div className="absolute right-0 top-0 h-full w-1/3 opacity-[0.03] pointer-events-none">
        <BrainCircuit size={160} className="text-blue-400" />
      </div>
    </motion.div>
  );
};
