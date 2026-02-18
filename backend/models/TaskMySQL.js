import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

// Task Model
class Task extends Model {
    // Method to calculate completion percentage including subtasks
    async calculateCompletionPercentage() {
        const subtasks = await this.getSubtasks();
        
        if (!subtasks || subtasks.length === 0) {
            return this.completed ? 100 : 0;
        }

        const completedSubtasks = subtasks.filter(st => st.completed).length;
        const totalSubtasks = subtasks.length;
        const subtaskPercentage = (completedSubtasks / totalSubtasks) * 0.8; // 80% weight
        const mainTaskPercentage = this.completed ? 0.2 : 0; // 20% weight

        return Math.round((subtaskPercentage + mainTaskPercentage) * 100);
    }

    // Format date for display
    get formattedDate() {
        if (!this.date) return null;
        const [year, month, day] = this.date.split('-');
        return `${month}/${day}/${year}`;
    }
}

Task.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Task title is required'
            },
            len: {
                args: [1, 200],
                msg: 'Title cannot exceed 200 characters'
            }
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: {
                args: [0, 1000],
                msg: 'Description cannot exceed 1000 characters'
            }
        }
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Date is required'
            }
        }
    },
    startTime: {
        type: DataTypes.STRING(5),
        allowNull: true,
        validate: {
            is: {
                args: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                msg: 'Invalid time format. Use HH:MM'
            }
        }
    },
    endTime: {
        type: DataTypes.STRING(5),
        allowNull: true,
        validate: {
            is: {
                args: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                msg: 'Invalid time format. Use HH:MM'
            }
        }
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        defaultValue: 'medium'
    },
    category: {
        type: DataTypes.ENUM('work', 'personal', 'health', 'finance', 'other'),
        defaultValue: 'other'
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    tags: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    isRecurring: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    recurrenceType: {
        type: DataTypes.ENUM('daily', 'weekly', 'monthly'),
        allowNull: true
    },
    recurrenceEndDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    recurringParentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'tasks',
            key: 'id'
        }
    },
    isRecurringInstance: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
    timestamps: true,
    indexes: [
        { fields: ['userId', 'date'] },
        { fields: ['userId', 'completed'] },
        { fields: ['userId', 'priority'] },
        { fields: ['userId', 'category'] }
    ]
});

// Subtask Model
class Subtask extends Model {}

Subtask.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tasks',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'Subtask',
    tableName: 'subtasks',
    timestamps: true
});

// Attachment Model
class Attachment extends Model {}

Attachment.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tasks',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    type: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Attachment',
    tableName: 'attachments',
    timestamps: true
});

// Define associations
Task.hasMany(Subtask, { 
    foreignKey: 'taskId', 
    as: 'subtasks',
    onDelete: 'CASCADE'
});
Subtask.belongsTo(Task, { 
    foreignKey: 'taskId'
});

Task.hasMany(Attachment, { 
    foreignKey: 'taskId', 
    as: 'attachments',
    onDelete: 'CASCADE'
});
Attachment.belongsTo(Task, { 
    foreignKey: 'taskId'
});

export { Task, Subtask, Attachment };
export default Task;
