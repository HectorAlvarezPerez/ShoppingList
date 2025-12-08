import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart } from 'lucide-react';

export default function FavoritesSidebar() {
    const { recipes } = useApp();

    const favoriteRecipes = recipes.filter(r => r.is_favorite);

    const handleDragStart = (e, name) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ name, isFavorite: true }));
        e.dataTransfer.effectAllowed = 'copy';
    };

    return (
        <div className="w-64 bg-white border-l border-gray-200 p-4 hidden xl:block overflow-y-auto">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Heart size={16} className="text-red-500" fill="currentColor" />
                Favoritos
            </h3>
            <div className="flex flex-wrap gap-2">
                {favoriteRecipes.length > 0 ? (
                    favoriteRecipes.map((recipe) => (
                        <div
                            key={recipe.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, recipe.name)}
                            className="px-3 py-2 bg-background border border-gray-200 rounded-lg text-sm text-gray-600 cursor-move hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors shadow-sm select-none"
                        >
                            {recipe.name}
                        </div>
                    ))
                ) : (
                    <p className="text-xs text-gray-400 italic">No tienes favoritos aún. Ve a 'Recetas' y marca tus platos preferidos.</p>
                )}
            </div>
            <div className="mt-8 p-4 bg-secondary/10 rounded-xl border border-secondary/20">
                <p className="text-xs text-secondary-dark font-medium text-center">
                    💡 ¡Arrastra estos platos al calendario para planificar tu semana rápidamente!
                </p>
            </div>
        </div>
    );
}
