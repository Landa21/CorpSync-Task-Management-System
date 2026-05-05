import React, { createContext, useContext, useState, useMemo } from 'react';
import { Task, Department, User } from '../types';
import { useAuth } from './AuthContext';

interface TaskContextType {
    tasks: Task[];
    departments: Department[];
    users: User[];
    getFilteredTasks: () => Task[];
    getDepartmentMembers: (deptId: string) => User[];
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'comments'>) => void;
    updateTaskStatus: (taskId: string, status: Task['status'], reason?: string) => void;
    addComment: (taskId: string, text: string) => void;
    addDepartment: (dept: Omit<Department, 'id' | 'createdAt'>) => void;
    addUser: (user: Omit<User, 'id'>) => void;
    deleteUser: (userId: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    const [tasks, setTasks] = useState<Task[]>([
        {
            id: 't1',
            title: 'Implement Auth Flow',
            description: 'Set up JWT authentication for the frontend.',
            status: 'IN_PROGRESS',
            priority: 'HIGH',
            assignedTo: '3', // John Doe
            createdBy: '1',  // Super Admin
            departmentId: 'dept-1',
            deadline: '2026-02-15',
            createdAt: '2026-01-20',
            comments: []
        },
        {
            id: 't2',
            title: 'Bug: Sidebar Alignment',
            description: 'Fix the layout issue in the sidebar navigation.',
            status: 'REVIEW',
            priority: 'MEDIUM',
            assignedTo: '3',
            createdBy: '2', // Sarah Manager
            departmentId: 'dept-1',
            deadline: '2026-02-10',
            createdAt: '2026-01-22',
            comments: []
        },
        {
            id: 't3',
            title: 'Database Migration',
            description: 'Migrate legacy data to the new schema.',
            status: 'TODO',
            priority: 'CRITICAL',
            assignedTo: '3',
            createdBy: '1',
            departmentId: 'dept-1',
            deadline: '2026-02-01',
            createdAt: '2026-01-25',
            comments: []
        },
        {
            id: 't4',
            title: 'Product Roadmap Q3',
            description: 'Define the key milestones for the next quarter.',
            status: 'IN_PROGRESS',
            priority: 'HIGH',
            assignedTo: '5', // Pam Beesly
            createdBy: '4', // Michael Scott
            departmentId: 'dept-2',
            deadline: '2026-03-01',
            createdAt: '2026-01-28',
            comments: []
        }
    ]);

    const [departments, setDepartments] = useState<Department[]>([
        {
            id: 'dept-1',
            name: 'Engineering',
            description: 'Software development and infrastructure.',
            managerId: '2',
            createdAt: '2026-01-01'
        },
        {
            id: 'dept-2',
            name: 'Product',
            description: 'Product strategy and roadmap.',
            managerId: '4',
            createdAt: '2026-01-05'
        },
        {
            id: 'dept-3',
            name: 'Design',
            description: 'User experience and visual identity.',
            managerId: '6',
            createdAt: '2026-01-10'
        }
    ]);

    const [users, setUsers] = useState<User[]>([
        {
            id: '1',
            name: 'Super Admin',
            email: 'super@corporate.com',
            role: 'SUPER_ADMIN',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky'
        },
        {
            id: '2',
            name: 'Sarah Manager',
            email: 'sarah@corporate.com',
            role: 'ADMIN_MANAGER',
            departmentId: 'dept-1',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            github: 'sarah-codes'
        },
        {
            id: '3',
            name: 'John Doe',
            email: 'john@corporate.com',
            role: 'EMPLOYEE',
            departmentId: 'dept-1',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
            github: 'johndoe-dev'
        },
        {
            id: '4',
            name: 'Michael Scott',
            email: 'michael@corporate.com',
            role: 'ADMIN_MANAGER',
            departmentId: 'dept-2',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
        },
        {
            id: '5',
            name: 'Pam Beesly',
            email: 'pam@corporate.com',
            role: 'EMPLOYEE',
            departmentId: 'dept-2',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pam'
        },
        {
            id: '6',
            name: 'Kelly Design',
            email: 'kelly@corporate.com',
            role: 'ADMIN_MANAGER',
            departmentId: 'dept-3',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kelly'
        }
    ]);

    const getFilteredTasks = useMemo(() => () => {
        if (!user) return [];
        switch (user.role) {
            case 'SUPER_ADMIN':
                return tasks;
            case 'ADMIN_MANAGER':
                return tasks.filter(t => t.departmentId === user.departmentId);
            case 'EMPLOYEE':
                return tasks.filter(t => t.assignedTo === user.id);
            default:
                return [];
        }
    }, [user, tasks]);

    const getDepartmentMembers = useMemo(() => (deptId: string) => {
        return users.filter(u => u.departmentId === deptId);
    }, [users]);

    const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'comments'>) => {
        const newTask: Task = {
            ...task,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            comments: []
        };
        setTasks(prev => [...prev, newTask]);
    };

    const updateTaskStatus = (taskId: string, status: Task['status'], reason?: string) => {
        setTasks(prev => prev.map(t =>
            t.id === taskId
                ? {
                    ...t,
                    status,
                    rejectionReason: status === 'IN_PROGRESS' && reason ? reason : t.rejectionReason
                }
                : t
        ));
    };

    const addComment = (taskId: string, text: string) => {
        if (!user) return;
        const newComment = {
            id: Math.random().toString(36).substr(2, 9),
            text,
            authorId: user.id,
            createdAt: new Date().toISOString()
        };
        setTasks(prev => prev.map(t =>
            t.id === taskId
                ? { ...t, comments: [...t.comments, newComment] }
                : t
        ));
    };

    const addDepartment = (dept: Omit<Department, 'id' | 'createdAt'>) => {
        const newDept: Department = {
            ...dept,
            id: `dept-${Math.random().toString(36).substr(2, 5)}`,
            createdAt: new Date().toISOString()
        };
        setDepartments(prev => [...prev, newDept]);
    };

    const addUser = (user: Omit<User, 'id'>) => {
        const newUser: User = {
            ...user,
            id: Math.random().toString(36).substr(2, 9)
        };
        setUsers(prev => [...prev, newUser]);
    };

    const deleteUser = (userId: string) => {
        setUsers(prev => prev.filter(u => u.id !== userId));
        // Optionally, we could also unassign tasks or handle dependencies here
    };

    return (
        <TaskContext.Provider value={{
            tasks,
            departments,
            users,
            getFilteredTasks,
            getDepartmentMembers,
            addTask,
            updateTaskStatus,
            addComment,
            addDepartment,
            addUser,
            deleteUser
        }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
};
