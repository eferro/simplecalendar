import { addDays, addMonths, endOfMonth, endOfWeek, format, getDay, getMonth, getWeek, getYear, isSameDay, isSameMonth, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import { useCalendarConfig } from '@/stores/calendarConfig';

export type CalendarDay = {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  weekNumber: number;
  quarter: number;
  dayOfYear: number;
};

export type CalendarWeek = {
  weekNumber: number;
  days: CalendarDay[];
};

// Calculate day of year (1-365/366)
export const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

// Get quarter for a given month based on configuration
export const getQuarterForMonth = (month: number, quarterConfig: Record<number, { startMonth: number; endMonth: number }>) => {
  for (const [quarter, config] of Object.entries(quarterConfig)) {
    if (month >= config.startMonth && month <= config.endMonth) {
      return Number(quarter);
    }
  }
  return Math.ceil(month / 3); // Fallback to default quarter calculation
};

export const getDaysInMonth = (date: Date, weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1, quarterConfig?: Record<number, { startMonth: number; endMonth: number }>) => {
  const startDate = startOfMonth(date);
  const endDate = endOfMonth(date);
  const startWeek = startOfWeek(startDate, { weekStartsOn });
  const endWeek = endOfWeek(endDate, { weekStartsOn });
  
  const today = new Date();
  const weeksInMonth: CalendarWeek[] = [];
  
  let currentDay = startWeek;
  
  while (currentDay <= endWeek) {
    const week: CalendarDay[] = [];
    const weekNumber = getWeek(currentDay, { weekStartsOn });
    
    let weekObj: CalendarWeek = {
      weekNumber,
      days: []
    };
    
    // Create 7 days for this week
    for (let i = 0; i < 7; i++) {
      const dayOfMonth = currentDay.getDate();
      const month = getMonth(currentDay) + 1; // 0-indexed to 1-indexed
      const quarter = quarterConfig 
        ? getQuarterForMonth(month, quarterConfig)
        : Math.ceil(month / 3);
      const dayOfYear = getDayOfYear(currentDay);
      
      const day: CalendarDay = {
        date: new Date(currentDay),
        dayOfMonth,
        isCurrentMonth: isSameMonth(currentDay, date),
        isToday: isSameDay(currentDay, today),
        weekNumber,
        quarter,
        dayOfYear
      };
      
      week.push(day);
      currentDay = addDays(currentDay, 1);
    }
    
    weekObj.days = week;
    weeksInMonth.push(weekObj);
  }
  
  return weeksInMonth;
};

export const getMonthData = (date: Date, weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1, quarterConfig?: Record<number, { startMonth: number; endMonth: number }>) => {
  return {
    weeks: getDaysInMonth(date, weekStartsOn, quarterConfig),
    monthName: format(date, 'MMMM'),
    year: getYear(date)
  };
};

export const getQuarterColor = (quarter: number): string => {
  switch (quarter) {
    case 1:
      return 'bg-quarter-q1';
    case 2:
      return 'bg-quarter-q2';
    case 3:
      return 'bg-quarter-q3';
    case 4:
      return 'bg-quarter-q4';
    default:
      return 'bg-background';
  }
};

export const getQuarterName = (quarter: number): string => {
  return `Q${quarter}`;
};

export const navigateMonth = (date: Date, direction: 'prev' | 'next'): Date => {
  if (direction === 'prev') {
    return subMonths(date, 1);
  } else {
    return addMonths(date, 1);
  }
};
