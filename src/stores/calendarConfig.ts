import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type QuarterConfig = {
  startMonth: number; // 1-12
  endMonth: number;   // 1-12
  color: string;      // Tailwind color class
};

export type CalendarConfig = {
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, etc.
  quarters: {
    [key: number]: QuarterConfig;
  };
};

const defaultConfig: CalendarConfig = {
  weekStartsOn: 1, // Default to Monday
  quarters: {
    1: { startMonth: 1, endMonth: 3, color: 'bg-quarter-q1' },
    2: { startMonth: 4, endMonth: 6, color: 'bg-quarter-q2' },
    3: { startMonth: 7, endMonth: 9, color: 'bg-quarter-q3' },
    4: { startMonth: 10, endMonth: 12, color: 'bg-quarter-q4' },
  },
};

type CalendarConfigStore = {
  config: CalendarConfig;
  setWeekStart: (weekStart: 0 | 1 | 2 | 3 | 4 | 5 | 6) => void;
  setQuarterConfig: (quarter: number, config: QuarterConfig) => void;
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
      setQuarterConfig: (quarter, quarterConfig) =>
        set((state) => ({
          config: {
            ...state.config,
            quarters: {
              ...state.config.quarters,
              [quarter]: quarterConfig,
            },
          },
        })),
      resetConfig: () => set({ config: defaultConfig }),
    }),
    {
      name: 'calendar-config',
    }
  )
); 