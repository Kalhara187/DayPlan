import { createContext, useContext, useState, useEffect } from 'react'

const TaskContext = createContext()

// Predefined tag colors
const TAG_COLORS = {
    urgent: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-500',
    important: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 border-orange-500',
    work: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-500',
    personal: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-500',
    study: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-purple-500',
    meeting: 'bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 border-pink-500',
    fitness: 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 border-teal-500',
    shopping: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-500',
    family: 'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 border-rose-500',
    hobby: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border-indigo-500',
    default: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-500'
}

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('dayplan_tasks')
        return saved ? JSON.parse(saved) : []
    })

    const [availableTags, setAvailableTags] = useState(() => {
        const saved = localStorage.getItem('dayplan_tags')
        return saved ? JSON.parse(saved) : ['urgent', 'important', 'work', 'personal', 'study', 'meeting']
    })

    useEffect(() => {
        localStorage.setItem('dayplan_tasks', JSON.stringify(tasks))
    }, [tasks])

    useEffect(() => {
        localStorage.setItem('dayplan_tags', JSON.stringify(availableTags))
    }, [availableTags])

    const addTask = (task) => {
        const newTask = {
            ...task,
            id: Date.now(),
            completed: false,
            subtasks: [],
            tags: task.tags || [],
            isRecurring: task.isRecurring || false,
            recurrenceType: task.recurrenceType || null,
            recurrenceEndDate: task.recurrenceEndDate || null,
            recurringParentId: task.recurringParentId || null,
            createdAt: new Date().toISOString()
        }
        setTasks([...tasks, newTask])
        return newTask
    }

    const updateTask = (id, updates) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, ...updates } : task))
    }

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id))
    }

    const toggleTaskComplete = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ))
    }

    const getTasksByDate = (date) => {
        return tasks.filter(task => task.date === date)
    }

    const getTasksForMonth = (year, month) => {
        return tasks.filter(task => {
            if (!task.date) return false
            const taskDate = new Date(task.date)
            return taskDate.getFullYear() === year && taskDate.getMonth() === month
        })
    }

    // Subtask management functions
    const addSubtask = (taskId, subtask) => {
        setTasks(tasks.map(task => {
            if (task.id === taskId) {
                const newSubtask = {
                    ...subtask,
                    id: Date.now() + Math.random(), // Ensure unique ID
                    completed: false,
                    createdAt: new Date().toISOString()
                }
                return {
                    ...task,
                    subtasks: [...(task.subtasks || []), newSubtask]
                }
            }
            return task
        }))
    }

    const updateSubtask = (taskId, subtaskId, updates) => {
        setTasks(tasks.map(task => {
            if (task.id === taskId) {
                return {
                    ...task,
                    subtasks: (task.subtasks || []).map(subtask =>
                        subtask.id === subtaskId ? { ...subtask, ...updates } : subtask
                    )
                }
            }
            return task
        }))
    }

    const deleteSubtask = (taskId, subtaskId) => {
        setTasks(tasks.map(task => {
            if (task.id === taskId) {
                return {
                    ...task,
                    subtasks: (task.subtasks || []).filter(subtask => subtask.id !== subtaskId)
                }
            }
            return task
        }))
    }

    const toggleSubtaskComplete = (taskId, subtaskId) => {
        setTasks(tasks.map(task => {
            if (task.id === taskId) {
                return {
                    ...task,
                    subtasks: (task.subtasks || []).map(subtask =>
                        subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
                    )
                }
            }
            return task
        }))
    }

    // Recurring task functions
    const generateRecurringInstances = (startDate, endDate) => {
        const instances = []
        const recurringTasks = tasks.filter(task => task.isRecurring && !task.recurringParentId)

        recurringTasks.forEach(task => {
            const taskDate = new Date(task.date)
            const start = new Date(startDate)
            const end = new Date(endDate)
            const recurrenceEnd = task.recurrenceEndDate ? new Date(task.recurrenceEndDate) : new Date(end.getTime() + 365 * 24 * 60 * 60 * 1000)

            let currentDate = new Date(taskDate)

            while (currentDate <= end && currentDate <= recurrenceEnd) {
                if (currentDate >= start && currentDate.toISOString().split('T')[0] !== task.date) {
                    instances.push({
                        ...task,
                        id: `${task.id}-${currentDate.toISOString().split('T')[0]}`,
                        date: currentDate.toISOString().split('T')[0],
                        recurringParentId: task.id,
                        isRecurringInstance: true
                    })
                }

                // Calculate next occurrence
                if (task.recurrenceType === 'daily') {
                    currentDate.setDate(currentDate.getDate() + 1)
                } else if (task.recurrenceType === 'weekly') {
                    currentDate.setDate(currentDate.getDate() + 7)
                } else if (task.recurrenceType === 'monthly') {
                    currentDate.setMonth(currentDate.getMonth() + 1)
                }
            }
        })

        return instances
    }

    const cancelRecurringTask = (taskId) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, isRecurring: false, recurrenceType: null, recurrenceEndDate: null } : task
        ))
    }

    const deleteRecurringSeries = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId && task.recurringParentId !== taskId))
    }

    const getAllTasksWithRecurring = (startDate, endDate) => {
        const regularTasks = tasks.filter(task => !task.recurringParentId)
        const recurringInstances = generateRecurringInstances(startDate, endDate)
        return [...regularTasks, ...recurringInstances]
    }

    // Tag management functions
    const addTag = (tagName) => {
        const normalizedTag = tagName.toLowerCase().trim()
        if (normalizedTag && !availableTags.includes(normalizedTag)) {
            setAvailableTags([...availableTags, normalizedTag])
            return true
        }
        return false
    }

    const removeTag = (tagName) => {
        setAvailableTags(availableTags.filter(tag => tag !== tagName))
    }

    const addTagToTask = (taskId, tagName) => {
        setTasks(tasks.map(task => {
            if (task.id === taskId) {
                const tags = task.tags || []
                if (!tags.includes(tagName)) {
                    return { ...task, tags: [...tags, tagName] }
                }
            }
            return task
        }))
    }

    const removeTagFromTask = (taskId, tagName) => {
        setTasks(tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, tags: (task.tags || []).filter(t => t !== tagName) }
            }
            return task
        }))
    }

    const getTagColor = (tagName) => {
        return TAG_COLORS[tagName] || TAG_COLORS.default
    }

    return (
        <TaskContext.Provider value={{
            tasks,
            addTask,
            updateTask,
            deleteTask,
            toggleTaskComplete,
            getTasksByDate,
            getTasksForMonth,
            addSubtask,
            updateSubtask,
            deleteSubtask,
            toggleSubtaskComplete,
            generateRecurringInstances,
            cancelRecurringTask,
            deleteRecurringSeries,
            getAllTasksWithRecurring,
            availableTags,
            addTag,
            removeTag,
            addTagToTask,
            removeTagFromTask,
            getTagColor
        }}>
            {children}
        </TaskContext.Provider>
    )
}

export const useTasks = () => {
    const context = useContext(TaskContext)
    if (!context) {
        throw new Error('useTasks must be used within a TaskProvider')
    }
    return context
}

