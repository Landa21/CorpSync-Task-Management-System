import { User, Mail, Shield, Building2, LogOut, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';

export const Profile = () => {
    const { user, logout } = useAuth();
    const { departments, getFilteredTasks } = useTasks();

    if (!user) return null;

    const department = departments.find(d => d.id === user.departmentId);
    const tasks = getFilteredTasks();
    const activeTasks = tasks.filter(t => t.status !== 'DONE').length;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight uppercase underline decoration-indigo-500/30 underline-offset-8">Account Profile</h1>
                    <p className="text-slate-400 mt-4 font-medium">Manage your personal information and preferences.</p>
                </div>
                <button
                    onClick={logout}
                    className="px-6 py-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-all flex items-center gap-2 font-bold shadow-lg shadow-rose-500/20 active:scale-95"
                >
                    <LogOut size={20} />
                    Logout Session
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-6">
                    <div className="glass-card p-8 flex flex-col items-center text-center">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-indigo-500 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                            <img
                                src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                                alt={user.name}
                                className="w-32 h-32 rounded-full border-4 border-slate-800 relative z-10"
                            />
                        </div>
                        <h2 className="text-2xl font-bold text-white mt-6 uppercase tracking-tight">{user.name}</h2>
                        <p className="text-indigo-400 font-mono text-sm mt-1 uppercase tracking-widest">{user.role.replace('_', ' ')}</p>

                        <div className="w-full pt-8 mt-8 border-t border-slate-800 flex justify-around">
                            <div>
                                <p className="text-2xl font-bold text-white tracking-tighter">{activeTasks}</p>
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Active Tasks</p>
                            </div>
                            <div className="border-l border-slate-800"></div>
                            <div>
                                <p className="text-2xl font-bold text-white tracking-tighter">98%</p>
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Efficiency</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <div className="glass-card p-8 space-y-8">
                        <h3 className="text-xl font-bold text-white uppercase tracking-tighter flex items-center gap-2">
                            <User size={20} className="text-indigo-500" />
                            General Information
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Full Corporate Name</p>
                                <p className="text-white font-medium flex items-center gap-2">
                                    {user.name}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Access Role</p>
                                <p className="text-white font-medium capitalize">
                                    {user.role.toLowerCase().replace('_', ' ')}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Registered Email</p>
                                <p className="text-white font-medium flex items-center gap-2">
                                    <Mail size={16} className="text-slate-500" />
                                    {user.email}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Department Unit</p>
                                <p className="text-white font-medium flex items-center gap-2">
                                    <Building2 size={16} className="text-slate-500" />
                                    {department?.name || 'Central Administration'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">System Location</p>
                                <p className="text-white font-medium flex items-center gap-2">
                                    <MapPin size={16} className="text-slate-500" />
                                    Remote Office
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Joined Date</p>
                                <p className="text-white font-medium flex items-center gap-2">
                                    <Calendar size={16} className="text-slate-500" />
                                    Jan 20, 2026
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 bg-indigo-500/5 border-indigo-500/20">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-500 rounded-xl text-white shadow-lg shadow-indigo-500/40">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold uppercase tracking-tight text-lg">Security & Authorization</h4>
                                <p className="text-slate-400 text-sm">Your security clearance is verified. Multi-factor authentication is active.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
