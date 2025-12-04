import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [profiles, setProfiles] = useState([]);
    const [currentProfile, setCurrentProfile] = useState(null);
    const [meals, setMeals] = useState([]);
    const [shoppingItems, setShoppingItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();

        // Realtime Subscription for Shopping List (Global)
        const shoppingSubscription = supabase
            .channel('shopping_list_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'shopping_list' }, (payload) => {
                handleShoppingListChange(payload);
            })
            .subscribe();

        // Realtime Subscription for Weekly Plan
        const mealsSubscription = supabase
            .channel('weekly_plan_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'weekly_plan' }, (payload) => {
                handleMealChange(payload);
            })
            .subscribe();

        return () => {
            shoppingSubscription.unsubscribe();
            mealsSubscription.unsubscribe();
        };
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: profilesData } = await supabase.from('profiles').select('*').order('name');
            const { data: mealsData } = await supabase.from('weekly_plan').select('*');
            const { data: itemsData } = await supabase.from('shopping_list').select('*').order('created_at');

            setProfiles(profilesData || []);
            setMeals(mealsData || []);
            setShoppingItems(itemsData || []);

            // Set default profile (Mom or first one)
            if (profilesData && profilesData.length > 0) {
                const defaultProfile = profilesData.find(p => p.name === 'Mom') || profilesData[0];
                setCurrentProfile(defaultProfile);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShoppingListChange = (payload) => {
        if (payload.eventType === 'INSERT') {
            setShoppingItems(prev => [...prev, payload.new]);
        } else if (payload.eventType === 'UPDATE') {
            setShoppingItems(prev => prev.map(item => item.id === payload.new.id ? payload.new : item));
        } else if (payload.eventType === 'DELETE') {
            setShoppingItems(prev => prev.filter(item => item.id !== payload.old.id));
        }
    };

    const handleMealChange = (payload) => {
        if (payload.eventType === 'INSERT') {
            setMeals(prev => [...prev, payload.new]);
        } else if (payload.eventType === 'UPDATE') {
            setMeals(prev => prev.map(meal => meal.id === payload.new.id ? payload.new : meal));
        } else if (payload.eventType === 'DELETE') {
            setMeals(prev => prev.filter(meal => meal.id !== payload.old.id));
        }
    };

    // --- Data Helpers ---

    const updateMeal = async (day, mealType, dishName, profileId) => {
        // Check if meal exists
        const existing = meals.find(m => m.day_of_week === day && m.meal_type === mealType && m.profile_id === profileId);

        if (existing) {
            const { error } = await supabase.from('weekly_plan').update({ dish_name: dishName }).eq('id', existing.id);
            if (error) throw error;
        } else {
            const { error } = await supabase.from('weekly_plan').insert([{ day_of_week: day, meal_type: mealType, dish_name: dishName, profile_id: profileId }]);
            if (error) throw error;
        }
    };

    const addShoppingItem = async (name) => {
        const { error } = await supabase.from('shopping_list').insert([{ item_name: name, is_checked: false }]);
        if (error) throw error;
    };

    const toggleShoppingItem = async (id, isChecked) => {
        const { error } = await supabase.from('shopping_list').update({ is_checked: isChecked }).eq('id', id);
        if (error) throw error;
    };

    return (
        <AppContext.Provider value={{
            loading,
            profiles,
            currentProfile,
            setCurrentProfile,
            meals,
            shoppingItems,
            updateMeal,
            addShoppingItem,
            toggleShoppingItem
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
