import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calendar from '../Calendar';
import { useCalendarState } from '@/hooks/useCalendarState';

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  )
}));

vi.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: any) => <div>{children}</div>,
  SheetContent: ({ children }: any) => <div>{children}</div>,
  SheetDescription: ({ children }: any) => <div>{children}</div>,
  SheetHeader: ({ children }: any) => <div>{children}</div>,
  SheetTitle: ({ children }: any) => <div>{children}</div>,
  SheetTrigger: ({ children }: any) => <div>{children}</div>
}));

vi.mock('@/components/ui/separator', () => ({
  Separator: () => <hr />
}));

vi.mock('@/components/ui/select', () => ({
  Select: ({ children }: any) => <div>{children}</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children }: any) => <div>{children}</div>,
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ children }: any) => <div>{children}</div>
}));

// Mock only essential dependencies
vi.mock('@/lib/utils', () => ({
  cn: (...inputs: any[]) => inputs.filter(Boolean).join(' ')
}));

vi.mock('lucide-react', () => ({
  ChevronLeft: () => <span>←</span>,
  ChevronRight: () => <span>→</span>,
  CalendarIcon: () => <span>📅</span>,
  Settings: () => <span>⚙️</span>,
  X: () => <span>✕</span>,
  Printer: () => <span>🖨️</span>
}));

// Mock date-fns functions
vi.mock('date-fns', () => ({
  getWeek: vi.fn(() => 1),
  addMonths: vi.fn((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1)),
  subMonths: vi.fn((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1)),
  format: vi.fn(() => 'Jan 1'),
  parseISO: vi.fn(() => new Date(2024, 0, 1))
}));

// Mock calendar utils
vi.mock('@/utils/calendarUtils', () => ({
  getMonthData: vi.fn(() => ({
    weeks: [
      {
        weekNumber: 1,
        days: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(2024, 0, i + 1),
          dayOfMonth: i + 1,
          isCurrentMonth: true,
          isToday: i === 0,
          weekNumber: 1,
          quarter: 1,
          dayOfYear: i + 1
        }))
      }
    ],
    monthName: 'January',
    year: 2024
  })),
  getDayOfYear: vi.fn(() => 1),
  getQuarterName: vi.fn((quarter) => `Q${quarter}`),
  getQuarterColor: vi.fn(() => 'bg-red-100')
}));

// Mock calendar hooks
const mockHandleNextMonth = vi.fn();
const mockHandlePrevMonth = vi.fn();
const mockHandleToday = vi.fn();
const mockHandleSelectDay = vi.fn();
const mockHandleUpdateCurrentDate = vi.fn();

vi.mock('@/stores/calendarConfig', () => ({
  useCalendarConfig: () => ({
    config: {
      weekStartsOn: 1,
      quarterStartDay: 1,
      quarters: {
        1: { startDate: '2024-01-01', endDate: '2024-03-31' },
        2: { startDate: '2024-04-01', endDate: '2024-06-30' },
        3: { startDate: '2024-07-01', endDate: '2024-09-30' },
        4: { startDate: '2024-10-01', endDate: '2024-12-31' }
      }
    },
    setWeekStart: vi.fn(),
    setQuarterStartDay: vi.fn(),
    resetConfig: vi.fn()
  })
}));

vi.mock('@/hooks/useCalendarState', () => ({
  useCalendarState: () => ({
    state: {
      currentDate: new Date(2024, 0, 1),
      selectedDate: new Date(2024, 0, 1)
    },
    handlePrevMonth: mockHandlePrevMonth,
    handleNextMonth: mockHandleNextMonth,
    handleToday: mockHandleToday,
    handleSelectDay: mockHandleSelectDay,
    handleUpdateCurrentDate: mockHandleUpdateCurrentDate
  })
}));

// Mock keyboard hook
vi.mock('@/hooks/useCalendarKeyboard', () => ({
  useCalendarKeyboard: vi.fn()
}));

// Mock child components
vi.mock('../CalendarHeader', () => ({
  default: () => <div data-testid="calendar-header">Calendar Header</div>
}));

vi.mock('../CalendarGrid', () => ({
  default: ({ onSelectDay, selectedDate }: any) => {
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
  default: ({ date, onSelectDay }: any) => (
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
    expect(screen.getByRole('button', { name: 'Go to today' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous month' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next month' })).toBeInTheDocument();
    
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
  });

  it('handles month navigation correctly', async () => {
    render(<Calendar />);
    
    // Click next month button
    await user.click(screen.getByRole('button', { name: 'Next month' }));
    
    // Check if handleNextMonth was called
    expect(mockHandleNextMonth).toHaveBeenCalled();
    
    // Click previous month button
    await user.click(screen.getByRole('button', { name: 'Previous month' }));
    
    // Check if handlePrevMonth was called
    expect(mockHandlePrevMonth).toHaveBeenCalled();
  });

  it('handles today button click correctly', async () => {
    render(<Calendar />);
    
    // Click today button
    await user.click(screen.getByRole('button', { name: 'Go to today' }));
    
    // Check if handleToday was called
    expect(mockHandleToday).toHaveBeenCalled();
  });
}); 