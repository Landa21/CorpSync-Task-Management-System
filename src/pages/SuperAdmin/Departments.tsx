import React, { useState } from 'react';
import { Building2, Plus, Users, Shield, MoreVertical } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export const Departments = () => {
    const { departments, users, addDepartment } = useTasks();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDept, setNewDept] = useState({ name: '', description: '', managerId: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addDepartment(newDept);
        setNewDept({ name: '', description: '', managerId: '' });
        setIsModalOpen(false);
    };

    const managers = users.filter(u => u.role === 'ADMIN_MANAGER');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Departments</h1>
                    <p className="text-slate-400 mt-1">Configure and manage corporate structural units.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Department
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept) => {
                    const manager = users.find(u => u.id === dept.managerId);
                    const membersCount = users.filter(u => u.departmentId === dept.id).length;

                    return (
                        <div key={dept.id} className="glass-card p-6 flex flex-col gap-6 group hover:border-indigo-500/50 transition-all">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                                    <Building2 size={24} />
                                </div>
                                <button className="p-2 text-slate-500 hover:text-white transition-colors">
                                    <MoreVertical size={20} />
                                </button>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                                    {dept.name}
                                </h3>
                                <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                                    {dept.description}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Users size={16} className="text-slate-500" />
                                    <span className="text-sm text-slate-300">{membersCount} members</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Shield size={16} className="text-emerald-500" />
                                    <span className="text-xs text-slate-400 truncate max-w-[100px]">
                                        {manager?.name || 'Unassigned'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Simple Modal Placeholder */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-card max-w-md w-full p-8 space-y-6">
                        <h2 className="text-2xl font-bold text-white">New Department</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                    value={newDept.name}
                                    onChange={e => setNewDept({ ...newDept, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                <textarea
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 h-24"
                                    value={newDept.description}
                                    onChange={e => setNewDept({ ...newDept, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Assign Manager</label>
                                <select
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                    value={newDept.managerId}
                                    onChange={e => setNewDept({ ...newDept, managerId: e.target.value })}
                                >
                                    <option value="">Select a manager</option>
                                    {managers.map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all font-bold"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
