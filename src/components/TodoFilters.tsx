import { useState } from 'react';
import { Priority, Category } from '../types';
import { Search, Filter, ArrowUpDown, Trash2, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { categoryColorMap, priorityColorMap } from '../utils';
import { motion, AnimatePresence } from 'motion/react';
import { translations, Locale, getCategoryName } from '../translations';

interface TodoFiltersProps {
  categories: Category[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: 'all' | 'active' | 'completed';
  onStatusChange: (status: 'all' | 'active' | 'completed') => void;
  priorityFilter: Priority | 'all';
  onPriorityChange: (priority: Priority | 'all') => void;
  categoryFilter: string | 'all';
  onCategoryChange: (category: string | 'all') => void;
  sortBy: string;
  onSortByChange: (sortBy: string) => void;
  locale: Locale;
}

export function TodoFilters({
  categories,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  categoryFilter,
  onCategoryChange,
  sortBy,
  onSortByChange,
  locale
}: TodoFiltersProps) {
  const t = translations[locale];
  const [showAdvanced, setShowAdvanced] = useState(false);

  const sortOptions = [
    { value: 'created-desc', label: t.sort_created_desc },
    { value: 'created-asc', label: t.sort_created_asc },
    { value: 'priority-desc', label: t.sort_priority_desc },
    { value: 'priority-asc', label: t.sort_priority_asc },
    { value: 'due-asc', label: t.sort_due_asc },
    { value: 'due-desc', label: t.sort_due_desc },
    { value: 'text-asc', label: t.sort_text_asc }
  ];

  const hasActiveFilters = searchQuery !== '' || priorityFilter !== 'all' || categoryFilter !== 'all';
  const hasAdvancedFilters = priorityFilter !== 'all' || categoryFilter !== 'all';

  const handleResetFilters = () => {
    onSearchChange('');
    onPriorityChange('all');
    onCategoryChange('all');
  };

  return (
    <div id="todo-filters-panel" className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 md:p-5 mb-6 shadow-xs space-y-4">
      {/* Search and Sort Topbar */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 stroke-[2]" size={16} />
          <input
            id="todo-search-field"
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:flex-none">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <select
              id="todo-sorting-dropdown"
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="w-full md:w-52 pl-9 pr-3 py-2.5 bg-slate-50/70 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle Advanced Filters */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              showAdvanced || hasAdvancedFilters
                ? 'bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-950/20 dark:border-indigo-900/40 dark:text-indigo-400'
                : 'bg-slate-50/55 border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
            title={locale === 'en' ? 'Toggle Detailed Filters' : '展开/收起高级筛选面版'}
          >
            <SlidersHorizontal size={16} className="stroke-[2.25]" />
          </button>
        </div>
      </div>

      {/* Main Status Toggle Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-100 dark:border-slate-800">
          {(['all', 'active', 'completed'] as const).map((status) => {
            const isActive = statusFilter === status;
            let statusLabel = status as string;
            if (status === 'all') statusLabel = t.allStatus;
            if (status === 'active') statusLabel = t.activeStatus;
            if (status === 'completed') statusLabel = t.completedStatus;

            return (
              <button
                key={status}
                type="button"
                onClick={() => onStatusChange(status)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer capitalize ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm border border-slate-100/50 dark:border-slate-800/50'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                {statusLabel}
              </button>
            );
          })}
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50/50 dark:text-indigo-400 dark:bg-indigo-950/10 cursor-pointer hover:underline transition-all"
            >
              <RefreshCw size={12} />
              <span>{t.resetParamsBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden space-y-4 pt-3 border-t border-slate-50 dark:border-slate-800"
          >
            {/* Filter by Priority */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">{t.prioritySegment}</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => onPriorityChange('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    priorityFilter === 'all'
                      ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900'
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50/50'
                  }`}
                >
                  {t.allPriorities}
                </button>
                {(Object.keys(priorityColorMap) as Priority[]).map((p) => {
                  const isActive = priorityFilter === p;
                  const colors = priorityColorMap[p];
                  let pLabel = p as string;
                  if (p === Priority.Low) pLabel = t.lowPrior;
                  if (p === Priority.Medium) pLabel = t.medPrior;
                  if (p === Priority.High) pLabel = t.highPrior;

                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => onPriorityChange(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border uppercase tracking-wider transition-all cursor-pointer ${
                        isActive
                          ? `${colors.bg} ${colors.text} ${colors.ring.replace('ring-', 'border-').split(' ')[0]} font-semibold`
                          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {pLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter by Category */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">{t.categorySegment}</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => onCategoryChange('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    categoryFilter === 'all'
                      ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900'
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50/50'
                  }`}
                >
                  {t.allCategories}
                </button>
                {categories.map((cat) => {
                  const isActive = categoryFilter === cat.id;
                  const colorObj = categoryColorMap[cat.color] || categoryColorMap.indigo;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => onCategoryChange(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? `${colorObj.bg} ${colorObj.text} ${colorObj.border} font-semibold`
                          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50/50'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${colorObj.dot}`} />
                      <span>{getCategoryName(cat.id, locale)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
