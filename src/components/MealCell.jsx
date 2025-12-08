import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Book, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function MealCell({
    day,
    mealType,
    content,
    onUpdate,
    isReadOnly
}) {
    const { recipes } = useApp();
    const [value, setValue] = useState(content || '');
    const [isEditing, setIsEditing] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
    const textareaRef = useRef(null);
    const buttonRef = useRef(null);
    const pickerRef = useRef(null);

    useEffect(() => {
        setValue(content || '');
    }, [content]);

    // Close picker when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (pickerRef.current && !pickerRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setShowPicker(false);
            }
        }
        if (showPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showPicker]);

    const handleBlur = () => {
        setTimeout(() => {
            setIsEditing(false);
            if (value !== content) {
                onUpdate(day, mealType, value);
            }
        }, 200);
    };

    const handleSelectRecipe = (recipeName) => {
        setValue(recipeName);
        onUpdate(day, mealType, recipeName);
        setShowPicker(false);
    };

    const handleOpenPicker = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPickerPosition({
                top: rect.bottom + 5,
                left: rect.left - 150
            });
        }
        setShowPicker(!showPicker);
    };

    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ day, mealType, content: value }));
        e.dataTransfer.effectAllowed = 'copyMove';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        try {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            if (data.isFavorite) {
                const newValue = value ? `${value}, ${data.name}` : data.name;
                setValue(newValue);
                onUpdate(day, mealType, newValue);
            } else if (data.content) {
                const newValue = data.content;
                setValue(newValue);
                onUpdate(day, mealType, newValue);
            }
        } catch (err) {
            console.error('Drop error', err);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    if (isReadOnly) {
        return (
            <div className="h-full p-2 text-lg font-medium text-gray-800 bg-white/50 rounded-lg">
                {value || <span className="text-gray-300 italic">Empty</span>}
            </div>
        );
    }

    // Recipe Picker Portal - renders outside the overflow container
    const pickerPortal = showPicker ? createPortal(
        <div
            ref={pickerRef}
            style={{
                position: 'fixed',
                top: pickerPosition.top,
                left: pickerPosition.left,
                zIndex: 9999
            }}
            className="w-48 max-h-48 overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200"
        >
            <div className="sticky top-0 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-500 border-b border-gray-100 flex justify-between items-center">
                MIS RECETAS
                <button onClick={() => setShowPicker(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={12} />
                </button>
            </div>

            {recipes && recipes.length > 0 ? (
                <div className="py-1">
                    {recipes.map(recipe => (
                        <button
                            key={recipe.id}
                            onClick={() => handleSelectRecipe(recipe.name)}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors truncate"
                            title={recipe.name}
                        >
                            {recipe.name}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="p-3 text-xs text-center text-gray-400">
                    No tienes recetas guardadas
                </div>
            )}
        </div>,
        document.body
    ) : null;

    return (
        <div
            className={`relative group h-full min-h-[80px] bg-white rounded-xl border transition-all ${isEditing || showPicker ? 'ring-2 ring-primary border-transparent shadow-md z-20' : 'border-gray-100 hover:border-primary/30 hover:shadow-sm'
                }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleBlur}
                onFocus={() => setIsEditing(true)}
                draggable={!isEditing}
                onDragStart={handleDragStart}
                placeholder={`${mealType}...`}
                className="w-full h-full p-3 bg-transparent resize-none outline-none text-sm text-gray-700 placeholder-gray-300 rounded-xl"
            />

            {/* Action Buttons */}
            <div className={`absolute bottom-2 right-2 flex gap-1 transition-all ${showPicker ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {/* Recipe Picker Button */}
                <button
                    ref={buttonRef}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleOpenPicker();
                    }}
                    className={`p-1.5 rounded-full transition-colors ${showPicker
                        ? 'bg-primary text-white'
                        : 'bg-gray-50 text-gray-400 hover:bg-primary/10 hover:text-primary'
                        }`}
                    title="Añadir receta guardada"
                >
                    <Book size={14} />
                </button>
            </div>

            {/* Render picker via portal */}
            {pickerPortal}
        </div>
    );
}
