import { useState } from 'react';
import { Todo, Priority, Category } from '../types';
import { priorityColorMap, categoryColorMap, formatDueDate, isOverdue, formatCreateDate } from '../utils';
import { Trash2, Edit2, Check, X, Calendar, AlertTriangle, ChevronDown, ChevronUp, Tag, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { translations, Locale, getCategoryName } from '../translations';

interface TodoItemProps {
  todo: Todo;
  categories: Category[];
  onToggleComplete: (id: string) => void;
  onUpdateTodo: (id: string, updatedFields: Partial<Todo>) => void;
  onDeleteTodo: (id: string) => void;
  locale: Locale;
  key?: string;
}

export function TodoItem({ todo, categories, onToggleComplete, onUpdateTodo, onDeleteTodo, locale }: TodoItemProps) {
  const t = translations[locale];
  const [isEditing, setIsEditing] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  // Editing state fields
  const [editText, setEditText] = useState(todo.text);
  const [editDesc, setEditDesc] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);
  const [editCategory, setEditCategory] = useState(todo.category);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate || '');
  const [editReminderTime, setEditReminderTime] = useState(todo.reminderTime || '');

  const handleSave = () => {
    if (!editText.trim()) return;
    
    onUpdateTodo(todo.id, {
      text: editText.trim(),
      description: editDesc.trim() || undefined,
      priority: editPriority,
      category: editCategory,
      dueDate: editDueDate || undefined,
      reminderTime: editReminderTime || undefined
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setEditDesc(todo.description || '');
    setEditPriority(todo.priority);
    setEditCategory(todo.category);
    setEditDueDate(todo.dueDate || '');
    setEditReminderTime(todo.reminderTime || '');
    setIsEditing(false);
  };

  const handleToggle = () => {
    onToggleComplete(todo.id);
  };

  // Find category metadata
  const currentCategoryObj = categories.find((c) => c.id === todo.category);
  const tagColor = currentCategoryObj ? categoryColorMap[currentCategoryObj.color] : categoryColorMap.indigo;
  
  // Find priority colors
  const pColors = priorityColorMap[todo.priority];
  const isExpired = isOverdue(todo.dueDate, todo.completed);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`group relative bg-white dark:bg-slate-900 border rounded-2xl p-4 transition-all ${
        todo.completed 
          ? 'border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20' 
          : isEditing 
            ? 'border-indigo-400 dark:border-indigo-600 ring-2 ring-indigo-500/10' 
            : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 shadow-xs'
      }`}
    >
      <div className="flex flex-col gap-3">
        
        {/* Core Layout: Checkbox + Information + Actions */}
        <div className="flex items-start gap-3.5">
          
          {/* Complete Status Checkbox */}
          {!isEditing && (
            <button
              type="button"
              onClick={todo.archived ? undefined : handleToggle}
              disabled={todo.archived}
              className={`mt-1 flex items-center justify-center w-5 h-5 rounded-md border transition-all ${
                todo.archived
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 cursor-not-allowed'
                  : todo.completed
                    ? 'bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600 cursor-pointer'
                    : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer'
              }`}
            >
              {todo.completed && <Check size={12} className="stroke-[3]" />}
            </button>
          )}

          {/* Dynamic Content: Display Mode vs Edit Mode */}
          {isEditing ? (
            /* --- INLINE EDIT GRID --- */
            <div className="flex-1 space-y-3 pt-1">
              <div className="grid grid-cols-1 gap-2.5">
                <input
                  id={`edit-text-field-${todo.id}`}
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  placeholder={locale === 'en' ? 'Task title...' : '任务标题...'}
                />
                
                <textarea
                  id={`edit-desc-field-${todo.id}`}
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg text-xs font-sans text-slate-600 dark:text-slate-300 focus:outline-none focus:border-indigo-500"
                  placeholder={locale === 'en' ? 'Additional observations & details (optional)...' : '补充备忘详情与额外说明（选填）...'}
                />
              </div>

              {/* Edit parameters row */}
              <div className="flex flex-wrap items-center gap-3 pt-1.5 border-t border-slate-50 dark:border-slate-800">
                
                {/* Edit Priority */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-mono text-slate-400 uppercase">{t.priorityLevel}</span>
                  <select
                    id={`edit-priority-select-${todo.id}`}
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as Priority)}
                    className="px-2 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    <option value={Priority.Low}>{t.lowPrior}</option>
                    <option value={Priority.Medium}>{t.medPrior}</option>
                    <option value={Priority.High}>{t.highPrior}</option>
                  </select>
                </div>

                {/* Edit Category */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-mono text-slate-400 uppercase">{t.categoryTag}</span>
                  <select
                    id={`edit-category-select-${todo.id}`}
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="px-2 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {getCategoryName(cat.id, locale)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Edit Due Date */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-mono text-slate-400 uppercase">{t.dateLimit}</span>
                  <input
                    id={`edit-due-date-field-${todo.id}`}
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="px-2 py-0.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer"
                  />
                </div>

                {/* Edit Reminder Time */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-mono text-slate-400 uppercase">{t.reminderLabel}</span>
                  <input
                    id={`edit-reminder-time-field-${todo.id}`}
                    type="datetime-local"
                    value={editReminderTime}
                    onChange={(e) => setEditReminderTime(e.target.value)}
                    className="px-2 py-0.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* --- REGULAR DISPLAY MODE --- */
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                
                {/* Title */}
                <span className={`text-sm font-semibold transition-all break-words ${
                  todo.completed 
                    ? 'text-slate-400 line-through decoration-[1.5px]' 
                    : 'text-slate-800 dark:text-slate-200'
                }`}>
                  {todo.text}
                </span>

                {/* Tags and Badges */}
                <div className="flex flex-wrap items-center gap-1.5 ml-1">
                  {/* Priority Badge */}
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${pColors.bg} ${pColors.text}`}>
                    {todo.priority === Priority.Low ? t.lowPrior : todo.priority === Priority.Medium ? t.medPrior : t.highPrior}
                  </span>

                  {/* Create Date Indicator */}
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-medium flex items-center gap-1 border bg-slate-50 border-slate-100 text-slate-500 dark:bg-slate-950/40 dark:border-slate-800/60" id={`create-date-${todo.id}`}>
                    <span className="text-slate-400 font-mono text-[9px] uppercase">{t.createdDate}:</span>
                    <span className="font-mono">{formatCreateDate(todo.createdAt)}</span>
                  </span>

                  {/* Category Badge */}
                  {currentCategoryObj && (
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border flex items-center gap-1 ${tagColor.bg} ${tagColor.text} ${tagColor.border}`}>
                      <span className={`w-1 h-1 rounded-full ${tagColor.dot}`} />
                      <span>{getCategoryName(currentCategoryObj.id, locale)}</span>
                    </span>
                  )}

                  {/* Due Date Indicator */}
                  {todo.dueDate && (
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium flex items-center gap-1 border ${
                      isExpired 
                        ? 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/40' 
                        : 'bg-slate-50 border-slate-100 text-slate-500 dark:bg-slate-950/40 dark:border-slate-800/60'
                    }`}>
                      {isExpired ? <AlertTriangle size={10} className="text-rose-500" /> : <Calendar size={10} />}
                      <span>{formatDueDate(todo.dueDate, locale)}</span>
                      {isExpired && <span className="font-bold underline ml-0.5 uppercase tracking-wide">{t.overdue}</span>}
                    </span>
                  )}

                  {/* Reminder Time Indicator */}
                  {todo.reminderTime && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium flex items-center gap-1 border bg-indigo-50/55 border-indigo-100/40 dark:bg-indigo-950/20 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                      <Bell size={10} className="text-indigo-500" />
                      <span className="text-indigo-400/80 font-mono text-[9px] uppercase">{t.reminderBadge}:</span>
                      <span className="font-mono">{todo.reminderTime.replace('T', ' ')}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Collapsed/Expanded Notes and Details */}
              {todo.description && (
                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={() => setShowNotes(!showNotes)}
                    className="text-[11px] font-sans font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{showNotes ? t.collapseNotes : t.viewNotes}</span>
                    {showNotes ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                  </button>

                  {showNotes && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans bg-slate-50/50 dark:bg-slate-950/30 p-2.5 rounded-xl border border-slate-100/50 dark:border-slate-850 break-words"
                    >
                      {todo.description}
                    </motion.p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Actions panel */}
          <div className="flex items-center gap-1.5 self-start shrink-0">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all cursor-pointer"
                  title={t.saveChanges}
                >
                  <Check size={14} className="stroke-[2.5]" />
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 rounded-lg transition-all cursor-pointer"
                  title={t.cancelChanges}
                >
                  <X size={14} className="stroke-[2.5]" />
                </button>
              </>
            ) : todo.archived ? (
              /* Show Archived Badge instead of Edit/Delete buttons */
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-[10px] font-mono font-bold rounded-lg uppercase tracking-wider flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-3xs" title={t.archivedDesc}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t.archivedBadge}</span>
              </span>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 dark:hover:text-slate-200 dark:hover:bg-slate-800 rounded-lg transition-all opacity-100 md:opacity-0 group-hover:opacity-100 cursor-pointer"
                  title={t.editTaskTitle}
                >
                  <Edit2 size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteTodo(todo.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-950/25 rounded-lg transition-all opacity-100 md:opacity-0 group-hover:opacity-100 cursor-pointer"
                  title={t.deleteTaskTitle}
                >
                  <Trash2 size={13} />
                </button>
              </>
            )}
          </div>

        </div>

      </div>
    </motion.div>
  );
}
