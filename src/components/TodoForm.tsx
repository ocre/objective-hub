import React, { useState } from 'react';
import { Priority, Todo, Category } from '../types';
import { Plus, Calendar, Tag, ChevronDown, ChevronUp, AlertCircle, Bell } from 'lucide-react';
import { priorityColorMap, categoryColorMap } from '../utils';
import { motion, AnimatePresence } from 'motion/react';
import { translations, Locale, getCategoryName } from '../translations';

interface TodoFormProps {
  categories: Category[];
  onAddTodo: (todo: Omit<Todo, 'id' | 'completed' | 'createdAt' | 'archived'>) => void;
  onAddCategory: (name: string, color: string) => void;
  locale: Locale;
}

export function TodoForm({ categories, onAddTodo, onAddCategory, locale }: TodoFormProps) {
  const t = translations[locale];
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.Medium);
  const [category, setCategory] = useState(categories[0]?.id || 'work');
  const [dueDate, setDueDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  
  // Custom Category adding inline state
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('indigo');
  
  // Expand details state
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError(t.errorTitleRequired);
      return;
    }
    
    setError('');
    onAddTodo({
      text: text.trim(),
      description: description.trim() || undefined,
      priority,
      category,
      dueDate: dueDate || undefined,
      reminderTime: reminderTime || undefined
    });

    // Reset standard form parts
    setText('');
    setDescription('');
    setPriority(Priority.Medium);
    setDueDate('');
    setReminderTime('');
    setShowDetails(false);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    
    onAddCategory(newCatName.trim(), newCatColor);
    setCategory(newCatName.toLowerCase().replace(/\s+/g, '-'));
    setNewCatName('');
    setShowAddCategory(false);
  };

  // Pre-configured tag colors for category generator
  const colorOptions = ['indigo', 'emerald', 'rose', 'amber', 'violet'];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm p-5 md:p-6 mb-8"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input Grid */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="todo-title-input" className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
            {t.createNewTask}
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                id="todo-title-input"
                type="text"
                placeholder={t.taskPlaceholder}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  if (e.target.value.trim()) setError('');
                }}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
              />
              {error && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-rose-500 gap-1 text-xs">
                  <AlertCircle size={14} />
                  <span>{t.requiredBadge}</span>
                </div>
              )}
            </div>
            
            <button
              type="submit"
              className="px-5 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer whitespace-nowrap group"
            >
              <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>{t.addTask}</span>
            </button>
          </div>
        </div>

        {/* Form controls & expanding fields */}
        <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-slate-50 dark:border-slate-800">
          
          {/* Left panel: Priority & Basic controls */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Priority Select */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{t.priorityLevel}</span>
              <div className="inline-flex bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-100 dark:border-slate-800">
                {(Object.keys(priorityColorMap) as Priority[]).map((p) => {
                  const itemColor = priorityColorMap[p];
                  const isSelected = priority === p;
                  let pLabel = p as string;
                  if (p === Priority.Low) pLabel = t.lowPrior;
                  if (p === Priority.Medium) pLabel = t.medPrior;
                  if (p === Priority.High) pLabel = t.highPrior;

                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        isSelected 
                          ? `${itemColor.bg} ${itemColor.text} shadow-xs ring-1 ${itemColor.ring}`
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                    >
                      {pLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Select */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{t.categoryTag}</span>
              <div className="flex items-center gap-1.5">
                <select
                  id="category-selector-form"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {getCategoryName(cat.id, locale)}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setShowAddCategory(!showAddCategory)}
                  className="p-1 px-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl text-[10px] font-sans text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all cursor-pointer"
                >
                  {t.newTagBtn}
                </button>
              </div>
            </div>

            {/* Due Date picker */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Calendar size={10} /> {t.dateLimit}
              </span>
              <input
                id="due-date-form-picker"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-3 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all cursor-pointer"
              />
            </div>

            {/* Reminder Time Picker */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Bell size={10} /> {t.reminderLabel}
              </span>
              <input
                id="reminder-time-form-picker"
                type="datetime-local"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="px-3 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all cursor-pointer"
              />
            </div>
          </div>

          {/* Right panel: Toggle Additional Details button */}
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs font-sans font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center justify-end gap-1.5 cursor-pointer py-1 self-end md:self-center"
          >
            <span>{showDetails ? t.hideNotesBtn : t.addNotesBtn}</span>
            {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Dynamic New Category popup Form */}
        <AnimatePresence>
          {showAddCategory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-850 p-4 rounded-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Tag size={12} className="text-indigo-600" /> {t.specifyCatProps}
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddCategory(false)}
                  className="text-[10px] font-sans font-semibold text-slate-400 hover:text-slate-600"
                >
                  {t.dismissBtn}
                </button>
              </div>
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-[150px]">
                  <input
                    id="new-category-name-input"
                    type="text"
                    placeholder={t.catNamePlaceholder}
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                
                {/* Color Selector */}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">{t.labelShade}</span>
                  <div className="flex items-center gap-1.5 py-1">
                    {colorOptions.map((shade) => {
                      const colorObj = categoryColorMap[shade];
                      return (
                        <button
                          key={shade}
                          type="button"
                          onClick={() => setNewCatColor(shade)}
                          className={`w-5 h-5 rounded-full ${colorObj.dot} border transition-all cursor-pointer flex items-center justify-center ${
                            newCatColor === shade 
                              ? 'ring-2 ring-indigo-500 scale-110 border-white' 
                              : 'scale-90 border-transparent hover:scale-100'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={!newCatName.trim()}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  {t.generateLabelBtn}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expandable Notes Input */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden space-y-1.5"
            >
              <label htmlFor="todo-description-textarea" className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                {t.additionalDetails}
              </label>
              <textarea
                id="todo-description-textarea"
                rows={3}
                placeholder={t.detailsPlaceholder}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-405 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-xs font-sans leading-relaxed"
              />
            </motion.div>
          )}
        </AnimatePresence>

      </form>
    </motion.div>
  );
}
