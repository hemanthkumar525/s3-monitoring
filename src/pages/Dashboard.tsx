import React, { useState, useEffect, useCallback } from 'react';
import {
  AlertCircle,
  Activity,
  Database,
  DollarSign,
  ShieldCheck,
  BarChart3,
  Clock3,
  RefreshCw,
} from 'lucide-react';

import { motion, AnimatePresence } from 'motion/react';

import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { S3BucketCard } from '../components/S3BucketCard';
import { AIAnalysis } from '../components/AIAnalysis';
import { ArchitectureBanner } from '../components/ArchitectureBanner';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

import { fetchMonitoringData } from '../services/api';
import { APIResponse } from '../types';

export default function Dashboard() {
  const [data, setData] = useState<APIResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // =========================================
  // Parse AI Analysis
  // =========================================

  const parseAIAnalysis = (analysis: string) => {
    try {
      if (
        analysis.includes("'choices':") &&
        analysis.includes("'content':")
      ) {
        const match = analysis.match(/'content':\s*'([^']*)'/);

        if (match && match[1]) {
          return match[1]
            .replace(/\\n/g, '\n')
            .replace(
              /\\u[0-9a-f]{4}/g,
              (c) =>
                String.fromCharCode(
                  parseInt(c.slice(2), 16)
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
  // Load Monitoring Data
  // =========================================

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsRefreshing(true);

    try {
      const result = await fetchMonitoringData();

      setData(result);
    } catch (err) {
      console.error(err);

      setError('Failed to fetch monitoring data');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // =========================================
  // Derived Metrics
  // =========================================

  const bucketCount =
    data?.monitoring_data?.s3_buckets?.length || 0;

  const metricCount =
    data?.monitoring_data?.cloudwatch_metrics
      ?.metric_count || 0;

  const eventCount =
    data?.monitoring_data?.cloudtrail_events
      ?.length || 0;

  const monthlyCost =
    data?.monitoring_data?.s3_billing
      ?.monthly_cost || 0;

  const secureBuckets =
    data?.monitoring_data?.s3_buckets?.filter(
      (bucket) => bucket.security === 'secure'
    ).length || 0;

  // =========================================
  // UI
  // =========================================

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B1120] text-white">
      {/* Sidebar */}

      <Sidebar />

      {/* Main Content */}

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Navbar }

        <Navbar />

        {/* Content */}

        <div className="flex-1 p-6 xl:p-8 space-y-6 max-w-[1800px] mx-auto w-full">
          {/* ========================================= */}
          {/* Header */}
          {/* ========================================= */}

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
                  Real-time telemetry, infrastructure
                  analysis, security posture monitoring,
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

          {/* ========================================= */}
          {/* Error */}
          {/* ========================================= */}

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

                  <button
                    onClick={() => setError(null)}
                    className="text-xs text-red-300 hover:text-white transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ========================================= */}
          {/* Loading */}
          {/* ========================================= */}

          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {/* ========================================= */}
              {/* KPI Cards */}
              {/* ========================================= */}

              <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
                {/* Monthly Cost */}

                <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5 shadow-xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-medium">
                        Monthly Cost
                      </p>

                      <h2 className="text-4xl font-bold mt-4">
                        $
                        {monthlyCost.toFixed(2)}
                      </h2>

                      <p className="text-emerald-400 text-sm mt-2">
                        Amazon S3 Billing
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <DollarSign
                        size={22}
                        className="text-emerald-400"
                      />
                    </div>
                  </div>
                </div>

                {/* S3 Buckets */}

                <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5 shadow-xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-medium">
                        S3 Buckets
                      </p>

                      <h2 className="text-4xl font-bold mt-4">
                        {bucketCount}
                      </h2>

                      <p className="text-blue-400 text-sm mt-2">
                        Active Resources
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <Database
                        size={22}
                        className="text-blue-400"
                      />
                    </div>
                  </div>
                </div>

                {/* CloudTrail Events */}

                <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5 shadow-xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-medium">
                        Events
                      </p>

                      <h2 className="text-4xl font-bold mt-4">
                        {eventCount}
                      </h2>

                      <p className="text-orange-400 text-sm mt-2">
                        CloudTrail Logs
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                      <Activity
                        size={22}
                        className="text-orange-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Metrics */}

                <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5 shadow-xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-medium">
                        Metrics
                      </p>

                      <h2 className="text-4xl font-bold mt-4">
                        {metricCount}
                      </h2>

                      <p className="text-violet-400 text-sm mt-2">
                        CloudWatch Signals
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                      <BarChart3
                        size={22}
                        className="text-violet-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Security */}

                <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5 shadow-xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-medium">
                        Secure Buckets
                      </p>

                      <h2 className="text-4xl font-bold mt-4">
                        {secureBuckets}
                      </h2>

                      <p className="text-emerald-400 text-sm mt-2">
                        Security Healthy
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <ShieldCheck
                        size={22}
                        className="text-emerald-400"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* ========================================= */}
              {/* Main Grid */}
              {/* ========================================= */}

              <section className="grid grid-cols-12 gap-6">
                {/* ========================================= */}
                {/* Left Column */}
                {/* ========================================= */}

                <div className="col-span-12 xl:col-span-8 space-y-6">
                  {/* Cost Analysis */}

                  <section className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-xl font-semibold">
                          Cost Analysis
                        </h2>

                        <p className="text-slate-400 text-sm mt-1">
                          Current AWS infrastructure
                          spend overview
                        </p>
                      </div>

                      <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
                        <span className="text-emerald-400 text-sm font-semibold">
                          {
                            data?.monitoring_data
                              ?.s3_billing
                              ?.currency
                          }
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="bg-[#0B1220] border border-white/5 rounded-2xl p-5">
                        <p className="text-sm text-slate-400">
                          Current Monthly Cost
                        </p>

                        <h2 className="text-5xl font-bold mt-4">
                          $
                          {monthlyCost.toFixed(2)}
                        </h2>
                      </div>

                      <div className="bg-[#0B1220] border border-white/5 rounded-2xl p-5">
                        <p className="text-sm text-slate-400">
                          Billing Service
                        </p>

                        <h2 className="text-2xl font-semibold mt-4">
                          {
                            data?.monitoring_data
                              ?.s3_billing?.service
                          }
                        </h2>
                      </div>

                      <div className="bg-[#0B1220] border border-white/5 rounded-2xl p-5">
                        <p className="text-sm text-slate-400">
                          Billing Period
                        </p>

                        <h2 className="text-2xl font-semibold mt-4">
                          {
                            data?.monitoring_data
                              ?.s3_billing
                              ?.billing_period
                          }
                        </h2>
                      </div>
                    </div>
                  </section>

                  {/* AI Analysis */}

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

                  {/* CloudTrail Events */}

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
                      {data?.monitoring_data?.cloudtrail_events?.map(
                        (event, index) => (
                          <div
                            key={index}
                            className="bg-[#0B1220] border border-white/5 rounded-xl p-4 hover:bg-white/[0.03] transition-all duration-200"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div>
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

                  {/* Architecture */}

                  <section className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-xl">
                    <div className="mb-5">
                      <h2 className="text-xl font-semibold">
                        Monitoring Architecture
                      </h2>

                      <p className="text-slate-400 text-sm mt-1">
                        AWS monitoring and telemetry
                        processing pipeline
                      </p>
                    </div>

                    <ArchitectureBanner />
                  </section>
                </div>

                {/* ========================================= */}
                {/* Right Column */}
                {/* ========================================= */}

                <div className="col-span-12 xl:col-span-4 space-y-6">
                  {/* Security Overview */}

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
                      <div className="bg-[#0B1220] border border-white/5 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-sm">
                            Secure Buckets
                          </span>

                          <span className="text-2xl font-bold text-emerald-400">
                            {secureBuckets}
                          </span>
                        </div>
                      </div>

                      <div className="bg-[#0B1220] border border-white/5 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-sm">
                            Total Resources
                          </span>

                          <span className="text-2xl font-bold text-blue-400">
                            {bucketCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Bucket Inventory */}

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
                      {data?.monitoring_data?.s3_buckets?.map(
                        (bucket, index) => (
                          <S3BucketCard
                            key={bucket.name}
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

        {/* ========================================= */}
        {/* Footer */}
        {/* ========================================= */}

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
