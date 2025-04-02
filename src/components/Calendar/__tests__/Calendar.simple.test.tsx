import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Calendar from '../Calendar';

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
      currentDate: new Date(2024, 0, 1), // January 1, 2024
      selectedDate: null
    },
    handlePrevMonth: vi.fn(),
    handleNextMonth: vi.fn(),
    handleToday: vi.fn(),
    handleSelectDay: vi.fn(),
    handleUpdateCurrentDate: vi.fn()
  })
}));

// Mock keyboard hook
vi.mock('@/hooks/useCalendarKeyboard', () => ({
  useCalendarKeyboard: vi.fn()
}));

describe('Calendar Simple Test', () => {
  beforeEach(() => {
    // Set a consistent date for testing
    vi.setSystemTime(new Date(2024, 0, 1));
  });

  it('renders basic calendar structure', () => {
    render(<Calendar />);
    
    // Check basic structure
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText('January')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to today' })).toBeInTheDocument();
  });
}); 