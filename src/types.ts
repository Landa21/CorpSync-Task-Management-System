export type Role = 'SUPER_ADMIN' | 'ADMIN_MANAGER' | 'EMPLOYEE';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    departmentId?: string;
    avatar?: string;
    github?: string;
}

export interface Department {
    id: string;
    name: string;
    managerId?: string;
    description: string;
    createdAt: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Comment {
    id: string;
    text: string;
    authorId: string;
    createdAt: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignedTo: string; // User ID
    createdBy: string; // User ID
    departmentId: string;
    deadline: string;
    createdAt: string;
    comments: Comment[];
    rejectionReason?: string;
}
