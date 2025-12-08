import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [profiles, setProfiles] = useState([]);
    const [currentProfile, setCurrentProfile] = useState(null);
    const [meals, setMeals] = useState([]);
    const [shoppingItems, setShoppingItems] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);

    useEffect(() => {
        // 1. Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchData();
            else setLoading(false);
        });

        // 2. Listen for auth changes
        const {
            data: { subscription: authListener },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) fetchData();
            else {
                setProfiles([]);
                setMeals([]);
                setShoppingItems([]);
                setRecipes([]);
                setCategories([]);
                setLoading(false);
            }
        });

        // 3. Realtime Subscriptions (Only if session exists - simplified here, 
        // we ideally re-subscribe when session changes, but for simplicity we'll keep it global 
        // as policies will block access if not auth anyway).
        // ACTUALLY: We should probably move subscriptions inside a useEffect that depends on session.
        let shoppingSubscription, mealsSubscription, recipesSubscription;

        if (true) { // We'll rely on connection staying open, but data policies enforcing access
            // Realtime Subscription for Shopping List (Global)
            shoppingSubscription = supabase
                .channel('shopping_list_changes')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'shopping_list' }, (payload) => {
                    handleShoppingListChange(payload);
                })
                .subscribe();

            // Realtime Subscription for Weekly Plan
            mealsSubscription = supabase
                .channel('weekly_plan_changes')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'weekly_plan' }, (payload) => {
                    handleMealChange(payload);
                })
                .subscribe();


            // Realtime Subscription for Recipes
            recipesSubscription = supabase
                .channel('recipes_changes')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'recipes' }, () => {
                    fetchRecipesOnly();
                })
                .subscribe();
        }

        return () => {
            authListener.unsubscribe();
            if (shoppingSubscription) shoppingSubscription.unsubscribe();
            if (mealsSubscription) mealsSubscription.unsubscribe();
            if (recipesSubscription) recipesSubscription.unsubscribe();
        };
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: profilesData } = await supabase.from('profiles').select('*').order('name');
            const { data: mealsData } = await supabase.from('weekly_plan').select('*');
            const { data: itemsData } = await supabase.from('shopping_list').select('*').order('created_at');
            const { data: recipesData } = await supabase.from('recipes').select(`
                *,
                recipe_ingredients (*)
            `).order('created_at', { ascending: false });
            const { data: categoriesData } = await supabase.from('categories').select('*').order('name');

            setProfiles(profilesData || []);
            setMeals(mealsData || []);
            setShoppingItems(itemsData || []);
            setRecipes(recipesData || []);
            setCategories(categoriesData || []);

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

    const fetchRecipesOnly = async () => {
        const { data } = await supabase.from('recipes').select(`
            *,
            recipe_ingredients (*)
        `).order('created_at', { ascending: false });
        if (data) setRecipes(data);
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
        // Optimistic Update
        setShoppingItems(prev => prev.map(item => item.id === id ? { ...item, is_checked: isChecked } : item));

        try {
            const { error } = await supabase.from('shopping_list').update({ is_checked: isChecked }).eq('id', id);
            if (error) throw error;
        } catch (error) {
            // Revert on error
            setShoppingItems(prev => prev.map(item => item.id === id ? { ...item, is_checked: !isChecked } : item));
            console.error("Error toggling shopping item:", error);
            // Optional: Alert user
        }
    };

    const addRecipe = async (name, instructions, imageUrl, ingredients, category) => {
        // 1. Insert Recipe
        const { data: recipeData, error: recipeError } = await supabase
            .from('recipes')
            .insert([{ name, instructions, image_url: imageUrl, category }])
            .select()
            .single();

        if (recipeError) throw recipeError;

        // 2. Insert Ingredients
        if (ingredients && ingredients.length > 0) {
            const ingredientsToInsert = ingredients.map(ing => ({
                recipe_id: recipeData.id,
                ingredient_name: ing.name,
                quantity: ing.quantity
            }));

            const { error: ingError } = await supabase
                .from('recipe_ingredients')
                .insert(ingredientsToInsert);

            if (ingError) throw ingError;
        }

        // Trigger fetch to update UI immediately (though subscription might hit too)
        fetchRecipesOnly();
    };

    const deleteRecipe = async (id) => {
        // Optimistic delete
        setRecipes(prev => prev.filter(r => r.id !== id));

        const { error } = await supabase.from('recipes').delete().eq('id', id);
        if (error) {
            // Revert on error - refetch
            fetchRecipesOnly();
            throw error;
        }
    };

    const toggleFavoriteRecipe = async (id, isFavorite) => {
        // Optimistic Update
        setRecipes(prev => prev.map(r => r.id === id ? { ...r, is_favorite: isFavorite } : r));

        try {
            const { error } = await supabase.from('recipes').update({ is_favorite: isFavorite }).eq('id', id);
            if (error) throw error;
        } catch (error) {
            // Revert on error
            setRecipes(prev => prev.map(r => r.id === id ? { ...r, is_favorite: !isFavorite } : r));
            console.error("Error toggling favorite:", error);
            throw error; // Re-throw so UI can alert if needed
        }
    };

    // Category Management
    const addCategory = async (name, icon = null) => {
        const { data, error } = await supabase
            .from('categories')
            .insert([{ name, icon }])
            .select()
            .single();

        if (error) throw error;

        // Optimistically add to state
        setCategories(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
        return data;
    };

    const deleteCategory = async (id) => {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;

        // Remove from state
        setCategories(prev => prev.filter(c => c.id !== id));
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
            toggleShoppingItem,
            recipes,
            addRecipe,
            deleteRecipe,
            toggleFavoriteRecipe,
            categories,
            addCategory,
            deleteCategory,
            session
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
