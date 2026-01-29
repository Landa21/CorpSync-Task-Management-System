import { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { TaskPriority, Task } from '../../types';
import { TaskActivityModal } from '../../components/Tasks/TaskActivityModal';
import { Users, Rocket, ShieldCheck, ExternalLink, Plus, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

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

export const AdminManagerDashboard = () => {
    const { user } = useAuth();
    const { getFilteredTasks, departments, users, addTask, updateTaskStatus } = useTasks();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM' as TaskPriority,
        assignedTo: '',
        deadline: new Date().toISOString().split('T')[0],
    });
    const [rejectionTask, setRejectionTask] = useState<Task | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const tasks = getFilteredTasks();
    const department = departments.find(d => d.id === user?.departmentId);
    const teamMembers = users.filter(u => u.departmentId === user?.departmentId);
    const pendingTasks = tasks.filter(t => t.status === 'REVIEW');
    const activeTasks = tasks.filter(t => t.status === 'IN_PROGRESS');

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        addTask({
            ...newTask,
            status: 'TODO',
            createdBy: user!.id,
            departmentId: user!.departmentId!
        });
        setIsModalOpen(false);
        setNewTask({
            title: '',
            description: '',
            priority: 'MEDIUM',
            assignedTo: '',
            deadline: new Date().toISOString().split('T')[0],
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">{department?.name} Operations</h1>
                    <p className="text-slate-400 mt-2 font-medium tracking-tight italic">Strategic Resource Allocation & Pipeline Management.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-2 text-xs uppercase tracking-widest"
                >
                    <Plus size={18} />
                    Deploy Task
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatMini
                    title="Active Pool"
                    value={activeTasks.length}
                    icon={Play}
                    color="text-indigo-400"
                    trend="RUNNING"
                    linkTo="/tasks"
                />
                <StatMini
                    title="Human Capital"
                    value={teamMembers.length}
                    icon={Users}
                    color="text-emerald-400"
                    trend="ASSIGNED"
                    linkTo="/admin-manager/team"
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
                <div className="lg:col-span-1 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter">Verification Queue</h2>
                        <span className="px-2 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black rounded tracking-widest animate-pulse">
                            AWAITING ACTION
                        </span>
                    </div>
                    <div className="space-y-4">
                        {pendingTasks.length > 0 ? pendingTasks.map(task => (
                            <div key={task.id} className="glass-card p-5 space-y-4 border-amber-500/20 bg-amber-500/5 group hover:border-amber-500/40 transition-all">
                                <h4 className="text-white font-bold text-sm uppercase tracking-tight">{task.title}</h4>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Awaiting Verification</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setRejectionTask(task)}
                                            className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-400"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => updateTaskStatus(task.id, 'DONE')}
                                            className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300"
                                        >
                                            Approve
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="glass-card p-10 text-center opacity-40 italic text-slate-500 text-sm">
                                Pipeline Clear.
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">Resource Registry</h2>
                    <div className="glass-card overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50 border-b border-slate-800">
                                <tr className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                    <th className="px-6 py-4">Resource</th>
                                    <th className="px-6 py-4">Current Objective</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Velocity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {teamMembers.map(member => {
                                    const memberTask = tasks.find(t => t.assignedTo === member.id && t.status === 'IN_PROGRESS');
                                    return (
                                        <tr key={member.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <img src={member.avatar} alt="" className="w-8 h-8 rounded-lg bg-slate-800" />
                                                <span className="text-white font-bold text-sm tracking-tight">{member.name}</span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-400 text-sm italic">
                                                {memberTask?.title || 'Inactive'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-black tracking-widest uppercase ${memberTask ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-600'
                                                    }`}>
                                                    {memberTask ? 'Active' : 'Standby'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 w-3/4 rounded-full"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Deployment Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="glass-card max-w-2xl w-full p-10 space-y-8 animate-in zoom-in duration-300">
                        <div className="space-y-2 text-center">
                            <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Authorize Deployment</h2>
                            <p className="text-slate-400 font-medium">Initialize new task parameters for the {department?.name} pipeline.</p>
                        </div>

                        <form onSubmit={handleAddTask} className="grid grid-cols-2 gap-8">
                            <div className="col-span-2">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Operational Identifier</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium"
                                    placeholder="Task Title"
                                    value={newTask.title}
                                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Scope & Documentation</label>
                                <textarea
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 h-32 resize-none font-medium text-sm"
                                    placeholder="Technical description..."
                                    value={newTask.description}
                                    onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Resource Allocation</label>
                                <select
                                    required
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                                    value={newTask.assignedTo}
                                    onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}
                                >
                                    <option value="">Select Resource</option>
                                    {teamMembers.map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Priority Tier</label>
                                <select
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                                    value={newTask.priority}
                                    onChange={e => setNewTask({ ...newTask, priority: e.target.value as any })}
                                >
                                    <option value="LOW">Low Velocity</option>
                                    <option value="MEDIUM">Standard</option>
                                    <option value="HIGH">High Priority</option>
                                    <option value="CRITICAL">Critical Path</option>
                                </select>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Target Finalization Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                                    value={newTask.deadline}
                                    onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
                                />
                            </div>

                            <div className="col-span-2 flex gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-bold uppercase tracking-widest text-xs border border-slate-800"
                                >
                                    Abort
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all font-bold uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20"
                                >
                                    Authorize Deployment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Rejection Feedback Modal */}
            {rejectionTask && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70] flex items-center justify-center p-4">
                    <div className="glass-card max-w-lg w-full p-10 space-y-8 animate-in zoom-in duration-300">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Strategic Feedback</h2>
                            <p className="text-slate-400 font-medium">Provide a clear rejection rationale for <strong>{rejectionTask.title}</strong>.</p>
                        </div>

                        <div className="space-y-4">
                            <textarea
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 h-32 resize-none font-medium text-sm"
                                placeholder="e.g. Code quality needs improvement, context missing..."
                                value={rejectionReason}
                                onChange={e => setRejectionReason(e.target.value)}
                            />
                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        setRejectionTask(null);
                                        setRejectionReason('');
                                    }}
                                    className="flex-1 px-4 py-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-bold uppercase tracking-widest text-xs border border-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        updateTaskStatus(rejectionTask.id, 'IN_PROGRESS', rejectionReason);
                                        setRejectionTask(null);
                                        setRejectionReason('');
                                    }}
                                    className="flex-1 px-4 py-4 bg-rose-600 text-white rounded-xl hover:bg-rose-500 transition-all font-bold uppercase tracking-widest text-xs shadow-xl shadow-rose-600/20"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedTask && (
                <TaskActivityModal
                    task={tasks.find(t => t.id === selectedTask.id) || selectedTask}
                    onClose={() => setSelectedTask(null)}
                />
            )}
        </div>
    );
};
