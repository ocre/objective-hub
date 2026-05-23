import { Priority } from './types';
import { Locale } from './translations';

export const categoryColorMap: Record<string, { bg: string; text: string; border: string; dot: string; accent: string }> = {
  indigo: {
    bg: 'bg-indigo-50/80 dark:bg-indigo-950/30',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-100 dark:border-indigo-950/50',
    dot: 'bg-indigo-500',
    accent: 'accent-indigo-600'
  },
  emerald: {
    bg: 'bg-emerald-50/80 dark:bg-emerald-950/30',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-100 dark:border-emerald-950/50',
    dot: 'bg-emerald-500',
    accent: 'accent-emerald-600'
  },
  rose: {
    bg: 'bg-rose-50/80 dark:bg-rose-950/30',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-100 dark:border-rose-950/50',
    dot: 'bg-rose-500',
    accent: 'accent-rose-600'
  },
  amber: {
    bg: 'bg-amber-50/80 dark:bg-amber-950/30',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-100 dark:border-amber-950/50',
    dot: 'bg-amber-500',
    accent: 'accent-amber-600'
  },
  violet: {
    bg: 'bg-violet-50/80 dark:bg-violet-950/30',
    text: 'text-violet-700 dark:text-violet-300',
    border: 'border-violet-100 dark:border-violet-950/50',
    dot: 'bg-violet-500',
    accent: 'accent-violet-600'
  }
};

export const priorityColorMap: Record<Priority, { bg: string; text: string; ring: string; textDark: string; label: string }> = {
  [Priority.Low]: {
    bg: 'bg-sky-50 dark:bg-sky-950/30',
    text: 'text-sky-700 dark:text-sky-300',
    ring: 'ring-sky-100 dark:ring-sky-950/50',
    textDark: 'text-sky-900 dark:text-sky-100',
    label: 'Low Priority'
  },
  [Priority.Medium]: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-700 dark:text-amber-300',
    ring: 'ring-amber-200 dark:ring-amber-950/50',
    textDark: 'text-amber-900 dark:text-amber-100',
    label: 'Medium Priority'
  },
  [Priority.High]: {
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    text: 'text-rose-700 dark:text-rose-300',
    ring: 'ring-rose-200 dark:ring-rose-950/50',
    textDark: 'text-rose-900 dark:text-rose-100',
    label: 'High Priority'
  }
};

/**
 * Checks if a due date is strictly in the past (overdue).
 * Ignores time of day, comparing purely on calendar dates.
 */
export function isOverdue(dueDateString?: string, completed?: boolean): boolean {
  if (!dueDateString || completed) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDateString);
  due.setHours(0, 0, 0, 0);
  
  return due < today;
}

/**
 * Returns a human-friendly format of the due date.
 */
export function formatDueDate(dueDateString?: string, locale: Locale = 'en'): string {
  if (!dueDateString) return '';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const due = new Date(dueDateString);
  due.setHours(0, 0, 0, 0);
  
  if (due.getTime() === today.getTime()) {
    return locale === 'zh' ? '今天' : 'Today';
  } else if (due.getTime() === tomorrow.getTime()) {
    return locale === 'zh' ? '明天' : 'Tomorrow';
  } else if (due.getTime() === yesterday.getTime()) {
    return locale === 'zh' ? '昨天' : 'Yesterday';
  } else {
    // Format options: "May 25, 2026" or "2026/5/25" / "5月25日"
    if (locale === 'zh') {
      const yearStr = due.getFullYear() !== today.getFullYear() ? `${due.getFullYear()}年` : '';
      return `${yearStr}${due.getMonth() + 1}月${due.getDate()}日`;
    }
    return due.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: due.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  }
}
