import React from 'react';
import { Cloud, Shield, Database, Calendar, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { S3Bucket } from '../types';

interface S3BucketCardProps {
  bucket: S3Bucket;
  index: number;
}

export const S3BucketCard: React.FC<S3BucketCardProps> = ({ bucket, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-[#161B22] border border-white/5 rounded-xl p-5 group hover:border-orange-500/30 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-sm font-mono text-slate-200 group-hover:text-white truncate" title={bucket.name}>
            {bucket.name}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-slate-500 font-bold uppercase tracking-tighter">us-east-1</span>
            <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">Standard</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] uppercase font-black tracking-widest border border-emerald-500/20">
            Secure
          </div>
          <div className="flex items-center gap-1 text-[9px] text-emerald-500 opacity-80 font-bold uppercase">
             <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
             Active
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
          <Cloud size={12} className="text-orange-500" />
          <span>Created {new Date(bucket.created).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
           <div className="w-1 h-1 rounded-full bg-slate-400" />
           <div className="w-1 h-1 rounded-full bg-slate-400" />
           <div className="w-1 h-1 rounded-full bg-slate-400" />
        </div>
      </div>
    </motion.div>
  );
};
