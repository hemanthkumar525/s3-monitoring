import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';

import {
  BrainCircuit,
  Cpu,
  Activity,
  RefreshCw,
  AlertCircle,
  Layers3,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Plus,
} from 'lucide-react';

import {
  motion,
  AnimatePresence,
} from 'motion/react';

import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { AIAnalysis } from '../components/AIAnalysis';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

import {
  fetchMonitoringData,
  createBedrockProfile,
} from '../services/api';

import {
  APIResponse,
} from '../types';

import {
  BedrockModelCard,
} from '../components/BedrockModelCard';

export default function BedrockOperations() {

  const [data, setData] =
    useState<APIResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [profileName, setProfileName] =
    useState('');

  const [modelArn, setModelArn] =
    useState('');

  const [creating, setCreating] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  // =====================================
  // LOAD DATA
  // =====================================

  const loadData = useCallback(
    async (showLoading = true) => {

      if (showLoading)
        setLoading(true);

      setIsRefreshing(true);

      try {

        const result =
          await fetchMonitoringData();

        setData(result);

      } catch (err: any) {

        console.error(err);

        setError(
          'Failed to sync AI telemetry.'
        );

      } finally {

        setLoading(false);

        setIsRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  // =====================================
  // CREATE PROFILE
  // =====================================

  const handleCreateProfile =
    async () => {

      try {

        setCreating(true);

        await createBedrockProfile({

          profile_name:
            profileName,

          model_arn:
            modelArn,
        });

        setSuccessMessage(
          'Inference profile provisioned successfully.'
        );

        setProfileName('');
        setModelArn('');

        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);

      } catch (err: any) {

        setError(err.message);

      } finally {

        setCreating(false);
      }
    };

  // =====================================
  // METRICS
  // =====================================

  const models =
    data?.monitoring_data
      ?.bedrock_monitoring
      ?.models || [];

  const modelCount =
    data?.monitoring_data
      ?.bedrock_monitoring
      ?.total_models || 0;

  const invocations =
    data?.monitoring_data
      ?.bedrock_usage
      ?.last_24h_invocations || 0;

  return (

    <div className="flex h-screen overflow-hidden bg-brand-bg text-white">

      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        <Navbar />

        <div className="flex-1 p-8 space-y-6 max-w-7xl mx-auto w-full">

          {/* ================================= */}
          {/* HERO */}
          {/* ================================= */}

          <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-brand-bg rounded-2xl p-8 border border-white/10 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">

            <div className="relative z-10 space-y-2">

              <div className="flex items-center gap-2 mb-2">

                <span className="glass-pill text-cyan-400 border-cyan-500/30">
                  BEDROCK AI OPS
                </span>

                <span className="glass-pill text-violet-400 border-violet-500/30">
                  FOUNDATION MODELS
                </span>
              </div>

              <h1 className="text-3xl font-black text-white tracking-tight">
                Bedrock Operations Center
              </h1>

              <p className="text-slate-400 max-w-xl font-medium leading-relaxed">
                Enterprise AI governance,
                foundation model telemetry,
                inference monitoring,
                and AI operational intelligence.
              </p>
            </div>

            <div className="flex items-center gap-3">

              <button
                onClick={() =>
                  loadData(false)
                }
                disabled={isRefreshing}
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
              >

                <RefreshCw
                  size={20}
                  className={
                    isRefreshing
                      ? 'animate-spin text-cyan-400'
                      : 'text-slate-400'
                  }
                />
              </button>
            </div>

            <div className="absolute right-0 top-0 h-full w-1/3 opacity-[0.03]">

              <BrainCircuit
                size={180}
                className="text-cyan-400 -rotate-12 translate-x-12 translate-y-4"
              />
            </div>
          </section>

          {/* ================================= */}
          {/* ALERTS */}
          {/* ================================= */}

          <AnimatePresence>

            {successMessage && (

              <motion.div

                initial={{
                  opacity: 0,
                  y: -20,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                exit={{
                  opacity: 0,
                }}

                className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400"
              >

                <CheckCircle2 size={18} />

                <p className="text-xs font-bold uppercase tracking-wider">
                  {successMessage}
                </p>
              </motion.div>
            )}

            {error && (

              <motion.div

                initial={{
                  opacity: 0,
                  y: -20,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                exit={{
                  opacity: 0,
                }}

                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400"
              >

                <AlertCircle size={18} />

                <p className="text-xs font-bold uppercase tracking-wider">
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ================================= */}
          {/* KPI ROW */}
          {/* ================================= */}

          <section className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <KpiCard
              title="Foundation Models"
              value={modelCount}
              subtitle="Available Models"
              icon={<BrainCircuit size={22} />}
              color="cyan"
            />

            <KpiCard
              title="AI Invocations"
              value={invocations}
              subtitle="24 Hour Usage"
              icon={<Cpu size={22} />}
              color="violet"
            />

            <KpiCard
              title="AI Operations"
              value="ACTIVE"
              subtitle="Operational Status"
              icon={<Activity size={22} />}
              color="emerald"
            />
          </section>

          {/* ================================= */}
          {/* MAIN GRID */}
          {/* ================================= */}

          <div className="grid grid-cols-12 gap-8">

            {/* LEFT */}

            <div className="col-span-12 lg:col-span-7 space-y-6">

              {/* CREATE PROFILE */}

              <section className="bg-slate-900 shadow-2xl rounded-2xl p-6 border border-white/5 space-y-5">

                <div className="flex items-center gap-3">

                  <Plus className="text-cyan-400" />

                  <h3 className="text-lg font-bold">
                    Create Inference Profile
                  </h3>
                </div>

                <div className="space-y-4">

                  <input
                    value={profileName}
                    onChange={(e) =>
                      setProfileName(
                        e.target.value
                      )
                    }
                    placeholder="finance-ai-profile"
                    className="w-full bg-[#0B1220] border border-[#1F2937] rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                  />

                  <input
                    value={modelArn}
                    onChange={(e) =>
                      setModelArn(
                        e.target.value
                      )
                    }
                    placeholder="arn:aws:bedrock:..."
                    className="w-full bg-[#0B1220] border border-[#1F2937] rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                  />

                  <button
                    onClick={
                      handleCreateProfile
                    }
                    disabled={creating}
                    className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold text-sm"
                  >

                    {creating
                      ? 'Creating...'
                      : 'Provision Profile'}
                  </button>
                </div>
              </section>

              {/* AI ANALYSIS */}

              {/*loading ? (

                <LoadingSkeleton />

              ) : (

                <AIAnalysis
                  analysis={
                    data?.ai_analysis ||
                    'Generating AI operational insights...'
                  }
                  bucketCount={modelCount}
                  metricCount={invocations}
                />
              )*/}
            </div>

            {/* RIGHT */}

            <div className="col-span-12 lg:col-span-5 space-y-4">

              <div className="flex items-center justify-between">

                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  AI Model Inventory
                </h2>
              </div>

              {loading ? (

                <LoadingSkeleton />

              ) : (

                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 scrollbar-none pb-8">

                  {models.map(
                    (
                      model,
                      index
                    ) => (

                      <BedrockModelCard
                        key={index}
                        model={model}
                      />
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function KpiCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: any) {

  const styles: any = {

    cyan:
      'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',

    violet:
      'bg-violet-500/10 border-violet-500/20 text-violet-400',

    emerald:
      'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  };

  return (

    <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5 shadow-xl">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs uppercase tracking-widest text-slate-400 font-medium">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-4">
            {value}
          </h2>

          <p className="text-sm mt-2 text-slate-400">
            {subtitle}
          </p>
        </div>

        <div className={`p-3 rounded-xl border ${styles[color]}`}>

          {icon}
        </div>
      </div>
    </div>
  );
}