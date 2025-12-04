import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
    LayoutDashboard,
    ShoppingCart,
    Bot,
    Menu
} from 'lucide-react';

export default function Layout({ children, activeTab, setActiveTab }) {
    const { profiles, currentProfile, setCurrentProfile } = useApp();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const NavItem = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => {
                setActiveTab(id);
                setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === id
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
    const COLOR_THEMES = {
            emerald: 'bg-emerald-500 ring-emerald-500',
            blue: 'bg-blue-500 ring-blue-500',
            orange: 'bg-orange-500 ring-orange-500',
            green: 'bg-emerald-500 ring-emerald-500', // Fallback
            primary: 'bg-primary ring-primary'
        };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-surface border-r border-gray-200 transform transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="h-full flex flex-col p-6">
                    <div className="flex items-center space-x-2 mb-8">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Bot className="text-white" size={20} />
                        </div>
                        <span className="text-xl font-bold text-gray-800">NutriSmart</span>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-2 flex-1">
                        <NavItem id="planner" icon={LayoutDashboard} label="Planificador" />
                        <NavItem id="shopping" icon={ShoppingCart} label="Lista de Compra" />
                        <NavItem id="agent" icon={Bot} label="Nutri-Agente" />
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Bar with Profile Tabs */}
                <div className="bg-surface border-b border-gray-200 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="lg:hidden flex items-center w-full justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <Bot className="text-white" size={20} />
                            </div>
                            <span className="text-xl font-bold text-gray-800">NutriSmart</span>
                        </div>
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            <Menu size={24} />
                        </button>
                    </div>

                    {/* Profile Tabs */}
                    <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
                        {profiles.map(profile => {
                            const themeClass = COLOR_THEMES[profile.color_theme] || COLOR_THEMES.primary;
                            const isActive = currentProfile?.id === profile.id;

                            return (
                                <button
                                    key={profile.id}
                                    onClick={() => setCurrentProfile(profile)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${isActive
                                            ? `${themeClass} text-white shadow-sm ring-2 ring-offset-2`
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                                        {profile.name.charAt(0)}
                                    </div>
                                    <span className="font-medium">{profile.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
