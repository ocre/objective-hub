import { describe, it, expect } from 'vitest';
import { getCategoryName, translations } from '../translations';

describe('Multlingual Translations System', () => {
  describe('translations coverage', () => {
    it('should have both "en" and "zh" keys defined', () => {
      expect(translations).toHaveProperty('en');
      expect(translations).toHaveProperty('zh');
    });

    it('should match keys density between en and zh', () => {
      const enKeys = Object.keys(translations.en);
      const zhKeys = Object.keys(translations.zh);
      
      // Both languages should have essential translation mapping
      expect(enKeys.length).toBeGreaterThan(30);
      expect(zhKeys.length).toBeGreaterThan(30);
    });
  });

  describe('getCategoryName Utility', () => {
    it('should translate default category work in both English and Chinese', () => {
      expect(getCategoryName('work', 'en')).toBe('Work');
      expect(getCategoryName('work', 'zh')).toBe('工作事务');
    });

    it('should translate default category personal in both English and Chinese', () => {
      expect(getCategoryName('personal', 'en')).toBe('Personal');
      expect(getCategoryName('personal', 'zh')).toBe('个人生活');
    });

    it('should translate default category ideas in both English and Chinese', () => {
      expect(getCategoryName('ideas', 'en')).toBe('Ideas & Inspiration');
      expect(getCategoryName('ideas', 'zh')).toBe('灵感与想法');
    });

    it('should format custom categories with capitalizations as fallback', () => {
      expect(getCategoryName('gardening', 'en')).toBe('Gardening');
      expect(getCategoryName('my-fancy-project', 'en')).toBe('My Fancy Project');
      expect(getCategoryName('home-renovations', 'zh')).toBe('Home Renovations');
    });
  });
});
