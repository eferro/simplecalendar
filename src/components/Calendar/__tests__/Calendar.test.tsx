import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calendar from '../Calendar';
import { getMonthData, getDayOfYear, getQuarterName, getQuarterColor, navigateMonth } from '@/utils/calendarUtils';
import { getWeek, addMonths, subMonths } from 'date-fns';

// Mock cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...inputs: any[]) => inputs.filter(Boolean).join(' ')
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  ChevronLeft: () => <span>←</span>,
  ChevronRight: () => <span>→</span>,
  CalendarIcon: () => <span>📅</span>
}));

// Mock date-fns functions
vi.mock('date-fns', () => ({
  getWeek: vi.fn((date: Date, options: { weekStartsOn: number }) => {
    // Simple week calculation for testing
    const yearStart = new Date(date.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((date.getTime() - yearStart.getTime()) / (24 * 60 * 60 * 1000)) + 1;
    return Math.floor((dayOfYear - 1) / 7) + 1;
  }),
  addMonths: vi.fn((date: Date, months: number) => new Date(date.getFullYear(), date.getMonth() + months, 1)),
  subMonths: vi.fn((date: Date, months: number) => new Date(date.getFullYear(), date.getMonth() - months, 1)),
  addDays: vi.fn((date: Date, days: number) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
  })
}));

// Mock calendarUtils functions
vi.mock('@/utils/calendarUtils', () => ({
  getMonthData: vi.fn((date: Date, weekStartsOn: number, quarters: number[]) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Create days array
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dayOfYear = Math.floor((dateObj.getTime() - new Date(year, 0, 1).getTime()) / (24 * 60 * 60 * 1000)) + 1;
      const weekNumber = Math.floor((dayOfYear - 1) / 7) + 1;
      const quarter = Math.floor(month / 3) + 1;
      
      days.push({
        date: dateObj,
        dayOfMonth: day,
        isCurrentMonth: true,
        isToday: false,
        weekNumber,
        quarter,
        dayOfYear
      });
    }
    
    // Group into weeks
    const weeks = [];
    let currentWeek = [];
    
    days.forEach(day => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push({
          weekNumber: day.weekNumber,
          days: [...currentWeek]
        });
        currentWeek = [];
      }
    });
    
    if (currentWeek.length > 0) {
      weeks.push({
        weekNumber: currentWeek[currentWeek.length - 1].weekNumber,
        days: [...currentWeek]
      });
    }
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    return {
      weeks,
      monthName: months[month],
      year
    };
  }),
  getDayOfYear: vi.fn((date: Date) => {
    const yearStart = new Date(date.getFullYear(), 0, 1);
    return Math.floor((date.getTime() - yearStart.getTime()) / (24 * 60 * 60 * 1000)) + 1;
  }),
  getQuarterName: vi.fn((quarter: number) => `Q${quarter}`),
  getQuarterColor: vi.fn((quarter: number) => `q${quarter}`),
  navigateMonth: vi.fn((date: Date, direction: 'prev' | 'next') => {
    if (direction === 'next') {
      return new Date(date.getFullYear(), date.getMonth() + 1, 1);
    } else {
      return new Date(date.getFullYear(), date.getMonth() - 1, 1);
    }
  })
}));

// Mock useCalendarConfig hook
vi.mock('@/stores/calendarConfig', () => ({
  useCalendarConfig: () => ({
    config: {
      weekStartsOn: 1, // Monday
      quarters: [1, 2, 3, 4]
    }
  })
}));

// Mock child components
vi.mock('../CalendarHeader', () => ({
  default: () => <div data-testid="calendar-header">Calendar Header</div>
}));

vi.mock('../CalendarGrid', () => ({
  default: ({ onSelectDay, selectedDate }) => {
    const date1 = new Date(2024, 0, 1);
    const date2 = new Date(2024, 0, 2);
    
    return (
      <div data-testid="calendar-grid">
        <button 
          onClick={() => onSelectDay(date1)}
          data-testid="day-1"
          aria-selected={selectedDate?.getTime() === date1.getTime()}
        >
          1
        </button>
        <button 
          onClick={() => onSelectDay(date2)}
          data-testid="day-2"
          aria-selected={selectedDate?.getTime() === date2.getTime()}
        >
          2
        </button>
      </div>
    );
  }
}));

vi.mock('../MiniCalendar', () => ({
  default: ({ date, onSelectDay }) => (
    <div data-testid="mini-calendar">
      <button onClick={() => onSelectDay(date)}>Select {date.getMonth() + 1}</button>
    </div>
  )
}));

vi.mock('../PrintCalendar', () => ({
  default: () => <div data-testid="print-calendar">Print Calendar</div>
}));

vi.mock('../CalendarConfig', () => ({
  default: () => <div data-testid="calendar-config">Calendar Config</div>
}));

