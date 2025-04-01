import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CalendarGrid from '../CalendarGrid';
import { useCalendarConfig } from '@/stores/calendarConfig';
import type { CalendarWeek } from '@/utils/calendarUtils';
import { getQuarterColor } from '@/utils/calendarUtils';

// Mock the calendar config store
vi.mock('@/stores/calendarConfig', () => ({
  useCalendarConfig: vi.fn()
}));

// Mock the CalendarDay component
vi.mock('../CalendarDay', () => ({
  default: ({ day, isSelected, onSelect }: any) => (
    <div 
      data-testid="calendar-day"
      data-selected={isSelected}
      data-today={day.isToday}
      onClick={onSelect}
    >
      {day.dayOfMonth}
    </div>
  )
}));

describe('CalendarGrid', () => {
  // Mock data
  const mockWeeks = [
    {
      weekNumber: 1,
      days: [
        {
          date: new Date('2024-01-01'),
          dayOfMonth: 1,
          isCurrentMonth: true,
          isToday: false,
          weekNumber: 1,
          quarter: 1,
          dayOfYear: 1
        },
        {
          date: new Date('2024-01-02'),
          dayOfMonth: 2,
          isCurrentMonth: true,
          isToday: false,
          weekNumber: 1,
          quarter: 1,
          dayOfYear: 2
        }
      ]
    }
  ];

  const mockConfig = {
    weekStartsOn: 1 // Monday
  };

  beforeEach(() => {
    (useCalendarConfig as any).mockReturnValue({ config: mockConfig });
  });

  it('renders the calendar grid with week header', () => {
    render(
      <CalendarGrid
        weeks={mockWeeks}
        selectedDate={null}
        onSelectDay={() => {}}
      />
    );

    // Check if week header is rendered
    expect(screen.getByText('Week')).toBeInTheDocument();
    
    // Check if day names are rendered in correct order (Monday first)
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    dayNames.forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it('renders week numbers and days', () => {
    render(
      <CalendarGrid
        weeks={mockWeeks}
        selectedDate={null}
        onSelectDay={() => {}}
      />
    );

    // Check if week number is rendered
    expect(screen.getByText('1', { selector: '.week-number' })).toBeInTheDocument();

    // Check if days are rendered
    const days = screen.getAllByTestId('calendar-day');
    expect(days).toHaveLength(2);
    expect(days[0]).toHaveTextContent('1');
    expect(days[1]).toHaveTextContent('2');
  });

  it('handles day selection', () => {
    const onSelectDay = vi.fn();
    render(
      <CalendarGrid
        weeks={mockWeeks}
        selectedDate={null}
        onSelectDay={onSelectDay}
      />
    );

    const days = screen.getAllByTestId('calendar-day');
    fireEvent.click(days[0]);

    expect(onSelectDay).toHaveBeenCalledWith(mockWeeks[0].days[0].date);
  });

  it('applies selected state to days', () => {
    const selectedDate = new Date('2024-01-01');
    render(
      <CalendarGrid
        weeks={mockWeeks}
        selectedDate={selectedDate}
        onSelectDay={() => {}}
      />
    );

    const days = screen.getAllByTestId('calendar-day');
    expect(days[0]).toHaveAttribute('data-selected', 'true');
    expect(days[1]).toHaveAttribute('data-selected', 'false');
  });

  it('applies quarter colors to week numbers', () => {
    render(
      <CalendarGrid
        weeks={mockWeeks}
        selectedDate={null}
        onSelectDay={() => {}}
      />
    );

    const weekNumber = screen.getByText('1', { selector: '.week-number' });
    expect(weekNumber.className).toContain('bg-quarter-q1/40');
  });

  it('adjusts day names order based on weekStartsOn config', () => {
    // Mock config with Sunday as start of week
    (useCalendarConfig as any).mockReturnValue({ 
      config: { ...mockConfig, weekStartsOn: 0 } 
    });

    render(
      <CalendarGrid
        weeks={mockWeeks}
        selectedDate={null}
        onSelectDay={() => {}}
      />
    );

    // Check if day names are rendered in correct order (Sunday first)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });

    // Verify order by checking the DOM order
    const headerCells = screen.getAllByText(/^(Sun|Mon|Tue|Wed|Thu|Fri|Sat)$/);
    headerCells.forEach((cell, index) => {
      expect(cell).toHaveTextContent(dayNames[index]);
    });
  });

  it('handles weeks spanning multiple quarters', () => {
    const multiQuarterWeek = [{
      weekNumber: 13,
      days: [
        {
          date: new Date('2024-03-31'),
          dayOfMonth: 31,
          isCurrentMonth: true,
          isToday: false,
          weekNumber: 13,
          quarter: 1,
          dayOfYear: 91
        },
        {
          date: new Date('2024-04-01'),
          dayOfMonth: 1,
          isCurrentMonth: false,
          isToday: false,
          weekNumber: 13,
          quarter: 2,
          dayOfYear: 92
        }
      ]
    }];

    render(
      <CalendarGrid
        weeks={multiQuarterWeek}
        selectedDate={null}
        onSelectDay={() => {}}
      />
    );

    // Check if week number has gradient class for multiple quarters
    const weekNumber = screen.getByText('13', { selector: '.week-number' });
    expect(weekNumber.className).toContain('bg-gradient-to-r');
    expect(weekNumber.className).toContain('from-quarter-q1/40');
    expect(weekNumber.className).toContain('to-quarter-q2/40');
  });

  it('handles weeks spanning multiple months', () => {
    const multiMonthWeek = [{
      weekNumber: 5,
      days: [
        {
          date: new Date('2024-01-31'),
          dayOfMonth: 31,
          isCurrentMonth: true,
          isToday: false,
          weekNumber: 5,
          quarter: 1,
          dayOfYear: 31
        },
        {
          date: new Date('2024-02-01'),
          dayOfMonth: 1,
          isCurrentMonth: false,
          isToday: false,
          weekNumber: 5,
          quarter: 1,
          dayOfYear: 32
        }
      ]
    }];

    render(
      <CalendarGrid
        weeks={multiMonthWeek}
        selectedDate={null}
        onSelectDay={() => {}}
      />
    );

    const days = screen.getAllByTestId('calendar-day');
    expect(days).toHaveLength(2);
    expect(days[0]).toHaveTextContent('31');
    expect(days[1]).toHaveTextContent('1');
  });

  it('supports all valid week start days', () => {
    // Test all possible week start days (0-6)
    const weekStarts = [0, 1, 2, 3, 4, 5, 6];
    const expectedFirstDays = [
      'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
    ];

    weekStarts.forEach((weekStart, index) => {
      (useCalendarConfig as any).mockReturnValue({ 
        config: { ...mockConfig, weekStartsOn: weekStart } 
      });

      const { unmount } = render(
        <CalendarGrid
          weeks={mockWeeks}
          selectedDate={null}
          onSelectDay={() => {}}
        />
      );

      // Check if first day matches the configured start day
      const firstDayCell = screen.getAllByText(/^(Sun|Mon|Tue|Wed|Thu|Fri|Sat)$/)[0];
      expect(firstDayCell).toHaveTextContent(expectedFirstDays[weekStart]);

      unmount();
    });
  });

  it('handles week spanning year transition', () => {
    const yearTransitionWeek = [{
      weekNumber: 52,
      days: [
        {
          date: new Date('2023-12-31'),
          dayOfMonth: 31,
          isCurrentMonth: true,
          isToday: false,
          weekNumber: 52,
          quarter: 4,
          dayOfYear: 365
        },
        {
          date: new Date('2024-01-01'),
          dayOfMonth: 1,
          isCurrentMonth: false,
          isToday: false,
          weekNumber: 52,
          quarter: 1,
          dayOfYear: 1
        }
      ]
    }];

    render(
      <CalendarGrid
        weeks={yearTransitionWeek}
        selectedDate={null}
        onSelectDay={() => {}}
      />
    );

    // Check if week number has gradient for quarter transition
    const weekNumber = screen.getByText('52', { selector: '.week-number' });
    const className = weekNumber.className;
    
    // Check that it's a week number cell
    expect(className).toContain('week-number');
    
    // Check that it has a gradient background
    expect(className).toContain('bg-gradient-to-r');

    // Check if days are rendered correctly
    const days = screen.getAllByTestId('calendar-day');
    expect(days).toHaveLength(2);
    expect(days[0]).toHaveTextContent('31');
    expect(days[1]).toHaveTextContent('1');
  });

  it('handles empty weeks array', () => {
    render(
      <CalendarGrid
        weeks={[]}
        selectedDate={null}
        onSelectDay={() => {}}
      />
    );

    // Header should still be rendered
    expect(screen.getByText('Week')).toBeInTheDocument();
    
    // Day names should still be rendered
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    dayNames.forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });

    // No days should be rendered
    const days = screen.queryAllByTestId('calendar-day');
    expect(days).toHaveLength(0);
  });

  it('handles week with empty days array', () => {
    const emptyDaysWeek = [{
      weekNumber: 1,
      days: []
    }];

    render(
      <CalendarGrid
        weeks={emptyDaysWeek}
        selectedDate={null}
        onSelectDay={() => {}}
      />
    );

    // Week number should still be rendered
    const weekNumber = screen.getByText('1', { selector: '.week-number' });
    expect(weekNumber).toBeInTheDocument();
    expect(weekNumber.className).toContain('bg-muted/30');

    // No days should be rendered
    const days = screen.queryAllByTestId('calendar-day');
    expect(days).toHaveLength(0);
  });

  it('handles today highlighting across months', () => {
    // Mock today's date
    const today = new Date('2024-01-31');
    vi.setSystemTime(today);

    const acrossMonthsWeek = [{
      weekNumber: 5,
      days: [
        {
          date: new Date('2024-01-31'),
          dayOfMonth: 31,
          isCurrentMonth: true,
          isToday: true,
          weekNumber: 5,
          quarter: 1,
          dayOfYear: 31
        },
        {
          date: new Date('2024-02-01'),
          dayOfMonth: 1,
          isCurrentMonth: false,
          isToday: false,
          weekNumber: 5,
          quarter: 1,
          dayOfYear: 32
        }
      ]
    }];

    render(
      <CalendarGrid
        weeks={acrossMonthsWeek}
        selectedDate={null}
        onSelectDay={() => {}}
      />
    );

    // Check if today's date is properly passed to CalendarDay
    const days = screen.getAllByTestId('calendar-day');
    expect(days[0]).toHaveAttribute('data-today', 'true');
    expect(days[1]).toHaveAttribute('data-today', 'false');

    // Reset system time
    vi.useRealTimers();
  });
}); 