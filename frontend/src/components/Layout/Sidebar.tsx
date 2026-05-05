import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    BarChart3,
    CheckSquare,
    Users,
    User,
    Building2,
    LogOut,
    LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';

interface NavItem {
    icon: React.ReactNode;
    label: string;
    path: string;
    roles: Role[];
}

const navItems: NavItem[] = [
    {
        icon: <LayoutDashboard size={20} />,
        label: 'Dashboard',
        path: '/', // Redirects based on role
        roles: ['SUPER_ADMIN', 'ADMIN_MANAGER', 'EMPLOYEE']
    },
    {
        icon: <Building2 size={20} />,
        label: 'Departments',
        path: '/super_admin/departments',
        roles: ['SUPER_ADMIN']
    },
    {
        icon: <Users size={20} />,
        label: 'User Management',
        path: '/super_admin/users',
        roles: ['SUPER_ADMIN']
    },
    {
        icon: <BarChart3 size={20} />,
        label: 'Team Overview',
        path: '/admin_manager/team',
        roles: ['ADMIN_MANAGER']
    },
    {
        icon: <CheckSquare size={20} />,
        label: 'Tasks',
        path: '/tasks',
        roles: ['SUPER_ADMIN', 'ADMIN_MANAGER', 'EMPLOYEE']
    },
    {
        icon: <User size={20} />,
        label: 'Profile',
        path: '/profile',
        roles: ['SUPER_ADMIN', 'ADMIN_MANAGER', 'EMPLOYEE']
    }
];

export const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    const filteredNavItems = navItems.filter(item =>
        item.roles.includes(user.role)
    );

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col pt-6 pb-4">
            <div className="px-6 mb-10">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent">
                    CorpSync
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {filteredNavItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${isActive
                                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
            `}
                    >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="px-4 mt-auto border-t border-slate-800 pt-4">
                <div className="flex items-center gap-3 px-4 py-3 mb-4">
                    <img
                        src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                        alt={user.name}
                        className="w-10 h-10 rounded-full bg-slate-800"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate capitalize">
                            {user.role.toLowerCase().replace('_', ' ')}
                        </p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-all duration-200 w-full"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};
