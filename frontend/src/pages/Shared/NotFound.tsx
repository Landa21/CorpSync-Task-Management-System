import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden text-center">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] scale-[4] rotate-12 pointer-events-none">
                <ShieldAlert size={300} className="text-indigo-500" />
            </div>

            <div className="glass-card p-12 max-w-lg w-full space-y-8 relative z-10 border-slate-700/50 shadow-2xl">
                <div className="inline-flex p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-500 animate-pulse">
                    <ShieldAlert size={64} className="stroke-[1.5px]" />
                </div>

                <div className="space-y-4">
                    <h1 className="text-7xl font-black text-white tracking-tighter uppercase leading-none">404</h1>
                    <h2 className="text-2xl font-bold text-slate-300 uppercase tracking-tight">Security Breach: Path Invalid</h2>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        The requested organizational path does not exist within the CorpSync registry.
                        Your access metadata has been logged.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-xl border border-slate-800 transition-all active:scale-95 text-xs uppercase tracking-widest"
                    >
                        <ArrowLeft size={16} />
                        Recursive Back
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-indigo-600/20 transition-all active:scale-95 text-xs uppercase tracking-widest"
                    >
                        <Home size={16} />
                        Central Hub
                    </button>
                </div>

                <div className="pt-8 border-t border-slate-800">
                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest font-mono italic">
                        PROTOCOL_ERROR: RESOURCE_NOT_FOUND
                    </p>
                </div>
            </div>
        </div>
    );
};
