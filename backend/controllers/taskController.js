import Task from '../models/Task.js';
import User from '../models/User.js';
import { sendTaskCreatedEmail } from '../services/emailService.js';

// Sample user for testing when database is not connected
const SAMPLE_USER = {
    id: 'sample-user-12345',
    _id: 'sample-user-12345'
};

// @desc    Get all tasks for a user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
    try {
        // SECURITY: Extract authenticated user ID from JWT token (set by auth middleware)
        const userId = req.user?.id || req.user?._id;

        // Return empty array for sample user (localStorage used)
        if (userId === SAMPLE_USER.id) {
            return res.status(200).json({
                status: 'success',
                message: 'Using localStorage for sample user',
                data: {
                    tasks: []
                }
            });
        }

        // SECURITY: Only fetch tasks that belong to the authenticated user
        const tasks = await Task.find({ user: userId }).sort({ date: -1, createdAt: -1 });

        res.status(200).json({
            status: 'success',
            results: tasks.length,
            data: {
                tasks
            }
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching tasks',
            error: error.message
        });
    }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (req, res) => {
    try {
        // SECURITY: Extract authenticated user ID from JWT token
        const userId = req.user?.id || req.user?._id;

        if (userId === SAMPLE_USER.id) {
            return res.status(400).json({
                status: 'error',
                message: 'Sample user uses localStorage'
            });
        }

        // SECURITY: User can only access their own tasks - prevents unauthorized access
        const task = await Task.findOne({ _id: req.params.id, user: userId });

        if (!task) {
            return res.status(404).json({
                status: 'error',
                message: 'Task not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                task
            }
        });
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching task',
            error: error.message
        });
    }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
    try {
        // SECURITY: Get authenticated user ID from JWT token
        const userId = req.user?.id || req.user?._id;

        if (userId === SAMPLE_USER.id) {
            return res.status(400).json({
                status: 'error',
                message: 'Sample user cannot create tasks on server. Use localStorage.'
            });
        }

        // SECURITY: Always set user from authenticated token, never trust client input
        // This prevents users from creating tasks for other users
        const taskData = {
            ...req.body,
            user: userId  // Override any user field from request body
        };

        const task = await Task.create(taskData);

        // Send email notification if user has email notifications enabled
        try {
            const user = await User.findById(userId);
            if (user && user.emailNotifications) {
                const emailToSend = user.notificationEmail || user.email;
                await sendTaskCreatedEmail(emailToSend, user.fullName, {
                    title: task.title,
                    description: task.description,
                    date: task.date,
                    startTime: task.startTime,
                    endTime: task.endTime,
                    priority: task.priority,
                    category: task.category
                });
            }
        } catch (emailError) {
            console.error('Failed to send task creation email:', emailError.message);
            // Don't fail the task creation if email fails
        }

        res.status(201).json({
            status: 'success',
            message: 'Task created successfully',
            data: {
                task
            }
        });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error creating task',
            error: error.message
        });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
    try {
        // SECURITY: Get authenticated user ID
        const userId = req.user?.id || req.user?._id;

        if (userId === SAMPLE_USER.id) {
            return res.status(400).json({
                status: 'error',
                message: 'Sample user cannot update tasks on server'
            });
        }

        // SECURITY: Verify task belongs to authenticated user before updating
        const task = await Task.findOne({ _id: req.params.id, user: userId });

        if (!task) {
            return res.status(404).json({
                status: 'error',
                message: 'Task not found'
            });
        }

        // Update fields
        Object.keys(req.body).forEach(key => {
            if (key !== 'user') { // Don't allow changing user
                task[key] = req.body[key];
            }
        });

        await task.save();

        res.status(200).json({
            status: 'success',
            message: 'Task updated successfully',
            data: {
                task
            }
        });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error updating task',
            error: error.message
        });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
    try {
        // SECURITY: Get authenticated user ID
        const userId = req.user?.id || req.user?._id;

        if (userId === SAMPLE_USER.id) {
            return res.status(400).json({
                status: 'error',
                message: 'Sample user cannot delete tasks on server'
            });
        }

        // SECURITY: Verify task belongs to authenticated user before deleting
        const task = await Task.findOne({ _id: req.params.id, user: userId });

        if (!task) {
            return res.status(404).json({
                status: 'error',
                message: 'Task not found'
            });
        }

        await Task.deleteOne({ _id: req.params.id });

        res.status(200).json({
            status: 'success',
            message: 'Task deleted successfully',
            data: null
        });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error deleting task',
            error: error.message
        });
    }
};

