import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useVoiceToText } from '../hooks/useVoiceToText';

export default function MealCell({
    day,
    mealType,
    content,
    onUpdate,
    isReadOnly
}) {
    const [value, setValue] = useState(content || '');
    const [isEditing, setIsEditing] = useState(false);
    const { isListening, transcript, startListening, setTranscript } = useVoiceToText();
    const textareaRef = useRef(null);

    useEffect(() => {
        setValue(content || '');
    }, [content]);

    useEffect(() => {
        if (transcript) {
            const newValue = value ? `${value} ${transcript}` : transcript;
            setValue(newValue);
            onUpdate(day, mealType, newValue);
            setTranscript('');
        }
    }, [transcript, value, day, mealType, onUpdate, setTranscript]);

    const handleBlur = () => {
        setIsEditing(false);
        if (value !== content) {
            onUpdate(day, mealType, value);
        }
    };

    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ day, mealType, content: value }));
        e.dataTransfer.effectAllowed = 'copyMove';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        try {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            // If dropping from favorites (which might just be a string or object)
            if (data.isFavorite) {
                const newValue = value ? `${value}, ${data.name}` : data.name;
                setValue(newValue);
                onUpdate(day, mealType, newValue);
            } else if (data.content) {
                // Swap or Copy? Let's do Copy/Overwrite for simplicity as per "Copy/Paste" request
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

    return (
        <div
            className={`relative group h-full min-h-[80px] bg-white rounded-xl border transition-all ${isEditing ? 'ring-2 ring-primary border-transparent shadow-md z-10' : 'border-gray-100 hover:border-primary/30 hover:shadow-sm'
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

            {/* Voice Button */}
            <button
                onClick={isListening ? null : startListening}
                className={`absolute bottom-2 right-2 p-1.5 rounded-full transition-all ${isListening
                        ? 'bg-red-100 text-red-500 animate-pulse'
                        : 'bg-gray-50 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-primary/10 hover:text-primary'
                    }`}
                title="Speak to add"
            >
                {isListening ? <MicOff size={14} /> : <Mic size={14} />}
            </button>
        </div>
    );
}
