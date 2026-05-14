import React, { useState, useEffect, useCallback } from 'react';
import { 
  Database, 
  Plus, 
  ShieldCheck, 
  Activity, 
  RefreshCw, 
  AlertCircle,
  Zap,
  CheckCircle2,
  Lock,
  Eye,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { S3BucketCard } from '../components/S3BucketCard';
import { AIAnalysis } from '../components/AIAnalysis';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { CreateBucketModal } from '../components/CreateBucketModal';
import { fetchMonitoringData } from '../services/api';
import { APIResponse } from '../types';

export default function S3Operations() {
  const [data, setData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Helper to parse AI analysis if it's JSON-like string
  const parseAIAnalysis = (analysis: string) => {
    try {
      if (analysis.includes("'choices':") && analysis.includes("'content':")) {
        const match = analysis.match(/'content':\s*'([^']*)'/);
        if (match && match[1]) {
          return match[1].replace(/\\n/g, '\n').replace(/\\u[0-9a-f]{4}/g, (c) => String.fromCharCode(parseInt(c.slice(2), 16)));
        }
      }
      return analysis;
    } catch {
      return analysis;
    }
  };

  const loadData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setIsRefreshing(true);
    setError(null);

    try {
      const result = await fetchMonitoringData();
      setData(result);
    } catch (err: any) {
      console.warn("API Fetch failed", err);
      setError("Failed to sync storage telemetry. Please check API Gateway status.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateSuccess = () => {
    setSuccessMessage("Bucket provisioned successfully. AI Monitoring will update shortly.");
    loadData(false);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-brand-bg text-white">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar />
        
        <div className="flex-1 p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* S3 Operations Hero */}
          <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-brand-bg rounded-2xl p-8 border border-white/10 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="glass-pill text-orange-500 border-orange-500/30">AWS STORAGE OPS</span>
                <span className="glass-pill text-blue-400 border-blue-400/30">HUMAN-IN-THE-LOOP</span>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">S3 Operations Center</h1>
              <p className="text-slate-400 max-w-xl font-medium leading-relaxed">
                Manage enterprise storage infrastructure with AI-driven insights and human-governed execution.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => loadData(false)}
                disabled={isRefreshing}
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                title="Refresh Analytics"
              >
                <RefreshCw size={20} className={isRefreshing ? "animate-spin text-brand-aws" : "text-slate-400"} />
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-500 border border-orange-500 shadow-lg shadow-orange-600/20 rounded-xl flex items-center gap-3 transition-all active:scale-95 group/btn"
              >
                <Plus size={20} className="text-white group-hover/btn:rotate-90 transition-transform duration-300" />
                <span className="font-bold text-sm tracking-widest uppercase">Create Bucket</span>
              </button>
            </div>

            <div className="absolute right-0 top-0 h-full w-1/3 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
              <Database size={160} className="text-slate-400 -rotate-12 translate-x-12 translate-y-4" />
            </div>
          </section>

          <AnimatePresence>
            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-500 shadow-xl shadow-emerald-500/5"
              >
                <CheckCircle2 size={18} />
                <p className="text-xs font-bold uppercase tracking-wider">{successMessage}</p>
              </motion.div>
            )}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400"
              >
                <AlertCircle size={18} />
                <p className="text-xs font-bold uppercase tracking-wider">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-12 gap-8">
            {/* Left Column: Governance & AI */}
            <div className="col-span-12 lg:col-span-7 space-y-6">
              {loading ? <div className="h-64 glass rounded-2xl animate-pulse" /> : (
                <AIAnalysis 
                  analysis={parseAIAnalysis(data?.ai_analysis || "Generating storage optimization strategy...")} 
                  bucketCount={data?.monitoring_data.s3_monitoring.length || 0}
                  metricCount={data?.monitoring_data.cloudwatch_metrics.metric_count || 0}
                />
              )}

              {/* Security Banner */}
              <div className="bg-slate-900 shadow-2xl rounded-2xl p-6 border border-white/5 space-y-4">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <ShieldCheck className="text-emerald-500" size={24} />
                  <h3 className="text-lg font-bold tracking-tight text-white">Enterprise AI Governance</h3>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "IAM Explicit Deny", icon: Lock, color: "text-rose-400 bg-rose-400/10" },
                    { label: "Human Approval", icon: CheckCircle2, color: "text-emerald-400 bg-emerald-400/10" },
                    { label: "Audited Actions", icon: Eye, color: "text-sky-400 bg-sky-400/10" },
                    { label: "Read-Only AI", icon: ShieldCheck, color: "text-blue-400 bg-blue-400/10" },
                  ].map((badge) => (
                    <div key={badge.label} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                      <div className={`p-2 rounded-lg ${badge.color}`}>
                        <badge.icon size={18} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">{badge.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Bucket Inventory */}
            <div className="col-span-12 lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Infrastructure Inventory</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-black tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Telems Synchronized
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => <div key={i} className="h-24 glass rounded-xl animate-pulse" />)}
                </div>
              ) : (
                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 scrollbar-none pb-8">
                  {data?.monitoring_data.s3_monitoring.map((bucket, i) => (
                    <S3BucketCard key={bucket.bucket_name} bucket={bucket} index={i} />
                  ))}
                  {data?.monitoring_data.s3_monitoring.length === 0 && (
                     <div className="p-12 text-center glass rounded-2xl space-y-4 border-dashed">
                        <Database size={48} className="mx-auto text-slate-700" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No active buckets detected</p>
                     </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Status Bar fallback 
        <footer className="h-10 bg-[#07080C] border-t border-white/5 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-6">
            <div className="text-[10px] text-slate-500 font-medium">
              Active Control Plane: <span className="text-brand-aws font-bold">AWS-MCP-US-EAST-1</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="text-[10px] text-slate-500 font-medium font-mono uppercase tracking-tighter">
              IAM: MFA-PROTECTED-OPERATIONS
            </div>
          </div>
          <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest flex items-center gap-2">
            Audit Stream Active
            <Activity size={12} className="text-brand-aws animate-pulse" />
          </div>
        </footer>*/}

        <CreateBucketModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleCreateSuccess} 
        />
      </main>
    </div>
  );
}
