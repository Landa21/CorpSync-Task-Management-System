import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SuperAdminDashboard } from './pages/SuperAdmin/SuperAdminDashboard';
import { AdminManagerDashboard } from './pages/AdminManager/AdminManagerDashboard';
import { EmployeeDashboard } from './pages/Employee/EmployeeDashboard';
import { Departments } from './pages/SuperAdmin/Departments';
import { UsersManagement } from './pages/SuperAdmin/Users';
import { Profile } from './pages/Shared/Profile';
import { Tasks } from './pages/Shared/Tasks';
import { Team } from './pages/AdminManager/Team';
import { NotFound } from './pages/Shared/NotFound';
import { UserDetails } from './pages/SuperAdmin/UserDetails';

import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const result = await login(email, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message || 'Login failed');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="glass-card p-10 w-full max-w-md space-y-8 relative z-10 border-slate-700/50 shadow-2xl">
                <div className="text-center space-y-2">
                    <div className="inline-block p-3 rounded-2xl bg-indigo-600/10 mb-4 border border-indigo-500/20">
                        <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent transform -skew-x-6">
                            CorpSync
                        </h1>
                    </div>
                    <h2 className="text-xl font-semibold text-white tracking-tight uppercase">Corporate Identity Vault</h2>
                    <p className="text-slate-400 text-sm italic">Enter your credentials to access the hub.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Email Identifier</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium"
                                    placeholder="name@corporate.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Access Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-2 group overflow-hidden relative"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                Authenticate
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            </>
                        )}
                    </button>
                </form>

                <div className="pt-6 border-t border-slate-800 text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold opacity-50">Precision Workspace Infrastructure v1.2</p>
                </div>
            </div>
        </div>
    );
};

const DashboardRedirect = () => {
    const { user, loading } = useAuth();
    if (loading) return null; // Or a spinner, but ProtectedRoute handles most cases.
    if (!user) return <Navigate to="/login" />;
    return <Navigate to={`/${user.role.toLowerCase()}`} />;
};

function App() {
    return (
        <AuthProvider>
            <TaskProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />

                        <Route path="/super_admin/*" element={
                            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                                <DashboardLayout>
                                    <Routes>
                                        <Route index element={<SuperAdminDashboard />} />
                                        <Route path="departments" element={<Departments />} />
                                        <Route path="users" element={<UsersManagement />} />
                                        <Route path="users/:id" element={<UserDetails />} />
                                    </Routes>
                                </DashboardLayout>
                            </ProtectedRoute>
                        } />

                        <Route path="/admin_manager/*" element={
                            <ProtectedRoute allowedRoles={['ADMIN_MANAGER']}>
                                <DashboardLayout>
                                    <Routes>
                                        <Route index element={<AdminManagerDashboard />} />
                                        <Route path="team" element={<Team />} />
                                    </Routes>
                                </DashboardLayout>
                            </ProtectedRoute>
                        } />

                        <Route path="/employee/*" element={
                            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                                <DashboardLayout>
                                    <EmployeeDashboard />
                                </DashboardLayout>
                            </ProtectedRoute>
                        } />

                        {/* Shared Protected Routes */}
                        <Route path="/tasks" element={
                            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_MANAGER', 'EMPLOYEE']}>
                                <DashboardLayout>
                                    <Tasks />
                                </DashboardLayout>
                            </ProtectedRoute>
                        } />

                        <Route path="/profile" element={
                            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_MANAGER', 'EMPLOYEE']}>
                                <DashboardLayout>
                                    <Profile />
                                </DashboardLayout>
                            </ProtectedRoute>
                        } />

                        <Route path="/" element={<DashboardRedirect />} />
                        <Route path="/404" element={<NotFound />} />
                        <Route path="*" element={<Navigate to="/404" />} />
                    </Routes>
                </Router>
            </TaskProvider>
        </AuthProvider>
    );
}

export default App;

