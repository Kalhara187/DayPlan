import { useState, useRef, useEffect } from 'react'

export default function HealthBot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi! I'm your AI Health Assistant 🏥. I can help you with health tips, wellness advice, and general health information. How can I assist you today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ])
    const [inputText, setInputText] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    // Health knowledge base
    const getHealthResponse = (message) => {
        const lowerMessage = message.toLowerCase()

        // Greetings
        if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
            return "Hello! 👋 How can I help you with your health today?"
        }

        // Headache
        if (lowerMessage.includes('headache') || lowerMessage.includes('head pain')) {
            return "For headaches, I recommend:\n\n💧 Stay hydrated - drink plenty of water\n😌 Rest in a quiet, dark room\n🧊 Apply a cold compress to your forehead\n🧘 Practice relaxation techniques\n\n⚠️ If headaches are severe or persistent, please consult a healthcare professional."
        }

        // Fever
        if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
            return "For fever management:\n\n🌡️ Monitor your temperature regularly\n💧 Stay well-hydrated\n🛌 Get plenty of rest\n🧊 Use cool compresses\n💊 Consider acetaminophen or ibuprofen (as directed)\n\n⚠️ Seek medical attention if fever exceeds 103°F (39.4°C) or lasts more than 3 days."
        }

        // Cold/Flu
        if (lowerMessage.includes('cold') || lowerMessage.includes('flu') || lowerMessage.includes('cough')) {
            return "For cold and flu symptoms:\n\n🍵 Drink warm liquids (tea, soup)\n😴 Get plenty of rest\n💧 Stay hydrated\n🍯 Honey can soothe throat irritation\n🧴 Use saline nasal drops\n🧼 Wash hands frequently\n\n⚠️ Consult a doctor if symptoms worsen or persist."
        }

        // Stress/Anxiety
        if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety') || lowerMessage.includes('anxious')) {
            return "To manage stress and anxiety:\n\n🧘 Practice deep breathing exercises\n🏃 Regular physical exercise\n😴 Maintain a regular sleep schedule\n🥗 Eat a balanced diet\n🧑‍🤝‍🧑 Talk to friends or family\n📝 Write in a journal\n🎵 Listen to calming music\n\n💚 Consider professional counseling if needed."
        }

        // Sleep problems
        if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia') || lowerMessage.includes('tired')) {
            return "To improve sleep quality:\n\n⏰ Stick to a consistent sleep schedule\n📱 Avoid screens 1 hour before bed\n🛏️ Create a comfortable sleep environment\n☕ Limit caffeine after 2 PM\n🧘 Try relaxation techniques\n🏃 Exercise regularly (but not before bed)\n🌡️ Keep bedroom cool (60-67°F)\n\n💤 Aim for 7-9 hours of sleep per night."
        }

        // Back pain
        if (lowerMessage.includes('back pain') || lowerMessage.includes('backache')) {
            return "For back pain relief:\n\n🧊 Apply ice for the first 48 hours\n🔥 Then switch to heat therapy\n🧘 Gentle stretching exercises\n💺 Maintain good posture\n🏃 Stay active with low-impact exercises\n💊 Over-the-counter pain relievers if needed\n\n⚠️ See a doctor if pain is severe or lasts more than 2 weeks."
        }

        // Diet/Nutrition
        if (lowerMessage.includes('diet') || lowerMessage.includes('nutrition') || lowerMessage.includes('food') || lowerMessage.includes('eat')) {
            return "For healthy eating:\n\n🥗 Eat plenty of fruits and vegetables\n🌾 Choose whole grains over refined\n🥩 Include lean proteins\n🥑 Healthy fats (nuts, avocado, olive oil)\n💧 Drink 8 glasses of water daily\n🍬 Limit processed foods and sugar\n🍽️ Practice portion control\n\n🥗 Aim for a balanced, colorful plate!"
        }

        // Exercise/Fitness
        if (lowerMessage.includes('exercise') || lowerMessage.includes('workout') || lowerMessage.includes('fitness') || lowerMessage.includes('gym')) {
            return "Exercise recommendations:\n\n🏃 150 minutes of moderate activity weekly\n💪 Strength training 2-3 times/week\n🤸 Include flexibility exercises\n🚶 Start slow if you're a beginner\n💧 Stay hydrated during workouts\n😴 Allow rest days for recovery\n🎯 Set realistic, achievable goals\n\n✨ Consistency is key to fitness success!"
        }

        // Weight management
        if (lowerMessage.includes('weight') || lowerMessage.includes('lose') || lowerMessage.includes('gain')) {
            return "For healthy weight management:\n\n⚖️ Aim for gradual, sustainable changes\n🍽️ Focus on balanced, nutritious meals\n🏃 Regular physical activity (30 min/day)\n💧 Drink water before meals\n😴 Get adequate sleep (7-9 hours)\n📝 Track your food intake\n🎯 Set realistic goals\n\n🚫 Avoid crash diets - they're not sustainable!"
        }

        // Hydration
        if (lowerMessage.includes('water') || lowerMessage.includes('hydration') || lowerMessage.includes('dehydrated')) {
            return "Stay hydrated with these tips:\n\n💧 Aim for 8-10 glasses of water daily\n🏃 Drink more when exercising\n☀️ Increase intake in hot weather\n🍉 Eat water-rich foods (fruits, vegetables)\n⏰ Set reminders to drink water\n🥤 Limit sugary drinks and alcohol\n\n✨ Your body is about 60% water - keep it topped up!"
        }

        // Mental health
        if (lowerMessage.includes('mental health') || lowerMessage.includes('depression') || lowerMessage.includes('mood')) {
            return "To support mental health:\n\n🧑‍🤝‍🧑 Connect with others\n🏃 Regular exercise boosts mood\n😴 Prioritize quality sleep\n🥗 Eat nutritious foods\n🧘 Practice mindfulness/meditation\n🎨 Engage in hobbies you enjoy\n📞 Don't hesitate to seek professional help\n\n💚 Your mental health matters - take care of it!"
        }

        // Skin care
        if (lowerMessage.includes('skin') || lowerMessage.includes('acne') || lowerMessage.includes('complexion')) {
            return "For healthy skin:\n\n🧴 Cleanse gently twice daily\n☀️ Use sunscreen (SPF 30+) daily\n💧 Stay hydrated\n😴 Get adequate sleep\n🥗 Eat antioxidant-rich foods\n🚭 Avoid smoking\n🧴 Moisturize regularly\n\n✨ Consistency is key for great skin!"
        }

        // Allergies
        if (lowerMessage.includes('allergy') || lowerMessage.includes('allergies') || lowerMessage.includes('sneezing')) {
            return "For allergy management:\n\n🪟 Keep windows closed during high pollen\n🧹 Clean regularly to reduce allergens\n👃 Use air purifiers\n🚿 Shower after being outdoors\n👔 Change clothes when coming inside\n💊 Consider antihistamines (consult doctor)\n😷 Wear masks outdoors if needed\n\n⚠️ Consult an allergist for severe allergies."
        }

        // Heart health
        if (lowerMessage.includes('heart') || lowerMessage.includes('cardiovascular') || lowerMessage.includes('cholesterol')) {
            return "For heart health:\n\n🏃 Regular aerobic exercise\n🥗 Eat heart-healthy foods\n🧂 Limit sodium intake\n🚭 Don't smoke\n🍷 Limit alcohol\n😴 Manage stress\n⚖️ Maintain healthy weight\n📊 Regular health check-ups\n\n❤️ Your heart works hard - take care of it!"
        }

        // Diabetes
        if (lowerMessage.includes('diabetes') || lowerMessage.includes('blood sugar')) {
            return "Blood sugar management tips:\n\n🌾 Choose complex carbohydrates\n🥗 Eat regular, balanced meals\n🏃 Stay physically active\n📊 Monitor blood sugar levels\n💊 Take medications as prescribed\n⚖️ Maintain healthy weight\n🚭 Avoid smoking\n\n⚠️ Work closely with your healthcare team."
        }

        // First Aid
        if (lowerMessage.includes('first aid') || lowerMessage.includes('injury') || lowerMessage.includes('cut') || lowerMessage.includes('burn')) {
            return "Basic first aid tips:\n\n🩹 Clean wounds with soap and water\n🧊 Apply ice to bruises/sprains\n🧴 Use antibiotic ointment on cuts\n🔥 Cool burns with running water\n📞 Call emergency services for serious injuries\n🩺 Keep a first aid kit accessible\n\n⚠️ Seek professional medical help for serious injuries!"
        }

        // Vitamins/Supplements
        if (lowerMessage.includes('vitamin') || lowerMessage.includes('supplement')) {
            return "About vitamins and supplements:\n\n🥗 Get nutrients from food first\n☀️ Vitamin D - especially if limited sun\n🦴 Calcium for bone health\n💊 B12 for vegetarians/vegans\n🤰 Prenatal vitamins if pregnant\n⚠️ Consult doctor before starting supplements\n\n💡 More isn't always better - avoid mega-doses!"
        }

        // Meditation/Mindfulness
        if (lowerMessage.includes('meditat') || lowerMessage.includes('mindful')) {
            return "Getting started with meditation:\n\n🧘 Start with just 5 minutes daily\n🌅 Find a quiet, comfortable space\n👃 Focus on your breathing\n💭 Let thoughts pass without judgment\n📱 Use meditation apps if helpful\n⏰ Practice at the same time daily\n🧘 Be patient with yourself\n\n✨ Regular practice brings the best results!"
        }

        // Posture
        if (lowerMessage.includes('posture')) {
            return "For better posture:\n\n💺 Keep feet flat on the floor\n🖥️ Screen at eye level\n📐 Shoulders back and relaxed\n🏃 Take breaks to stand/stretch\n💪 Strengthen core muscles\n📱 Avoid looking down at phone\n🛌 Choose supportive mattress/pillow\n\n✨ Good posture reduces pain and improves confidence!"
        }

        // Eye health
        if (lowerMessage.includes('eye') || lowerMessage.includes('vision')) {
            return "To protect your eyes:\n\n🖥️ Follow 20-20-20 rule (every 20 min, look 20 ft away for 20 sec)\n💡 Ensure adequate lighting\n😎 Wear sunglasses outdoors\n🥗 Eat eye-healthy foods (carrots, leafy greens)\n💧 Stay hydrated\n😴 Get adequate sleep\n👓 Regular eye exams\n\n⚠️ See an eye doctor if you have vision changes."
        }

        // Thank you
        if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
            return "You're welcome! 😊 Feel free to ask me anything about health and wellness. Stay healthy! 💚"
        }

        // Emergency keywords
        if (lowerMessage.includes('emergency') || lowerMessage.includes('911') || lowerMessage.includes('urgent') || 
            lowerMessage.includes('chest pain') || lowerMessage.includes('can\'t breathe') || lowerMessage.includes('severe')) {
            return "⚠️ IMPORTANT: If this is a medical emergency, please call 911 or your local emergency number immediately!\n\n🏥 For severe chest pain, difficulty breathing, severe bleeding, or loss of consciousness, seek emergency medical care right away.\n\nI'm an AI assistant for general health information only, not for emergencies."
        }

        // Default response
        const defaultResponses = [
            "I'm here to help with health questions! You can ask me about:\n\n💊 Common illnesses (cold, flu, headaches)\n🏃 Exercise and fitness\n🥗 Nutrition and diet\n😴 Sleep issues\n🧘 Stress and mental health\n🩺 General wellness tips\n\nWhat would you like to know?",
            "I can provide general health information and wellness tips. Try asking me about:\n\n• Symptoms and remedies\n• Healthy lifestyle habits\n• Exercise routines\n• Nutrition advice\n• Mental wellness\n\nWhat's on your mind?",
            "I'm not sure I understand that specific question. I can help with:\n\n✨ Wellness tips\n🏥 Common health concerns\n🥗 Nutrition guidance\n🧘 Stress management\n💪 Fitness advice\n\nCould you rephrase your question or ask about one of these topics?"
        ]

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!inputText.trim()) return

        const userMessage = {
            id: messages.length + 1,
            text: inputText,
            sender: 'user',
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInputText('')
        setIsTyping(true)

        // Simulate typing delay
        setTimeout(() => {
            const botResponse = {
                id: messages.length + 2,
                text: getHealthResponse(inputText),
                sender: 'bot',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, botResponse])
            setIsTyping(false)
        }, 1000 + Math.random() * 1000)
    }

    const quickQuestions = [
        "How to reduce stress?",
        "Tips for better sleep",
        "Headache remedies",
        "Healthy eating tips",
        "Exercise advice"
    ]

    const handleQuickQuestion = (question) => {
        setInputText(question)
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    return (
        <>
            {/* Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-400 ${
                    isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                }`}
                aria-label="Health Bot"
            >
                {isOpen ? (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <div className="relative">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                    </div>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slideUp">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold">AI Health Assistant</h3>
                                    <p className="text-xs opacity-90">Always here to help 💚</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-white/20 rounded-full p-1 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                        message.sender === 'user'
                                            ? 'bg-blue-500 text-white rounded-br-none'
                                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md rounded-bl-none'
                                    }`}
                                >
                                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-md">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Questions */}
                    {messages.length <= 1 && (
                        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Quick questions:</p>
                            <div className="flex flex-wrap gap-2">
                                {quickQuestions.map((question, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleQuickQuestion(question)}
                                        className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex space-x-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Ask about your health..."
                                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                disabled={isTyping}
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim() || isTyping}
                                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </form>

                    {/* Disclaimer */}
                    <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-700">
                        <p className="text-xs text-yellow-800 dark:text-yellow-400">
                            ⚠️ This is for informational purposes only. Consult a healthcare professional for medical advice.
                        </p>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </>
    )
}
