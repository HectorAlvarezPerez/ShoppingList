import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Send, Bot, Sparkles } from 'lucide-react';

const SIMULATED_RESPONSES = {
    default: "I'm your Nutri-Agent! I can help you plan meals or manage your shopping list. Try saying 'Add milk to the list' or 'Plan Pizza for Friday Dinner'.",
    keto: "I've generated a Keto plan for you! Avocado and eggs are on the menu.",
    vegan: "Going plant-based? Great choice! I've suggested some lentil soups and salads.",
    snack: "How about some apple slices with almond butter? It's healthy and delicious!",
};

export default function NutriAgent() {
    const { addShoppingItem, updateMeal, currentProfile } = useApp();
    const [messages, setMessages] = useState([
        { id: 1, text: `Hi ${currentProfile?.name || 'there'}! I'm Nutri-Agent. How can I help you eat better today?`, sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const processCommand = async (text) => {
        const lowerText = text.toLowerCase();
        let responseText = SIMULATED_RESPONSES.default;

        // 1. Add to Shopping List
        const addMatch = lowerText.match(/add (.+) to (?:the )?(?:shopping )?list/);
        if (addMatch) {
            const item = addMatch[1];
            await addShoppingItem(item);
            responseText = `I've added "${item}" to the global shopping list.`;
        }

        // 2. Plan Meal
        const planMatch = lowerText.match(/plan (.+) for (\w+) (\w+)/);
        if (planMatch) {
            const [_, meal, day, type] = planMatch;
            const capDay = day.charAt(0).toUpperCase() + day.slice(1);
            const capType = type.charAt(0).toUpperCase() + type.slice(1);

            const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const validTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

            if (validDays.includes(capDay) && validTypes.includes(capType)) {
                if (currentProfile) {
                    await updateMeal(capDay, capType, meal, currentProfile.id);
                    responseText = `Done! I've scheduled "${meal}" for ${capDay} ${capType} for ${currentProfile.name}.`;
                } else {
                    responseText = "Please select a profile first.";
                }
            } else {
                responseText = "I couldn't recognize that day or meal type. Please use standard days (e.g., Monday) and types (Breakfast, Lunch, Dinner, Snack).";
            }
        }

        if (lowerText.includes('keto')) responseText = SIMULATED_RESPONSES.keto;
        if (lowerText.includes('vegan')) responseText = SIMULATED_RESPONSES.vegan;
        if (lowerText.includes('snack')) responseText = SIMULATED_RESPONSES.snack;

        return responseText;
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        setTimeout(async () => {
            const responseText = await processCommand(userMsg.text);
            const botMsg = { id: Date.now() + 1, text: responseText, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1000);
    };

    return (
        <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-primary/5 flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-sm">
                    <Bot className="text-white" size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800">Nutri-Agent</h3>
                    <p className="text-xs text-primary-dark font-medium flex items-center">
                        <Sparkles size={12} className="mr-1" /> AI Assistant
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${msg.sender === 'user'
                                    ? 'bg-primary text-white rounded-tr-none'
                                    : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none'
                                }`}
                        >
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={handleSend} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me to plan a meal or add to list..."
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all bg-gray-50 focus:bg-white"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="p-3 bg-primary text-white rounded-xl hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}
