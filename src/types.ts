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
  archived: boolean;
  dueDate?: string;
  reminderTime?: string; // ISO string format or 'YYYY-MM-DDTHH:mm'
  category: string;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  color: string; // Tailwind color class suffix, eg 'blue', 'purple', etc.
}
