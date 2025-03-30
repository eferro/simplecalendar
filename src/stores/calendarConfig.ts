import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addMonths, setDate } from 'date-fns';

export type QuarterConfig = {
  startDate: Date;
  endDate: Date;
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
    const date = new Date(year, monthIndex, startDay);
    return date;
  };

  return {
    1: {
      startDate: createQuarterDate(0), // Jan
      endDate: addMonths(createQuarterDate(0), 3),
      color: 'bg-quarter-q1'
    },
    2: {
      startDate: createQuarterDate(3), // Apr
      endDate: addMonths(createQuarterDate(3), 3),
      color: 'bg-quarter-q2'
    },
    3: {
      startDate: createQuarterDate(6), // Jul
      endDate: addMonths(createQuarterDate(6), 3),
      color: 'bg-quarter-q3'
    },
    4: {
      startDate: createQuarterDate(9), // Oct
      endDate: addMonths(createQuarterDate(9), 3),
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
    }
  )
); 