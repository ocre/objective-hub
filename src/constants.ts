import { Category } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'work', name: 'Work', color: 'indigo' },
  { id: 'personal', name: 'Personal', color: 'emerald' },
  { id: 'shopping', name: 'Shopping', color: 'rose' },
  { id: 'health', name: 'Health & Wellness', color: 'amber' },
  { id: 'ideas', name: 'Ideas & Inspiration', color: 'violet' }
];

export const STORAGE_KEYS = {
  TODOS: 'priority_todo_items',
  CATEGORIES: 'priority_todo_categories'
};
