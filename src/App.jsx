import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import MealPlanner from './components/MealPlanner';
import ShoppingList from './components/ShoppingList';
import NutriAgent from './components/NutriAgent';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { loading } = useApp();
  const [activeTab, setActiveTab] = useState('planner');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'planner' && <MealPlanner />}
      {activeTab === 'shopping' && <ShoppingList />}
      {activeTab === 'agent' && <NutriAgent />}
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