// @desc    Toggle task completion
// @route   PATCH /api/tasks/:id/complete
// @access  Private
export const toggleTaskComplete = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        if (userId === SAMPLE_USER.id) {
            return res.status(400).json({
                status: 'error',
                message: 'Sample user cannot toggle tasks on server'
            });
        }

        const task = await Task.findOne({ _id: req.params.id, user: userId });

        if (!task) {
            return res.status(404).json({
                status: 'error',
                message: 'Task not found'
            });
        }

        task.completed = !task.completed;
        await task.save();

        res.status(200).json({
            status: 'success',
            message: `Task marked as ${task.completed ? 'completed' : 'incomplete'}`,
            data: {
                task
            }
        });
    } catch (error) {
        console.error('Error toggling task:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error toggling task',
            error: error.message
        });
    }
};

// @desc    Add subtask to task
// @route   POST /api/tasks/:id/subtasks
// @access  Private
export const addSubtask = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        if (userId === SAMPLE_USER.id) {
            return res.status(400).json({
                status: 'error',
                message: 'Sample user cannot add subtasks on server'
            });
        }

        const task = await Task.findOne({ _id: req.params.id, user: userId });

        if (!task) {
            return res.status(404).json({
                status: 'error',
                message: 'Task not found'
            });
        }

        const subtask = {
            title: req.body.title,
            completed: false
        };

        task.subtasks.push(subtask);
        await task.save();

        res.status(201).json({
            status: 'success',
            message: 'Subtask added successfully',
            data: {
                task
            }
        });
    } catch (error) {
        console.error('Error adding subtask:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error adding subtask',
            error: error.message
        });
    }
};

// @desc    Update subtask
// @route   PUT /api/tasks/:id/subtasks/:subtaskId
// @access  Private
export const updateSubtask = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        if (userId === SAMPLE_USER.id) {
            return res.status(400).json({
                status: 'error',
                message: 'Sample user cannot update subtasks on server'
            });
        }

        const task = await Task.findOne({ _id: req.params.id, user: userId });

        if (!task) {
            return res.status(404).json({
                status: 'error',
                message: 'Task not found'
            });
        }

        const subtask = task.subtasks.id(req.params.subtaskId);

        if (!subtask) {
            return res.status(404).json({
                status: 'error',
                message: 'Subtask not found'
            });
        }

        if (req.body.title !== undefined) subtask.title = req.body.title;
        if (req.body.completed !== undefined) subtask.completed = req.body.completed;

        await task.save();

        res.status(200).json({
            status: 'success',
            message: 'Subtask updated successfully',
            data: {
                task
            }
        });
    } catch (error) {
        console.error('Error updating subtask:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error updating subtask',
            error: error.message
        });
    }
};

// @desc    Delete subtask
// @route   DELETE /api/tasks/:id/subtasks/:subtaskId
// @access  Private
export const deleteSubtask = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        if (userId === SAMPLE_USER.id) {
            return res.status(400).json({
                status: 'error',
                message: 'Sample user cannot delete subtasks on server'
            });
        }

        const task = await Task.findOne({ _id: req.params.id, user: userId });

        if (!task) {
            return res.status(404).json({
                status: 'error',
                message: 'Task not found'
            });
        }

        task.subtasks.pull(req.params.subtaskId);
        await task.save();

        res.status(200).json({
            status: 'success',
            message: 'Subtask deleted successfully',
            data: {
                task
            }
        });
    } catch (error) {
        console.error('Error deleting subtask:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error deleting subtask',
            error: error.message
        });
    }
};

