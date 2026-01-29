const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const users = [
    {
        id: '1',
        name: 'Super Admin',
        email: 'super@corporate.com',
        password: 'admin123',
        role: 'SUPER_ADMIN',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky'
    },
    {
        id: '2',
        name: 'Sarah Manager',
        email: 'sarah@corporate.com',
        password: 'manager123',
        role: 'ADMIN_MANAGER',
        departmentId: 'dept-1',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        github: 'sarah-codes'
    },
    {
        id: '3',
        name: 'John Doe',
        email: 'john@corporate.com',
        password: 'employee123',
        role: 'EMPLOYEE',
        departmentId: 'dept-1',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        github: 'johndoe-dev'
    },
    {
        id: '4',
        name: 'Michael Scott',
        email: 'michael@corporate.com',
        password: 'manager123',
        role: 'ADMIN_MANAGER',
        departmentId: 'dept-2',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
    },
    {
        id: '5',
        name: 'Pam Beesly',
        email: 'pam@corporate.com',
        password: 'employee123',
        role: 'EMPLOYEE',
        departmentId: 'dept-2',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pam'
    },
    {
        id: '6',
        name: 'Kelly Design',
        email: 'kelly@corporate.com',
        password: 'manager123',
        role: 'ADMIN_MANAGER',
        departmentId: 'dept-3',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kelly'
    }
];

async function initDB() {
    const hashedUsers = await Promise.all(users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
    }));

    fs.writeFileSync(
        path.join(__dirname, 'db.json'),
        JSON.stringify({ users: hashedUsers }, null, 2)
    );
    console.log('Database initialized successfully.');
}

initDB();
