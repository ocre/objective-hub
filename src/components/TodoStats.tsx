import { Todo, Priority } from '../types';
import { priorityColorMap } from '../utils';
import { CheckCircle2, Circle, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { translations, Locale } from '../translations';

interface TodoStatsProps {
  todos: Todo[];
  selectedPriority: Priority | 'all';
  onSelectPriority: (priority: Priority | 'all') => void;
  locale: Locale;
}

export function TodoStats({ todos, selectedPriority, onSelectPriority, locale }: TodoStatsProps) {
  const t = translations[locale];
  const total = todos.length;
  const completed = todos.filter((todoItem) => todoItem.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Counts by priority (only pending items make sense to prioritize, or total pending)
  const getPendingCountByPriority = (p: Priority) => {
    return todos.filter((todoItem) => todoItem.priority === p && !todoItem.completed).length;
  };

  const highPending = getPendingCountByPriority(Priority.High);
  const medPending = getPendingCountByPriority(Priority.Medium);
  const lowPending = getPendingCountByPriority(Priority.Low);

  // Motivational message
  const getMessage = () => {
    if (total === 0) {
      return {
        title: t.cleanSlateTitle,
        desc: t.cleanSlateDesc,
        icon: Sparkles,
        color: "text-slate-400"
      };
    }
    if (pending === 0) {
      return {
        title: t.caughtUpTitle,
        desc: t.caughtUpDesc,
        icon: CheckCircle2,
        color: "text-emerald-500"
      };
    }
    if (highPending > 0) {
      const desc = highPending === 1 
        ? t.focusDescSingle 
        : t.focusDescPlural.replace('{count}', String(highPending));
      return {
        title: t.focusTitle,
        desc: desc,
        icon: AlertCircle,
        color: "text-rose-500"
      };
    }
    
    const desc = t.progressDesc
      .replace('{completed}', String(completed))
      .replace('{total}', String(total));
    return {
      title: t.progressTitle,
      desc: desc,
      icon: CheckCircle2,
      color: "text-indigo-500"
    };
  };

  const message = getMessage();
  const MsgIcon = message.icon;

  const prioritiesList = [
    { key: Priority.High, label: t.highPrior, count: highPending, mapKey: Priority.High },
    { key: Priority.Medium, label: t.medPrior, count: medPending, mapKey: Priority.Medium },
    { key: Priority.Low, label: t.lowPrior, count: lowPending, mapKey: Priority.Low }
  ];

  return (
    <div id="todo-stats-dashboard" className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      {/* Percentage / Completion Progress */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between"
      >
        <div className="flex flex-col">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{t.completionStatus}</span>
          <span className="text-3xl font-display font-semibold text-slate-800 dark:text-slate-100 mt-1">
            {completionRate}%
          </span>
          <span className="text-xs text-slate-500 mt-1">
            {t.ofCompleted.replace('{count}', String(total)).replace('{completed}', String(completed))}
          </span>
        </div>
        
        {/* Circle Progress Bar */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="26"
              className="stroke-slate-100 dark:stroke-slate-800 fill-none"
              strokeWidth="6"
            />
            <motion.circle
              cx="32"
              cy="32"
              r="26"
              className="stroke-indigo-600 dark:stroke-indigo-400 fill-none"
              strokeWidth="6"
              strokeDasharray={163.36}
              initial={{ strokeDashoffset: 163.36 }}
              animate={{ strokeDashoffset: 163.36 - (163.36 * completionRate) / 100 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-xs font-mono font-medium text-slate-600 dark:text-slate-300">
            {completed}/{total}
          </span>
        </div>
      </motion.div>

      {/* Priority Shortcuts */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-xs"
      >
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-3">{t.pendingPriorities}</span>
        <div className="grid grid-cols-3 gap-2">
          {prioritiesList.map((p) => {
            const mapped = priorityColorMap[p.mapKey];
            const isActive = selectedPriority === p.key;
            
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => onSelectPriority(isActive ? 'all' : p.key)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isActive 
                    ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-xs' 
                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950/20'
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${mapped.bg.replace('bg-', 'bg-').split(' ')[0]} border ${mapped.ring.replace('ring-', 'border-').split(' ')[0]} mb-1.5`} />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{p.label}</span>
                <span className={`text-base font-semibold font-mono mt-0.5 ${mapped.text.split(' ')[0]}`}>
                  {p.count}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Motivational Insights */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-xs flex items-start gap-4"
      >
        <div className={`p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 ${message.color}`}>
          <MsgIcon size={20} className="stroke-[2.25]" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{t.insightIndicator}</span>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
            {message.title}
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
            {message.desc}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
