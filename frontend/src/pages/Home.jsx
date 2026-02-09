import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../navbar/Navbar'

export default function Home() {
    const [user] = useState(() => {
        const userData = localStorage.getItem('user')
        return userData ? JSON.parse(userData) : null
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
    }, [navigate])

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
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Tasks</h3>
                                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">No tasks yet</p>
                        </div>

                        {/* Completed Tasks */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Completed</h3>
                                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Great start!</p>
                        </div>

                        {/* Upcoming Events */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming</h3>
                                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">This week</p>
                        </div>

                        {/* Productivity Score */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Productivity</h3>
                                <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">100%</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Keep it up!</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Activity */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-center py-12">
                                    <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
                                </div>
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
        </>
    )
}
