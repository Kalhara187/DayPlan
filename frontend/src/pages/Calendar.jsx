import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../navbar/Navbar'
import { useTasks } from '../context/TaskContext'

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(null)
    const { tasks, toggleTaskComplete, deleteTask, toggleSubtaskComplete, getAllTasksWithRecurring } = useTasks()
    const navigate = useNavigate()

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()

    const previousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1))
    }

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1))
    }

    const goToToday = () => {
        setCurrentDate(new Date())
        setSelectedDate(new Date().toISOString().split('T')[0])
    }

    const getTasksForDate = (date) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
        // Get both regular tasks and recurring instances for this date
        const allTasks = getAllTasksWithRecurring(dateStr, dateStr)
        return allTasks.filter(task => task.date === dateStr)
    }

    const handleDateClick = (date) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
        setSelectedDate(dateStr)
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-500'
            case 'medium':
                return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-500'
            case 'low':
                return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-500'
            default:
                return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-500'
        }
    }

    const selectedDateTasks = selectedDate ? getAllTasksWithRecurring(selectedDate, selectedDate).filter(task => task.date === selectedDate) : []

    const renderCalendarDays = () => {
        const days = []
        const today = new Date()
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(
                <div key={`empty-${i}`} className="aspect-square p-2 bg-gray-50 dark:bg-gray-800/50"></div>
            )
        }

        // Days of the month
        for (let date = 1; date <= daysInMonth; date++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
            const dayTasks = getTasksForDate(date)
            const isToday = dateStr === todayStr
            const isSelected = dateStr === selectedDate

            days.push(
                <div
                    key={date}
                    onClick={() => handleDateClick(date)}
                    className={`aspect-square p-2 border-2 cursor-pointer transition-all hover:border-blue-400 dark:hover:border-blue-500 ${isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                        } ${isToday ? 'ring-2 ring-purple-500' : ''}`}
                >
                    <div className="h-full flex flex-col">
                        <div className={`text-sm font-semibold mb-1 ${isToday
                            ? 'text-purple-600 dark:text-purple-400'
                            : 'text-gray-900 dark:text-white'
                            }`}>
                            {date}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            {dayTasks.length > 0 && (
                                <div className="space-y-1">
                                    {dayTasks.slice(0, 2).map(task => (
                                        <div
                                            key={task.id}
                                            className={`text-xs px-1 py-0.5 rounded truncate ${task.priority === 'high'
                                                ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                                                : task.priority === 'medium'
                                                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                                                    : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                                                } ${task.isRecurringInstance ? 'border-l-2 border-cyan-500' : ''}`}
                                        >
                                            {task.isRecurringInstance ? '🔁 ' : ''}{task.completed ? '✓ ' : ''}{task.title}
                                        </div>
                                    ))}
                                    {dayTasks.length > 2 && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            +{dayTasks.length - 2} more
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )
        }

        return days
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
                        <h1 className="text-4xl font-bold mb-2">Calendar View 📅</h1>
                        <p className="text-purple-100">Visualize your tasks and plan ahead</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Calendar */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                                {/* Calendar Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {monthNames[month]} {year}
                                    </h2>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={goToToday}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                        >
                                            Today
                                        </button>
                                        <button
                                            onClick={previousMonth}
                                            className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={nextMonth}
                                            className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Weekday Headers */}
                                <div className="grid grid-cols-7 gap-2 mb-2">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                        <div key={day} className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7 gap-2">
                                    {renderCalendarDays()}
                                </div>

                                {/* Legend */}
                                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 rounded ring-2 ring-purple-500"></div>
                                            <span className="text-gray-600 dark:text-gray-400">Today</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 bg-red-100 dark:bg-red-900 rounded"></div>
                                            <span className="text-gray-600 dark:text-gray-400">High Priority</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 bg-yellow-100 dark:bg-yellow-900 rounded"></div>
                                            <span className="text-gray-600 dark:text-gray-400">Medium Priority</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 bg-green-100 dark:bg-green-900 rounded"></div>
                                            <span className="text-gray-600 dark:text-gray-400">Low Priority</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Selected Date Tasks */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    {selectedDate ? (
                                        <>
                                            Tasks for {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </>
                                    ) : (
                                        'Select a date'
                                    )}
                                </h3>

                                {selectedDate ? (
                                    selectedDateTasks.length > 0 ? (
                                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                            {selectedDateTasks.map(task => (
                                                <div
                                                    key={task.id}
                                                    className={`border-l-4 ${task.completed
                                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                                        : 'border-blue-500 bg-white dark:bg-gray-700'
                                                        } rounded-lg p-3 shadow-sm`}
                                                >
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex items-start space-x-2 flex-1">
                                                            <input
                                                                type="checkbox"
                                                                checked={task.completed}
                                                                onChange={() => toggleTaskComplete(task.id)}
                                                                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                            />
                                                            <div className="flex-1">
                                                                <h4 className={`font-semibold ${task.completed
                                                                    ? 'line-through text-gray-500'
                                                                    : 'text-gray-900 dark:text-white'
                                                                    }`}>
                                                                    {task.title}
                                                                </h4>
                                                                {task.description && (
                                                                    <p className={`text-sm mt-1 ${task.completed
                                                                        ? 'line-through text-gray-400'
                                                                        : 'text-gray-600 dark:text-gray-400'
                                                                        }`}>
                                                                        {task.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => deleteTask(task.id)}
                                                            className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {(task.startTime || task.endTime) && (
                                                            <span className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                {task.startTime} {task.endTime && `- ${task.endTime}`}
                                                            </span>
                                                        )}
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                                            {task.priority.toUpperCase()}
                                                        </span>
                                                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-xs capitalize">
                                                            {task.category}
                                                        </span>
                                                        {task.subtasks && task.subtasks.length > 0 && (
                                                            <span className="flex items-center px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                                </svg>
                                                                {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
                                                            </span>
                                                        )}
                                                        {task.isRecurring && !task.isRecurringInstance && (
                                                            <span className="flex items-center px-2 py-0.5 bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 rounded-full text-xs font-medium">
                                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                                </svg>
                                                                {task.recurrenceType}
                                                            </span>
                                                        )}
                                                        {task.isRecurringInstance && (
                                                            <span className="flex items-center px-2 py-0.5 bg-cyan-50 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 rounded-full text-xs font-medium">
                                                                🔁 Recurring
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Subtasks */}
                                                    {task.subtasks && task.subtasks.length > 0 && (
                                                        <div className="mt-3 pl-3 border-l-2 border-gray-300 dark:border-gray-600 space-y-1">
                                                            {task.subtasks.map((subtask) => (
                                                                <div key={subtask.id} className="flex items-start space-x-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={subtask.completed}
                                                                        onChange={() => toggleSubtaskComplete(task.id, subtask.id)}
                                                                        className="mt-1 h-3 w-3 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                                                                    />
                                                                    <div className="flex-1">
                                                                        <p className={`text-xs ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                                                                            {subtask.title}
                                                                        </p>
                                                                        {subtask.description && (
                                                                            <p className={`text-xs ${subtask.completed ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                                                                {subtask.description}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-gray-600 dark:text-gray-400">No tasks for this day</p>
                                            <button
                                                onClick={() => navigate('/dayplan')}
                                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                            >
                                                Add Task
                                            </button>
                                        </div>
                                    )
                                ) : (
                                    <div className="text-center py-8">
                                        <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                        </svg>
                                        <p className="text-gray-600 dark:text-gray-400">Click on a date to view tasks</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
