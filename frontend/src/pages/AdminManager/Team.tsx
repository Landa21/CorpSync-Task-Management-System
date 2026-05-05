import { Mail, ArrowRight } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';

export const Team = () => {
    const { user } = useAuth();
    const { users, departments, tasks } = useTasks();

    const department = departments.find(d => d.id === user?.departmentId);
    const teamMembers = users.filter(u => u.departmentId === user?.departmentId);

    return (
        <div className="space-y-8 animate-in slide-in-from-right duration-700">
            <div>
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Team Registry</h1>
                <p className="text-slate-400 mt-2 font-medium tracking-tight">Managing resources for the {department?.name} unit.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member) => {
                    const activeTasks = tasks.filter(t => t.assignedTo === member.id && t.status !== 'DONE').length;

                    return (
                        <div key={member.id} className="glass-card p-6 space-y-6 group hover:border-indigo-500/50 transition-all">
                            <div className="flex justify-between items-start">
                                <img
                                    src={member.avatar}
                                    alt=""
                                    className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-slate-800 group-hover:border-indigo-500/30 transition-all"
                                />
                                <div className="text-right">
                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${member.role === 'ADMIN_MANAGER' ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-400'
                                        }`}>
                                        {member.role.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-white uppercase tracking-tight">{member.name}</h3>
                                <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                                    <Mail size={14} />
                                    <span>{member.email}</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-800 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Active Pool</p>
                                    <p className="text-xl font-bold text-white">{activeTasks}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Status</p>
                                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold uppercase tracking-widest">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Available
                                    </span>
                                </div>
                            </div>

                            <button className="w-full py-3 bg-slate-900 text-slate-400 rounded-xl hover:bg-slate-800 hover:text-white transition-all border border-slate-800 font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                                Resource Profile
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
