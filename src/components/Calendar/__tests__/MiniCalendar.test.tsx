import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MiniCalendar from '../MiniCalendar';
import { format } from 'date-fns';

// Mock date-fns functions
const mockIsSameDay = vi.fn();
vi.mock('date-fns', () => ({
  format: vi.fn((date: Date, format: string) => '1'),
  isSameMonth: vi.fn(() => true),
  isSameDay: (date1: Date, date2: Date) => mockIsSameDay(date1, date2)
}));

// Mock cn function
vi.mock('@/lib/utils', () => ({
  cn: (...inputs: any[]) => inputs.filter(Boolean).join(' ')
}));

// Mock the calendarUtils functions
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
      },
      {
        weekNumber: 2,
        days: [
          { date: new Date(2024, 0, 8), dayOfMonth: 8, isCurrentMonth: false, isToday: false, quarter: 1 },
          { date: new Date(2024, 0, 9), dayOfMonth: 9, isCurrentMonth: false, isToday: false, quarter: 1 },
          { date: new Date(2024, 0, 10), dayOfMonth: 10, isCurrentMonth: false, isToday: false, quarter: 1 },
          { date: new Date(2024, 0, 11), dayOfMonth: 11, isCurrentMonth: false, isToday: false, quarter: 1 },
          { date: new Date(2024, 0, 12), dayOfMonth: 12, isCurrentMonth: false, isToday: false, quarter: 1 },
          { date: new Date(2024, 0, 13), dayOfMonth: 13, isCurrentMonth: false, isToday: false, quarter: 1 },
          { date: new Date(2024, 0, 14), dayOfMonth: 14, isCurrentMonth: false, isToday: false, quarter: 1 }
        ]
      }
    ],
    monthName: 'January',
    year: 2024
  }),
  getQuarterColor: (quarter: number) => `bg-quarter-${quarter}`
}));

describe('MiniCalendar', () => {
  const mockDate = new Date(2024, 0, 1);
  const mockCurrentDate = new Date(2024, 0, 1);
  const mockSelectedDate = new Date(2024, 0, 1);
  const mockOnSelectDay = vi.fn();

  beforeEach(() => {
    mockIsSameDay.mockReset();
    mockOnSelectDay.mockReset();
  });

  it('renders month and year correctly', () => {
    render(
      <MiniCalendar
        date={mockDate}
        currentDate={mockCurrentDate}
        selectedDate={null}
        onSelectDay={mockOnSelectDay}
      />
    );

    expect(screen.getByText('January 2024')).toBeInTheDocument();
  });

  it('renders day names in correct order', () => {
    render(
      <MiniCalendar
        date={mockDate}
        currentDate={mockCurrentDate}
        selectedDate={null}
        onSelectDay={mockOnSelectDay}
      />
    );

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    dayNames.forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it('renders week numbers and days', () => {
    render(
      <MiniCalendar
        date={mockDate}
        currentDate={mockCurrentDate}
        selectedDate={null}
        onSelectDay={mockOnSelectDay}
      />
    );

    // Check week number header
    expect(screen.getByText('Wk')).toBeInTheDocument();

    // Check week number
    const weekNumberCell = screen.getByText('1', { 
      selector: '.text-xs.text-center.text-muted-foreground'
    });
    expect(weekNumberCell).toBeInTheDocument();

    // Check day number
    const dayCell = screen.getByText('1', {
      selector: '.mini-calendar-day'
    });
    expect(dayCell).toBeInTheDocument();
  });

  it('handles day selection', () => {
    render(
      <MiniCalendar
        date={mockDate}
        currentDate={mockCurrentDate}
        selectedDate={null}
        onSelectDay={mockOnSelectDay}
      />
    );

    // Find the day cell that's not the week number
    const dayCell = screen.getByText('1', {
      selector: '.mini-calendar-day'
    });
    fireEvent.click(dayCell);
    expect(mockOnSelectDay).toHaveBeenCalledWith(mockDate);
  });

  it('applies selected state to days', () => {
    mockIsSameDay.mockReturnValue(true);

    render(
      <MiniCalendar
        date={mockDate}
        currentDate={mockCurrentDate}
        selectedDate={mockSelectedDate}
        onSelectDay={mockOnSelectDay}
      />
    );

    // Find the day cell that's not the week number
    const dayCell = screen.getByText('1', {
      selector: '.mini-calendar-day'
    });
    expect(dayCell.className).toContain('bg-primary');
    expect(dayCell.className).toContain('text-primary-foreground');
  });

  it('applies today highlighting', () => {
    render(
      <MiniCalendar
        date={mockDate}
        currentDate={mockCurrentDate}
        selectedDate={null}
        onSelectDay={mockOnSelectDay}
      />
    );

    // Find the day cell that's not the week number
    const dayCell = screen.getByText('1', {
      selector: '.mini-calendar-day'
    });
    expect(dayCell.className).toContain('ring-1');
    expect(dayCell.className).toContain('ring-red-500');
  });

  it('applies different styles for current and other month days', () => {
    render(
      <MiniCalendar
        date={mockDate}
        currentDate={mockCurrentDate}
        selectedDate={null}
        onSelectDay={mockOnSelectDay}
      />
    );

    // Find the day cell that's not the week number
    const dayCell = screen.getByText('1', {
      selector: '.mini-calendar-day'
    });
    expect(dayCell.className).toContain('hover:bg-muted');
    expect(dayCell.className).toContain('cursor-pointer');
  });

  it('applies quarter colors to week numbers and days', () => {
    render(
      <MiniCalendar
        date={mockDate}
        currentDate={mockCurrentDate}
        selectedDate={null}
        onSelectDay={mockOnSelectDay}
      />
    );

    // Check week number color
    const weekNumberCell = screen.getByText('1', { 
      selector: '.text-xs.text-center.text-muted-foreground'
    });
    expect(weekNumberCell.className).toContain('bg-quarter-1');

    // Check day color
    const dayCell = screen.getByText('1', {
      selector: '.mini-calendar-day'
    });
    expect(dayCell.className).toContain('bg-quarter-1');
  });

  it('disables selection for non-current month days', () => {
    render(
      <MiniCalendar
        date={mockDate}
        currentDate={mockCurrentDate}
        selectedDate={null}
        onSelectDay={mockOnSelectDay}
      />
    );

    // Find a day from another month
    const otherMonthDay = screen.getByText('8', {
      selector: '.mini-calendar-day'
    });
    expect(otherMonthDay.className).toContain('opacity-40');
    fireEvent.click(otherMonthDay);
    expect(mockOnSelectDay).not.toHaveBeenCalled();
  });

  it('renders multiple weeks correctly', () => {
    render(
      <MiniCalendar
        date={mockDate}
        currentDate={mockCurrentDate}
        selectedDate={null}
        onSelectDay={mockOnSelectDay}
      />
    );

    // Check both week numbers are rendered
    const weekNumbers = screen.getAllByText(/[12]/, {
      selector: '.text-xs.text-center.text-muted-foreground'
    });
    expect(weekNumbers).toHaveLength(2);

    // Check days from both weeks are rendered
    const firstWeekDay = screen.getByText('1', {
      selector: '.mini-calendar-day'
    });
    const secondWeekDay = screen.getByText('8', {
      selector: '.mini-calendar-day'
    });
    expect(firstWeekDay).toBeInTheDocument();
    expect(secondWeekDay).toBeInTheDocument();
  });
}); 