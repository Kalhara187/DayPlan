import { createContext, useContext, useState, useEffect } from 'react'

const TaskContext = createContext()

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('dayplan_tasks')
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        localStorage.setItem('dayplan_tasks', JSON.stringify(tasks))
    }, [tasks])

    const addTask = (task) => {
        const newTask = {
            ...task,
            id: Date.now(),
            completed: false,
            subtasks: [],
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
            getAllTasksWithRecurring
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

