import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Send, Bot, Sparkles, AlertTriangle } from 'lucide-react';
import OpenAI from 'openai';

const SIMULATED_RESPONSES = {
    default: "¡Hola! Soy tu Nutri-Agente. Puedo ayudarte a planificar comidas o gestionar tu lista de la compra. Prueba a decir 'Añade leche a la lista' o 'Planifica Pizza para la Cena del Viernes'.",
    keto: "¡He generado un plan Keto para ti! Aguacate y huevos están en el menú.",
    vegan: "Going plant-based? ¡Genial! He sugerido algunas sopas de lentejas y ensaladas.",
    snack: "¿Qué tal unas rodajas de manzana con mantequilla de almendra? ¡Es saludable y delicioso!",
};

export default function NutriAgent() {
    const { addShoppingItem, updateMeal, currentProfile } = useApp();
    const [messages, setMessages] = useState([
        { id: 1, text: `¡Hola ${currentProfile?.name || ''}! Soy Nutri-Agente. ¿Cómo puedo ayudarte a comer mejor hoy?`, sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Initialize OpenAI Client
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const openai = apiKey ? new OpenAI({ apiKey, dangerouslyAllowBrowser: true }) : null;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const processCommandWithAI = async (text) => {
        if (!openai) return processCommandSimulated(text);

        try {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are Nutri-Agent, a helpful family meal assistant. You speak Spanish.
            You have access to the current user's profile: ${currentProfile?.name}.
            
            Analyze the user's request and return a JSON object with one of the following structures:

            1. To add an item to the shopping list:
            { "type": "add_item", "item": "Name of item" }

            2. To plan a meal (Days: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo. Types: Desayuno, Comida, Cena, Snack):
            { "type": "plan_meal", "day": "Day", "mealType": "Type", "dish": "Dish Name" }

            3. For general chat or advice:
            { "type": "chat", "message": "Your helpful response in Spanish" }

            ALWAYS return valid JSON.`
                    },
                    { role: "user", content: text }
                ],
                model: "gpt-4o-mini",
                response_format: { type: "json_object" },
            });

            const response = JSON.parse(completion.choices[0].message.content);

            if (response.type === 'add_item') {
                await addShoppingItem(response.item);
                return `He añadido "${response.item}" a la lista de la compra.`;
            } else if (response.type === 'plan_meal') {
                if (currentProfile) {
                    await updateMeal(response.day, response.mealType, response.dish, currentProfile.id);
                    return `¡Hecho! He planificado "${response.dish}" para la ${response.mealType} del ${response.day}.`;
                } else {
                    return "Por favor, selecciona un perfil primero.";
                }
            } else {
                return response.message;
            }

        } catch (error) {
            console.error("OpenAI Error:", error);
            return "Lo siento, tuve un problema conectando con mi cerebro digital. ¿Puedes intentarlo de nuevo?";
        }
    };

    const processCommandSimulated = async (text) => {
        const lowerText = text.toLowerCase();
        let responseText = SIMULATED_RESPONSES.default;

        // 1. Add to Shopping List
        const addMatch = lowerText.match(/añad[ei] (.+) a (?:la )?(?:lista)/);
        if (addMatch) {
            const item = addMatch[1];
            await addShoppingItem(item);
            responseText = `He añadido "${item}" a la lista de la compra global.`;
        }

        // 2. Plan Meal (Simple regex for Spanish)
        // "Planifica Pizza para la Cena del Viernes"
        const planMatch = lowerText.match(/planifica (.+) para (?:la|el) (\w+) del (\w+)/);
        if (planMatch) {
            const [_, meal, type, day] = planMatch;
            // Capitalize
            const capDay = day.charAt(0).toUpperCase() + day.slice(1);
            const capType = type.charAt(0).toUpperCase() + type.slice(1);

            if (currentProfile) {
                await updateMeal(capDay, capType, meal, currentProfile.id);
                responseText = `¡Hecho! He planificado "${meal}" para ${capType} del ${capDay}.`;
            }
        }

        return responseText;
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate network delay for realism
        setTimeout(async () => {
            const responseText = await processCommandWithAI(userMsg.text);
            const botMsg = { id: Date.now() + 1, text: responseText, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1000);
    };

    return (
        <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-primary/5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-sm">
                        <Bot className="text-white" size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">Nutri-Agente</h3>
                        <p className="text-xs text-primary-dark font-medium flex items-center">
                            <Sparkles size={12} className="mr-1" /> Asistente IA
                        </p>
                    </div>
                </div>
                {!apiKey && (
                    <div className="flex items-center text-amber-500 text-xs bg-amber-50 px-2 py-1 rounded-lg border border-amber-100" title="Añade VITE_OPENAI_API_KEY a tu .env">
                        <AlertTriangle size={12} className="mr-1" />
                        <span>Modo Simulación</span>
                    </div>
                )}
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
                        placeholder="Pídeme planificar una comida o añadir a la lista..."
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
