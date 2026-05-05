import { Link } from 'react-router-dom';
import { useTasks } from '../../context/TaskContext';
import { Users, Building2, Rocket, ShieldCheck, ExternalLink } from 'lucide-react';

const StatMini = ({ title, value, icon: Icon, color, trend, linkTo }: { title: string, value: string | number, icon: any, color: string, trend?: string, linkTo?: string }) => {
    const CardContent = (
        <div className="glass-card p-6 flex flex-col gap-3 group hover:border-indigo-500/30 transition-all cursor-pointer h-full">
            <div className="flex justify-between items-start">
                <div className={`p-3 rounded-xl bg-slate-900 border border-slate-800 ${color} group-hover:scale-110 transition-transform`}>
                    <Icon size={20} />
                </div>
                {trend && (
                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded tracking-widest">
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{title}</p>
                <div className="flex items-end justify-between">
                    <h3 className="text-3xl font-black text-white tracking-tighter">{value}</h3>
                    {linkTo && <ExternalLink size={14} className="text-slate-600 group-hover:text-indigo-400 transition-colors mb-1" />}
                </div>
            </div>
        </div>
    );

    return linkTo ? <Link to={linkTo}>{CardContent}</Link> : CardContent;
};

export const SuperAdminDashboard = () => {
    const { users, departments, tasks } = useTasks();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Command Center</h1>
                    <p className="text-slate-400 mt-2 font-medium tracking-tight">Global Administrative Oversight & Infrastructure.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatMini
                    title="Active Entities"
                    value={departments.length}
                    icon={Building2}
                    color="text-indigo-400"
                    trend="+2 NEW"
                    linkTo="/super-admin/departments"
                />
                <StatMini
                    title="Global Workforce"
                    value={users.length}
                    icon={Users}
                    color="text-emerald-400"
                    trend="ACTIVE"
                    linkTo="/super-admin/users"
                />
                <StatMini
                    title="Operational Flux"
                    value={tasks.length}
                    icon={Rocket}
                    color="text-amber-400"
                    linkTo="/tasks"
                />
                <StatMini
                    title="System Integrity"
                    value="99.9%"
                    icon={ShieldCheck}
                    color="text-rose-400"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter">Velocity Performance</h2>
                    </div>

                    <div className="glass-card p-8 h-[300px] flex items-end justify-between gap-4">
                        {[40, 70, 45, 90, 65, 85, 95].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                                <div
                                    className="w-full bg-gradient-to-t from-indigo-600/50 to-indigo-400 rounded-lg group-hover:to-indigo-300 transition-all duration-500 shadow-lg shadow-indigo-500/10"
                                    style={{ height: `${h}%` }}
                                ></div>
                                <span className="text-[10px] font-black text-slate-600 uppercase">Q{i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">Top Organizations</h2>
                    <div className="space-y-4">
                        {departments.slice(0, 3).map(dept => {
                            const deptTasks = tasks.filter(t => t.departmentId === dept.id);
                            const completion = Math.round((deptTasks.filter(t => t.status === 'DONE').length / (deptTasks.length || 1)) * 100);

                            return (
                                <div key={dept.id} className="glass-card p-5 space-y-4 group hover:border-indigo-500/30 transition-all">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-bold text-white uppercase tracking-tight">{dept.name}</h4>
                                        <span className="text-[10px] font-black text-indigo-400">{completion}%</span>
                                    </div>
                                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${completion}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                        <span>Capacity: {deptTasks.length} Ops</span>
                                        <Link to="/super-admin/departments" className="text-indigo-400 hover:text-white transition-colors">
                                            Manage
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
