import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';

import {
  AlertCircle,
  Activity,
  Database,
  DollarSign,
  ShieldCheck,
  BarChart3,
  Clock3,
  RefreshCw,
  Cpu,
} from 'lucide-react';

import {
  motion,
  AnimatePresence,
} from 'motion/react';

import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { S3BucketCard } from '../components/S3BucketCard';
import { AIAnalysis } from '../components/AIAnalysis';
import { ArchitectureBanner } from '../components/ArchitectureBanner';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

import {
  fetchMonitoringData,
} from '../services/api';

import {
  APIResponse,
} from '../types';

export default function Dashboard() {

  const [data, setData] =
    useState<APIResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  // =========================================
  // PARSE AI ANALYSIS
  // =========================================

  const parseAIAnalysis = (
    analysis: string
  ) => {

    try {

      if (
        analysis.includes("'choices':") &&
        analysis.includes("'content':")
      ) {

        const match =
          analysis.match(
            /'content':\s*'([^']*)'/
          );

        if (
          match &&
          match[1]
        ) {

          return match[1]

            .replace(
              /\\n/g,
              '\n'
            )

            .replace(
              /\\u[0-9a-f]{4}/g,
              (c) =>
                String.fromCharCode(
                  parseInt(
                    c.slice(2),
                    16
                  )
                )
            );
        }
      }

      return analysis;

    } catch {

      return analysis;
    }
  };

  // =========================================
  // LOAD DATA
  // =========================================

  const loadData =
    useCallback(async () => {

      setLoading(true);

      setError(null);

      setIsRefreshing(true);

      try {

        const result =
          await fetchMonitoringData();

        setData(result);

      } catch (err) {

        console.error(err);

        setError(
          'Failed to fetch monitoring data'
        );

      } finally {

        setLoading(false);

        setIsRefreshing(false);
      }
    }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // =========================================
  // METRICS
  // =========================================

  const bucketCount =
    data?.monitoring_data
      ?.s3_monitoring?.length || 0;

  const metricCount =
    data?.monitoring_data
      ?.cloudwatch_metrics
      ?.metric_count || 0;

  const eventCount =
    data?.monitoring_data
      ?.cloudtrail_events
      ?.length || 0;

  const monthlyCost =
    data?.monitoring_data
      ?.s3_billing
      ?.monthly_cost || 0;

  const secureBuckets =
    data?.monitoring_data
      ?.s3_monitoring?.filter(
        (bucket) =>
          bucket.encrypted
      ).length || 0;

  const bedrockInvocations =
    data?.monitoring_data
      ?.bedrock_usage
      ?.last_24h_invocations || 0;

  // =========================================
  // UI
  // =========================================

  return (

    <div className="flex h-screen overflow-hidden bg-[#0B1120] text-white">

      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        <Navbar />

        <div className="flex-1 p-6 xl:p-8 space-y-6 max-w-[1800px] mx-auto w-full">

          {/* HEADER */}

          <section className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-xl">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

              <div>

                <p className="text-xs uppercase tracking-[0.3em] text-blue-400 font-semibold mb-2">
                  Enterprise Infrastructure Monitoring
                </p>

                <h1 className="text-3xl font-bold tracking-tight">
                  AWS Monitoring Dashboard
                </h1>

                <p className="text-slate-400 mt-2 max-w-2xl">
                  Real-time telemetry, infrastructure analysis,
                  security posture monitoring,
                  and AWS cost intelligence.
                </p>
              </div>

              <button
                onClick={loadData}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 transition-all duration-200 px-5 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20"
              >

                <RefreshCw
                  size={16}
                  className={
                    isRefreshing
                      ? 'animate-spin'
                      : ''
                  }
                />

                Refresh Data
              </button>
            </div>
          </section>

          {/* ERROR */}

          <AnimatePresence>

            {error && (

              <motion.div

                initial={{
                  opacity: 0,
                  height: 0,
                }}

                animate={{
                  opacity: 1,
                  height: 'auto',
                }}

                exit={{
                  opacity: 0,
                  height: 0,
                }}

                className="overflow-hidden"
              >

                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <AlertCircle
                      size={18}
                      className="text-red-400"
                    />

                    <p className="text-sm text-red-300">
                      {error}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CONTENT */}

          {loading ? (

            <LoadingSkeleton />

          ) : (

            <>
              {/* KPI */}

              <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-5">

                <KpiCard
                  title="Monthly Cost"
                  value={`$${monthlyCost.toFixed(2)}`}
                  subtitle="Amazon S3 Billing"
                  icon={
                    <DollarSign size={22} />
                  }
                  color="emerald"
                />

                <KpiCard
                  title="S3 Buckets"
                  value={bucketCount}
                  subtitle="Active Resources"
                  icon={
                    <Database size={22} />
                  }
                  color="blue"
                />

                <KpiCard
                  title="Events"
                  value={eventCount}
                  subtitle="CloudTrail Logs"
                  icon={
                    <Activity size={22} />
                  }
                  color="orange"
                />

                <KpiCard
                  title="Metrics"
                  value={metricCount}
                  subtitle="CloudWatch Signals"
                  icon={
                    <BarChart3 size={22} />
                  }
                  color="violet"
                />

                <KpiCard
                  title="AI Invocations"
                  value={bedrockInvocations}
                  subtitle="Bedrock Usage"
                  icon={
                    <Cpu size={22} />
                  }
                  color="cyan"
                />

                <KpiCard
                  title="Secure Buckets"
                  value={secureBuckets}
                  subtitle="Security Healthy"
                  icon={
                    <ShieldCheck size={22} />
                  }
                  color="emerald"
                />
              </section>

              {/* MAIN GRID */}

              <section className="grid grid-cols-12 gap-6">

                {/* LEFT */}

                <div className="col-span-12 xl:col-span-8 space-y-6">

                  <section className="bg-[#111827] border border-[#1F2937] rounded-2xl p-1 shadow-xl">

                    <AIAnalysis
                      analysis={parseAIAnalysis(
                        data?.ai_analysis ||
                        'No AI analysis available.'
                      )}
                      bucketCount={bucketCount}
                      metricCount={metricCount}
                    />
                  </section>

                  {/* CLOUDTRAIL */}

                  <section className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-xl">

                    <div className="flex items-center justify-between mb-6">

                      <div>

                        <h2 className="text-xl font-semibold">
                          CloudTrail Activity
                        </h2>

                        <p className="text-slate-400 text-sm mt-1">
                          Real-time AWS audit event feed
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400">

                        <Clock3 size={14} />

                        Live Events
                      </div>
                    </div>

                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">

                      {data?.monitoring_data
                        ?.cloudtrail_events?.map(
                          (event, index) => (

                            <div
                              key={index}
                              className="bg-[#0B1220] border border-white/5 rounded-xl p-4"
                            >

                              <div className="flex items-center justify-between gap-4">

                                <div className="flex items-center gap-3">

                                  <span className="text-blue-400 text-sm font-semibold">
                                    {event.event}
                                  </span>

                                  <span className="text-slate-500 text-xs">
                                    by
                                  </span>

                                  <span className="text-slate-300 text-xs">
                                    {event.user}
                                  </span>
                                </div>

                                <div className="text-xs text-slate-500 whitespace-nowrap">

                                  {new Date(
                                    event.time
                                  ).toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                    </div>
                  </section>

                  {/* ARCHITECTURE */}

                  <section className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-xl">

                    <div className="mb-5">

                      <h2 className="text-xl font-semibold">
                        Monitoring Architecture
                      </h2>

                      <p className="text-slate-400 text-sm mt-1">
                        AWS monitoring and telemetry processing pipeline
                      </p>
                    </div>

                    <ArchitectureBanner />
                  </section>
                </div>

                {/* RIGHT */}

                <div className="col-span-12 xl:col-span-4 space-y-6">

                  {/* SECURITY */}

                  <section className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-xl">

                    <div className="flex items-center justify-between mb-5">

                      <div>

                        <h2 className="text-xl font-semibold">
                          Security Overview
                        </h2>

                        <p className="text-slate-400 text-sm mt-1">
                          Infrastructure security posture
                        </p>
                      </div>

                      <ShieldCheck className="text-emerald-400" />
                    </div>

                    <div className="space-y-4">

                      <MetricRow
                        label="Secure Buckets"
                        value={secureBuckets}
                        color="emerald"
                      />

                      <MetricRow
                        label="Total Resources"
                        value={bucketCount}
                        color="blue"
                      />
                    </div>
                  </section>

                  {/* BUCKETS */}

                  <section className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-xl">

                    <div className="flex items-center justify-between mb-5">

                      <div>

                        <h2 className="text-xl font-semibold">
                          Bucket Inventory
                        </h2>

                        <p className="text-slate-400 text-sm mt-1">
                          Active S3 storage resources
                        </p>
                      </div>

                      <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-lg text-blue-400 text-sm font-semibold">

                        {bucketCount}
                      </div>
                    </div>

                    <div className="space-y-4 max-h-[900px] overflow-y-auto pr-2">

                      {data?.monitoring_data
                        ?.s3_monitoring?.map(
                          (bucket, index) => (

                            <S3BucketCard
                              key={
                                bucket.bucket_name
                              }
                              bucket={bucket}
                              index={index}
                            />
                          )
                        )}
                    </div>
                  </section>
                </div>
              </section>
            </>
          )}
        </div>

        {/* FOOTER */}

        <footer className="h-12 border-t border-[#1F2937] bg-[#111827] flex items-center justify-between px-8 shrink-0">

          <div className="flex items-center gap-6">

            <div className="flex items-center gap-2 text-xs text-slate-400">

              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>

              Monitoring API Connected
            </div>

            <div className="text-xs text-slate-500">
              AWS MCP Telemetry Stream
            </div>
          </div>

          <div className="text-xs text-slate-500">

            Last Sync:{' '}

            {data?.monitoring_data?.timestamp

              ? new Date(
                  data.monitoring_data.timestamp
                ).toLocaleString()

              : 'N/A'}
          </div>
        </footer>
      </main>
    </div>
  );
}

// =========================================
// KPI CARD
// =========================================

function KpiCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: any) {

  const styles: any = {

    emerald:
      'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',

    blue:
      'bg-blue-500/10 border-blue-500/20 text-blue-400',

    orange:
      'bg-orange-500/10 border-orange-500/20 text-orange-400',

    violet:
      'bg-violet-500/10 border-violet-500/20 text-violet-400',

    cyan:
      'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
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

          <p className={`text-sm mt-2 ${styles[color].split(' ')[2]}`}>
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

// =========================================
// METRIC ROW
// =========================================

function MetricRow({
  label,
  value,
  color,
}: any) {

  const colors: any = {

    emerald:
      'text-emerald-400',

    blue:
      'text-blue-400',
  };

  return (

    <div className="bg-[#0B1220] border border-white/5 rounded-xl p-4">

      <div className="flex items-center justify-between">

        <span className="text-slate-400 text-sm">
          {label}
        </span>

        <span className={`text-2xl font-bold ${colors[color]}`}>
          {value}
        </span>
      </div>
    </div>
  );
}