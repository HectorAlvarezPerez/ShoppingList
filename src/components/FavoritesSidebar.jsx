import React from 'react';

const FAVORITES = [
    "Grilled Chicken Salad",
    "Spaghetti Bolognese",
    "Tacos",
    "Salmon & Veggies",
    "Pizza Night",
    "Lentil Soup",
    "Oatmeal & Berries",
    "Scrambled Eggs",
    "Smoothie",
    "Avocado Toast"
];

export default function FavoritesSidebar() {
    const handleDragStart = (e, name) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ name, isFavorite: true }));
        e.dataTransfer.effectAllowed = 'copy';
    };

    return (
        <div className="w-64 bg-white border-l border-gray-200 p-4 hidden xl:block overflow-y-auto">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">Favorites</h3>
            <div className="flex flex-wrap gap-2">
                {FAVORITES.map((meal, index) => (
                    <div
                        key={index}
                        draggable
                        onDragStart={(e) => handleDragStart(e, meal)}
                        className="px-3 py-2 bg-background border border-gray-200 rounded-lg text-sm text-gray-600 cursor-move hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors shadow-sm"
                    >
                        {meal}
                    </div>
                ))}
            </div>
            <div className="mt-8 p-4 bg-secondary/10 rounded-xl border border-secondary/20">
                <p className="text-xs text-secondary-dark font-medium text-center">
                    💡 Drag these items onto the calendar to quickly plan your week!
                </p>
            </div>
        </div>
    );
}