// @desc    Toggle subtask completion
// @route   PATCH /api/tasks/:id/subtasks/:subtaskId/toggle
// @access  Private
export const toggleSubtask = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        if (userId === SAMPLE_USER.id) {
            return res.status(400).json({
                status: 'error',
                message: 'Sample user cannot toggle subtasks on server'
            });
        }

        const task = await Task.findOne({ _id: req.params.id, user: userId });

        if (!task) {
            return res.status(404).json({
                status: 'error',
                message: 'Task not found'
            });
        }

        const subtask = task.subtasks.id(req.params.subtaskId);

        if (!subtask) {
            return res.status(404).json({
                status: 'error',
                message: 'Subtask not found'
            });
        }

        subtask.completed = !subtask.completed;
        await task.save();

        res.status(200).json({
            status: 'success',
            message: `Subtask marked as ${subtask.completed ? 'completed' : 'incomplete'}`,
            data: {
                task
            }
        });
    } catch (error) {
        console.error('Error toggling subtask:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error toggling subtask',
            error: error.message
        });
    }
};

// @desc    Get user's tags
// @route   GET /api/tasks/tags
// @access  Private
export const getTags = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        if (userId === SAMPLE_USER.id) {
            return res.status(200).json({
                status: 'success',
                data: {
                    tags: ['urgent', 'important', 'work', 'personal', 'study', 'meeting']
                }
            });
        }

        const tasks = await Task.find({ user: userId });
        const tagsSet = new Set();

        tasks.forEach(task => {
            if (task.tags && task.tags.length > 0) {
                task.tags.forEach(tag => tagsSet.add(tag));
            }
        });

        const tags = Array.from(tagsSet).sort();

        res.status(200).json({
            status: 'success',
            results: tags.length,
            data: {
                tags
            }
        });
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching tags',
            error: error.message
        });
    }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private
export const getTaskStats = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        if (userId === SAMPLE_USER.id) {
            return res.status(200).json({
                status: 'success',
                data: {
                    total: 0,
                    completed: 0,
                    pending: 0,
                    completionRate: 0,
                    byPriority: { high: 0, medium: 0, low: 0 },
                    byCategory: {}
                }
            });
        }

        const tasks = await Task.find({ user: userId });

        const stats = {
            total: tasks.length,
            completed: tasks.filter(t => t.completed).length,
            pending: tasks.filter(t => !t.completed).length,
            completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0,
            byPriority: {
                high: tasks.filter(t => t.priority === 'high').length,
                medium: tasks.filter(t => t.priority === 'medium').length,
                low: tasks.filter(t => t.priority === 'low').length
            },
            byCategory: {}
        };

        tasks.forEach(task => {
            if (task.category) {
                stats.byCategory[task.category] = (stats.byCategory[task.category] || 0) + 1;
            }
        });

        res.status(200).json({
            status: 'success',
            data: stats
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching statistics',
            error: error.message
        });
    }
};

// @desc    Delete recurring series
// @route   DELETE /api/tasks/:id/recurring
// @access  Private
export const deleteRecurringSeries = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        if (userId === SAMPLE_USER.id) {
            return res.status(400).json({
                status: 'error',
                message: 'Sample user cannot delete recurring series on server'
            });
        }

        const task = await Task.findOne({ _id: req.params.id, user: userId });

        if (!task) {
            return res.status(404).json({
                status: 'error',
                message: 'Task not found'
            });
        }

        // Delete all instances of this recurring task
        await Task.deleteMany({
            user: userId,
            $or: [
                { _id: req.params.id },
                { recurringParentId: req.params.id }
            ]
        });

        res.status(200).json({
            status: 'success',
            message: 'Recurring series deleted successfully',
            data: null
        });
    } catch (error) {
        console.error('Error deleting recurring series:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error deleting recurring series',
            error: error.message
        });
    }
};
