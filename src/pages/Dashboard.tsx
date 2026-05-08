import React, { useState, useEffect, useCallback } from 'react';
import { 
  AlertCircle, 
  Zap
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

const MOCK_DATA: APIResponse = {
  monitoring_data: {
    timestamp: "2026-05-07 19:44:38.752769",
    s3_buckets: [
      { name: "cdk-hnb659fds-assets-831009602174-us-east-1", created: "2026-05-07 18:48:42+00:00" },
      { name: "codepipeline-us-east-1-b025b9fed094-4526-a726-8c037a9a5605", created: "2026-04-18 18:31:52+00:00" },
      { name: "heman-portfolio", created: "2026-04-18 17:47:46+00:00" },
      { name: "rms-demo-831009602174-us-east-1-an", created: "2026-04-20 12:25:07+00:00" }
    ],
    cloudtrail_events: [
      { event: "ListStacks", user: "Hemanth", time: "2026-05-07 19:42:40+00:00" },
      { event: "ListStacks", user: "Hemanth", time: "2026-05-07 19:41:40+00:00" },
      { event: "ListStacks", user: "Hemanth", time: "2026-05-07 19:41:19+00:00" },
      { event: "ListManagedNotificationEvents", user: "Hemanth", time: "2026-05-07 19:41:19+00:00" },
      { event: "ListManagedNotificationEvents", user: "Hemanth", time: "2026-05-07 19:41:19+00:00" },
      { event: "GetEnvironmentStatus", user: "Hemanth", time: "2026-05-07 19:41:14+00:00" },
      { event: "DeleteSession", user: "Hemanth", time: "2026-05-07 19:41:13+00:00" },
      { event: "ListStacks", user: "Hemanth", time: "2026-05-07 19:40:39+00:00" },
      { event: "ListRetirableGrants", user: "9d1e91d3-0826-4afc-b216-280d9d5cd4ac", time: "2026-05-07 19:40:21+00:00" },
      { event: "AssumeRole", user: "Unknown", time: "2026-05-07 19:40:21+00:00" }
    ],
    cloudwatch_metrics: {
      metric_count: 6
    }
  },
  ai_analysis: "Okay, let’s analyze this AWS monitoring data.\n\n**Summary:**\n\nThe data indicates activity primarily attributed to a user named \"Hemanth\" within the US-East-1 region. We observe the creation of several S3 buckets, including one potentially related to CDK deployments (cdk-hnb659fds-assets-831009602174-us-east-1), a codepipeline bucket, and a personal portfolio bucket (heman-portfolio).  Furthermore, Hemanth is performing a high volume of `ListStacks` operations within a short timeframe – occurring multiple times between 19:40 and 19:44.  There’s also an `AssumeRole` event with an unknown user ID, raising a potential security concern.\n\n**Suspicious Activity Detection:**\n\n*   **High Frequency `ListStacks` Calls:** The repeated `ListStacks` calls by Hemanth in a short period (19:40-19:44) are noteworthy. While listing stacks is a legitimate operation, the frequency suggests a potentially intensive investigation or scanning of AWS resources. Without further context, it is difficult to determine if this is normal behavior.\n*   **Unknown `AssumeRole` User:** The `AssumeRole` event with an “Unknown” user ID should be investigated immediately. This signifies that someone is assuming an IAM role without clear identification. A role assumption is a key security control, and an unknown user exploiting it could indicate unauthorized access. \n\n**Recommendations:**\n\n1.  **Investigate Hemanth’s Activity:** Immediately review Hemanth's recent activity logs (CloudTrail, S3 access) to understand the scope and purpose of these `ListStacks` calls.  Determine if this is part of a legitimate deployment process, or if it's indicative of reconnaissance or malicious activity.\n2.  **Investigate `AssumeRole` Event:** Determine the IAM role that was assumed by the \"Unknown\" user.  Audit the role's permissions.  If the role has overly permissive access, immediately restrict those permissions.  Analyze the timing of the role assumption to see if it aligns with Hemanth's activity.\n3.  **S3 Bucket Review:** Examine the newly created S3 buckets. Assess their purpose and ensure they align with expected business needs. The `cdk-hnb659fds-assets-831009602174-us-east-1` bucket, linked to CDK suggests infrastructure deployments, ensure it's part of managed processes. Monitor the bucket for any unexpected data uploads or downloads.\n4.  **CloudTrail Deeper Dive:** Examine additional CloudTrail events around the same timeframe for any related activity – API calls to other services, changes to IAM policies, etc.\n5.  **User Context:** Confirm the identity of \"Hemanth\". Are they a legitimate employee with appropriate access?"
};

export default function Dashboard() {
  const [data, setData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Helper to parse AI analysis if it's JSON-like string
  const parseAIAnalysis = (analysis: string) => {
    try {
      if (analysis.includes("'choices':") && analysis.includes("'content':")) {
        // Attempt to extract the content part directly as it's not standard JSON (Python dict style)
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
      // In a real scenario, this would use fetchMonitoringData().
      // For the demo preview, we allow fallback to mock data if API is not set.
      if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== 'https://api.example.com/v1') {
        const result = await fetchMonitoringData();
        setData(result);
        setError(null);
      } else {
        // Simulating network delay for demo
        await new Promise(resolve => setTimeout(resolve, 1500));
        setData(MOCK_DATA);
        setError(null);
      }
    } catch (err) {
      // If the real API fails, we log it and show mock data
      console.warn("API Fetch failed, falling back to demo mode", err);
      setData(MOCK_DATA);
      setError("Note: Using offline demo data. API connection inhibited.");
      // Clear the error after a few seconds so it doesn't clutter the UI indefinitely
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="flex h-screen overflow-hidden bg-brand-bg text-white">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar />
        
        <div className="flex-1 p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-r from-[#1E293B] to-[#0F172A] rounded-2xl p-8 border border-white/10 shadow-2xl group">
            <div className="relative z-10 space-y-2">
              <p className="text-orange-400 text-sm font-bold uppercase tracking-[0.2em] mb-1">Operational Overview</p>
              <h2 className="text-3xl font-bold text-white tracking-tight">Human-Governed AI Operations</h2>
              <p className="text-slate-400 max-w-xl font-medium leading-relaxed">
                Real-time analysis of AWS Cloud assets using autonomous MCP agents with direct human oversight and governance protocols.
              </p>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
              <svg fill="currentColor" viewBox="0 0 100 100" className="w-full h-full text-slate-400"><circle cx="50" cy="50" r="40"/></svg>
            </div>
          </section>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between text-amber-400">
                  <div className="flex items-center gap-3">
                    <AlertCircle size={18} />
                    <p className="text-xs font-bold uppercase tracking-wider">{error}</p>
                  </div>
                  <button onClick={() => setError(null)} className="text-[10px] uppercase font-black tracking-widest hover:text-white">Dismiss</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? <LoadingSkeleton /> : (
            <div className="grid grid-cols-12 gap-6">
              {/* Left Column: AI and Architecture */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                <AIAnalysis 
                  analysis={parseAIAnalysis(data?.ai_analysis || "Processing AI stream...")} 
                  bucketCount={data?.monitoring_data.s3_buckets.length || 0}
                  metricCount={data?.monitoring_data.cloudwatch_metrics.metric_count || 0}
                />
                
                <section className="space-y-6">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Zap size={14} className="text-brand-aws" />
                        Recent CloudTrail Events
                      </h3>
                      <span className="text-[10px] text-slate-500 font-mono italic">Real-time Feed</span>
                    </div>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-none font-mono">
                      {data?.monitoring_data.cloudtrail_events.map((event, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-900/50 border border-white/5 hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-blue-400 font-bold w-24 truncate">{event.event}</span>
                            <span className="text-[10px] text-slate-500">by</span>
                            <span className="text-[10px] text-slate-300 font-bold">{event.user}</span>
                          </div>
                          <span className="text-[10px] text-slate-600">{new Date(event.time).toLocaleTimeString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-center">Pipeline Flow</h3>
                    <ArchitectureBanner />
                  </div>
                </section>
              </div>

              {/* Right Column: Bucket List */}
              <div className="col-span-12 lg:col-span-4 space-y-4">
                <div className="flex items-center justify-between mb-2">
                   <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Active Storage Resources</h2>
                   <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-500">{data?.monitoring_data.s3_buckets.length}</span>
                </div>
                <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 scrollbar-none">
                  {data?.monitoring_data.s3_buckets.map((bucket, i) => (
                    <S3BucketCard key={bucket.name} bucket={bucket} index={i} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Status Bar */}
        <footer className="h-10 bg-[#07080C] border-t border-white/5 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></span>
              API Status: <span className="text-slate-300">Connected to monitoring-api.mcp.aws</span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              Network Latency: <span className="text-emerald-500 font-bold tracking-tighter">12ms</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-600 italic font-mono tracking-tighter">
            Last Telemetry Sync: {data?.monitoring_data.timestamp ? new Date(data.monitoring_data.timestamp).toLocaleString() : 'N/A'}
          </div>
        </footer>
      </main>
    </div>
  );
}
