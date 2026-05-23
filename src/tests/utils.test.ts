import { describe, it, expect } from 'vitest';
import { isOverdue, formatDueDate } from '../utils';

describe('Todo Utility Functions', () => {
  describe('isOverdue', () => {
    it('should return false if dueDate is undefined', () => {
      expect(isOverdue(undefined)).toBe(false);
      expect(isOverdue('')).toBe(false);
    });

    it('should return false if already completed, regardless of due date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      expect(isOverdue(yesterdayStr, true)).toBe(false);
    });

    it('should return true if due date is in the strict past and not completed', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      expect(isOverdue(yesterdayStr, false)).toBe(true);
      expect(isOverdue(yesterdayStr)).toBe(true);
    });

    it('should return false if due date is today or in the future', () => {
      const todayStr = new Date().toISOString().split('T')[0];

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      expect(isOverdue(todayStr, false)).toBe(false);
      expect(isOverdue(tomorrowStr, false)).toBe(false);
    });
  });

  describe('formatDueDate', () => {
    it('should return an empty string if dueDate string is empty or undefined', () => {
      expect(formatDueDate(undefined)).toBe('');
      expect(formatDueDate('')).toBe('');
    });

    it('should format relative dates (Today, Tomorrow, Yesterday) in English', () => {
      const todayStr = new Date().toISOString().split('T')[0];

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      expect(formatDueDate(todayStr, 'en')).toBe('Today');
      expect(formatDueDate(tomorrowStr, 'en')).toBe('Tomorrow');
      expect(formatDueDate(yesterdayStr, 'en')).toBe('Yesterday');
    });

    it('should format relative dates (今天, 明天, 昨天) in Chinese', () => {
      const todayStr = new Date().toISOString().split('T')[0];

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      expect(formatDueDate(todayStr, 'zh')).toBe('今天');
      expect(formatDueDate(tomorrowStr, 'zh')).toBe('明天');
      expect(formatDueDate(yesterdayStr, 'zh')).toBe('昨天');
    });

    it('should output a formatted calendar date for older or far future dates in English', () => {
      // Use specific year to avoid differences in the year-omitted logic
      const futureDate = new Date();
      const currentYear = futureDate.getFullYear();
      
      // Let's testing a far-future date in another year
      const farFutureStr = `${currentYear + 2}-08-25`;
      const result = formatDueDate(farFutureStr, 'en');
      
      expect(result).toContain(String(currentYear + 2));
      expect(result).toContain('Aug');
      expect(result).toContain('25');
    });

    it('should output fully formatted calendar date in Chinese', () => {
      const farFutureStr = '2030-08-25';
      const result = formatDueDate(farFutureStr, 'zh');
      
      expect(result).toBe('2030年8月25日');
    });
  });
});
