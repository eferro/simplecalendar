import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Calendar from '../Calendar';
import { useCalendarConfig } from '@/stores/calendarConfig';

// Helper function to create dates at midnight
const createDate = (year: number, month: number, day: number) => {
  const date = new Date(year, month, day);
  date.setHours(0, 0, 0, 0);
  return date;
};

// Mock the calendar config hook
vi.mock('@/stores/calendarConfig', () => ({
  useCalendarConfig: vi.fn(() => ({
    config: {
      weekStartsOn: 0,
      quarters: true,
    },
  })),
}));

// Mock calendar state hook
const mockHandleSelectDay = vi.fn();
const mockHandleUpdateCurrentDate = vi.fn();

vi.mock('@/hooks/useCalendarState', () => {
  return {
    useCalendarState: vi.fn(() => ({
      state: {
        currentDate: createDate(2024, 0, 15), // January 15, 2024
        selectedDate: createDate(2024, 0, 15),
      },
      handlePrevMonth: vi.fn(),
      handleNextMonth: vi.fn(),
      handleToday: vi.fn(),
      handleSelectDay: mockHandleSelectDay,
      handleUpdateCurrentDate: mockHandleUpdateCurrentDate,
    })),
  };
});

// Mock calendar keyboard hook
vi.mock('@/hooks/useCalendarKeyboard', () => ({
  useCalendarKeyboard: vi.fn(),
}));

// Mock calendar utils
vi.mock('@/utils/calendarUtils', () => ({
  getMonthData: vi.fn((date) => {
    const isJanuary = date.getMonth() === 0;
    return {
      weeks: [
        {
          days: [
            { date: createDate(2024, isJanuary ? 0 : 1, 1), quarter: 1, isCurrentMonth: true },
            { date: createDate(2024, isJanuary ? 0 : 1, 2), quarter: 1, isCurrentMonth: true },
          ],
        },
      ],
      monthName: isJanuary ? 'January' : 'February',
      year: 2024,
    };
  }),
  getDayOfYear: vi.fn(() => 15),
  getQuarterName: vi.fn((quarter) => `Q${quarter}`),
  getQuarterColor: vi.fn(() => 'bg-red-200'),
}));

// Mock date-fns
vi.mock('date-fns', () => ({
  getWeek: vi.fn(() => 3),
  addMonths: vi.fn((date, amount) => {
    return createDate(date.getFullYear(), date.getMonth() + amount, date.getDate());
  }),
  subMonths: vi.fn((date, amount) => {
    return createDate(date.getFullYear(), date.getMonth() - amount, date.getDate());
  }),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ChevronLeft: () => <span>←</span>,
  ChevronRight: () => <span>→</span>,
  CalendarIcon: () => <span>📅</span>,
  Settings: () => <span>⚙️</span>,
}));

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

// Mock child components
vi.mock('../CalendarHeader', () => ({
  default: () => <div data-testid="calendar-header">Calendar Header</div>,
}));

vi.mock('../CalendarGrid', () => ({
  default: ({ weeks, selectedDate, onSelectDay }) => (
    <div data-testid="calendar-grid" role="grid">
      {weeks[0].days.map((day) => (
        <button
          key={day.date.toISOString()}
          onClick={() => onSelectDay(day.date)}
          aria-pressed={selectedDate?.getTime() === day.date.getTime()}
        >
          {day.date.getDate()}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('../MiniCalendar', () => ({
  default: ({ date, selectedDate, onSelectDay, currentDate }) => {
    const monthName = date.getMonth() === 0 ? 'January' : 'February';
    
    // Compare year-month combinations for accurate positioning
    const currentYearMonth = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
    const dateYearMonth = `${date.getFullYear()}-${date.getMonth()}`;
    
    let position;
    if (dateYearMonth < currentYearMonth) {
      position = 'prev';
    } else if (dateYearMonth > currentYearMonth) {
      position = 'next';
    } else {
      position = 'current';
    }
    
    const testId = `mini-calendar-${position}-${monthName.toLowerCase()}`;
    const dayTestId = `${position}-month-day-1`;
    
    // Create a date object for the first day of the month
    const firstDayOfMonth = createDate(date.getFullYear(), date.getMonth(), 1);
    
    return (
      <div
        data-testid={testId}
        role="grid"
        aria-label={`Mini calendar for ${monthName} 2024 (${position})`}
      >
        <button
          onClick={() => {
            // First update current date to the month's date
            mockHandleUpdateCurrentDate(date);
            // Then select the specific day
            onSelectDay(firstDayOfMonth);
          }}
          aria-pressed={selectedDate?.getTime() === firstDayOfMonth.getTime()}
          aria-label={`${monthName} 1, 2024`}
          data-testid={dayTestId}
        >
          {monthName} 1
        </button>
      </div>
    );
  },
}));

vi.mock('../PrintCalendar', () => ({
  default: () => <div data-testid="print-calendar">Print Calendar</div>,
}));

vi.mock('../CalendarConfig', () => ({
  default: () => <div data-testid="calendar-config">Calendar Config</div>,
}));

// Mock cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

describe('Calendar Integration Tests', () => {
  const today = createDate(2024, 0, 15); // January 15, 2024

  beforeEach(() => {
    vi.clearAllMocks();
    vi.setSystemTime(today);
  });

  it('should sync main calendar when selecting date in mini calendar', async () => {
    render(<Calendar />);

    // Find the next month's mini calendar (February) using the specific test id
    const nextMonthMiniCalendar = screen.getByTestId('mini-calendar-next-february');
    expect(nextMonthMiniCalendar).toBeInTheDocument();

    // Select February 1st in the mini calendar using the specific test id
    const feb1Button = screen.getByTestId('next-month-day-1');
    fireEvent.click(feb1Button);

    // Create expected dates
    const expectedMonthDate = createDate(2024, 1, 15); // February 15, 2024 (keeps the day from current date)
    const expectedSelectedDate = createDate(2024, 1, 1); // February 1, 2024

    // Verify that handleUpdateCurrentDate was called with the month's date
    expect(mockHandleUpdateCurrentDate).toHaveBeenCalledWith(expect.any(Date));
    expect(mockHandleUpdateCurrentDate.mock.calls[0][0].getTime()).toBe(expectedMonthDate.getTime());
    
    // Verify that handleSelectDay was called with the selected date
    expect(mockHandleSelectDay).toHaveBeenCalledWith(expect.any(Date));
    expect(mockHandleSelectDay.mock.calls[0][0].getTime()).toBe(expectedSelectedDate.getTime());
  });
}); 