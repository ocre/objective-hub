export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export interface Todo {
  id: string;
  text: string;
  description?: string;
  priority: Priority;
  completed: boolean;
  dueDate?: string;
  category: string;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  color: string; // Tailwind color class suffix, eg 'blue', 'purple', etc.
}
