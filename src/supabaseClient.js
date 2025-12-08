import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase;

if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.error('Missing Supabase environment variables! Check .env or GitHub Secrets.');
    // Create a dummy client that logs errors instead of crashing immediately
    supabase = {
        auth: {
            getSession: async () => ({ data: { session: null }, error: new Error('Missing Env Vars') }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithPassword: async () => ({ error: { message: 'Supabase no configurado (Variables de entorno faltantes).' } }),
            signUp: async () => ({ error: { message: 'Supabase no configurado.' } }),
            signOut: async () => ({ error: null })
        },
        from: () => ({
            select: () => ({ order: () => ({ data: [], error: new Error('Missing Env Vars') }) }),
            insert: () => ({ select: () => ({ single: () => ({ error: new Error('Missing Env Vars') }) }) }),
            update: () => ({ eq: () => ({ error: new Error('Missing Env Vars') }) }),
            delete: () => ({ eq: () => ({ error: new Error('Missing Env Vars') }) })
        }),
        channel: () => ({
            on: () => ({ subscribe: () => ({ unsubscribe: () => { } }) })
        })
    };
}

export { supabase };
