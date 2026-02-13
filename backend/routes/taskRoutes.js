import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    addSubtask,
    updateSubtask,
    deleteSubtask,
    toggleSubtask,
    getTags,
    getTaskStats,
    deleteRecurringSeries
} from '../controllers/taskController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Task CRUD routes
router.route('/')
    .get(getTasks)
    .post(createTask);

// Task stats and tags (must be before /:id routes)
router.get('/stats', getTaskStats);
router.get('/tags', getTags);

// Single task routes
router.route('/:id')
    .get(getTask)
    .put(updateTask)
    .delete(deleteTask);

// Toggle task completion
router.patch('/:id/complete', toggleTaskComplete);

// Recurring task routes
router.delete('/:id/recurring', deleteRecurringSeries);

// Subtask routes
router.post('/:id/subtasks', addSubtask);
router.put('/:id/subtasks/:subtaskId', updateSubtask);
router.delete('/:id/subtasks/:subtaskId', deleteSubtask);
router.patch('/:id/subtasks/:subtaskId/toggle', toggleSubtask);

export default router;
