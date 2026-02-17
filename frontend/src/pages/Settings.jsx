import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../navbar/Navbar'
import Footer from '../components/Footer'
import api from '../services/api'
import { useTheme } from '../context/ThemeContext'

export default function Settings() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ text: '', type: '' })
    const navigate = useNavigate()
    const { isDark, toggleTheme } = useTheme()

    // Active tab state
    const [activeTab, setActiveTab] = useState('profile')

    // Profile state
    const [profile, setProfile] = useState({
        fullName: '',
        email: ''
    })

    // Password state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    // Notification state
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: false,
        notificationTime: '09:00',
        notificationEmail: ''
    })

    // Preferences state
    const [preferences, setPreferences] = useState({
        startOfWeek: 'monday',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12',
        language: 'en'
    })

    // Delete account state
    const [deletePassword, setDeletePassword] = useState('')
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/signin')
            return
        }

        fetchUserData()
        fetchNotificationSettings()
        loadPreferences()
    }, [navigate])

    const loadPreferences = () => {
        const savedPrefs = localStorage.getItem('userPreferences')
        if (savedPrefs) {
            setPreferences(JSON.parse(savedPrefs))
        }
    }

    const savePreferences = (newPrefs) => {
        setPreferences(newPrefs)
        localStorage.setItem('userPreferences', JSON.stringify(newPrefs))
        setMessage({ text: 'Preferences saved successfully!', type: 'success' })
    }

    const fetchUserData = async () => {
        try {
            const response = await api.get('/user/profile')
            if (response.data.status === 'success') {
                const userData = response.data.data.user
                setUser(userData)
                setProfile({
                    fullName: userData.fullName,
                    email: userData.email
                })
            }
        } catch (error) {
            console.error('Error fetching user data:', error)
        }
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

    const handleProfileUpdate = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ text: '', type: '' })

        try {
            const response = await api.put('/user/profile', profile)
            if (response.data.status === 'success') {
                setMessage({ text: 'Profile updated successfully!', type: 'success' })
                localStorage.setItem('user', JSON.stringify(response.data.data.user))
                setUser(response.data.data.user)
            }
        } catch (error) {
            setMessage({
                text: error.response?.data?.message || 'Failed to update profile',
                type: 'error'
            })
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ text: '', type: '' })

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ text: 'Passwords do not match', type: 'error' })
            setLoading(false)
            return
        }

        try {
            const response = await api.put('/user/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            })
            if (response.data.status === 'success') {
                setMessage({ text: 'Password changed successfully!', type: 'success' })
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
            }
        } catch (error) {
            setMessage({
                text: error.response?.data?.message || 'Failed to change password',
                type: 'error'
            })
        } finally {
            setLoading(false)
        }
    }

    const handleNotificationToggle = async () => {
        setLoading(true)
        try {
            const newValue = !notificationSettings.emailNotifications
            const response = await api.put('/notifications/settings', {
                emailNotifications: newValue
            })
            if (response.data.status === 'success') {
                setNotificationSettings(prev => ({ ...prev, emailNotifications: newValue }))
                setMessage({
                    text: newValue ? 'Email notifications enabled!' : 'Email notifications disabled',
                    type: 'success'
                })
            }
        } catch (error) {
            console.error('Error updating notification settings:', error)
            setMessage({ text: 'Failed to update notification settings', type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    const handleNotificationTimeChange = async (e) => {
        const newTime = e.target.value
        setNotificationSettings(prev => ({ ...prev, notificationTime: newTime }))
        try {
            await api.put('/notifications/settings', { notificationTime: newTime })
            setMessage({ text: 'Notification time updated!', type: 'success' })
        } catch (error) {
            console.error('Error updating notification time:', error)
        }
    }

    const handleNotificationEmailChange = (e) => {
        setNotificationSettings(prev => ({ ...prev, notificationEmail: e.target.value }))
    }

    const handleNotificationEmailBlur = async () => {
        try {
            await api.put('/notifications/settings', {
                notificationEmail: notificationSettings.notificationEmail
            })
            setMessage({ text: 'Notification email updated!', type: 'success' })
        } catch (error) {
            console.error('Error updating notification email:', error)
        }
    }

    const handleSendTestEmail = async () => {
        setLoading(true)
        try {
            const response = await api.post('/notifications/test')
            if (response.data.status === 'success') {
                setMessage({ text: `Test email sent to ${response.data.data.sentTo}!`, type: 'success' })
            }
        } catch (error) {
            console.error('Error sending test email:', error)
            setMessage({ text: 'Failed to send test email', type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteAccount = async () => {
        setLoading(true)
        setMessage({ text: '', type: '' })

        try {
            const response = await api.delete('/user/account', {
                data: { password: deletePassword }
            })
            if (response.data.status === 'success') {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                navigate('/signin')
            }
        } catch (error) {
            setMessage({
                text: error.response?.data?.message || 'Failed to delete account',
                type: 'error'
            })
        } finally {
            setLoading(false)
            setShowDeleteModal(false)
            setDeletePassword('')
        }
    }

    useEffect(() => {
        if (message.text) {
            const timer = setTimeout(() => setMessage({ text: '', type: '' }), 5000)
            return () => clearTimeout(timer)
        }
    }, [message])

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
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
                        <p className="text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
                    </div>

                    {/* Success/Error Message */}
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    {/* Tab Navigation */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-6 overflow-hidden">
                        <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`px-6 py-4 font-semibold transition-colors ${activeTab === 'profile'
                                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                👤 Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`px-6 py-4 font-semibold transition-colors ${activeTab === 'security'
                                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                🔒 Security
                            </button>
                            <button
                                onClick={() => setActiveTab('notifications')}
                                className={`px-6 py-4 font-semibold transition-colors ${activeTab === 'notifications'
                                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                📧 Notifications
                            </button>
                            <button
                                onClick={() => setActiveTab('preferences')}
                                className={`px-6 py-4 font-semibold transition-colors ${activeTab === 'preferences'
                                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                ⚙️ Preferences
                            </button>
                            <button
                                onClick={() => setActiveTab('danger')}
                                className={`px-6 py-4 font-semibold transition-colors ${activeTab === 'danger'
                                    ? 'text-red-600 dark:text-red-400 border-b-2 border-red-600 dark:border-red-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                ⚠️ Danger Zone
                            </button>
                        </div>
                    </div>

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Information</h2>
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.fullName}
                                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div className="pt-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Member Since
                                    </label>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 'N/A'}
                                    </p>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Change Password</h2>
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        minLength={6}
                                        required
                                    />
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                        Must be at least 6 characters long
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        minLength={6}
                                        required
                                    />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
                                    >
                                        {loading ? 'Changing...' : 'Change Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Email Notifications</h2>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <div>
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
                                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${notificationSettings.emailNotifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${notificationSettings.emailNotifications ? 'translate-x-7' : 'translate-x-1'
                                            }`} />
                                    </button>
                                </div>

                                {notificationSettings.emailNotifications && (
                                    <>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                            <label className="block font-semibold text-gray-900 dark:text-white mb-3">
                                                Notification Time
                                            </label>
                                            <input
                                                type="time"
                                                value={notificationSettings.notificationTime}
                                                onChange={handleNotificationTimeChange}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                        </div>

                                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                            <label className="block font-semibold text-gray-900 dark:text-white mb-3">
                                                Notification Email (Optional)
                                            </label>
                                            <input
                                                type="email"
                                                value={notificationSettings.notificationEmail}
                                                onChange={handleNotificationEmailChange}
                                                onBlur={handleNotificationEmailBlur}
                                                placeholder={user?.email || "your.email@example.com"}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                                Leave empty to use your account email
                                            </p>
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                onClick={handleSendTestEmail}
                                                disabled={loading}
                                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
                                            >
                                                {loading ? 'Sending...' : 'Send Test Email'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === 'preferences' && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">App Preferences</h2>
                            <div className="space-y-6">
                                {/* Theme Toggle */}
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                🌙 Dark Mode
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Toggle between light and dark theme
                                            </p>
                                        </div>
                                        <button
                                            onClick={toggleTheme}
                                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${isDark ? 'bg-blue-600' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isDark ? 'translate-x-7' : 'translate-x-1'
                                                }`} />
                                        </button>
                                    </div>
                                </div>

                                {/* Start of Week */}
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <label className="block font-semibold text-gray-900 dark:text-white mb-3">
                                        📅 Start of Week
                                    </label>
                                    <select
                                        value={preferences.startOfWeek}
                                        onChange={(e) => savePreferences({ ...preferences, startOfWeek: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="sunday">Sunday</option>
                                        <option value="monday">Monday</option>
                                        <option value="saturday">Saturday</option>
                                    </select>
                                </div>

                                {/* Date Format */}
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <label className="block font-semibold text-gray-900 dark:text-white mb-3">
                                        📆 Date Format
                                    </label>
                                    <select
                                        value={preferences.dateFormat}
                                        onChange={(e) => savePreferences({ ...preferences, dateFormat: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2026)</option>
                                        <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2026)</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD (2026-12-31)</option>
                                    </select>
                                </div>

                                {/* Time Format */}
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <label className="block font-semibold text-gray-900 dark:text-white mb-3">
                                        🕐 Time Format
                                    </label>
                                    <select
                                        value={preferences.timeFormat}
                                        onChange={(e) => savePreferences({ ...preferences, timeFormat: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="12">12-hour (3:45 PM)</option>
                                        <option value="24">24-hour (15:45)</option>
                                    </select>
                                </div>

                                {/* Language */}
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <label className="block font-semibold text-gray-900 dark:text-white mb-3">
                                        🌐 Language
                                    </label>
                                    <select
                                        value={preferences.language}
                                        onChange={(e) => savePreferences({ ...preferences, language: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="en">English</option>
                                        <option value="es">Español</option>
                                        <option value="fr">Français</option>
                                        <option value="de">Deutsch</option>
                                        <option value="it">Italiano</option>
                                        <option value="pt">Português</option>
                                        <option value="ja">日本語</option>
                                        <option value="zh">中文</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Danger Zone Tab */}
                    {activeTab === 'danger' && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-2 border-red-200 dark:border-red-900">
                            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-6">Danger Zone</h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                        Delete Your Account
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        Once you delete your account, there is no going back. Please be certain. This will:
                                    </p>
                                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 mb-4">
                                        <li>Permanently delete your profile and account data</li>
                                        <li>Remove all your tasks and day plans</li>
                                        <li>Cancel email notifications</li>
                                        <li>Cannot be undone</li>
                                    </ul>
                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                                    >
                                        Delete My Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">⚠️ Confirm Account Deletion</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            This action cannot be undone. All your data will be permanently deleted. Please enter your password to confirm.
                        </p>
                        <input
                            type="password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
                        />
                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false)
                                    setDeletePassword('')
                                }}
                                className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={loading || !deletePassword}
                                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
                            >
                                {loading ? 'Deleting...' : 'Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </>
    )
}