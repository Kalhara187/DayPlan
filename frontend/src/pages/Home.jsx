import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../navbar/Navbar'
import Footer from '../components/Footer'
import HealthBot from '../components/HealthBot'
import api from '../services/api'

export default function Home() {
    const [user] = useState(() => {
        const userData = localStorage.getItem('user')
        return userData ? JSON.parse(userData) : null
    })
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: false,
        notificationTime: '09:00',
        notificationEmail: ''
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ text: '', type: '' })
    const [tasks, setTasks] = useState([])
    const [taskStats, setTaskStats] = useState({
        todayTasks: 0,
        completedTasks: 0,
        upcomingTasks: 0,
        productivityScore: 0
    })
    const navigate = useNavigate()

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token')

        if (!token) {
            // Redirect to signin if not authenticated
            navigate('/signin')
            return
        }

        // Fetch notification settings and tasks
        fetchNotificationSettings()
        fetchTasks()
    }, [navigate])

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks')
            if (response.data.status === 'success') {
                const allTasks = response.data.data
                setTasks(allTasks)
                calculateTaskStats(allTasks)
            }
        } catch (error) {
            console.error('Error fetching tasks:', error)
        }
    }

    const calculateTaskStats = (allTasks) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const todayStr = today.toISOString().split('T')[0]
        
        // Today's tasks - tasks with today's date
        const todayTasks = allTasks.filter(task => task.date === todayStr)
        
        // Completed tasks - all completed tasks
        const completedTasks = allTasks.filter(task => task.completed)
        
        // Upcoming tasks - tasks with future dates (not today, not completed)
        const upcomingTasks = allTasks.filter(task => {
            const taskDate = new Date(task.date)
            taskDate.setHours(0, 0, 0, 0)
            return taskDate > today && !task.completed
        })
        
        // Calculate productivity score
        const totalTasks = allTasks.length
        const completedCount = completedTasks.length
        const productivityScore = totalTasks > 0 
            ? Math.round((completedCount / totalTasks) * 100) 
            : 100

        setTaskStats({
            todayTasks: todayTasks.length,
            completedTasks: completedCount,
            upcomingTasks: upcomingTasks.length,
            productivityScore
        })
    }

    const fetchNotificationSettings = async () => {
        try {
            const response = await api.get('/notifications/settings')
            if (response.data.status === 'success') {
                setNotificationSettings(response.data.data)
            }
        } catch (error) {
            console.error('Error fetching notification settings:', error)
        }
    }

    const handleNotificationToggle = async () => {
        setLoading(true)
        setMessage({ text: '', type: '' })

        try {
            const newValue = !notificationSettings.emailNotifications
            const response = await api.put('/notifications/settings', {
                emailNotifications: newValue
            })

            if (response.data.status === 'success') {
                setNotificationSettings(prev => ({
                    ...prev,
                    emailNotifications: newValue
                }))
                setMessage({
                    text: newValue ? 'Email notifications enabled!' : 'Email notifications disabled',
                    type: 'success'
                })
            }
        } catch (error) {
            console.error('Error updating notification settings:', error)
            setMessage({
                text: 'Failed to update notification settings',
                type: 'error'
            })
        } finally {
            setLoading(false)
        }
    }

    const handleTimeChange = async (e) => {
        const newTime = e.target.value
        setNotificationSettings(prev => ({ ...prev, notificationTime: newTime }))

        try {
            await api.put('/notifications/settings', {
                notificationTime: newTime
            })
            setMessage({
                text: 'Notification time updated!',
                type: 'success'
            })
        } catch (error) {
            console.error('Error updating notification time:', error)
            setMessage({
                text: 'Failed to update notification time',
                type: 'error'
            })
        }
    }

    const handleEmailChange = async (e) => {
        const newEmail = e.target.value
        setNotificationSettings(prev => ({ ...prev, notificationEmail: newEmail }))
    }

    const handleEmailBlur = async () => {
        try {
            await api.put('/notifications/settings', {
                notificationEmail: notificationSettings.notificationEmail
            })
            setMessage({
                text: 'Notification email updated!',
                type: 'success'
            })
        } catch (error) {
            console.error('Error updating notification email:', error)
            setMessage({
                text: 'Failed to update notification email',
                type: 'error'
            })
        }
    }

    const handleSendTestEmail = async () => {
        setLoading(true)
        setMessage({ text: '', type: '' })

        try {
            const response = await api.post('/notifications/test')
            if (response.data.status === 'success') {
                setMessage({
                    text: `Test email sent to ${response.data.data.sentTo}!`,
                    type: 'success'
                })
            }
        } catch (error) {
            console.error('Error sending test email:', error)
            setMessage({
                text: 'Failed to send test email. Check your email configuration.',
                type: 'error'
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (message.text) {
            const timer = setTimeout(() => {
                setMessage({ text: '', type: '' })
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [message])

    const getCurrentDate = () => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
        return new Date().toLocaleDateString('en-US', options)
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-gray-600 dark:text-gray-400">Loading...</div>
            </div>
        )
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Welcome Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Welcome back, {user.fullName}! 👋
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {getCurrentDate()}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Today's Tasks */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                             onClick={() => navigate('/dayplan')}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Tasks</h3>
                                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{taskStats.todayTasks}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                {taskStats.todayTasks === 0 ? 'No tasks yet' : `${taskStats.todayTasks} task${taskStats.todayTasks !== 1 ? 's' : ''} today`}
                            </p>
                        </div>

                        {/* Completed Tasks */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                             onClick={() => navigate('/tasks')}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Completed</h3>
                                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{taskStats.completedTasks}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                {taskStats.completedTasks === 0 ? 'Great start!' : `${taskStats.completedTasks} task${taskStats.completedTasks !== 1 ? 's' : ''} done`}
                            </p>
                        </div>

                        {/* Upcoming Events */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                             onClick={() => navigate('/calendar')}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming</h3>
                                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{taskStats.upcomingTasks}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                {taskStats.upcomingTasks === 0 ? 'All caught up' : 'Future tasks'}
                            </p>
                        </div>

                        {/* Productivity Score */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                             onClick={() => navigate('/reports')}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Productivity</h3>
                                <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{taskStats.productivityScore}%</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Keep it up!</p>
                        </div>
                    </div>

                    {/* Email Notification Settings */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                    📧 Daily Task Notifications
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Get daily reminders via email to stay on top of your tasks
                                </p>
                            </div>
                        </div>

                        {/* Success/Error Message */}
                        {message.text && (
                            <div className={`mb-4 p-4 rounded-lg ${message.type === 'success'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                }`}>
                                {message.text}
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Enable/Disable Toggle */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                        Enable Email Notifications
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Receive daily task reminders in your inbox
                                    </p>
                                </div>
                                <button
                                    onClick={handleNotificationToggle}
                                    disabled={loading}
                                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${notificationSettings.emailNotifications
                                        ? 'bg-blue-600'
                                        : 'bg-gray-300 dark:bg-gray-600'
                                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span
                                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${notificationSettings.emailNotifications ? 'translate-x-7' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Notification Time */}
                            {notificationSettings.emailNotifications && (
                                <>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                        <label className="block font-semibold text-gray-900 dark:text-white mb-3">
                                            Notification Time
                                        </label>
                                        <input
                                            type="time"
                                            value={notificationSettings.notificationTime}
                                            onChange={handleTimeChange}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        />
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                            Choose when you'd like to receive your daily reminder
                                        </p>
                                    </div>

                                    {/* Notification Email */}
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                        <label className="block font-semibold text-gray-900 dark:text-white mb-3">
                                            Notification Email (Optional)
                                        </label>
                                        <input
                                            type="email"
                                            value={notificationSettings.notificationEmail}
                                            onChange={handleEmailChange}
                                            onBlur={handleEmailBlur}
                                            placeholder={user?.email || "your.email@example.com"}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                                        />
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                            Leave empty to use your account email ({user?.email})
                                        </p>
                                    </div>

                                    {/* Send Test Email */}
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleSendTestEmail}
                                            disabled={loading}
                                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            {loading ? 'Sending...' : 'Send Test Email'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Activity */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Tasks</h2>
                            <div className="space-y-4">
                                {tasks.length === 0 ? (
                                    <div className="flex items-center justify-center py-12">
                                        <p className="text-gray-500 dark:text-gray-400">No tasks yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {tasks.slice(0, 5).map((task) => (
                                            <div 
                                                key={task.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                                onClick={() => navigate('/dayplan')}
                                            >
                                                <div className="flex items-center space-x-3 flex-1">
                                                    <div className={`flex-shrink-0 w-2 h-2 rounded-full ${
                                                        task.completed 
                                                            ? 'bg-green-500' 
                                                            : task.priority === 'high' 
                                                            ? 'bg-red-500' 
                                                            : task.priority === 'medium' 
                                                            ? 'bg-yellow-500' 
                                                            : 'bg-blue-500'
                                                    }`}></div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-medium truncate ${
                                                            task.completed 
                                                                ? 'text-gray-500 dark:text-gray-400 line-through' 
                                                                : 'text-gray-900 dark:text-white'
                                                        }`}>
                                                            {task.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {new Date(task.date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                {task.completed && (
                                                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                        ))}
                                        {tasks.length > 5 && (
                                            <button 
                                                onClick={() => navigate('/tasks')}
                                                className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:underline py-2"
                                            >
                                                View all tasks →
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => navigate('/tasks')}
                                    className="flex flex-col items-center justify-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                >
                                    <svg className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">New Task</span>
                                </button>

                                <button
                                    onClick={() => navigate('/calendar')}
                                    className="flex flex-col items-center justify-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
                                >
                                    <svg className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Calendar</span>
                                </button>

                                <button
                                    onClick={() => navigate('/reports')}
                                    className="flex flex-col items-center justify-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                                >
                                    <svg className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Reports</span>
                                </button>

                                <button
                                    onClick={() => navigate('/settings')}
                                    className="flex flex-col items-center justify-center p-6 bg-orange-50 dark:bg-orange-900/20 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors"
                                >
                                    <svg className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Settings</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <HealthBot />
            <Footer />
        </>
    )
}
