export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  quarter: number;
  weekNumber: number;
  dayOfYear: number;
}

export interface CalendarWeek {
  weekNumber: number;
  days: CalendarDay[];
}

export interface CalendarMonth {
  monthName: string;
  year: number;
  weeks: CalendarWeek[];
}

export interface CalendarConfig {
  weekStartsOn: number;
  quarters: boolean;
  showWeekNumbers: boolean;
  showDayOfYear: boolean;
  showQuarters: boolean;
}

export interface CalendarState {
  currentDate: Date;
  selectedDate: Date | null;
}

export interface CalendarNavigationProps {
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  currentDate: Date;
}

export interface CalendarInfoProps {
  weekNumber: string | number;
  dayOfYear: string | number;
  visibleQuarters: number[];
}

export interface CalendarActionsProps {
  onPrint: () => void;
  onConfigChange: (config: CalendarConfig) => void;
} 