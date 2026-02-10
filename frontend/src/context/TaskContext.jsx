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

    return (
        <TaskContext.Provider value={{
            tasks,
            addTask,
            updateTask,
            deleteTask,
            toggleTaskComplete,
            getTasksByDate,
            getTasksForMonth
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

