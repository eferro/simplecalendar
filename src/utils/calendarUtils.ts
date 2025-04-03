import { addMonths, endOfMonth, endOfWeek, format, getMonth, getWeek, getYear, isSameDay, isSameMonth, startOfMonth, startOfWeek, subMonths, isWithinInterval, parseISO, eachDayOfInterval } from 'date-fns';
import type { QuarterConfig } from '@/stores/calendarConfig';

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
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  // Array of days in each month (non-leap year)
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  // Adjust February for leap years
  if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
    daysInMonth[1] = 29;
  }
  
  // Calculate days up to the current month
  let dayOfYear = day;
  for (let i = 0; i < month; i++) {
    dayOfYear += daysInMonth[i];
  }
  
  return dayOfYear;
};

// Get quarter for a given date based on configuration
export const getQuarterForDate = (date: Date, quarterConfig: Record<number, QuarterConfig>) => {
  // Adjust the year of quarter dates if needed
  const adjustQuarterDates = (isoString: string) => {
    const quarterDate = parseISO(isoString);
    const year = date.getFullYear();
    return new Date(year, quarterDate.getMonth(), quarterDate.getDate());
  };

  for (const [quarter, config] of Object.entries(quarterConfig)) {
    const startDate = adjustQuarterDates(config.startDate);
    const endDate = adjustQuarterDates(config.endDate);
    
    // Handle year transition for Q4
    if (Number(quarter) === 4 && date.getMonth() === 0) {
      const prevYearStart = new Date(startDate);
      prevYearStart.setFullYear(date.getFullYear() - 1);
      const prevYearEnd = new Date(endDate);
      prevYearEnd.setFullYear(date.getFullYear());
      
      if (isWithinInterval(date, { start: prevYearStart, end: prevYearEnd })) {
        return 4;
      }
    }
    
    if (isWithinInterval(date, { start: startDate, end: endDate })) {
      return Number(quarter);
    }
  }
  
  // If no quarter found (shouldn't happen), return based on month
  return Math.ceil((date.getMonth() + 1) / 3);
};

export const getDaysInMonth = (date: Date, weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1, quarterConfig?: Record<number, QuarterConfig>) => {
  // Set time to noon to avoid timezone issues
  const normalizeDate = (d: Date) => {
    const normalized = new Date(d);
    normalized.setHours(12, 0, 0, 0);
    return normalized;
  };

  const targetDate = normalizeDate(date);
  const monthStart = startOfMonth(targetDate);
  const monthEnd = endOfMonth(targetDate);
  
  // Get the first day of the first week
  const firstDay = startOfWeek(monthStart, { weekStartsOn });
  // Get the last day of the last week
  const lastDay = endOfWeek(monthEnd, { weekStartsOn });
  
  const today = normalizeDate(new Date());
  const weeksInMonth: CalendarWeek[] = [];
  
  // Get all days in the interval
  const allDays = eachDayOfInterval({ start: firstDay, end: lastDay }).map(d => normalizeDate(d));
  
  // Group days into weeks of 7 days
  for (let i = 0; i < allDays.length; i += 7) {
    const weekDays = allDays.slice(i, i + 7);
    const weekNumber = getWeek(weekDays[0], { weekStartsOn });
    
    const week: CalendarDay[] = weekDays.map(currentDate => ({
      date: currentDate,
      dayOfMonth: currentDate.getDate(),
      isCurrentMonth: isSameMonth(currentDate, targetDate),
      isToday: isSameDay(currentDate, today),
      weekNumber,
      quarter: quarterConfig 
        ? getQuarterForDate(currentDate, quarterConfig)
        : Math.ceil((getMonth(currentDate) + 1) / 3),
      dayOfYear: getDayOfYear(currentDate)
    }));
    
    weeksInMonth.push({ weekNumber, days: week });
  }
  
  return weeksInMonth;
};

export const getMonthData = (date: Date, weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1, quarterConfig?: Record<number, QuarterConfig>) => {
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
