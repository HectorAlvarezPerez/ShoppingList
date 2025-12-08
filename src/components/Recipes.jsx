import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, ChevronDown, ChevronUp, ChefHat, Heart, Filter, Settings, X } from 'lucide-react';

export default function Recipes() {
    const { recipes, addRecipe, deleteRecipe, toggleFavoriteRecipe, categories, addCategory, deleteCategory } = useApp();
    const [isAdding, setIsAdding] = useState(false);
    const [showCategoryManager, setShowCategoryManager] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    // Form State
    const [name, setName] = useState('');
    const [instructions, setInstructions] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [category, setCategory] = useState('');
    const [customCategory, setCustomCategory] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);

    // Filter State
    const [activeFilter, setActiveFilter] = useState('');

    // View State
    const [expandedRecipeId, setExpandedRecipeId] = useState(null);

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        try {
            await addCategory(newCategoryName.trim());
            setNewCategoryName('');
        } catch (error) {
            alert('Error al crear categoría: ' + error.message);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!confirm('¿Eliminar esta categoría?')) return;
        try {
            await deleteCategory(id);
        } catch (error) {
            alert('Error al eliminar categoría: ' + error.message);
        }
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: '', quantity: '' }]);
    };

    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index][field] = value;
        setIngredients(newIngredients);
    };

    const handleRemoveIngredient = (index) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
    };

    const handleCategoryChange = (value) => {
        if (value === '__custom__') {
            setShowCustomInput(true);
            setCategory('');
        } else {
            setShowCustomInput(false);
            setCategory(value);
            setCustomCategory('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Filter out empty ingredients
            const validIngredients = ingredients.filter(i => i.name.trim() !== '');
            const finalCategory = showCustomInput ? customCategory.trim() : category;
            await addRecipe(name, instructions, imageUrl, validIngredients, finalCategory || null);

            // Reset form
            setName('');
            setInstructions('');
            setImageUrl('');
            setCategory('');
            setCustomCategory('');
            setShowCustomInput(false);
            setIngredients([{ name: '', quantity: '' }]);
            setIsAdding(false);
        } catch (error) {
            console.error(error);
            alert('Error al guardar la receta');
        }
    };

    // Filter recipes by category
    const filteredRecipes = activeFilter
        ? recipes.filter(r => r.category === activeFilter)
        : recipes;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <ChefHat className="text-primary" />
                    Mis Recetas
                </h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    {isAdding ? 'Cancelar' : (
                        <>
                            <Plus size={20} />
                            Nueva Receta
                        </>
                    )}
                </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex gap-2 flex-wrap items-center">
                <Filter size={16} className="text-gray-400" />
                <button
                    onClick={() => setActiveFilter('')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${activeFilter === ''
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Todas
                </button>
                {categories && categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveFilter(cat.name)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${activeFilter === cat.name
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {cat.icon && <span className="mr-1">{cat.icon}</span>}
                        {cat.name}
                    </button>
                ))}
                <button
                    onClick={() => setShowCategoryManager(true)}
                    className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    title="Gestionar categorías"
                >
                    <Settings size={16} />
                </button>
            </div>

            {/* Category Manager Modal */}
            {showCategoryManager && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-in fade-in zoom-in-95">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800">Gestionar Categorías</h3>
                            <button onClick={() => setShowCategoryManager(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Nueva categoría..."
                                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                            />
                            <button
                                onClick={handleAddCategory}
                                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
                            >
                                <Plus size={18} />
                            </button>
                        </div>

                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {categories && categories.map(cat => (
                                <div key={cat.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                                    <span className="flex items-center gap-2">
                                        {cat.icon && <span>{cat.icon}</span>}
                                        <span className="font-medium">{cat.name}</span>
                                    </span>
                                    <button
                                        onClick={() => handleDeleteCategory(cat.id)}
                                        className="text-gray-400 hover:text-red-500 p-1"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {(!categories || categories.length === 0) && (
                                <p className="text-center text-gray-400 py-4">No hay categorías</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isAdding && (
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 animate-in fade-in slide-in-from-top-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Receta</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    required
                                    placeholder="ej. Lentejas de la Abuela"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                                <div className="flex gap-2">
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
                                    >
                                        <option value="">Sin categoría</option>
                                        {categories && categories.map(cat => (
                                            <option key={cat.id} value={cat.name}>
                                                {cat.icon ? `${cat.icon} ${cat.name}` : cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => setShowCategoryManager(true)}
                                        className="px-3 py-2 text-gray-500 hover:text-primary rounded-lg border border-gray-200 hover:border-primary/50"
                                        title="Gestionar categorías"
                                    >
                                        <Settings size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Instrucciones</label>
                            <textarea
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]"
                                placeholder="Pasos para preparar el plato..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen (Opcional)</label>
                            <input
                                type="text"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="https://..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ingredientes</label>
                            <div className="space-y-2">
                                {ingredients.map((ing, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Ingrediente (ej. Arroz)"
                                            value={ing.name}
                                            onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Cant. (ej. 200g)"
                                            value={ing.quantity}
                                            onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                            className="w-32 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                        {ingredients.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveIngredient(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddIngredient}
                                    className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
                                >
                                    <Plus size={16} />
                                    Añadir Ingrediente
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark shadow-sm hover:shadow transition-all"
                            >
                                Guardar Receta
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredRecipes.map(recipe => (
                    <div key={recipe.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        {recipe.image_url && (
                            <div className="h-48 overflow-hidden bg-gray-100">
                                <img src={recipe.image_url} alt={recipe.name} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">{recipe.name}</h3>
                                    {recipe.category && (
                                        <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                                            {recipe.category}
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={async () => {
                                            try {
                                                await toggleFavoriteRecipe(recipe.id, !recipe.is_favorite);
                                            } catch (error) {
                                                console.error(error);
                                                alert("Error al actualizar favorito: " + error.message);
                                            }
                                        }}
                                        className={`p-1 rounded-full hover:bg-red-50 transition-colors ${recipe.is_favorite ? 'text-red-500' : 'text-gray-300'}`}
                                        title={recipe.is_favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                                    >
                                        <Heart size={20} fill={recipe.is_favorite ? "currentColor" : "none"} />
                                    </button>
                                    <button
                                        onClick={() => deleteRecipe(recipe.id)}
                                        className="text-gray-400 hover:text-red-500 p-1"
                                        title="Eliminar receta"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="text-sm text-gray-500 mb-4">
                                {recipe.recipe_ingredients?.length || 0} ingredientes
                            </div>

                            <button
                                onClick={() => setExpandedRecipeId(expandedRecipeId === recipe.id ? null : recipe.id)}
                                className="w-full flex items-center justify-center gap-1 text-primary bg-primary/5 py-2 rounded-lg hover:bg-primary/10 transition-colors text-sm font-medium"
                            >
                                {expandedRecipeId === recipe.id ? (
                                    <>Ocultar Detalles <ChevronUp size={16} /></>
                                ) : (
                                    <>Ver Receta <ChevronDown size={16} /></>
                                )}
                            </button>
                        </div>

                        {expandedRecipeId === recipe.id && (
                            <div className="p-4 bg-gray-50 border-t border-gray-100 text-sm">
                                {recipe.recipe_ingredients?.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="font-semibold text-gray-700 mb-2">Ingredientes:</h4>
                                        <ul className="space-y-1">
                                            {recipe.recipe_ingredients.map(ing => (
                                                <li key={ing.id} className="flex justify-between text-gray-600">
                                                    <span>{ing.ingredient_name}</span>
                                                    <span className="text-gray-400">{ing.quantity}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {recipe.instructions && (
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-2">Preparación:</h4>
                                        <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{recipe.instructions}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {filteredRecipes.length === 0 && !isAdding && (
                    <div className="col-span-full text-center py-12 text-gray-400">
                        <ChefHat size={48} className="mx-auto mb-4 opacity-20" />
                        {activeFilter ? (
                            <p>No tienes recetas en esta categoría.</p>
                        ) : (
                            <>
                                <p>No tienes recetas guardadas aún.</p>
                                <button onClick={() => setIsAdding(true)} className="text-primary hover:underline mt-2">
                                    ¡Crea la primera!
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
