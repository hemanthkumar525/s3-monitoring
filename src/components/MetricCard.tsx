import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

export const MetricCard = ({ label, value, icon: Icon, color }: MetricCardProps) => {
  return (
    <div className="glass p-5 rounded-2xl flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-white mt-0.5">{value}</p>
      </div>
    </div>
  );
};
