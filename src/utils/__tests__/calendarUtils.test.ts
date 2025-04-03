import { describe, it, expect } from 'vitest';
import {
  getDayOfYear,
  getQuarterForDate,
  getDaysInMonth,
  getMonthData,
  getQuarterColor,
  getQuarterName,
  navigateMonth
} from '../calendarUtils';
import type { QuarterConfig } from '@/stores/calendarConfig';

describe('calendarUtils', () => {
  describe('getDayOfYear', () => {
    it('returns correct day of year for January 1st', () => {
      const date = new Date(2024, 0, 1);
      expect(getDayOfYear(date)).toBe(1);
    });

    it('returns correct day of year for December 31st', () => {
      const date = new Date(2024, 11, 31);
      expect(getDayOfYear(date)).toBe(366); // 2024 is a leap year
    });

    it('handles leap years correctly', () => {
      // Create dates at midnight to avoid timezone issues
      const createDate = (year: number, month: number, day: number) => {
        const date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0);
        return date;
      };

      const leapYear = createDate(2024, 11, 31);
      const nonLeapYear = createDate(2023, 11, 31);
      
      expect(getDayOfYear(leapYear)).toBe(366);
      expect(getDayOfYear(nonLeapYear)).toBe(365);
    });
  });

  describe('getQuarterForDate', () => {
    const mockQuarterConfig: Record<number, QuarterConfig> = {
      1: { startDate: '2024-01-01', endDate: '2024-03-31', color: 'bg-quarter-q1' },
      2: { startDate: '2024-04-01', endDate: '2024-06-30', color: 'bg-quarter-q2' },
      3: { startDate: '2024-07-01', endDate: '2024-09-30', color: 'bg-quarter-q3' },
      4: { startDate: '2024-10-01', endDate: '2024-12-31', color: 'bg-quarter-q4' }
    };

    it('returns correct quarter for dates within quarters', () => {
      expect(getQuarterForDate(new Date(2024, 0, 15), mockQuarterConfig)).toBe(1);
      expect(getQuarterForDate(new Date(2024, 3, 15), mockQuarterConfig)).toBe(2);
      expect(getQuarterForDate(new Date(2024, 6, 15), mockQuarterConfig)).toBe(3);
      expect(getQuarterForDate(new Date(2024, 9, 15), mockQuarterConfig)).toBe(4);
    });

    it('handles year transition for Q4', () => {
      const q4Config: Record<number, QuarterConfig> = {
        4: { startDate: '2024-10-01', endDate: '2024-12-31', color: 'bg-quarter-q4' }
      };
      // December 31st, 2024
      expect(getQuarterForDate(new Date(2024, 11, 31), q4Config)).toBe(4);
      // January 1st, 2025
      expect(getQuarterForDate(new Date(2025, 0, 1), q4Config)).toBe(4);
    });

    it('falls back to month-based quarter when no config matches', () => {
      const emptyConfig = {};
      expect(getQuarterForDate(new Date(2024, 0, 15), emptyConfig)).toBe(1);
      expect(getQuarterForDate(new Date(2024, 3, 15), emptyConfig)).toBe(2);
      expect(getQuarterForDate(new Date(2024, 6, 15), emptyConfig)).toBe(3);
      expect(getQuarterForDate(new Date(2024, 9, 15), emptyConfig)).toBe(4);
    });
  });

  describe('getDaysInMonth', () => {
    it('returns correct number of weeks for a month', () => {
      const weeks = getDaysInMonth(new Date(2024, 0, 1));
      expect(weeks.length).toBe(5); // January 2024 has 5 weeks
    });

    it('includes days from previous and next months', () => {
      // March 2024:
      // Mo Tu We Th Fr Sa Su
      //             1  2  3  <- Week 1 (Feb 26-29, Mar 1-3)
      //  4  5  6  7  8  9 10 <- Week 2 (Mar 4-10)
      // 11 12 13 14 15 16 17 <- Week 3 (Mar 11-17)
      // 18 19 20 21 22 23 24 <- Week 4 (Mar 18-24)
      // 25 26 27 28 29 30 31 <- Week 5 (Mar 25-31)
      
      const date = new Date(2024, 2, 1); // March 1st, 2024
      const weekStartsOn = 1; // Monday
      const weeks = getDaysInMonth(date, weekStartsOn);

      // First week should start with February 26
      const firstWeek = weeks[0].days;
      expect(firstWeek[0].date.getFullYear()).toBe(2024);
      expect(firstWeek[0].date.getMonth()).toBe(1); // February is month 1
      expect(firstWeek[0].date.getDate()).toBe(26);
      expect(firstWeek[0].isCurrentMonth).toBe(false);

      // First week should end with March 3
      expect(firstWeek[6].date.getFullYear()).toBe(2024);
      expect(firstWeek[6].date.getMonth()).toBe(2); // March is month 2
      expect(firstWeek[6].date.getDate()).toBe(3);
      expect(firstWeek[6].isCurrentMonth).toBe(true);

      // Last week should start with March 25
      const lastWeek = weeks[weeks.length - 1].days;
      expect(lastWeek[0].date.getFullYear()).toBe(2024);
      expect(lastWeek[0].date.getMonth()).toBe(2); // March is month 2
      expect(lastWeek[0].date.getDate()).toBe(25);
      expect(lastWeek[0].isCurrentMonth).toBe(true);

      // Last week should end with March 31 (since it's a Sunday)
      const lastDay = lastWeek[lastWeek.length - 1];
      expect(lastDay.date.getFullYear()).toBe(2024);
      expect(lastDay.date.getMonth()).toBe(2); // March is month 2
      expect(lastDay.date.getDate()).toBe(31);
      expect(lastDay.isCurrentMonth).toBe(true);

      // We should have exactly 5 weeks since March 31st is a Sunday
      expect(weeks.length).toBe(5);
    });

    it('respects weekStartsOn configuration', () => {
      const mondayFirst = getDaysInMonth(new Date(2024, 0, 1), 1);
      const sundayFirst = getDaysInMonth(new Date(2024, 0, 1), 0);

      expect(mondayFirst[0].days[0].date.getDay()).toBe(1); // Monday
      expect(sundayFirst[0].days[0].date.getDay()).toBe(0); // Sunday
    });
  });

  describe('getMonthData', () => {
    it('returns correct month name and year', () => {
      const data = getMonthData(new Date(2024, 0, 1));
      expect(data.monthName).toBe('January');
      expect(data.year).toBe(2024);
    });

    it('includes weeks data', () => {
      const data = getMonthData(new Date(2024, 0, 1));
      expect(data.weeks).toBeDefined();
      expect(Array.isArray(data.weeks)).toBe(true);
    });
  });

  describe('getQuarterColor', () => {
    it('returns correct color class for each quarter', () => {
      expect(getQuarterColor(1)).toBe('bg-quarter-q1');
      expect(getQuarterColor(2)).toBe('bg-quarter-q2');
      expect(getQuarterColor(3)).toBe('bg-quarter-q3');
      expect(getQuarterColor(4)).toBe('bg-quarter-q4');
    });

    it('returns background color for invalid quarter', () => {
      expect(getQuarterColor(0)).toBe('bg-background');
      expect(getQuarterColor(5)).toBe('bg-background');
    });
  });

  describe('getQuarterName', () => {
    it('returns correct quarter name format', () => {
      expect(getQuarterName(1)).toBe('Q1');
      expect(getQuarterName(2)).toBe('Q2');
      expect(getQuarterName(3)).toBe('Q3');
      expect(getQuarterName(4)).toBe('Q4');
    });
  });

  describe('navigateMonth', () => {
    it('navigates to previous month', () => {
      const date = new Date(2024, 0, 15);
      const prevMonth = navigateMonth(date, 'prev');
      expect(prevMonth.getMonth()).toBe(11); // December
      expect(prevMonth.getFullYear()).toBe(2023);
    });

    it('navigates to next month', () => {
      const date = new Date(2024, 11, 15);
      const nextMonth = navigateMonth(date, 'next');
      expect(nextMonth.getMonth()).toBe(0); // January
      expect(nextMonth.getFullYear()).toBe(2025);
    });

    it('handles year transitions correctly', () => {
      // December to January
      const decToJan = navigateMonth(new Date(2024, 11, 15), 'next');
      expect(decToJan.getMonth()).toBe(0);
      expect(decToJan.getFullYear()).toBe(2025);

      // January to December
      const janToDec = navigateMonth(new Date(2024, 0, 15), 'prev');
      expect(janToDec.getMonth()).toBe(11);
      expect(janToDec.getFullYear()).toBe(2023);
    });
  });
}); 