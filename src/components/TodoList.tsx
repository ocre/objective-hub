import { Todo, Category } from '../types';
import { TodoItem } from './TodoItem';
import { ClipboardList, Sparkles, Sliders } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { translations, Locale } from '../translations';

interface TodoListProps {
  todos: Todo[];
  categories: Category[];
  totalCount: number;
  onToggleComplete: (id: string) => void;
  onUpdateTodo: (id: string, updatedFields: Partial<Todo>) => void;
  onDeleteTodo: (id: string) => void;
  onResetFilters: () => void;
  locale: Locale;
}

export function TodoList({
  todos,
  categories,
  totalCount,
  onToggleComplete,
  onUpdateTodo,
  onDeleteTodo,
  onResetFilters,
  locale
}: TodoListProps) {
  const t = translations[locale];
  
  if (totalCount === 0) {
    return (
      <div id="todo-empty-state" className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-2xl text-indigo-600 dark:text-indigo-400 mb-4 animate-pulse">
          <Sparkles size={24} className="stroke-[2]" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t.noTasksPlanned}</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          {t.noTasksPlannedDesc}
        </p>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div id="todo-empty-filtered-state" className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center">
        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-2xl text-amber-600 dark:text-amber-400 mb-4">
          <Sliders size={24} className="stroke-[2]" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t.noMatchesFound}</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto mb-4">
          {t.noMatchesFoundDesc}
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          {t.resetFiltersBtn}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {/* Title Count Subbar */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <ClipboardList size={14} /> {t.objectivesInView.replace('{count}', String(todos.length))}
        </span>
      </div>

      {/* Interactive Todo List Items */}
      <div id="todos-container-list" className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              categories={categories}
              onToggleComplete={onToggleComplete}
              onUpdateTodo={onUpdateTodo}
              onDeleteTodo={onDeleteTodo}
              locale={locale}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
