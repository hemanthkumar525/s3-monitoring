import React, { useState } from 'react';
import { X, ShieldAlert, Loader2, Globe, Key, Lock, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { S3BucketCreate } from '../types';
import { createBucket } from '../services/api';

interface CreateBucketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateBucketModal = ({ isOpen, onClose, onSuccess }: CreateBucketModalProps) => {
  const [formData, setFormData] = useState<S3BucketCreate>({
    bucket_name: '',
    region: 'us-east-1',
    access_key: '',
    secret_key: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createBucket(formData);
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        bucket_name: '',
        region: 'us-east-1',
        access_key: '',
        secret_key: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to create bucket. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg bg-[#0A0B10] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-3 text-white">
                <div className="p-2 bg-orange-600/20 rounded-lg text-orange-500">
                  <Database size={20} />
                </div>
                <h2 className="text-xl font-bold">Provision New S3 Bucket</h2>
              </div>
              <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3 text-amber-500">
                <ShieldAlert size={24} className="shrink-0" />
                <p className="text-xs font-medium leading-relaxed">
                  <span className="font-bold underline">Security Governance Warning:</span> Credentials are used only for human-authorized execution and are never stored. CloudTrail will audit this action.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-500 text-xs font-bold uppercase tracking-wider">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-1">Bucket Name</label>
                  <div className="relative">
                    <Database className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                      required
                      type="text"
                      placeholder="e.g. mcp-provisioned-assets"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all font-mono"
                      value={formData.bucket_name}
                      onChange={(e) => setFormData({ ...formData, bucket_name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-1">AWS Region</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all appearance-none"
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    >
                      <option value="us-east-1">us-east-1 (N. Virginia)</option>
                      <option value="us-east-2">us-east-2 (Ohio)</option>
                      <option value="us-west-1">us-west-1 (N. California)</option>
                      <option value="eu-west-1">eu-west-1 (Ireland)</option>
                      <option value="ap-southeast-2">ap-southeast-2 (Sydney)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-1">Access Key</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input
                        required
                        type="password"
                        placeholder="AKIA..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all font-mono uppercase"
                        value={formData.access_key}
                        onChange={(e) => setFormData({ ...formData, access_key: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-1">Secret Key</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input
                        required
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all font-mono"
                        value={formData.secret_key}
                        onChange={(e) => setFormData({ ...formData, secret_key: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-slate-400 hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  type="submit"
                  className="flex-[2] px-4 py-2.5 bg-orange-600 border border-orange-500 shadow-lg shadow-orange-600/20 rounded-xl text-sm font-bold text-white hover:bg-orange-500 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <Database size={18} />
                      Authorize Execution
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
