import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, Trash2, Edit2, Check, User } from 'lucide-react';

export default function ProfileManagerModal({ isOpen, onClose }) {
    const { profiles, addProfile, updateProfile, deleteProfile } = useApp();
    const [editingId, setEditingId] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [formData, setFormData] = useState({ name: '', color_theme: 'emerald' });
    const [error, setError] = useState('');

    const COLOR_THEMES = [
        { id: 'emerald', name: 'Emerald', bg: 'bg-emerald-500' },
        { id: 'blue', name: 'Blue', bg: 'bg-blue-500' },
        { id: 'orange', name: 'Orange', bg: 'bg-orange-500' },
    ];

    if (!isOpen) return null;

    const resetForm = () => {
        setFormData({ name: '', color_theme: 'emerald' });
        setEditingId(null);
        setIsAdding(false);
        setError('');
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            setError('Please enter a name');
            return;
        }

        try {
            if (editingId) {
                await updateProfile(editingId, formData);
            } else {
                await addProfile(formData.name, formData.color_theme);
            }
            resetForm();
        } catch (err) {
            setError('Error saving profile. Try again.');
            console.error(err);
        }
    };

    const startEdit = (profile) => {
        setFormData({ name: profile.name, color_theme: profile.color_theme });
        setEditingId(profile.id);
        setIsAdding(false);
        setError('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this profile? This cannot be undone.')) {
            try {
                await deleteProfile(id);
            } catch (err) {
                console.error("Error deleting profile:", err);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-surface bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">Manage Profiles</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Add/Edit Form */}
                    {(isAdding || editingId) && (
                        <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-200">
                            <div className="font-medium text-sm text-gray-700">
                                {editingId ? 'Edit Profile' : 'New Profile'}
                            </div>

                            <input
                                type="text"
                                placeholder="Profile Name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                autoFocus
                            />

                            <div className="flex space-x-2">
                                {COLOR_THEMES.map(theme => (
                                    <button
                                        key={theme.id}
                                        onClick={() => setFormData(prev => ({ ...prev, color_theme: theme.id }))}
                                        className={`w-8 h-8 rounded-full ${theme.bg} transition-transform ${formData.color_theme === theme.id ? 'scale-110 ring-2 ring-offset-2 ring-gray-400' : 'opacity-70 hover:opacity-100'
                                            }`}
                                        title={theme.name}
                                    />
                                ))}
                            </div>

                            <div className="flex justify-end space-x-2 pt-2">
                                <button
                                    onClick={resetForm}
                                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-lg text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center space-x-1"
                                >
                                    <Check size={16} />
                                    <span>Save</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Profile List */}
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                        {!isAdding && !editingId && (
                            <button
                                onClick={() => setIsAdding(true)}
                                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center space-x-2 font-medium"
                            >
                                <Plus size={20} />
                                <span>Add New Profile</span>
                            </button>
                        )}

                        {profiles.map(profile => (
                            <div
                                key={profile.id}
                                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${editingId === profile.id ? 'bg-primary/5 border-primary' : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-${profile.color_theme}-500 ${profile.color_theme === 'emerald' ? 'bg-emerald-500' : profile.color_theme === 'blue' ? 'bg-blue-500' : 'bg-orange-500'}`}>
                                        {profile.name.charAt(0)}
                                    </div>
                                    <span className="font-medium text-gray-700">{profile.name}</span>
                                </div>

                                <div className="flex items-center space-x-1">
                                    <button
                                        onClick={() => startEdit(profile)}
                                        disabled={!!editingId || isAdding}
                                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-30"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(profile.id)}
                                        disabled={!!editingId || isAdding}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
