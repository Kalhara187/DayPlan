import mongoose from 'mongoose';

const subtaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const attachmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    size: {
        type: Number
    },
    type: {
        type: String
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    date: {
        type: String, // Format: YYYY-MM-DD
        required: [true, 'Date is required']
    },
    startTime: {
        type: String // Format: HH:MM
    },
    endTime: {
        type: String // Format: HH:MM
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    category: {
        type: String,
        enum: ['work', 'personal', 'health', 'finance', 'other'],
        default: 'other'
    },
    completed: {
        type: Boolean,
        default: false
    },
    subtasks: [subtaskSchema],
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    attachments: [attachmentSchema],
    // Recurring task fields
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurrenceType: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', null],
        default: null
    },
    recurrenceEndDate: {
        type: String // Format: YYYY-MM-DD
    },
    recurringParentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        default: null
    },
    isRecurringInstance: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes for better query performance
taskSchema.index({ user: 1, date: 1 });
taskSchema.index({ user: 1, completed: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, category: 1 });
taskSchema.index({ user: 1, tags: 1 });

// Method to calculate completion percentage including subtasks
taskSchema.methods.calculateCompletionPercentage = function() {
    if (!this.subtasks || this.subtasks.length === 0) {
        return this.completed ? 100 : 0;
    }
    
    const completedSubtasks = this.subtasks.filter(st => st.completed).length;
    const totalSubtasks = this.subtasks.length;
    const subtaskPercentage = (completedSubtasks / totalSubtasks) * 0.8; // 80% weight
    const mainTaskPercentage = this.completed ? 0.2 : 0; // 20% weight
    
    return Math.round((subtaskPercentage + mainTaskPercentage) * 100);
};

// Virtual for formatted date display
taskSchema.virtual('formattedDate').get(function() {
    if (!this.date) return null;
    const [year, month, day] = this.date.split('-');
    return `${month}/${day}/${year}`;
});

// Ensure virtuals are included in JSON
taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;