describe('Calendar', () => {
  let user: ReturnType<typeof userEvent.setup>;
  
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Set a consistent date for testing
    vi.setSystemTime(new Date(2024, 0, 1)); // January 1, 2024
    
    // Setup user event
    user = userEvent.setup();
  });

  it('renders initial state correctly', async () => {
    render(<Calendar />);
    
    // Check month and year
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText('January')).toBeInTheDocument();
    
    // Check navigation buttons
    expect(screen.getByRole('button', { name: /📅.*Today/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /←.*Previous month/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /→.*Next month/i })).toBeInTheDocument();
    
    // Check week and day numbers
    const weekContainer = screen.getByText(/Week:/).closest('div');
    const dayContainer = screen.getByText(/Day:/).closest('div');
    
    expect(weekContainer).toBeInTheDocument();
    expect(dayContainer).toBeInTheDocument();
    
    expect(weekContainer?.querySelector('span.font-bold')).toHaveTextContent('1');
    expect(dayContainer?.querySelector('span.font-bold')).toHaveTextContent('1');
    
    // Check quarter legend
    expect(screen.getByText('Quarters:')).toBeInTheDocument();
    expect(screen.getByText('Q1')).toBeInTheDocument();
    expect(screen.getByText('Q2')).toBeInTheDocument();
    expect(screen.getByText('Q3')).toBeInTheDocument();
    expect(screen.getByText('Q4')).toBeInTheDocument();
    
    // Check child components
    expect(screen.getByTestId('calendar-grid')).toBeInTheDocument();
    expect(screen.getAllByTestId('mini-calendar')).toHaveLength(2);
    expect(screen.getByTestId('calendar-config')).toBeInTheDocument();
    expect(screen.getByTestId('print-calendar')).toBeInTheDocument();
  });

  it('handles month navigation correctly', async () => {
    render(<Calendar />);
    
    // Click next month button
    await user.click(screen.getByRole('button', { name: /→.*Next month/i }));
    
    // Check if navigateMonth was called with next
    expect(navigateMonth).toHaveBeenCalledWith(expect.any(Date), 'next');
    
    // Check if getMonthData was called with February
    expect(getMonthData).toHaveBeenCalledWith(
      expect.any(Date),
      1, // weekStartsOn
      [1, 2, 3, 4] // quarters
    );
    
    // Verify the month is February
    const lastCall = (getMonthData as Mock).mock.calls.slice(-1)[0];
    expect(lastCall[0].getMonth()).toBe(1); // February
    expect(lastCall[0].getFullYear()).toBe(2024);
    
    // Click previous month button
    await user.click(screen.getByRole('button', { name: /←.*Previous month/i }));
    
    // Check if navigateMonth was called with prev
    expect(navigateMonth).toHaveBeenCalledWith(expect.any(Date), 'prev');
    
    // Check if getMonthData was called with January
    expect(getMonthData).toHaveBeenCalledWith(
      expect.any(Date),
      1, // weekStartsOn
      [1, 2, 3, 4] // quarters
    );
    
    // Verify the month is January
    const prevCall = (getMonthData as Mock).mock.calls.slice(-1)[0];
    expect(prevCall[0].getMonth()).toBe(0); // January
    expect(prevCall[0].getFullYear()).toBe(2024);
  });

  it('handles today button correctly', async () => {
    render(<Calendar />);
    
    // Click today button
    await user.click(screen.getByRole('button', { name: /📅.*Today/i }));
    
    // Check if current date and selected date are set to today
    expect(getMonthData).toHaveBeenCalledWith(
      expect.any(Date),
      1, // weekStartsOn
      [1, 2, 3, 4] // quarters
    );
    
    // Verify the month is January 2024 (today's date in our mocked environment)
    const lastCall = (getMonthData as Mock).mock.calls.slice(-1)[0];
    expect(lastCall[0].getMonth()).toBe(0); // January
    expect(lastCall[0].getFullYear()).toBe(2024);
  });

  it('handles date selection correctly', async () => {
    // Set initial date to January 1, 2024
    vi.setSystemTime(new Date(2024, 0, 1));
    
    render(<Calendar />);
    
    // Initially, January 1 should be selected (it's today)
    const dayElement = screen.getByTestId('day-1');
    expect(dayElement).toHaveAttribute('aria-selected', 'true');
    
    // Click day 2
    const day2Element = screen.getByTestId('day-2');
    await user.click(day2Element);
    
    // Check if day 2 is selected and day 1 is unselected
    expect(dayElement).toHaveAttribute('aria-selected', 'false');
    expect(day2Element).toHaveAttribute('aria-selected', 'true');
    
    // Click day 2 again to unselect it
    await user.click(day2Element);
    expect(day2Element).toHaveAttribute('aria-selected', 'false');
  });
}); 