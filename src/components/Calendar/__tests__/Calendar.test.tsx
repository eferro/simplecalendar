import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calendar from '../Calendar';
import { addMonths, subMonths, getWeek, addDays } from 'date-fns';

// Mock date-fns functions
vi.mock('date-fns', () => ({
  addMonths: vi.fn((date: Date) => date),
  subMonths: vi.fn((date: Date) => date),
  getWeek: vi.fn(() => 1),
  addDays: vi.fn((date: Date, days: number) => date),
}));

// Mock calendarUtils functions
vi.mock('@/utils/calendarUtils', () => ({
  getMonthData: () => ({
    weeks: [
      {
        weekNumber: 1,
        days: [
          { date: new Date(2024, 0, 1), dayOfMonth: 1, isCurrentMonth: true, isToday: true, quarter: 1 },
          { date: new Date(2024, 0, 2), dayOfMonth: 2, isCurrentMonth: true, isToday: false, quarter: 1 },
          { date: new Date(2024, 0, 3), dayOfMonth: 3, isCurrentMonth: true, isToday: false, quarter: 1 },
          { date: new Date(2024, 0, 4), dayOfMonth: 4, isCurrentMonth: true, isToday: false, quarter: 1 },
          { date: new Date(2024, 0, 5), dayOfMonth: 5, isCurrentMonth: true, isToday: false, quarter: 1 },
          { date: new Date(2024, 0, 6), dayOfMonth: 6, isCurrentMonth: true, isToday: false, quarter: 1 },
          { date: new Date(2024, 0, 7), dayOfMonth: 7, isCurrentMonth: true, isToday: false, quarter: 1 }
        ]
      }
    ],
    monthName: 'January',
    year: 2024
  }),
  navigateMonth: vi.fn((date: Date, direction: 'prev' | 'next') => date),
  getDayOfYear: vi.fn((date: Date) => {
    if (date.getTime() === new Date(2024, 0, 1).getTime()) return 1;
    if (date.getTime() === new Date(2024, 0, 2).getTime()) return 2;
    return 1;
  }),
  getQuarterName: vi.fn((quarter: number) => `Q${quarter}`),
  getQuarterColor: vi.fn((quarter: number) => `bg-quarter-${quarter}`)
}));

// Mock the calendar config hook
vi.mock('@/stores/calendarConfig', () => ({
  useCalendarConfig: () => ({
    config: {
      weekStartsOn: 1,
      quarters: [
        { startMonth: 0, endMonth: 2 },
        { startMonth: 3, endMonth: 5 },
        { startMonth: 6, endMonth: 8 },
        { startMonth: 9, endMonth: 11 }
      ]
    }
  })
}));

// Mock child components
vi.mock('../CalendarHeader', () => ({
  default: () => <div data-testid="calendar-header">Calendar Header</div>
}));

vi.mock('../CalendarGrid', () => ({
  default: ({ onSelectDay, selectedDate }) => (
    <div data-testid="calendar-grid">
      <button 
        onClick={() => onSelectDay(new Date(2024, 0, 1))}
        data-testid="day-1"
        aria-selected={selectedDate?.getTime() === new Date(2024, 0, 1).getTime()}
      >
        1
      </button>
      <button 
        onClick={() => onSelectDay(new Date(2024, 0, 2))}
        data-testid="day-2"
        aria-selected={selectedDate?.getTime() === new Date(2024, 0, 2).getTime()}
      >
        2
      </button>
    </div>
  )
}));

vi.mock('../MiniCalendar', () => ({
  default: () => <div data-testid="mini-calendar">Mini Calendar</div>
}));

vi.mock('../PrintCalendar', () => ({
  default: () => <div data-testid="print-calendar">Print Calendar</div>
}));

vi.mock('../CalendarConfig', () => ({
  default: () => <div data-testid="calendar-config">Calendar Config</div>
}));

describe('Calendar', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    // Mock the current date to be consistent
    vi.setSystemTime(new Date(2024, 0, 1));
  });

  it('renders the calendar with correct month and year', () => {
    render(<Calendar />);
    
    // Check month and year display
    expect(screen.getByText('January')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
  });

  it('renders navigation controls', () => {
    render(<Calendar />);
    
    // Check navigation buttons
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Previous month', { selector: '.sr-only' })).toBeInTheDocument();
    expect(screen.getByText('Next month', { selector: '.sr-only' })).toBeInTheDocument();
  });

  it('renders week and day numbers', () => {
    render(<Calendar />);
    
    // Check week and day numbers
    const weekContainer = screen.getByText('Week:').closest('div');
    const dayContainer = screen.getByText('Day:').closest('div');
    
    expect(weekContainer).toBeInTheDocument();
    expect(weekContainer).toHaveTextContent('Week: 1');
    expect(dayContainer).toBeInTheDocument();
    expect(dayContainer).toHaveTextContent('Day: 1');
  });

  it('renders quarters legend', () => {
    render(<Calendar />);
    
    // Check quarters legend
    expect(screen.getByText('Quarters:')).toBeInTheDocument();
    expect(screen.getByText('Q1')).toBeInTheDocument();
    expect(screen.getByText('Q2')).toBeInTheDocument();
    expect(screen.getByText('Q3')).toBeInTheDocument();
    expect(screen.getByText('Q4')).toBeInTheDocument();
  });

  it('renders all required components', () => {
    render(<Calendar />);
    
    // Check that all child components are rendered
    expect(screen.getByTestId('calendar-grid')).toBeInTheDocument();
    expect(screen.getAllByTestId('mini-calendar')).toHaveLength(2); // Previous and next month
    expect(screen.getByTestId('calendar-config')).toBeInTheDocument();
    expect(screen.getByTestId('print-calendar')).toBeInTheDocument();
  });

  it('selects today by default', () => {
    render(<Calendar />);
    
    // Today (Jan 1, 2024) should be selected by default
    expect(screen.getByTestId('day-1')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('day-2')).toHaveAttribute('aria-selected', 'false');
  });

  it('allows selecting and unselecting dates', async () => {
    const user = userEvent.setup();
    render(<Calendar />);
    
    // Initially Jan 1 is selected
    expect(screen.getByTestId('day-1')).toHaveAttribute('aria-selected', 'true');
    
    // Click Jan 2
    await user.click(screen.getByTestId('day-2'));
    expect(screen.getByTestId('day-1')).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByTestId('day-2')).toHaveAttribute('aria-selected', 'true');
    
    // Click Jan 2 again to unselect
    await user.click(screen.getByTestId('day-2'));
    expect(screen.getByTestId('day-1')).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByTestId('day-2')).toHaveAttribute('aria-selected', 'false');
  });

  it('updates week and day numbers when selection changes', async () => {
    const user = userEvent.setup();
    // Mock getWeek to return different values for different dates
    const getWeekMock = vi.fn()
      .mockReturnValueOnce(1)  // For Jan 1
      .mockReturnValueOnce(1); // For Jan 2
    
    vi.mocked(getWeek).mockImplementation(getWeekMock);
    
    render(<Calendar />);
    
    // Initially shows week 1, day 1
    const weekContainer = screen.getByText('Week:').closest('div');
    const dayContainer = screen.getByText('Day:').closest('div');
    
    expect(weekContainer).toHaveTextContent('Week: 1');
    expect(dayContainer).toHaveTextContent('Day: 1');
    
    // Click Jan 2
    await user.click(screen.getByTestId('day-2'));
    
    // Should show week 1, day 2
    expect(weekContainer).toHaveTextContent('Week: 1');
    expect(dayContainer).toHaveTextContent('Day: 2');
  });
}); 