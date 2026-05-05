import { Clock, Play, CheckCircle, ArrowRight, ShieldCheck, Zap, AlertTriangle, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { Task } from '../../types';
import { TaskActivityModal } from '../../components/Tasks/TaskActivityModal';

export const EmployeeDashboard = () => {
    const { user } = useAuth();
    const { getFilteredTasks, updateTaskStatus } = useTasks();
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const tasks = getFilteredTasks();

    const activeTask = tasks.find(t => t.status === 'IN_PROGRESS');
    const todoTasks = tasks.filter(t => t.status === 'TODO');
    const reviewTasks = tasks.filter(t => t.status === 'REVIEW');
    const doneTasks = tasks.filter(t => t.status === 'DONE');

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'CRITICAL': return 'bg-rose-500/20 text-rose-500 border border-rose-500/30';
            case 'HIGH': return 'bg-amber-500/20 text-amber-500 border border-amber-500/30';
            default: return 'bg-slate-800 text-slate-400 border border-slate-700';
        }
    };

    return (
        <div className="space-y-10 animate-in zoom-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Employee Workspace v2.0</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Welcome, {user?.name.split(' ')[0]}</h1>
                    <p className="text-slate-400 mt-2 font-medium">Synchronizing {tasks.filter(t => t.status !== 'DONE').length} active objectives.</p>
                </div>

                <div className="flex items-center gap-6 px-8 py-4 glass-card bg-indigo-500/5 border-indigo-500/20">
                    <div className="text-center">
                        <p className="text-2xl font-black text-white tracking-tighter">{doneTasks.length}</p>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Finalized</p>
                    </div>
                    <div className="h-8 w-px bg-slate-800"></div>
                    <div className="text-center">
                        <p className="text-2xl font-black text-white tracking-tighter">{Math.round((doneTasks.length / (tasks.length || 1)) * 100)}%</p>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Efficiency</p>
                    </div>
                </div>
            </div>

            {/* Active Task Focus */}
            {activeTask ? (
                <div className="glass-card overflow-hidden border-indigo-500/40 relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Zap size={120} className="text-indigo-400" />
                    </div>
                    <div className="p-10 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-md animate-pulse shadow-lg shadow-indigo-600/30">Active Focus</span>
                                <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${getPriorityColor(activeTask.priority)}`}>
                                    {activeTask.priority} Priority
                                </span>
                            </div>
                            <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">{activeTask.title}</h2>
                            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-2xl">{activeTask.description}</p>

                            {activeTask.rejectionReason && (
                                <div className="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl max-w-2xl">
                                    <AlertTriangle className="text-rose-500 shrink-0" size={18} />
                                    <div>
                                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-none mb-1">Feedback from Manager</p>
                                        <p className="text-sm text-slate-300 italic">"{activeTask.rejectionReason}"</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-6 text-xs font-bold text-slate-500">
                                <div className="flex items-center gap-1.5">
                                    <Clock size={16} className="text-indigo-400" />
                                    <span>Target Finalization: {activeTask.deadline}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => updateTaskStatus(activeTask.id, 'REVIEW')}
                            className="bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-6 rounded-2xl flex flex-col items-center gap-2 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 group/btn"
                        >
                            <CheckCircle size={32} className="stroke-[3px]" />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">Submit for Review</span>
                            <ArrowRight size={16} className="mt-1 transition-transform group-hover/btn:translate-x-1" />
                        </button>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 overflow-hidden">
                        <div className="h-full bg-indigo-500 animate-progress origin-left"></div>
                    </div>
                </div>
            ) : todoTasks.length > 0 ? (
                <div className="glass-card p-12 flex flex-col items-center justify-center border-dashed border-2 border-slate-800 text-center space-y-4">
                    <div className="p-4 bg-slate-800 rounded-full text-slate-600">
                        <Play size={40} className="ml-1" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">System Idle</h3>
                        <p className="text-slate-500 mt-1 max-w-sm">No task currently active. Select an objective from your pool below to initialize focus.</p>
                    </div>
                </div>
            ) : null}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Backlog / TODO Area */}
                <div className="space-y-6">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Clock size={16} className="text-slate-500" />
                        Awaiting Boarding
                    </h3>
                    <div className="grid gap-4">
                        {todoTasks.map(task => (
                            <div key={task.id} className="glass-card p-6 flex justify-between items-center group transition-all hover:border-slate-600">
                                <div className="space-y-1">
                                    <h4 className="text-white font-bold uppercase tracking-tight group-hover:text-indigo-400 transition-colors">{task.title}</h4>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{task.priority} Priority</p>
                                </div>
                                <button
                                    onClick={() => updateTaskStatus(task.id, 'IN_PROGRESS')}
                                    className="p-3 bg-slate-800 text-white rounded-xl hover:bg-indigo-600 transition-all shadow-lg active:scale-90"
                                >
                                    <Play size={18} fill="currentColor" />
                                </button>
                                <button
                                    onClick={() => setSelectedTask(task)}
                                    className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-700 transition-all border border-slate-700 active:scale-90"
                                >
                                    <MessageSquare size={18} />
                                </button>
                            </div>
                        ))}
                        {todoTasks.length === 0 && <p className="text-slate-600 text-xs uppercase font-black tracking-widest py-8 text-center italic">No pending boarding</p>}
                    </div>
                </div>

                {/* Review / Done Area */}
                <div className="space-y-6">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        Verification Cycle
                    </h3>
                    <div className="grid gap-4">
                        {reviewTasks.map(task => (
                            <div key={task.id} className="glass-card p-6 flex justify-between items-center border-amber-500/20 bg-amber-500/5">
                                <div className="space-y-1">
                                    <h4 className="text-white font-bold uppercase tracking-tight">{task.title}</h4>
                                    <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest animate-pulse">Pending Review</p>
                                </div>
                                <button
                                    onClick={() => updateTaskStatus(task.id, 'DONE')}
                                    className="px-4 py-2 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all"
                                >
                                    Finalize
                                </button>
                                <button
                                    onClick={() => setSelectedTask(task)}
                                    className="p-2 text-slate-500 hover:text-white transition-colors"
                                >
                                    <MessageSquare size={16} />
                                </button>
                            </div>
                        ))}
                        {doneTasks.slice(0, 3).map(task => (
                            <div key={task.id} className="glass-card p-6 flex justify-between items-center opacity-60">
                                <div className="space-y-1">
                                    <h4 className="text-white font-bold uppercase tracking-tight line-through decoration-slate-600">{task.title}</h4>
                                    <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Completed</p>
                                </div>
                                <CheckCircle size={20} className="text-emerald-500" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {selectedTask && (
                <TaskActivityModal
                    task={tasks.find(t => t.id === selectedTask.id) || selectedTask}
                    onClose={() => setSelectedTask(null)}
                />
            )}
        </div>
    );
};


