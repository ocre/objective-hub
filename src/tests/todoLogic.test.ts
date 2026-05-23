import { describe, it, expect } from 'vitest';
import { Todo, Priority } from '../types';

// Declare standard filter and sort implementations mirroring the exact production behavior in App.tsx
function filterTodos(
  todos: Todo[],
  searchQuery: string,
  statusFilter: 'all' | 'active' | 'completed',
  priorityFilter: Priority | 'all',
  categoryFilter: string | 'all'
): Todo[] {
  return todos.filter((todo) => {
    const matchesSearch =
      todo.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && !todo.completed) ||
      (statusFilter === 'completed' && todo.completed);

    const matchesPriority = priorityFilter === 'all' || todo.priority === priorityFilter;

    const matchesCategory = categoryFilter === 'all' || todo.category === categoryFilter;

    return !!(matchesSearch && matchesStatus && matchesPriority && matchesCategory);
  });
}

function sortTodos(todos: Todo[], sortBy: string): Todo[] {
  return [...todos].sort((a, b) => {
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
}

const SAMPLE_TODOS: Todo[] = [
  {
    id: '1',
    text: 'Submit project report',
    description: 'Prepare detailed finance charts',
    priority: Priority.High,
    completed: false,
    dueDate: '2026-06-01',
    category: 'work',
    createdAt: 1000
  },
  {
    id: '2',
    text: 'Buy Groceries',
    description: 'Milk, Eggs, Bread and some salad greens',
    priority: Priority.Low,
    completed: true,
    dueDate: '2026-05-24',
    category: 'shopping',
    createdAt: 2000
  },
  {
    id: '3',
    text: 'Evening Gym Session',
    priority: Priority.Medium,
    completed: false,
    // No due date
    category: 'health',
    createdAt: 3000
  },
  {
    id: '4',
    text: 'Brainstorm business pitch',
    description: 'Notes on product design details',
    priority: Priority.High,
    completed: true,
    dueDate: '2026-05-31',
    category: 'ideas',
    createdAt: 1500
  }
];

describe('Core Todo Filtering and Sorting Logic', () => {
  describe('filterTodos', () => {
    it('should return all todos with default parameters', () => {
      const results = filterTodos(SAMPLE_TODOS, '', 'all', 'all', 'all');
      expect(results.length).toBe(4);
    });

    it('should search case-insensitively within task titles and descriptions', () => {
      const searchTitle = filterTodos(SAMPLE_TODOS, 'project report', 'all', 'all', 'all');
      expect(searchTitle.length).toBe(1);
      expect(searchTitle[0].id).toBe('1');

      const searchDesc = filterTodos(SAMPLE_TODOS, 'salad greens', 'all', 'all', 'all');
      expect(searchDesc.length).toBe(1);
      expect(searchDesc[0].id).toBe('2');

      const searchCase = filterTodos(SAMPLE_TODOS, 'MILK', 'all', 'all', 'all');
      expect(searchCase.length).toBe(1);
      expect(searchCase[0].id).toBe('2');
    });

    it('should filter by status (active vs completed)', () => {
      const activeTodos = filterTodos(SAMPLE_TODOS, '', 'active', 'all', 'all');
      expect(activeTodos.every(t => !t.completed)).toBe(true);
      expect(activeTodos.length).toBe(2);

      const completedTodos = filterTodos(SAMPLE_TODOS, '', 'completed', 'all', 'all');
      expect(completedTodos.every(t => t.completed)).toBe(true);
      expect(completedTodos.length).toBe(2);
    });

    it('should filter by specific Priority levels', () => {
      const highTodos = filterTodos(SAMPLE_TODOS, '', 'all', Priority.High, 'all');
      expect(highTodos.every(t => t.priority === Priority.High)).toBe(true);
      expect(highTodos.length).toBe(2);

      const medTodos = filterTodos(SAMPLE_TODOS, '', 'all', Priority.Medium, 'all');
      expect(medTodos.length).toBe(1);
      expect(medTodos[0].id).toBe('3');
    });

    it('should filter by specific Category tags', () => {
      const workTodos = filterTodos(SAMPLE_TODOS, '', 'all', 'all', 'work');
      expect(workTodos.length).toBe(1);
      expect(workTodos[0].category).toBe('work');
    });
  });

  describe('sortTodos', () => {
    it('should sort by creation date (newest first / created-desc)', () => {
      const sorted = sortTodos(SAMPLE_TODOS, 'created-desc');
      expect(sorted[0].id).toBe('3'); // 3000
      expect(sorted[1].id).toBe('2'); // 2000
      expect(sorted[2].id).toBe('4'); // 1500
      expect(sorted[3].id).toBe('1'); // 1000
    });

    it('should sort by creation date (oldest first / created-asc)', () => {
      const sorted = sortTodos(SAMPLE_TODOS, 'created-asc');
      expect(sorted[0].id).toBe('1'); // 1000
      expect(sorted[1].id).toBe('4'); // 1500
      expect(sorted[2].id).toBe('2'); // 2000
      expect(sorted[3].id).toBe('3'); // 3000
    });

    it('should sort by high-to-low priority', () => {
      const sorted = sortTodos(SAMPLE_TODOS, 'priority-desc');
      // High (1, 4) should come before Medium (3) which comes before Low (2)
      expect(sorted[0].priority).toBe(Priority.High);
      expect(sorted[1].priority).toBe(Priority.High);
      expect(sorted[2].priority).toBe(Priority.Medium);
      expect(sorted[3].priority).toBe(Priority.Low);
    });

    it('should sort by low-to-high priority', () => {
      const sorted = sortTodos(SAMPLE_TODOS, 'priority-asc');
      expect(sorted[0].priority).toBe(Priority.Low);
      expect(sorted[1].priority).toBe(Priority.Medium);
      expect(sorted[2].priority).toBe(Priority.High);
      expect(sorted[3].priority).toBe(Priority.High);
    });

    it('should sort by soonest due-date, pushing no-dueDate items to the bottom', () => {
      const sorted = sortTodos(SAMPLE_TODOS, 'due-asc');
      // Dates: '2026-05-24' (2), '2026-06-01' (1), '2026-05-31' (4), 'no due date' (3)
      // Sorted ascending: 2 (May 24), 4 (May 31), 1 (Jun 1), then 3 (no due date)
      expect(sorted[0].id).toBe('2');
      expect(sorted[1].id).toBe('4');
      expect(sorted[2].id).toBe('1');
      expect(sorted[3].id).toBe('3');
    });

    it('should sort by latest due-date, pushing no-dueDate items to the bottom', () => {
      const sorted = sortTodos(SAMPLE_TODOS, 'due-desc');
      // Dates: '2026-05-24' (2), '2026-06-01' (1), '2026-05-31' (4), 'no due date' (3)
      // Sorted descending: 1 (Jun 1), 4 (May 31), 2 (May 24), then 3 (no due date)
      expect(sorted[0].id).toBe('1');
      expect(sorted[1].id).toBe('4');
      expect(sorted[2].id).toBe('2');
      expect(sorted[3].id).toBe('3');
    });

    it('should sort alphabetically', () => {
      const sorted = sortTodos(SAMPLE_TODOS, 'text-asc');
      // Titles:
      // 'Submit project report' (1)
      // 'Buy Groceries' (2)
      // 'Evening Gym Session' (3)
      // 'Brainstorm business pitch' (4)
      // Alphabetical: Brainstorm... (4), Buy... (2), Evening... (3), Submit... (1)
      expect(sorted[0].id).toBe('4');
      expect(sorted[1].id).toBe('2');
      expect(sorted[2].id).toBe('3');
      expect(sorted[3].id).toBe('1');
    });
  });
});
