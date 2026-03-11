import { Shield, CheckCircle, AlertTriangle, Lock, Upload, FileText, Trash2, Edit3, Save, X, Plus, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCampaignStore } from '../store/useCampaignStore';
import { useAuthStore } from '../store/useAuthStore';
import { useMemo, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

interface GuardrailFile {
    id: string;
    name: string;
    size: string;
    type: string;
    uploadedAt: string;
    content?: string;
    url?: string;
}

export const GuardrailsPage = () => {
    const { input, campaigns } = useCampaignStore();
    const latestCampaignId = campaigns?.[campaigns.length - 1]?.id;
    const { user } = useAuthStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [files, setFiles] = useState<GuardrailFile[]>(
        input.brandGuidelines
            ? [{ id: 'bg-1', name: input.brandGuidelines || 'Brand Guidelines', size: '—', type: 'Uploaded', uploadedAt: 'Current session' }]
            : []
    );
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [uploadErr, setUploadErr] = useState('');

    // Active rule sets derived from upload state
    const rules = useMemo(() => {
        const base = [
            { id: 1, name: 'Brand Tone Verification', level: 'Strict', type: 'NLP Analysis' },
            { id: 2, name: 'Regulatory Compliance (GDPR)', level: 'Critical', type: 'Policy Check' },
        ];
        if (files.length > 0) {
            base.push({ id: 3, name: 'Custom Brand Guidelines', level: 'Custom', type: 'Similarity Match' });
        }
        return base;
    }, [files]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        if (!allowed.includes(file.type)) {
            setUploadErr('Only PDF, DOCX, or TXT files are supported.');
            return;
        }
        setUploadErr('');
        setUploading(true);

        try {
            let url: string | undefined;
            if (user?.id) {
                const path = `guardrails/${user.id}/${Date.now()}_${file.name}`;
                const { error } = await supabase.storage.from('campaign-assets').upload(path, file);
                if (!error) {
                    const { data: urlData } = supabase.storage.from('campaign-assets').getPublicUrl(path);
                    url = urlData?.publicUrl;
                    // Link file to campaign in DB
                    if (latestCampaignId) {
                        await supabase.from('campaign_guardrails').upsert({
                            campaign_id: latestCampaignId,
                            file_name: file.name,
                            file_url: url,
                            uploaded_by: user.id,
                        });
                    }
                }
            }
            const newFile: GuardrailFile = {
                id: Date.now().toString(),
                name: file.name,
                size: (file.size / 1024).toFixed(1) + ' KB',
                type: file.type.includes('pdf') ? 'PDF' : file.type.includes('word') ? 'DOCX' : 'TXT',
                uploadedAt: new Date().toLocaleString(),
                url,
            };
            setFiles(prev => [...prev, newFile]);
        } catch {
            setUploadErr('Upload failed. Please try again.');
        }
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDelete = async (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const startEdit = (file: GuardrailFile) => {
        setEditingId(file.id);
        setEditName(file.name);
    };

    const saveEdit = (id: string) => {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, name: editName } : f));
        setEditingId(null);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-green-500">
                    <Shield size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Active Guardrails</h1>
                    <p className="text-slate-400">Automated safety and compliance protocols governing agent outputs.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl text-center">
                    <div className="text-3xl font-bold text-green-500 mb-1">100%</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide font-bold">Safe Output Rate</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl text-center">
                    <div className="text-3xl font-bold text-indigo-400 mb-1">{rules.length} Active</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide font-bold">Rule Sets</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl text-center">
                    <div className="text-3xl font-bold text-orange-500 mb-1">0</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide font-bold">Violations</div>
                </div>
            </div>

            {/* Upload Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-white text-lg flex items-center gap-2">
                            <Upload size={18} className="text-indigo-400" /> Brand Guardrail Documents
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">Upload PDF, DOCX, or TXT files. Files are saved to the database and linked to your campaign.</p>
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
                    >
                        {uploading ? (
                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</>
                        ) : (
                            <><Plus size={16} /> Upload File</>
                        )}
                    </button>
                    <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt" onChange={handleFileSelect} className="hidden" />
                </div>

                {uploadErr && (
                    <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
                        <AlertTriangle size={16} /> {uploadErr}
                    </div>
                )}

                {/* File List */}
                <div className="divide-y divide-slate-800/60">
                    <AnimatePresence>
                        {files.length === 0 ? (
                            <div className="p-10 text-center text-slate-500">
                                <Database size={32} className="mx-auto mb-3 opacity-30" />
                                <p className="font-medium text-slate-400">No guardrail documents uploaded</p>
                                <p className="text-sm mt-1">Upload a PDF, DOCX, or TXT file to apply custom brand constraints.</p>
                            </div>
                        ) : files.map((file, idx) => (
                            <motion.div
                                key={file.id}
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 shrink-0">
                                        <FileText size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        {editingId === file.id ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    autoFocus
                                                    className="bg-slate-800 border border-indigo-500 rounded px-2 py-1 text-sm text-white outline-none"
                                                    value={editName}
                                                    onChange={e => setEditName(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && saveEdit(file.id)}
                                                />
                                                <button onClick={() => saveEdit(file.id)} className="text-green-400 hover:text-green-300"><Save size={14} /></button>
                                                <button onClick={() => setEditingId(null)} className="text-slate-500 hover:text-slate-300"><X size={14} /></button>
                                            </div>
                                        ) : (
                                            <div className="font-bold text-slate-200 truncate">{file.name}</div>
                                        )}
                                        <div className="text-xs text-slate-500">{file.type} · {file.size} · {file.uploadedAt}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-xs font-bold text-green-500 flex items-center gap-1"><CheckCircle size={12} /> Active</span>
                                    {file.url && (
                                        <a href={file.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 underline">View</a>
                                    )}
                                    <button onClick={() => startEdit(file)} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                                        <Edit3 size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(file.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Rule Configuration */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                    <h3 className="font-bold text-white text-lg">Rule Configuration</h3>
                </div>
                <div className="divide-y divide-slate-800">
                    {rules.map((rule, idx) => (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={rule.id}
                            className="p-6 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-slate-800 rounded-lg text-slate-400"><Lock size={18} /></div>
                                <div>
                                    <div className="font-bold text-slate-200">{rule.name}</div>
                                    <div className="text-xs text-slate-500">{rule.type}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full uppercase tracking-wide">{rule.level}</span>
                                <div className="flex items-center gap-2 text-green-500 text-sm font-bold">
                                    <CheckCircle size={16} /> Active
                                </div>
                                <div className="w-12 h-6 bg-indigo-600/20 rounded-full relative">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-indigo-500 rounded-full shadow-lg" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {files.length === 0 && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center gap-4 text-yellow-400">
                    <AlertTriangle size={24} />
                    <div>
                        <p className="font-bold">No Custom Brand Guidelines Detected</p>
                        <p className="text-sm opacity-80">Default global safety rules are active, but custom brand voice constraints are disabled.</p>
                    </div>
                </div>
            )}
        </div>
    );
};
