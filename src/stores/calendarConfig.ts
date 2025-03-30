import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { addDays, addMonths, subDays } from 'date-fns';

export type QuarterConfig = {
  startDate: string; // ISO string
  endDate: string;   // ISO string
  color: string;
};

export type CalendarConfig = {
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, etc.
  quarters: {
    [key: number]: QuarterConfig;
  };
  quarterStartDay: number; // Day of month when quarters start
};

// Helper function to create quarter dates
const createQuarterDates = (startDay: number = 1) => {
  const year = new Date().getFullYear();
  const createQuarterDate = (monthIndex: number) => {
    return new Date(year, monthIndex, startDay);
  };

  // Helper to get end date (day before next quarter starts)
  const getEndDate = (startDate: Date, isLastQuarter: boolean) => {
    if (isLastQuarter) {
      // For Q4, end date is the day before Q1 starts next year
      const nextYearQ1Start = new Date(startDate.getFullYear() + 1, 0, startDay);
      return subDays(nextYearQ1Start, 1);
    }
    // For other quarters, end date is the day before next quarter starts
    const nextQuarterStart = addMonths(startDate, 3);
    return subDays(nextQuarterStart, 1);
  };

  return {
    1: {
      startDate: createQuarterDate(0).toISOString(), // Jan
      endDate: getEndDate(createQuarterDate(0), false).toISOString(),
      color: 'bg-quarter-q1'
    },
    2: {
      startDate: createQuarterDate(3).toISOString(), // Apr
      endDate: getEndDate(createQuarterDate(3), false).toISOString(),
      color: 'bg-quarter-q2'
    },
    3: {
      startDate: createQuarterDate(6).toISOString(), // Jul
      endDate: getEndDate(createQuarterDate(6), false).toISOString(),
      color: 'bg-quarter-q3'
    },
    4: {
      startDate: createQuarterDate(9).toISOString(), // Oct
      endDate: getEndDate(createQuarterDate(9), true).toISOString(),
      color: 'bg-quarter-q4'
    }
  };
};

const defaultConfig: CalendarConfig = {
  weekStartsOn: 1, // Default to Monday
  quarters: createQuarterDates(1), // Default to 1st of month
  quarterStartDay: 1
};

type CalendarConfigStore = {
  config: CalendarConfig;
  setWeekStart: (weekStart: 0 | 1 | 2 | 3 | 4 | 5 | 6) => void;
  setQuarterStartDay: (day: number) => void;
  resetConfig: () => void;
};

export const useCalendarConfig = create<CalendarConfigStore>()(
  persist(
    (set) => ({
      config: defaultConfig,
      setWeekStart: (weekStart) =>
        set((state) => ({
          config: { ...state.config, weekStartsOn: weekStart },
        })),
      setQuarterStartDay: (day) =>
        set((state) => {
          const newQuarters = createQuarterDates(day);
          return {
            config: {
              ...state.config,
              quarterStartDay: day,
              quarters: newQuarters
            }
          };
        }),
      resetConfig: () => set({ config: defaultConfig }),
    }),
    {
      name: 'calendar-config',
      storage: createJSONStorage(() => localStorage),
    }
  )
); 