import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../navbar/Navbar'
import { useTasks } from '../context/TaskContext'

export default function DayPlan() {
    const { tasks, addTask, deleteTask, toggleTaskComplete, addSubtask, updateSubtask, deleteSubtask, toggleSubtaskComplete, cancelRecurringTask, deleteRecurringSeries, getAllTasksWithRecurring, availableTags, addTag, removeTagFromTask, getTagColor, addAttachmentToTask, removeAttachmentFromTask } = useTasks()
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        priority: 'medium',
        category: 'work',
        isRecurring: false,
        recurrenceType: null,
        recurrenceEndDate: '',
        tags: [],
        attachments: []
    })
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [expandedTasks, setExpandedTasks] = useState({})
    const [newSubtask, setNewSubtask] = useState({})
    const [editingSubtask, setEditingSubtask] = useState({ taskId: null, subtaskId: null })
    const [selectedTags, setSelectedTags] = useState([])
    const [newTagInput, setNewTagInput] = useState('')
    const [previewAttachment, setPreviewAttachment] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/signin')
        }
    }, [navigate])

    const handleAddTask = (e) => {
        e.preventDefault()
        if (newTask.title.trim()) {
            addTask({ ...newTask, date: selectedDate })
            setNewTask({
                title: '',
                description: '',
                startTime: '',
                endTime: '',
                priority: 'medium',
                category: 'work',
                isRecurring: false,
                recurrenceType: null,
                recurrenceEndDate: '',
                tags: [],
                attachments: []
            })
        }
    }

    const handleDeleteTask = (id) => {
        deleteTask(id)
    }

    const handleToggleComplete = (id) => {
        toggleTaskComplete(id)
    }

    const toggleTaskExpanded = (taskId) => {
        setExpandedTasks(prev => ({
            ...prev,
            [taskId]: !prev[taskId]
        }))
    }

    const handleAddSubtask = (taskId, e) => {
        e.preventDefault()
        const subtask = newSubtask[taskId]
        if (subtask && subtask.title && subtask.title.trim()) {
            addSubtask(taskId, {
                title: subtask.title,
                description: subtask.description || ''
            })
            setNewSubtask(prev => ({
                ...prev,
                [taskId]: { title: '', description: '' }
            }))
        }
    }

    const handleDeleteSubtask = (taskId, subtaskId) => {
        deleteSubtask(taskId, subtaskId)
    }

    const handleToggleSubtaskComplete = (taskId, subtaskId) => {
        toggleSubtaskComplete(taskId, subtaskId)
    }

    const handleEditSubtask = (taskId, subtaskId, updates) => {
        updateSubtask(taskId, subtaskId, updates)
        setEditingSubtask({ taskId: null, subtaskId: null })
    }

    const initNewSubtask = (taskId) => {
        if (!newSubtask[taskId]) {
            setNewSubtask(prev => ({
                ...prev,
                [taskId]: { title: '', description: '' }
            }))
        }
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
            case 'medium':
                return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
            case 'low':
                return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
            default:
                return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
        }
    }

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'work':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                )
            case 'personal':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                )
            case 'health':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                )
            case 'study':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                )
            default:
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                )
        }
    }

    const handleAddTagToTask = (tagName) => {
        if (!newTask.tags.includes(tagName)) {
            setNewTask({ ...newTask, tags: [...newTask.tags, tagName] })
        }
    }

    const handleRemoveTagFromNewTask = (tagName) => {
        setNewTask({ ...newTask, tags: newTask.tags.filter(t => t !== tagName) })
    }

    const handleAddNewTag = () => {
        if (newTagInput.trim() && addTag(newTagInput.trim())) {
            handleAddTagToTask(newTagInput.toLowerCase().trim())
            setNewTagInput('')
        }
    }

    const toggleTagFilter = (tagName) => {
        if (selectedTags.includes(tagName)) {
            setSelectedTags(selectedTags.filter(t => t !== tagName))
        } else {
            setSelectedTags([...selectedTags, tagName])
        }
    }

    const clearTagFilters = () => {
        setSelectedTags([])
    }

    const handleFileUpload = async (e, taskId = null) => {
        const files = Array.from(e.target.files)

        for (const file of files) {
            // File size limit: 2MB
            if (file.size > 2 * 1024 * 1024) {
                alert(`File "${file.name}" is too large. Maximum size is 2MB.`)
                continue
            }

            const reader = new FileReader()
            reader.onload = (event) => {
                const attachment = {
                    id: Date.now() + Math.random(),
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    data: event.target.result,
                    uploadedAt: new Date().toISOString()
                }

                if (taskId) {
                    // Add to existing task
                    addAttachmentToTask(taskId, attachment)
                } else {
                    // Add to new task
                    setNewTask(prev => ({
                        ...prev,
                        attachments: [...prev.attachments, attachment]
                    }))
                }
            }
            reader.readAsDataURL(file)
        }
        e.target.value = ''
    }

    const handleRemoveAttachment = (attachmentId, taskId = null) => {
        if (taskId) {
            removeAttachmentFromTask(taskId, attachmentId)
        } else {
            setNewTask(prev => ({
                ...prev,
                attachments: prev.attachments.filter(a => a.id !== attachmentId)
            }))
        }
    }

    const handlePreviewAttachment = (attachment) => {
        setPreviewAttachment(attachment)
    }

    const closePreview = () => {
        setPreviewAttachment(null)
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    const getFileIcon = (type) => {
        if (type.startsWith('image/')) {
            return '🖼️'
        } else if (type.startsWith('video/')) {
            return '🎥'
        } else if (type.includes('pdf')) {
            return '📄'
        } else if (type.includes('word') || type.includes('document')) {
            return '📝'
        } else if (type.includes('sheet') || type.includes('excel')) {
            return '📊'
        } else {
            return '📎'
        }
    }

    const dateTasks = tasks.filter(t => t.date === selectedDate && !t.recurringParentId)
        .concat(
            getAllTasksWithRecurring(selectedDate, selectedDate).filter(t => t.date === selectedDate && t.isRecurringInstance)
        )
        .filter(task => {
            if (selectedTags.length === 0) return true
            return selectedTags.some(tag => (task.tags || []).includes(tag))
        })

    const stats = {
        total: dateTasks.length,
        completed: dateTasks.filter(t => t.completed).length,
        pending: dateTasks.filter(t => !t.completed).length,
        highPriority: dateTasks.filter(t => t.priority === 'high').length
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
                        <h1 className="text-4xl font-bold mb-2">Plan Your Day 📅</h1>
                        <p className="text-blue-100">Organize your tasks and make today productive</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">Total Tasks</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                                </div>
                                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">Completed</p>
                                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
                                </div>
                                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">Pending</p>
                                    <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
                                </div>
                                <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">High Priority</p>
                                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.highPriority}</p>
                                </div>
                                <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Add Task Form */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Task</h2>

                                <form onSubmit={handleAddTask} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Task Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={newTask.title}
                                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            placeholder="Enter task title"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={newTask.description}
                                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                                            placeholder="Task details..."
                                            rows="3"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Start Time
                                            </label>
                                            <input
                                                type="time"
                                                value={newTask.startTime}
                                                onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                End Time
                                            </label>
                                            <input
                                                type="time"
                                                value={newTask.endTime}
                                                onChange={(e) => setNewTask({ ...newTask, endTime: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Priority
                                        </label>
                                        <select
                                            value={newTask.priority}
                                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Category
                                        </label>
                                        <select
                                            value={newTask.category}
                                            onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        >
                                            <option value="work">Work</option>
                                            <option value="personal">Personal</option>
                                            <option value="health">Health</option>
                                            <option value="study">Study</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    {/* Tags Section */}
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Tags 🏷️
                                        </label>

                                        {/* Selected Tags */}
                                        {newTask.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {newTask.tags.map(tag => (
                                                    <span
                                                        key={tag}
                                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTagColor(tag)}`}
                                                    >
                                                        {tag}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveTagFromNewTask(tag)}
                                                            className="ml-1 hover:text-red-600"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Available Tags */}
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {availableTags.filter(tag => !newTask.tags.includes(tag)).map(tag => (
                                                <button
                                                    key={tag}
                                                    type="button"
                                                    onClick={() => handleAddTagToTask(tag)}
                                                    className={`px-2 py-1 rounded-full text-xs font-medium border hover:shadow-md transition-all ${getTagColor(tag)}`}
                                                >
                                                    + {tag}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Add Custom Tag */}
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={newTagInput}
                                                onChange={(e) => setNewTagInput(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNewTag())}
                                                placeholder="Create new tag..."
                                                className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddNewTag}
                                                className="px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>

                                    {/* Recurring Task Options */}
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <input
                                                type="checkbox"
                                                id="isRecurring"
                                                checked={newTask.isRecurring}
                                                onChange={(e) => setNewTask({
                                                    ...newTask,
                                                    isRecurring: e.target.checked,
                                                    recurrenceType: e.target.checked ? 'daily' : null,
                                                    recurrenceEndDate: e.target.checked ? newTask.recurrenceEndDate : ''
                                                })}
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            />
                                            <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                                                🔁 Make this a recurring task
                                            </label>
                                        </div>

                                        {newTask.isRecurring && (
                                            <div className="space-y-3 pl-6 border-l-2 border-blue-500">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Repeat
                                                    </label>
                                                    <select
                                                        value={newTask.recurrenceType || 'daily'}
                                                        onChange={(e) => setNewTask({ ...newTask, recurrenceType: e.target.value })}
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                    >
                                                        <option value="daily">Daily</option>
                                                        <option value="weekly">Weekly</option>
                                                        <option value="monthly">Monthly</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        End Date (optional)
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={newTask.recurrenceEndDate}
                                                        onChange={(e) => setNewTask({ ...newTask, recurrenceEndDate: e.target.value })}
                                                        min={selectedDate}
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                    />
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        Leave empty for indefinite recurrence
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Attachments Section */}
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Attachments 📎
                                        </label>

                                        {/* Display Attached Files */}
                                        {newTask.attachments.length > 0 && (
                                            <div className="space-y-2 mb-3">
                                                {newTask.attachments.map(attachment => (
                                                    <div
                                                        key={attachment.id}
                                                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                                                    >
                                                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                                                            <span className="text-lg">{getFileIcon(attachment.type)}</span>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                                    {attachment.name}
                                                                </p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {formatFileSize(attachment.size)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            {attachment.type.startsWith('image/') && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handlePreviewAttachment(attachment)}
                                                                    className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                                    title="Preview"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                    </svg>
                                                                </button>
                                                            )}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveAttachment(attachment.id)}
                                                                className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                                title="Remove"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* File Upload Input */}
                                        <div className="flex items-center justify-center w-full">
                                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 transition-colors">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <svg className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Max 2MB per file</p>
                                                </div>
                                                <input
                                                    type="file"
                                                    multiple
                                                    onChange={(e) => handleFileUpload(e)}
                                                    className="hidden"
                                                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all transform hover:scale-105"
                                    >
                                        Add Task
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Tasks List */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Schedule</h2>
                                    <div className="flex items-center space-x-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date:</label>
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Tag Filter */}
                                {availableTags.length > 0 && (
                                    <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filter by Tags:</h3>
                                            {selectedTags.length > 0 && (
                                                <button
                                                    onClick={clearTagFilters}
                                                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                                >
                                                    Clear filters
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {availableTags.map(tag => (
                                                <button
                                                    key={tag}
                                                    onClick={() => toggleTagFilter(tag)}
                                                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${selectedTags.includes(tag)
                                                        ? `${getTagColor(tag)} ring-2 ring-blue-500 shadow-md`
                                                        : `${getTagColor(tag)} opacity-50 hover:opacity-100`
                                                        }`}
                                                >
                                                    {selectedTags.includes(tag) ? '✓ ' : ''}{tag}
                                                </button>
                                            ))}
                                        </div>
                                        {selectedTags.length > 0 && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                Showing tasks with {selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {dateTasks.length === 0 ? (
                                    <div className="text-center py-12">
                                        <svg className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                        </svg>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No tasks yet</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Start planning your day by adding your first task!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {dateTasks.map((task) => (
                                            <div
                                                key={task.id}
                                                className={`border-l-4 ${task.completed ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-blue-500 bg-white dark:bg-gray-700'} rounded-lg p-4 shadow hover:shadow-md transition-all`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start space-x-3 flex-1">
                                                        <input
                                                            type="checkbox"
                                                            checked={task.completed}
                                                            onChange={() => handleToggleComplete(task.id)}
                                                            className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                                                                    {task.title}
                                                                </h3>
                                                                {task.subtasks && task.subtasks.length > 0 && (
                                                                    <button
                                                                        onClick={() => toggleTaskExpanded(task.id)}
                                                                        className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                                                    >
                                                                        <svg className={`w-5 h-5 transform transition-transform ${expandedTasks[task.id] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                        </svg>
                                                                    </button>
                                                                )}
                                                            </div>
                                                            {task.description && (
                                                                <p className={`text-sm mt-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                                                    {task.description}
                                                                </p>
                                                            )}
                                                            <div className="flex flex-wrap gap-3 mt-3">
                                                                {(task.startTime || task.endTime) && (
                                                                    <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                        {task.startTime} {task.endTime && `- ${task.endTime}`}
                                                                    </span>
                                                                )}
                                                                <span className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                                                    {task.priority.toUpperCase()}
                                                                </span>
                                                                <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                                    {getCategoryIcon(task.category)}
                                                                    <span className="ml-1 capitalize">{task.category}</span>
                                                                </span>
                                                                {task.subtasks && task.subtasks.length > 0 && (
                                                                    <span className="flex items-center px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                                        </svg>
                                                                        {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks
                                                                    </span>
                                                                )}
                                                                {task.isRecurring && !task.isRecurringInstance && (
                                                                    <span className="flex items-center px-2 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 rounded-full text-xs font-medium">
                                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                                        </svg>
                                                                        {task.recurrenceType?.charAt(0).toUpperCase() + task.recurrenceType?.slice(1)}
                                                                    </span>
                                                                )}
                                                                {task.isRecurringInstance && (
                                                                    <span className="flex items-center px-2 py-1 bg-cyan-50 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 rounded-full text-xs font-medium">
                                                                        🔁 Recurring instance
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Task Tags */}
                                                            {task.tags && task.tags.length > 0 && (
                                                                <div className="flex flex-wrap gap-2 mt-3">
                                                                    {task.tags.map(tag => (
                                                                        <span
                                                                            key={tag}
                                                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTagColor(tag)}`}
                                                                        >
                                                                            🏷️ {tag}
                                                                            {!task.isRecurringInstance && (
                                                                                <button
                                                                                    onClick={() => removeTagFromTask(task.id, tag)}
                                                                                    className="ml-1 hover:text-red-600 dark:hover:text-red-400"
                                                                                    title="Remove tag"
                                                                                >
                                                                                    ×
                                                                                </button>
                                                                            )}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {/* Task Attachments */}
                                                            {task.attachments && task.attachments.length > 0 && (
                                                                <div className="mt-3">
                                                                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                                                        Attachments ({task.attachments.length}):
                                                                    </p>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {task.attachments.map(attachment => (
                                                                            <div
                                                                                key={attachment.id}
                                                                                className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs border border-gray-300 dark:border-gray-600"
                                                                            >
                                                                                <span>{getFileIcon(attachment.type)}</span>
                                                                                <span className="text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
                                                                                    {attachment.name}
                                                                                </span>
                                                                                <div className="flex items-center space-x-1">
                                                                                    {attachment.type.startsWith('image/') && (
                                                                                        <button
                                                                                            onClick={() => handlePreviewAttachment(attachment)}
                                                                                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                                                                            title="Preview"
                                                                                        >
                                                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                                            </svg>
                                                                                        </button>
                                                                                    )}
                                                                                    {!task.isRecurringInstance && (
                                                                                        <button
                                                                                            onClick={() => handleRemoveAttachment(attachment.id, task.id)}
                                                                                            className="text-red-600 hover:text-red-700 dark:text-red-400"
                                                                                            title="Remove"
                                                                                        >
                                                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                                            </svg>
                                                                                        </button>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    {!task.isRecurringInstance && (
                                                                        <label className="mt-2 inline-flex items-center px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                                                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                            </svg>
                                                                            Add file
                                                                            <input
                                                                                type="file"
                                                                                multiple
                                                                                onChange={(e) => handleFileUpload(e, task.id)}
                                                                                className="hidden"
                                                                                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                                                                            />
                                                                        </label>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {/* Subtasks Section */}
                                                            {expandedTasks[task.id] && (
                                                                <div className="mt-4 pl-4 border-l-2 border-gray-300 dark:border-gray-600 space-y-2">
                                                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Subtasks:</h4>

                                                                    {/* Existing Subtasks */}
                                                                    {task.subtasks && task.subtasks.length > 0 && (
                                                                        <div className="space-y-2">
                                                                            {task.subtasks.map((subtask) => (
                                                                                <div key={subtask.id} className="flex items-start space-x-2 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={subtask.completed}
                                                                                        onChange={() => handleToggleSubtaskComplete(task.id, subtask.id)}
                                                                                        className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                                                                                    />
                                                                                    {editingSubtask.taskId === task.id && editingSubtask.subtaskId === subtask.id ? (
                                                                                        <div className="flex-1 space-y-1">
                                                                                            <input
                                                                                                type="text"
                                                                                                defaultValue={subtask.title}
                                                                                                onBlur={(e) => handleEditSubtask(task.id, subtask.id, { title: e.target.value })}
                                                                                                onKeyPress={(e) => {
                                                                                                    if (e.key === 'Enter') {
                                                                                                        handleEditSubtask(task.id, subtask.id, { title: e.target.value })
                                                                                                    }
                                                                                                }}
                                                                                                autoFocus
                                                                                                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                                                            />
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="flex-1">
                                                                                            <p className={`text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
                                                                                                {subtask.title}
                                                                                            </p>
                                                                                            {subtask.description && (
                                                                                                <p className={`text-xs mt-1 ${subtask.completed ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                                                                                    {subtask.description}
                                                                                                </p>
                                                                                            )}
                                                                                        </div>
                                                                                    )}
                                                                                    <div className="flex space-x-1">
                                                                                        <button
                                                                                            onClick={() => setEditingSubtask({ taskId: task.id, subtaskId: subtask.id })}
                                                                                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                                                        >
                                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                                            </svg>
                                                                                        </button>
                                                                                        <button
                                                                                            onClick={() => handleDeleteSubtask(task.id, subtask.id)}
                                                                                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                                                        >
                                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                                            </svg>
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}

                                                                    {/* Add New Subtask Form */}
                                                                    <form onSubmit={(e) => handleAddSubtask(task.id, e)} className="mt-3">
                                                                        <div className="flex flex-col space-y-2">
                                                                            <input
                                                                                type="text"
                                                                                value={newSubtask[task.id]?.title || ''}
                                                                                onChange={(e) => setNewSubtask(prev => ({
                                                                                    ...prev,
                                                                                    [task.id]: { ...prev[task.id], title: e.target.value }
                                                                                }))}
                                                                                onFocus={() => initNewSubtask(task.id)}
                                                                                placeholder="Add a subtask..."
                                                                                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                                            />
                                                                            {newSubtask[task.id]?.title && (
                                                                                <>
                                                                                    <input
                                                                                        type="text"
                                                                                        value={newSubtask[task.id]?.description || ''}
                                                                                        onChange={(e) => setNewSubtask(prev => ({
                                                                                            ...prev,
                                                                                            [task.id]: { ...prev[task.id], description: e.target.value }
                                                                                        }))}
                                                                                        placeholder="Description (optional)"
                                                                                        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                                                    />
                                                                                    <button
                                                                                        type="submit"
                                                                                        className="px-3 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
                                                                                    >
                                                                                        Add Subtask
                                                                                    </button>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                            )}

                                                            {/* Toggle Subtasks Button when collapsed */}
                                                            {!expandedTasks[task.id] && task.subtasks && task.subtasks.length === 0 && (
                                                                <button
                                                                    onClick={() => toggleTaskExpanded(task.id)}
                                                                    className="mt-3 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center"
                                                                >
                                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                    </svg>
                                                                    Add subtasks
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4 flex items-center space-x-2">
                                                        {task.isRecurring && !task.isRecurringInstance && (
                                                            <div className="relative group">
                                                                <button className="p-1 text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors">
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                                    </svg>
                                                                </button>
                                                                <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                                                                    <button
                                                                        onClick={() => cancelRecurringTask(task.id)}
                                                                        className="flex items-center w-full px-4 py-2 text-sm text-orange-600 dark:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                    >
                                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                                        </svg>
                                                                        Cancel Recurrence
                                                                    </button>
                                                                    <button
                                                                        onClick={() => deleteRecurringSeries(task.id)}
                                                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                    >
                                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                        </svg>
                                                                        Delete Series
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteTask(task.id)}
                                                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Attachment Preview Modal */}
            {previewAttachment && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
                    onClick={closePreview}
                >
                    <div
                        className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl">{getFileIcon(previewAttachment.type)}</span>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {previewAttachment.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {formatFileSize(previewAttachment.size)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closePreview}
                                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 max-h-[calc(90vh-100px)] overflow-auto">
                            {previewAttachment.type.startsWith('image/') ? (
                                <img
                                    src={previewAttachment.data}
                                    alt={previewAttachment.name}
                                    className="max-w-full h-auto mx-auto"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <span className="text-6xl mb-4">{getFileIcon(previewAttachment.type)}</span>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        Preview not available for this file type
                                    </p>
                                    <a
                                        href={previewAttachment.data}
                                        download={previewAttachment.name}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Download File
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
