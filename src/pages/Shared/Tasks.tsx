import { useState, useMemo } from 'react';
import {
    Search,
    Filter,
    ArrowUpDown,
    Calendar,
    AlertCircle,
    CheckCircle2,
    Clock,
    Play,
    Building2,
    User as UserIcon,
    SearchX,
    MessageSquare
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { Task, TaskStatus, TaskPriority } from '../../types';
import { TaskActivityModal } from '../../components/Tasks/TaskActivityModal';

export const Tasks = () => {
    const { user } = useAuth();
    const { getFilteredTasks, users, departments } = useTasks();
    const tasks = getFilteredTasks();

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
    const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'ALL'>('ALL');
    const [sortBy, setSortBy] = useState<'deadline' | 'priority' | 'createdAt'>('deadline');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const filteredAndSortedTasks = useMemo(() => {
        let result = tasks.filter(task => {
            const matchesSearch =
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
            const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;

            return matchesSearch && matchesStatus && matchesPriority;
        });

        result.sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'deadline') {
                comparison = a.deadline.localeCompare(b.deadline);
            } else if (sortBy === 'createdAt') {
                comparison = a.createdAt.localeCompare(b.createdAt);
            } else if (sortBy === 'priority') {
                const priorityWeight = { 'CRITICAL': 3, 'HIGH': 2, 'MEDIUM': 1, 'LOW': 0 };
                comparison = priorityWeight[b.priority] - priorityWeight[a.priority];
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [tasks, searchQuery, statusFilter, priorityFilter, sortBy, sortOrder]);

    const getStatusStyle = (status: TaskStatus) => {
        switch (status) {
            case 'DONE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'REVIEW': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'IN_PROGRESS': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default: return 'bg-slate-800 text-slate-400 border-slate-700';
        }
    };

    const getPriorityStyle = (priority: TaskPriority) => {
        switch (priority) {
            case 'CRITICAL': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            case 'HIGH': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            default: return 'bg-slate-800 text-slate-400 border-slate-700';
        }
    };

    const getStatusIcon = (status: TaskStatus) => {
        switch (status) {
            case 'DONE': return <CheckCircle2 size={14} />;
            case 'REVIEW': return <Clock size={14} className="animate-pulse" />;
            case 'IN_PROGRESS': return <Play size={14} />;
            default: return <AlertCircle size={14} />;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Task Registry</h1>
                    <p className="text-slate-400 mt-2 font-medium tracking-tight">
                        {user?.role === 'SUPER_ADMIN' ? 'Global structural backlog analysis.' :
                            user?.role === 'ADMIN_MANAGER' ? 'Departmental operation synchronization.' :
                                'Personal objective execution workspace.'}
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-slate-900 px-6 py-4 rounded-2xl border border-slate-800 shadow-xl">
                    <div className="text-center">
                        <p className="text-2xl font-black text-white tracking-tighter">{filteredAndSortedTasks.length}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Displayed</p>
                    </div>
                    <div className="h-8 w-px bg-slate-800"></div>
                    <div className="text-center">
                        <p className="text-2xl font-black text-emerald-500 tracking-tighter">{filteredAndSortedTasks.filter(t => t.status === 'DONE').length}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Finalized</p>
                    </div>
                </div>
            </div>

            {/* Controls Section */}
            <div className="glass-card p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-4 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by title or description..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="md:col-span-8 flex flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <Filter size={16} className="text-slate-500" />
                            <select
                                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest text-slate-300 focus:outline-none focus:border-indigo-500"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                            >
                                <option value="ALL">All Status</option>
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="REVIEW">Review</option>
                                <option value="DONE">Done</option>
                            </select>

                            <select
                                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest text-slate-300 focus:outline-none focus:border-indigo-500"
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value as any)}
                            >
                                <option value="ALL">All Priorities</option>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="CRITICAL">Critical</option>
                            </select>
                        </div>

                        <div className="h-10 w-px bg-slate-800 hidden lg:block"></div>

                        <div className="flex items-center gap-3">
                            <ArrowUpDown size={16} className="text-slate-500" />
                            <select
                                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest text-slate-300 focus:outline-none focus:border-indigo-500"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                            >
                                <option value="deadline">Sort by Deadline</option>
                                <option value="priority">Sort by Priority</option>
                                <option value="createdAt">Sort by Date Created</option>
                            </select>
                            <button
                                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 hover:text-white transition-colors"
                            >
                                <ArrowUpDown size={18} className={sortOrder === 'desc' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Task List Section */}
            <div className="space-y-4">
                {filteredAndSortedTasks.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredAndSortedTasks.map((task) => {
                            const assignee = users.find(u => u.id === task.assignedTo);
                            const department = departments.find(d => d.id === task.departmentId);

                            return (
                                <div key={task.id} className="glass-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-indigo-500/50 transition-all group overflow-hidden relative">
                                    <div className="flex-1 space-y-3 relative z-10">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(task.status)} flex items-center gap-1.5`}>
                                                {getStatusIcon(task.status)}
                                                {task.status.replace('_', ' ')}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${getPriorityStyle(task.priority)}`}>
                                                {task.priority} Priority
                                            </span>
                                            <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                                <Calendar size={12} />
                                                Due: {task.deadline}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-tighter group-hover:text-indigo-400 transition-colors leading-none">{task.title}</h3>
                                        <p className="text-slate-400 text-sm font-medium line-clamp-1 max-w-3xl">{task.description}</p>
                                    </div>

                                    <div className="flex items-center gap-8 relative z-10">
                                        <div className="hidden sm:flex items-center gap-8 border-l border-slate-800 pl-8">
                                            <div className="flex flex-col items-end">
                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                                                    <Building2 size={10} /> UNIT
                                                </p>
                                                <p className="text-white font-bold text-xs uppercase tracking-tight">{department?.name || 'N/A'}</p>
                                            </div>
                                            <div className="flex flex-col items-end min-w-[120px]">
                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                                                    <UserIcon size={10} /> RESOURCE
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <img src={assignee?.avatar} alt="" className="w-5 h-5 rounded-full bg-slate-800" />
                                                    <p className="text-white font-bold text-xs tracking-tight">{assignee?.name || 'Unassigned'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedTask(task)}
                                            className="p-3 bg-slate-800/50 rounded-xl text-slate-400 hover:text-white hover:bg-indigo-600 transition-all border border-slate-700 hover:border-indigo-500/50 active:scale-95 shadow-lg group/btn flex items-center gap-2 px-4"
                                        >
                                            <MessageSquare size={18} className="group-hover/btn:scale-110 transition-transform" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{task.comments.length || ''}</span>
                                        </button>
                                    </div>

                                    {/* Subdued BG Decor */}
                                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none transform translate-x-1/4 -translate-y-1/4 scale-150">
                                        {getStatusIcon(task.status)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="glass-card p-24 text-center border-dashed border-2 border-slate-800">
                        <div className="inline-flex p-6 rounded-full bg-slate-900 mb-6">
                            <SearchX size={48} className="text-slate-700" />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Negative Registry Results</h3>
                        <p className="text-slate-500 mt-2 font-medium">No tasks matching your current filters were identified in the centralized hub.</p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setStatusFilter('ALL');
                                setPriorityFilter('ALL');
                            }}
                            className="mt-8 text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-widest text-xs"
                        >
                            Reset Registry Parameters
                        </button>
                    </div>
                )}
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
