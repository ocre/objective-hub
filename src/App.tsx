import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Todo, Priority, Category } from './types';
import { DEFAULT_CATEGORIES, STORAGE_KEYS } from './constants';
import { TodoStats } from './components/TodoStats';
import { TodoForm } from './components/TodoForm';
import { TodoFilters } from './components/TodoFilters';
import { TodoList } from './components/TodoList';
import { Download, Upload, ClipboardList, Settings, Sparkles, CheckSquare, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { translations, Locale } from './translations';

const INITIAL_TODOS: Todo[] = [
  {
    id: 'setup-initial-high',
    text: 'Formulate upcoming roadmap benchmarks',
    description: 'Establish core target indicators for our key metrics and prepare brief summaries of findings.',
    priority: Priority.High,
    completed: false,
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    category: 'work',
    createdAt: Date.now() - 3600000
  },
  {
    id: 'setup-initial-med',
    text: 'Order heavy-duty braided cables',
    description: 'Double check charging capacity works fine with 65W smart dual adapters.',
    priority: Priority.Medium,
    completed: false,
    category: 'shopping',
    createdAt: Date.now() - 7200000
  },
  {
    id: 'setup-initial-low',
    text: 'Complete evening aerobic wellness segment',
    description: 'Aim for a 30-minute light routine to track targets on wearable logs.',
    priority: Priority.Low,
    completed: true,
    category: 'health',
    createdAt: Date.now() - 86400000
  }
];

export default function App() {
  // Multilingual active locale state
  const [locale, setLocale] = useState<Locale>(() => {
    const stored = localStorage.getItem('applet_locale');
    return (stored === 'zh' || stored === 'en') ? stored : 'en';
  });

  // Load todos from storage, fallback to INITIAL_TODOS if empty
  const [todos, setTodos] = useState<Todo[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.TODOS);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored todos', e);
      }
    }
    return INITIAL_TODOS;
  });

  // Load categories from storage, fallback to DEFAULT_CATEGORIES
  const [categories, setCategories] = useState<Category[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored categories', e);
      }
    }
    return DEFAULT_CATEGORIES;
  });

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all');
  const [sortBy, setSortBy] = useState('created-desc');

  // Backup & settings drawer toggle state
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = translations[locale];

  // Save active language selection
  useEffect(() => {
    localStorage.setItem('applet_locale', locale);
  }, [locale]);

  // Synchronize todos to localstorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
  }, [todos]);

  // Synchronize categories to localstorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  // Create new Todo
  const handleAddTodo = (newTodoData: Omit<Todo, 'id' | 'completed' | 'createdAt'>) => {
    const newTodo: Todo = {
      ...newTodoData,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      completed: false,
      createdAt: Date.now()
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  // Create custom new Category
  const handleAddCategory = (name: string, color: string) => {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    if (categories.some((c) => c.id === id)) return; // prevent exact duplicates

    const newCat: Category = { id, name, color };
    setCategories((prev) => [...prev, newCat]);
  };

  // Toggle Complete / Pending state
  const handleToggleComplete = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  // Update specific fields on Todo item
  const handleUpdateTodo = (id: string, updatedFields: Partial<Todo>) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...updatedFields } : todo))
    );
  };

  // Delete Todo item
  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // Purge/Clear completed items
  const handleClearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  // Backup Export
  const handleExportBackup = () => {
    try {
      const dataStr = JSON.stringify({ todos, categories }, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.download = `todo_list_archive_${new Date().toISOString().split('T')[0]}.json`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Backup save failed', e);
    }
  };

  // Backup Import
  const handleImportBackup = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.todos)) {
          setTodos(parsed.todos);
        }
        if (Array.isArray(parsed.categories)) {
          setCategories(parsed.categories);
        }
        setShowSettings(false);
      } catch (err) {
        alert(t.invalidArchive);
      }
    };
    reader.readAsText(file);
    // Reset file input value so same file can be chose again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Filter Logic
  const filteredTodos = todos.filter((todo) => {
    const matchesSearch =
      todo.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && !todo.completed) ||
      (statusFilter === 'completed' && todo.completed);

    const matchesPriority = priorityFilter === 'all' || todo.priority === priorityFilter;

    const matchesCategory = categoryFilter === 'all' || todo.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Sorting Logic
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    switch (sortBy) {
      case 'created-desc':
        return b.createdAt - a.createdAt;
      case 'created-asc':
        return a.createdAt - b.createdAt;
      case 'priority-desc': {
        const pA = a.priority === Priority.High ? 3 : a.priority === Priority.Medium ? 2 : 1;
        const pB = b.priority === Priority.High ? 3 : b.priority === Priority.Medium ? 2 : 1;
        return pB - pA;
      }
      case 'priority-asc': {
        const pA = a.priority === Priority.High ? 3 : a.priority === Priority.Medium ? 2 : 1;
        const pB = b.priority === Priority.High ? 3 : b.priority === Priority.Medium ? 2 : 1;
        return pA - pB;
      }
      case 'due-asc': {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      case 'due-desc': {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      }
      case 'text-asc':
        return a.text.localeCompare(b.text);
      default:
        return b.createdAt - a.createdAt;
    }
  });

  const mainCompletedCount = todos.filter((todoItem) => todoItem.completed).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans transition-colors duration-200">
      
      {/* Decorative Top Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 md:py-12 space-y-6">
        
        {/* Master Header */}
        <header className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/10">
              <CheckSquare size={22} className="stroke-[2.25] rotate-2" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                {t.appName} <span className="text-xs font-mono font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">{t.localBadge}</span>
              </h1>
              <p className="text-xs text-slate-400 font-mono tracking-wider mt-0.5">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Configuration, language switching and archiving controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                showSettings
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                  : 'bg-white border-slate-100 text-slate-500 hover:text-slate-700 shadow-3xs'
              }`}
              title="Backup and settings"
            >
              <Settings size={16} className={`transition-transform duration-500 ${showSettings ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </header>

        {/* Setting / Archiving Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
                {/* Archive Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">{t.archiveManager}</h4>
                    <p className="text-xs text-slate-500">
                      {t.archiveDesc}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleExportBackup}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Download size={13} />
                      <span>{t.backupBtn}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-3xs transition-all cursor-pointer"
                    >
                      <Upload size={13} />
                      <span>{t.importBtn}</span>
                    </button>
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImportBackup}
                      accept=".json"
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100/60 dark:border-slate-800/40" />

                {/* Language Switch Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">{t.languageLabel}</h4>
                    <p className="text-xs text-slate-500">
                      {t.languageDesc}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
                    className="px-4 py-2 bg-indigo-50 hover:bg-indigo-150/80 border border-indigo-150 text-indigo-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    title={locale === 'en' ? 'Switch to Chinese (切换为中文)' : 'Switch to English (切换为英文)'}
                  >
                    <Globe size={13} className="text-indigo-500" />
                    <span>{t.switchLangBtn}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard statistics section */}
        <TodoStats
          todos={todos}
          selectedPriority={priorityFilter}
          onSelectPriority={setPriorityFilter}
          locale={locale}
        />

        {/* Task registration form */}
        <TodoForm
          categories={categories}
          onAddTodo={handleAddTodo}
          onAddCategory={handleAddCategory}
          locale={locale}
        />

        {/* Search, sorting, and tag controls */}
        <TodoFilters
          categories={categories}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onClearCompleted={handleClearCompleted}
          completedCount={mainCompletedCount}
          locale={locale}
        />

        {/* Interactive listing layout */}
        <TodoList
          todos={sortedTodos}
          categories={categories}
          totalCount={todos.length}
          onToggleComplete={handleToggleComplete}
          onUpdateTodo={handleUpdateTodo}
          onDeleteTodo={handleDeleteTodo}
          locale={locale}
          onResetFilters={() => {
            setSearchQuery('');
            setStatusFilter('all');
            setPriorityFilter('all');
            setCategoryFilter('all');
          }}
        />

        {/* Humble, clean page footer */}
        <footer className="pt-8 text-center border-t border-slate-200">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <span>{t.persistenceEngine}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t.secureStorage}</span>
          </p>
        </footer>

      </main>

    </div>
  );
}
