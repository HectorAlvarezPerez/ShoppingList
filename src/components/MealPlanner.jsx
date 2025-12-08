import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import MealCell from './MealCell';
import FavoritesSidebar from './FavoritesSidebar';
import { Eye, EyeOff } from 'lucide-react';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const MEAL_TYPES = ['Comida', 'Cena'];

export default function MealPlanner() {
    const { meals, updateMeal, currentProfile } = useApp();
    const [isFridgeView, setIsFridgeView] = useState(false);

    const getMealContent = (day, type) => {
        const meal = meals.find(m =>
            m.day_of_week === day &&
            m.meal_type === type &&
            m.profile_id === currentProfile?.id
        );
        return meal ? meal.dish_name : '';
    };

    const handleUpdate = (day, type, content) => {
        if (currentProfile) {
            updateMeal(day, type, content, currentProfile.id);
        }
    };

    if (isFridgeView) {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const todayIndex = DAYS.indexOf(today) !== -1 ? DAYS.indexOf(today) : 0;
        const tomorrowIndex = (todayIndex + 1) % 7;
        const viewDays = [DAYS[todayIndex], DAYS[tomorrowIndex]];

        return (
            <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                        <span className="text-6xl">❄️</span> Vista Nevera
                    </h2>
                    <button
                        onClick={() => setIsFridgeView(false)}
                        className="flex items-center space-x-2 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors text-lg font-medium"
                    >
                        <EyeOff size={24} />
                        <span>Salir</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                    {viewDays.map(day => (
                        <div key={day} className="bg-white rounded-3xl shadow-xl border-4 border-primary/20 p-8 flex flex-col">
                            <h3 className="text-3xl font-bold text-primary mb-8 border-b-2 border-gray-100 pb-4">{day}</h3>
                            <div className="space-y-8 flex-1">
                                {['Comida', 'Cena'].map(type => (
                                    <div key={type}>
                                        <span className="text-xl font-bold text-gray-400 uppercase tracking-wider">{type}</span>
                                        <div className="mt-2 text-4xl font-medium text-gray-800 leading-tight">
                                            {getMealContent(day, type) || "Sin planificar"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-8rem)]">
            <div className="flex-1 flex flex-col pr-6 overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Planificador Semanal</h2>
                        <p className="text-gray-500">Planificando comidas para <span className="font-bold text-primary">{currentProfile?.name}</span></p>
                    </div>
                    <button
                        onClick={() => setIsFridgeView(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <Eye size={18} />
                        <span>Vista Nevera</span>
                    </button>
                </div>

                <div className="flex-1 overflow-auto bg-white rounded-2xl shadow-sm border border-gray-200">
                    <div className="min-w-[800px] h-full flex flex-col">
                        {/* Header Row */}
                        <div className="grid grid-cols-8 border-b border-gray-100 bg-gray-50/50">
                            <div className="p-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Comida</div>
                            {DAYS.map(day => (
                                <div key={day} className="p-4 font-semibold text-gray-700 text-center border-l border-gray-100">
                                    {day.slice(0, 3)}
                                </div>
                            ))}
                        </div>

                        {/* Meal Rows */}
                        {MEAL_TYPES.map(type => (
                            <div key={type} className="grid grid-cols-8 flex-1 border-b border-gray-100 last:border-0">
                                <div className="p-4 font-medium text-gray-600 flex items-center text-sm bg-gray-50/30">
                                    {type}
                                </div>
                                {DAYS.map(day => (
                                    <div key={`${day}-${type}`} className="p-2 border-l border-gray-100">
                                        <MealCell
                                            day={day}
                                            mealType={type}
                                            content={getMealContent(day, type)}
                                            onUpdate={handleUpdate}
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <FavoritesSidebar />
        </div>
    );
}
