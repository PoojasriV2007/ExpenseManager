# Spendly – Personal Expense Manager

A small React app for recording daily expenses and viewing totals, search results and category-based filtering. Built with **React, CSS and Vite**. No backend.

## Features

- Add an expense with **title, amount, category and date**, with validation (required fields, amount > 0 with up to 2 decimals, no future dates)
- **Edit** and **delete** expenses (delete asks for confirmation)
- **Search** by title and **filter** by category; the filtered total updates live
- **Summary cards**: total expenses, this month (with change vs last month), top category, transactions this month
- **Monthly bar chart** (last 6, 9 or 12 months) and a **category donut chart**, built with plain SVG/CSS
- Views: Dashboard, Add Expense, Expenses (full list), Categories, Analytics, Settings (your name, load sample data, delete all)
- Data lives in React state (`useState`) and is mirrored to `localStorage`, so it survives a refresh
- Responsive: the sidebar becomes a slide-out menu and the table becomes a card list on small screens

Sample data is loaded on the first visit only. Use **Settings → Delete all expenses** to start clean.

## Components

| Component | Responsibility |
|---|---|
| `App` | Holds UI state (view, search, filter, modals) and wires components together |
| `hooks/useExpenses` | Expense list state plus add, update and delete; syncs to localStorage |
| `ExpenseForm` | Controlled form with validation, used for both add and edit |
| `ExpenseList` / `ExpenseItem` | Table with search and category filter, one row per expense |
| `Summary` | The four stat cards |
| `MonthlyChart` / `CategoryChart` | Bar and donut charts |
| `CategoriesView` / `SettingsView` | Secondary pages |
| `Sidebar`, `Header`, `Modal` | Layout and shared UI |

Totals, category shares and monthly sums are computed with array methods (`filter`, `reduce`, `map`) in `src/utils/stats.js`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

Production build:

```bash
npm run build      # outputs to dist/
npm run preview    # serves dist/ on http://localhost:4173
```

## Deploy to Netlify

1. Push this folder to GitHub.
2. In Netlify, choose **Add new site → Import an existing project** and pick the repository.
3. Build command: `npm run build`. Publish directory: `dist`. `netlify.toml` already sets both, plus Node 22 and an SPA fallback.
4. From the live URL, check the form, filters, totals, refresh behaviour and responsive layout.
