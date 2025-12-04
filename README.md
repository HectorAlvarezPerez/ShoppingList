# NutriSmart Agent 🥗🤖

NutriSmart Agent is a modern, family-focused Single Page Application (SPA) designed to simplify meal planning and grocery shopping. It features a **No-Login Shared Database** architecture, allowing family members to access a shared dashboard instantly without the friction of authentication.

## ✨ Key Features

- **🚀 Frictionless Access**: No login required. The app loads directly to the family dashboard.
- **🔄 Real-Time Sync**: Changes to meal plans and shopping lists update instantly across all devices using Supabase Realtime.
- **👥 Multi-User Profiles**: Switch between profiles (e.g., "Mom", "Dad", "Me") to manage individual meal preferences while sharing a global shopping list.
- **📅 Interactive Meal Planner**:
    - Drag-and-drop "Favorites" to quickly plan meals.
    - **Voice-to-Text**: Use the microphone to speak your meal plans.
    - **Fridge View**: A simplified, large-text "Read-Only" mode perfect for a tablet on the fridge.
- **🛒 Smart Shopping List**:
    - Global list shared by the whole family.
    - **Generate from Menu**: Automatically extracts ingredients from the current meal plan.
    - **WhatsApp Export**: Send the shopping list to your family group chat with one click.
- **🤖 Nutri-Agent AI**: A built-in AI assistant that can help you plan meals ("Plan Pizza for Friday") or add items to the list ("Add milk").

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Icons**: Lucide React
- **Deployment**: GitHub Pages

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A [Supabase](https://supabase.com/) account

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/nutrismart-agent.git
    cd nutrismart-agent
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Supabase**:
    - Create a new project on Supabase.
    - Go to the **SQL Editor** in your Supabase dashboard.
    - Copy the contents of `schema.sql` (located in the root of this project) and run it.
    - *Note: The schema disables Row Level Security (RLS) to allow public access, as per the "No-Login" architecture.*

4.  **Set Environment Variables**:
    - Rename `.env.example` to `.env`:
      ```bash
      mv .env.example .env
      ```
    - Update `.env` with your Supabase credentials:
      ```env
      VITE_SUPABASE_URL=your_project_url
      VITE_SUPABASE_ANON_KEY=your_anon_key
      ```

### Running the App

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to the URL shown (usually `http://localhost:5173`).

## 📦 Deployment

This project is configured for deployment to **GitHub Pages**.

1.  Push your code to a GitHub repository.
2.  Go to **Settings > Pages** in your repository.
3.  Select **GitHub Actions** as the source.
4.  The included `.github/workflows/deploy.yml` will automatically build and deploy your app on every push to the `main` branch.

## 📄 License

MIT
