import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import {
    ArrowLeft,
    Mail,
    Shield,
    Calendar,
    Clock,
    CheckCircle2,
    Activity,
    ExternalLink,
    Trash2,
    AlertOctagon,
    Github
} from 'lucide-react';

export const UserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { users, departments, tasks, deleteUser } = useTasks();
    const { user: currentUser } = useAuth();

    const user = users.find(u => u.id === id);
    const department = departments.find(d => d.id === user?.departmentId);
    const userTasks = tasks.filter(t => t.assignedTo === id);

    const completedTasks = userTasks.filter(t => t.status === 'DONE').length;
    const pendingTasks = userTasks.filter(t => t.status !== 'DONE').length;
    const completionRate = userTasks.length > 0
        ? Math.round((completedTasks / userTasks.length) * 100)
        : 0;

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <p className="text-slate-500 font-medium">Resource not found.</p>
                <button onClick={() => navigate(-1)} className="btn-primary">Go Back</button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Resource Intelligence</h1>
                    <p className="text-slate-400 mt-1 font-medium tracking-tight">Viewing granular metrics for {user.name}.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Basic Info & Profile */}
                <div className="space-y-6">
                    <div className="glass-card p-8 text-center space-y-6">
                        <div className="relative inline-block">
                            <img
                                src={user.avatar}
                                alt=""
                                className="w-32 h-32 rounded-3xl bg-slate-800 border-4 border-slate-800 mx-auto"
                            />
                            <div className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 rounded-xl border-4 border-slate-950">
                                <Shield size={16} className="text-white" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight">{user.name}</h2>
                            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mt-1">
                                <Mail size={14} />
                                <span>{user.email}</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black rounded uppercase tracking-widest border border-indigo-500/20">
                                {user.role.replace('_', ' ')}
                            </span>
                            <span className="px-3 py-1 bg-slate-800 text-slate-400 text-[10px] font-black rounded uppercase tracking-widest border border-slate-700">
                                {department?.name || 'Global'}
                            </span>
                        </div>
                    </div>

                    {user.github && (
                        <div className="glass-card p-6 space-y-4">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Github size={14} />
                                Development Identity
                            </h3>
                            <a
                                href={`https://github.com/${user.github}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition-all group"
                            >
                                <span className="text-sm font-medium text-slate-300">@{user.github}</span>
                                <ExternalLink size={14} className="text-slate-500 group-hover:text-indigo-400" />
                            </a>
                        </div>
                    )}

                    <div className="glass-card p-6 space-y-4">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Metadata</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 flex items-center gap-2 italic">
                                    <Clock size={14} />
                                    Security Status
                                </span>
                                <span className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">VERIFIED</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 flex items-center gap-2 italic">
                                    <Calendar size={14} />
                                    Access Granted
                                </span>
                                <span className="text-slate-300 font-medium">Jan 29, 2026</span>
                            </div>
                        </div>
                    </div>

                    {currentUser?.id !== user.id && (
                        <div className="glass-card p-6 border-rose-500/20 bg-rose-500/5 space-y-4">
                            <h3 className="text-xs font-black text-rose-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <AlertOctagon size={14} />
                                Danger Zone
                            </h3>
                            <p className="text-xs text-slate-500 italic leading-relaxed">
                                Terminating access will permanently remove this resource from the corporate registry.
                            </p>
                            <button
                                onClick={() => {
                                    if (window.confirm(`CRITICAL: Are you sure you want to terminate access for ${user.name}? This will remove them from all departments.`)) {
                                        deleteUser(user.id);
                                        navigate('/super_admin/users');
                                    }
                                }}
                                className="w-full py-3 bg-rose-600/10 text-rose-500 border border-rose-500/20 rounded-xl hover:bg-rose-600 hover:text-white transition-all font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                            >
                                <Trash2 size={14} />
                                Terminate Access
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Column: Key Metrics & Task History */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-card p-6 flex flex-col gap-2">
                            <Activity size={24} className="text-indigo-400 mb-2" />
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Velocity</p>
                            <h4 className="text-3xl font-black text-white tracking-tighter">{completionRate}%</h4>
                        </div>
                        <div className="glass-card p-6 flex flex-col gap-2">
                            <CheckCircle2 size={24} className="text-emerald-400 mb-2" />
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Finalized</p>
                            <h4 className="text-3xl font-black text-white tracking-tighter">{completedTasks}</h4>
                        </div>
                        <div className="glass-card p-6 flex flex-col gap-2">
                            <Clock size={24} className="text-amber-400 mb-2" />
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">In Pipeline</p>
                            <h4 className="text-3xl font-black text-white tracking-tighter">{pendingTasks}</h4>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Assigned Operations</h2>
                            <Link to="/tasks" className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                                Full Registry <ExternalLink size={10} />
                            </Link>
                        </div>
                        <div className="glass-card overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-900/50 border-b border-slate-800">
                                    <tr className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                        <th className="px-6 py-4">Task Identifier</th>
                                        <th className="px-6 py-4">Priority</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Deadline</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/40">
                                    {userTasks.length > 0 ? userTasks.map(task => (
                                        <tr key={task.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-white tracking-tight">{task.title}</p>
                                                <p className="text-[10px] text-slate-500 truncate max-w-xs">{task.description}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${task.priority === 'CRITICAL' ? 'text-rose-500' :
                                                    task.priority === 'HIGH' ? 'text-amber-500' :
                                                        'text-indigo-400'
                                                    }`}>
                                                    {task.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-black tracking-widest uppercase ${task.status === 'DONE' ? 'bg-emerald-500/10 text-emerald-400' :
                                                    task.status === 'REVIEW' ? 'bg-amber-500/10 text-amber-500 animate-pulse' :
                                                        'bg-indigo-500/10 text-indigo-400'
                                                    }`}>
                                                    {task.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-xs text-slate-400 font-mono tracking-tighter">
                                                    {new Date(task.deadline).toLocaleDateString()}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic text-sm">
                                                No operations active for this resource.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
