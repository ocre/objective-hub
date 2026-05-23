export type Locale = 'en' | 'zh';

export const translations = {
  en: {
    // Header
    appName: 'Objective Hub',
    localBadge: 'local storage',
    tagline: 'Diligently organize objectives by status and priorities',
    archiveManager: 'Archive Manager',
    archiveDesc: 'Backup your active targets to an offline JSON file, or restore existing lists.',
    backupBtn: 'Backup Archive',
    importBtn: 'Import Archive',
    invalidArchive: 'Invalid archive file. Ensure format is genuine.',
    languageLabel: 'Applet Language',
    languageDesc: 'Select the active display language for overall app interface.',
    switchLangBtn: '切换为中文 (Chinese)',
    
    // Stats & Insights
    completionStatus: 'Completion Status',
    ofCompleted: 'of {count} tasks completed',
    pendingPriorities: 'Pending Priorities',
    insightIndicator: 'Insight Indicator',
    highPrior: 'High',
    medPrior: 'Medium',
    lowPrior: 'Low',
    
    // Insights text
    cleanSlateTitle: 'Clean Slate',
    cleanSlateDesc: 'Add your first task below to plan your day.',
    caughtUpTitle: 'All Caught Up!',
    caughtUpDesc: "You've completed all tasks. Enjoy the peace!",
    focusTitle: 'Focus Required',
    focusDescSingle: '1 high priority task requires attention.',
    focusDescPlural: '{count} high priority tasks require attention.',
    progressTitle: 'Steady Progress',
    progressDesc: '{completed} of {total} tasks finished. Keep it going!',

    // Form
    createNewTask: 'Create New Task',
    taskPlaceholder: 'What objective needs to be accomplished?',
    errorTitleRequired: 'Please specify a task summary or title.',
    requiredBadge: 'Required',
    addTask: 'Add Task',
    priorityLevel: 'Priority Level',
    categoryTag: 'Category Tag',
    newTagBtn: 'New Tag',
    dateLimit: 'Date Limit',
    addNotesBtn: 'Add Notes / Description',
    hideNotesBtn: 'Hide Notes',
    specifyCatProps: 'Specify Category Properties',
    dismissBtn: 'Dismiss',
    catNamePlaceholder: 'E.g. Study, Garden',
    labelShade: 'Label Shade',
    generateLabelBtn: 'Generate Label',
    additionalDetails: 'Additional Details & Notes (Optional)',
    detailsPlaceholder: 'List sub-tasks, context, reference URLs or general observations...',
    
    // Filters
    searchPlaceholder: 'Search objectives and details...',
    sortByLabel: 'Sort',
    allStatus: 'all',
    activeStatus: 'active',
    completedStatus: 'completed',
    resetParamsBtn: 'Reset parameters',
    purgeCompletedBtn: 'Purge Completed ({count})',
    prioritySegment: 'Priority Segment',
    allPriorities: 'All Priorities',
    categorySegment: 'Category Segment',
    allCategories: 'All Categories',
    sort_created_desc: 'Recently Created',
    sort_created_asc: 'Oldest Created',
    sort_priority_desc: 'Priority: High to Low',
    sort_priority_asc: 'Priority: Low to High',
    sort_due_asc: 'Due Date: Soonest',
    sort_due_desc: 'Due Date: Latest',
    sort_text_asc: 'Alphabetical: A-Z',

    // List Headers & Empty-states
    objectivesInView: 'Objectives In View ({count})',
    noTasksPlanned: 'No tasks planned yet',
    noTasksPlannedDesc: 'Map out your day, organize objectives by priority, and stay on track with local persistence.',
    noMatchesFound: 'No matches found',
    noMatchesFoundDesc: 'Adjust or reset search query and active tags to locate your objectives.',
    resetFiltersBtn: 'Reset Filter Parameters',
    
    // Todo items & dates
    collapseNotes: 'Collapse Notes',
    viewNotes: 'View Notes',
    overdue: 'Overdue',
    today: 'Today',
    tomorrow: 'Tomorrow',
    yesterday: 'Yesterday',
    saveChanges: 'Save',
    cancelChanges: 'Cancel',
    editTaskTitle: 'Edit task parameters',
    deleteTaskTitle: 'Purge task objective',

    // Footer
    persistenceEngine: 'Precision persistence engine',
    secureStorage: 'Secure offline data storage',

    // Category translations
    cat_work: 'Work',
    cat_personal: 'Personal',
    cat_shopping: 'Shopping',
    cat_health: 'Health & Wellness',
    cat_ideas: 'Ideas & Inspiration',
  },
  zh: {
    // Header
    appName: 'Objective Hub',
    localBadge: '本地存储',
    tagline: '管理您的所有个人目标与任务，区分状态与重要性',
    archiveManager: '存档管理器',
    archiveDesc: '将您的活动任务备份到本地 JSON 文件中，或导入已存在的任务列表。',
    backupBtn: '备份存档',
    importBtn: '导入存档',
    invalidArchive: '存档文件格式无效。请确保其为有效 JSON 格式。',
    languageLabel: '界面语言设置',
    languageDesc: '选择和切换系统的主体显示语言。',
    switchLangBtn: 'Switch to English',
    
    // Stats & Insights
    completionStatus: '完成进度率',
    ofCompleted: '已完成 {completed} 个任务',
    pendingPriorities: '待办任务优先级',
    insightIndicator: '系统洞察',
    highPrior: '高',
    medPrior: '中',
    lowPrior: '低',
    
    // Insights text
    cleanSlateTitle: '全新的开始',
    cleanSlateDesc: '在下方添加您的第一个任务来开启规划的一天。',
    caughtUpTitle: '全部搞定！',
    caughtUpDesc: '您已完成所有日常目标。享受轻松的心绪吧！',
    focusTitle: '需要聚焦',
    focusDescSingle: '有 1 项高优先级任务需要尽快处理。',
    focusDescPlural: '有 {count} 项高优先级任务需要尽快处理。',
    progressTitle: '稳步推进',
    progressDesc: '已完结成总计 {total} 项任务中的 {completed} 项。加油！',

    // Form
    createNewTask: '创建新任务',
    taskPlaceholder: '今天有什么目标需要付诸行动？',
    errorTitleRequired: '请指定一个明确的任务标题。',
    requiredBadge: '必填项',
    addTask: '加入任务',
    priorityLevel: '优先级',
    categoryTag: '分类便签',
    newTagBtn: '新建便签',
    dateLimit: '到期时限',
    addNotesBtn: '添加备忘 / 详情说明',
    hideNotesBtn: '收起说明',
    specifyCatProps: '自定义便签属性',
    dismissBtn: '放弃',
    catNamePlaceholder: '如：学习、园艺运动',
    labelShade: '标签背景颜色',
    generateLabelBtn: '生成新便签',
    additionalDetails: '备忘录补充说明（选填）',
    detailsPlaceholder: '详细分解子任务、上下文背景、参考链接，亦或是其他补充观察心得...',
    
    // Filters
    searchPlaceholder: '搜索和筛选任务名称或备忘详情...',
    sortByLabel: '排序规则',
    allStatus: '全部状态',
    activeStatus: '进行中',
    completedStatus: '已完成',
    resetParamsBtn: '重置筛选',
    purgeCompletedBtn: '清空已完成并归档 ({count})',
    prioritySegment: '筛选优先级等级',
    allPriorities: '所有优先级',
    categorySegment: '按分类便签过滤',
    allCategories: '所有分类',
    sort_created_desc: '按最新创建排序',
    sort_created_asc: '按最早创建排序',
    sort_priority_desc: '按优先级从高到低',
    sort_priority_asc: '按优先级从低到高',
    sort_due_asc: '按截止时间从近到远',
    sort_due_desc: '按截止时间从远到近',
    sort_text_asc: '按英文字母 A-Z 顺序',

    // List Headers & Empty-states
    objectivesInView: '列表中共有 ({count}) 项相关目标',
    noTasksPlanned: '目前尚无既定任务',
    noTasksPlannedDesc: '悉心规划每日事务，精确定位各级优先级，通过安全的本地存储使一切井然有序。',
    noMatchesFound: '未找到匹配结果',
    noMatchesFoundDesc: '请尝试精简您的搜索关键词或切换筛选条件来获取符合要求的目标。',
    resetFiltersBtn: '重置所有筛选参数',
    
    // Todo items & dates
    collapseNotes: '收起详细备注',
    viewNotes: '查看详细备注',
    overdue: '已逾期',
    today: '今天',
    tomorrow: '明天',
    yesterday: '昨天',
    saveChanges: '保存',
    cancelChanges: '取消',
    editTaskTitle: '编辑此任务参数',
    deleteTaskTitle: '销毁此任务目标',

    // Footer
    persistenceEngine: '数据持久化存储',
    secureStorage: '本地脱机存储保护',

    // Category translations
    cat_work: '工作事务',
    cat_personal: '个人生活',
    cat_shopping: '购物清单',
    cat_health: '健康与锻炼',
    cat_ideas: '灵感与想法',
  }
};

export function getCategoryName(id: string, locale: Locale): string {
  const trans = translations[locale];
  const key = `cat_${id.replace(/\s+/g, '_')}` as keyof typeof trans;
  if (key in trans) {
    return trans[key] as string;
  }
  
  // Custom user categories are fallback returned literally
  return id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
