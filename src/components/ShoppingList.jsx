import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Check, Plus, RefreshCw, Share2, Sparkles, Loader2 } from 'lucide-react';
import OpenAI from 'openai';

export default function ShoppingList() {
    const { shoppingItems, addShoppingItem, toggleShoppingItem, meals, currentProfile, recipes } = useApp();
    const [newItem, setNewItem] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // Initialize OpenAI Client
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const openai = apiKey ? new OpenAI({ apiKey, dangerouslyAllowBrowser: true }) : null;

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (newItem.trim()) {
            await addShoppingItem(newItem.trim());
            setNewItem('');
        }
    };

    const generateWithAI = async () => {
        if (!currentProfile) return;
        setIsGenerating(true);

        try {
            // Get all meal contents for current profile
            const profileMeals = meals.filter(m => m.profile_id === currentProfile.id && m.dish_name);

            if (profileMeals.length === 0) {
                alert('No hay comidas planificadas esta semana. Añade platos al calendario primero.');
                setIsGenerating(false);
                return;
            }

            // Build meal list text
            const mealList = profileMeals.map(m => `${m.day_of_week} ${m.meal_type}: ${m.dish_name}`).join('\n');

            // Build recipe info for context
            const recipeInfo = recipes.map(r => {
                const ings = r.recipe_ingredients?.map(i => i.ingredient_name).join(', ') || '';
                return `${r.name}: ${ings}`;
            }).join('\n');

            if (!openai) {
                // Fallback: simple extraction
                const ingredients = new Set();
                profileMeals.forEach(meal => {
                    const parts = meal.dish_name.split(/[,;\n]+/).map(s => s.trim()).filter(s => s.length > 2);
                    parts.forEach(p => ingredients.add(p));
                });
                for (const item of ingredients) {
                    const exists = shoppingItems.some(si => si.item_name.toLowerCase() === item.toLowerCase());
                    if (!exists) await addShoppingItem(item);
                }
                setIsGenerating(false);
                return;
            }

            // Call OpenAI
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `Eres un asistente de cocina. Tu tarea es generar una lista de la compra basándote en el menú semanal.

REGLAS:
- Devuelve SOLO una lista de ingredientes, uno por línea
- Solo nombres de productos, SIN cantidades
- Agrupa ingredientes similares (no repitas)
- Sé específico pero conciso (ej: "Tomates", "Pechuga de pollo")
- No incluyas ingredientes básicos que toda cocina tiene (sal, aceite, pimienta)
- Responde SOLO con la lista, sin explicaciones ni formato adicional`
                    },
                    {
                        role: "user",
                        content: `Menú semanal:\n${mealList}\n\nRecetas conocidas con ingredientes:\n${recipeInfo}\n\nGenera la lista de la compra:`
                    }
                ],
                temperature: 0.3,
                max_tokens: 500
            });

            const response = completion.choices[0].message.content;

            // Parse response and add items
            const items = response.split('\n')
                .map(line => line.replace(/^[-•*]\s*/, '').trim())
                .filter(line => line.length > 1);

            for (const item of items) {
                const exists = shoppingItems.some(si =>
                    si.item_name.toLowerCase().includes(item.toLowerCase().split(' ')[0]) ||
                    item.toLowerCase().includes(si.item_name.toLowerCase().split(' ')[0])
                );
                if (!exists) {
                    await addShoppingItem(item);
                }
            }

        } catch (error) {
            console.error('AI Error:', error);
            alert('Error al generar la lista. Inténtalo de nuevo.');
        } finally {
            setIsGenerating(false);
        }
    };

    const getWhatsAppLink = () => {
        const pendingItems = shoppingItems.filter(i => !i.is_checked).map(i => `- ${i.item_name}`);
        if (pendingItems.length === 0) return '';

        const text = `*Lista de Compra*:\n\n${pendingItems.join('\n')}`;
        return `https://wa.me/?text=${encodeURIComponent(text)}`;
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Lista de Compra</h2>
                    <p className="text-gray-500">Lista global para toda la familia</p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={generateWithAI}
                        disabled={isGenerating}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-sm disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span className="hidden sm:inline">Generando...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} />
                                <span className="hidden sm:inline">Generar con IA</span>
                            </>
                        )}
                    </button>

                    <a
                        href={getWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center space-x-2 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#128C7E] transition-colors shadow-sm ${shoppingItems.filter(i => !i.is_checked).length === 0 ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        <Share2 size={18} />
                        <span className="hidden sm:inline">WhatsApp</span>
                    </a>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
                {/* Add Item Input */}
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <form onSubmit={handleAddItem} className="relative flex items-center">
                        <input
                            type="text"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            placeholder="Añadir producto (ej. Leche, Huevos)..."
                            className="w-full pl-4 pr-14 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                        />
                        <div className="absolute right-2 flex items-center space-x-1">
                            <button
                                type="submit"
                                disabled={!newItem.trim()}
                                className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </form>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-2">
                    {shoppingItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <ShoppingCartIcon size={32} />
                            </div>
                            <p>Tu lista está vacía</p>
                            <p className="text-sm mt-2">Pulsa "Generar con IA" para crear la lista del menú</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {shoppingItems.map(item => (
                                <div
                                    key={item.id}
                                    className={`group flex items-center justify-between p-3 rounded-xl transition-all ${item.is_checked ? 'bg-gray-50' : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3 flex-1">
                                        <button
                                            onClick={() => toggleShoppingItem(item.id, !item.is_checked)}
                                            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${item.is_checked
                                                ? 'bg-primary border-primary text-white'
                                                : 'border-gray-300 hover:border-primary'
                                                }`}
                                        >
                                            {item.is_checked && <Check size={14} strokeWidth={3} />}
                                        </button>
                                        <span className={`text-lg transition-colors ${item.is_checked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                            {item.item_name}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const ShoppingCartIcon = ({ size }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
);
