import { UtensilsCrossed, Bus, ShoppingBag, Zap, Clapperboard, Tag } from 'lucide-react'

export const CATEGORIES = [
  { name: 'Food', color: '#7c5cf6', bg: '#f1eaff', ink: '#7c3aed', icon: UtensilsCrossed },
  { name: 'Transport', color: '#4f7cf7', bg: '#e5efff', ink: '#2563eb', icon: Bus },
  { name: 'Shopping', color: '#ec4899', bg: '#fde7f1', ink: '#db2777', icon: ShoppingBag },
  { name: 'Bills', color: '#fbbf24', bg: '#fef3c7', ink: '#d97706', icon: Zap },
  { name: 'Entertainment', color: '#22c55e', bg: '#dcfce7', ink: '#16a34a', icon: Clapperboard },
  { name: 'Others', color: '#c3c6de', bg: '#eef0f6', ink: '#64748b', icon: Tag },
]

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name)

export const getCategory = (name) =>
  CATEGORIES.find((c) => c.name === name) ?? CATEGORIES[CATEGORIES.length - 1]
