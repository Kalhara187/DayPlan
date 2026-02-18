import sequelize from '../config/database.js';
import User from './UserMySQL.js';
import { Task, Subtask, Attachment } from './TaskMySQL.js';

// Define associations between models
User.hasMany(Task, {
    foreignKey: 'userId',
    as: 'tasks',
    onDelete: 'CASCADE'
});

Task.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// Self-referential association for recurring tasks
Task.belongsTo(Task, {
    foreignKey: 'recurringParentId',
    as: 'recurringParent'
});

Task.hasMany(Task, {
    foreignKey: 'recurringParentId',
    as: 'recurringInstances'
});

// Initialize database
const initializeDatabase = async () => {
    try {
        // Sync all models with database
        // alter: true will update tables if they exist
        // force: true will drop and recreate tables (use with caution!)
        await sequelize.sync({ alter: true });
        console.log('✅ Database tables synchronized successfully');
        return true;
    } catch (error) {
        console.error('❌ Database initialization error:', error);
        return false;
    }
};

export {
    sequelize,
    User,
    Task,
    Subtask,
    Attachment,
    initializeDatabase
};

export default {
    sequelize,
    User,
    Task,
    Subtask,
    Attachment,
    initializeDatabase
};
