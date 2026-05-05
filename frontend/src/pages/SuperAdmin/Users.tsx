import React, { useState } from 'react';
import { Plus, Shield, Building2, Search, Filter, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';

export const UsersManagement = () => {
    const { users, departments, addUser, deleteUser } = useTasks();
    const { user: currentUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'EMPLOYEE' as Role,
        departmentId: '',
        github: ''
    });
    const [searchQuery, setSearchQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addUser({
            ...newUser,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.name}`
        });
        setNewUser({ name: '', email: '', role: 'EMPLOYEE', departmentId: '', github: '' });
        setIsModalOpen(false);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">User Management</h1>
                    <p className="text-slate-400 mt-1">Administer directory access and user roles.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add User
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-all"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-lg border border-slate-700 hover:bg-slate-700 transition-all flex items-center gap-2">
                    <Filter size={18} />
                    Filters
                </button>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredUsers.map((user) => {
                                const dept = departments.find(d => d.id === user.departmentId);
                                return (
                                    <tr key={user.id} className="hover:bg-slate-800/20 transition-all group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={user.avatar} alt="" className="w-10 h-10 rounded-full bg-slate-800" />
                                                <div>
                                                    <p className="font-semibold text-white uppercase tracking-tight">{user.name}</p>
                                                    <p className="text-xs text-slate-500 font-mono tracking-tighter">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.role === 'SUPER_ADMIN' ? 'bg-indigo-500/10 text-indigo-400' :
                                                user.role === 'ADMIN_MANAGER' ? 'bg-emerald-500/10 text-emerald-400' :
                                                    'bg-slate-700 text-slate-400'
                                                }`}>
                                                <Shield size={12} />
                                                {user.role.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">
                                            <div className="flex items-center gap-2">
                                                <Building2 size={14} className="text-slate-500" />
                                                {dept?.name || 'Global'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block mr-2" />
                                            <span className="text-sm text-slate-400">Active</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end items-center gap-4">
                                                <Link
                                                    to={`/super_admin/users/${user.id}`}
                                                    className="text-xs font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors"
                                                >
                                                    Manage
                                                </Link>
                                                {currentUser?.id !== user.id && (
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm(`Are you sure you want to terminate access for ${user.name}? This action is irreversible.`)) {
                                                                deleteUser(user.id);
                                                            }
                                                        }}
                                                        className="p-2 text-slate-600 hover:text-rose-500 transition-colors"
                                                        title="Terminate Access"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-card max-w-md w-full p-8 space-y-6">
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Add New User</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                                    value={newUser.name}
                                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Corporate Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                                    value={newUser.email}
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">GitHub Handle (Optional)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-mono">@</span>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-all font-mono text-sm"
                                        placeholder="octocat"
                                        value={newUser.github}
                                        onChange={e => setNewUser({ ...newUser, github: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Role</label>
                                    <select
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                                        value={newUser.role}
                                        onChange={e => setNewUser({ ...newUser, role: e.target.value as Role })}
                                    >
                                        <option value="EMPLOYEE">Employee</option>
                                        <option value="ADMIN_MANAGER">Admin Manager</option>
                                        <option value="SUPER_ADMIN">Super Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Department</label>
                                    <select
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                                        value={newUser.departmentId}
                                        onChange={e => setNewUser({ ...newUser, departmentId: e.target.value })}
                                    >
                                        <option value="">Global / None</option>
                                        {departments.map(d => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all font-bold uppercase tracking-widest text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all font-bold uppercase tracking-widest text-xs shadow-lg shadow-indigo-600/20"
                                >
                                    Confirm User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
