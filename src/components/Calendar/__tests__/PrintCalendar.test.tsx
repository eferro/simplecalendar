import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PrintCalendar from '../PrintCalendar';
import { format, addMonths, startOfYear, getMonth } from 'date-fns';
import { getMonthData, getQuarterColor, type CalendarDay, type CalendarWeek } from '@/utils/calendarUtils';

// Mock window.open
const mockOpen = vi.fn();
const mockAlert = vi.fn();

// Mock date-fns functions
vi.mock('date-fns', () => ({
  format: vi.fn(),
  addMonths: vi.fn((date: Date, months: number) => new Date(date.getFullYear(), date.getMonth() + months, 1)),
  startOfYear: vi.fn((date: Date) => new Date(date.getFullYear(), 0, 1)),
  getMonth: vi.fn((date: Date) => date.getMonth())
}));

// Mock calendarUtils functions
vi.mock('@/utils/calendarUtils', () => ({
  getMonthData: vi.fn((date: Date) => ({
    weeks: [
      {
        weekNumber: 1,
        days: [
          { date: new Date(2024, 0, 1), dayOfMonth: 1, isCurrentMonth: true, dayOfYear: 1 },
          { date: new Date(2024, 0, 2), dayOfMonth: 2, isCurrentMonth: true, dayOfYear: 2 }
        ]
      }
    ],
    monthName: 'January',
    year: 2024
  })),
  getQuarterColor: vi.fn((quarter: number) => `bg-quarter-${quarter}`)
}));

describe('PrintCalendar', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Mock window.open and alert
    window.open = mockOpen;
    window.alert = mockAlert;
    
    // Set a consistent date
    vi.setSystemTime(new Date(2024, 0, 1));
  });

  it('renders print button correctly', () => {
    render(<PrintCalendar currentDate={new Date(2024, 0, 1)} />);
    
    // Check if the print button is rendered
    const printButton = screen.getByRole('button');
    expect(printButton).toBeInTheDocument();
    expect(printButton).toHaveAccessibleName('Print Calendar');
  });

  it('shows alert when popup is blocked', () => {
    // Mock window.open to return null (simulating blocked popup)
    mockOpen.mockReturnValue(null);
    
    render(<PrintCalendar currentDate={new Date(2024, 0, 1)} />);
    
    // Click print button
    fireEvent.click(screen.getByRole('button'));
    
    // Check if alert was shown
    expect(mockAlert).toHaveBeenCalledWith('Please allow popups for this website to print the calendar.');
  });

  it('opens print window with correct content when clicked', () => {
    // Mock window object for print window
    const mockPrintWindow = {
      document: {
        write: vi.fn(),
        close: vi.fn()
      },
      print: vi.fn(),
      close: vi.fn()
    };
    
    // Mock window.open to return our mock window
    mockOpen.mockReturnValue(mockPrintWindow);
    
    render(<PrintCalendar currentDate={new Date(2024, 0, 1)} />);
    
    // Click print button
    fireEvent.click(screen.getByRole('button'));
    
    // Check if window.open was called with correct parameters
    expect(mockOpen).toHaveBeenCalledWith('', '_blank', 'width=1200,height=800');
    
    // Check if content was written to the window
    expect(mockPrintWindow.document.write).toHaveBeenCalled();
    const writtenContent = mockPrintWindow.document.write.mock.calls[0][0];
    
    // Verify content includes essential elements
    expect(writtenContent).toContain('Calendar 2024');
    expect(writtenContent).toContain('January');
    expect(writtenContent).toContain('Week Range: 1 - 1');
    expect(writtenContent).toContain('Day Range: 1-2');
  });

  it('handles leap year February correctly', () => {
    // Mock window object for print window
    const mockPrintWindow = {
      document: {
        write: vi.fn(),
        close: vi.fn()
      },
      print: vi.fn(),
      close: vi.fn()
    };
    
    // Mock window.open to return our mock window
    mockOpen.mockReturnValue(mockPrintWindow);
    
    // Mock getMonthData to return February with 29 days
    const getMonthDataMock = vi.fn((date: Date) => {
      const month = date.getMonth();
      const quarter = Math.floor(month / 3) + 1;
      
      // For February, create days 1-29
      const days: CalendarDay[] = [];
      for (let day = 1; day <= (month === 1 ? 29 : 1); day++) {
        days.push({
          date: new Date(2024, month, day),
          dayOfMonth: day,
          isCurrentMonth: true,
          isToday: false,
          weekNumber: Math.floor((day - 1) / 7) + 1,
          quarter,
          dayOfYear: month === 1 ? 31 + day : day // Account for January's days
        });
      }
      
      const weeks: CalendarWeek[] = [];
      for (let week = 1; week <= Math.ceil(days.length / 7); week++) {
        weeks.push({
          weekNumber: week,
          days: days.slice((week - 1) * 7, week * 7).filter(d => d) // Filter out undefined days
        });
      }
      
      return {
        weeks,
        monthName: month === 1 ? 'February' : 'January',
        year: 2024
      };
    });
    
    // Update the mock implementation
    vi.mocked(getMonthData).mockImplementation(getMonthDataMock);
    
    render(<PrintCalendar currentDate={new Date(2024, 1, 1)} />);
    
    // Click print button
    fireEvent.click(screen.getByRole('button'));
    
    // Get the written content
    const writtenContent = mockPrintWindow.document.write.mock.calls[0][0];
    
    // Check February's content
    expect(writtenContent).toContain('February');
    expect(writtenContent).toContain('Day Range: 32-60'); // February 1st is day 32 (31 days in January + 1)
    expect(writtenContent).toContain('Week Range: 1 - 5'); // February 2024 spans 5 weeks
    
    // Check that all days are present
    for (let day = 1; day <= 29; day++) {
      expect(writtenContent).toContain(`>${day}<`);
    }
    
    // Check quarter class is applied correctly
    expect(writtenContent).toContain('class="month-container q1"'); // February is in Q1
    
    // Verify week numbers are correct
    expect(writtenContent).toContain('<td class="week-number">\n            1');
    expect(writtenContent).toContain('<td class="week-number">\n            5');
  });

  it('includes correct print window styling', () => {
    // Mock window object for print window
    const mockPrintWindow = {
      document: {
        write: vi.fn(),
        close: vi.fn()
      },
      print: vi.fn(),
      close: vi.fn()
    };
    
    // Mock window.open to return our mock window
    mockOpen.mockReturnValue(mockPrintWindow);
    
    render(<PrintCalendar currentDate={new Date(2024, 0, 1)} />);
    
    // Click print button
    fireEvent.click(screen.getByRole('button'));
    
    // Get the written content
    const writtenContent = mockPrintWindow.document.write.mock.calls[0][0];
    
    // Verify print-specific styles
    expect(writtenContent).toContain('@media print');
    expect(writtenContent).toContain('@page {');
    expect(writtenContent).toContain('size: landscape');
    expect(writtenContent).toContain('margin: 0.5cm');
    
    // Verify quarter color classes
    expect(writtenContent).toContain('.q1 { background-color: rgba(191, 219, 254, 0.3); }');
    expect(writtenContent).toContain('.q2 { background-color: rgba(187, 247, 208, 0.3); }');
    expect(writtenContent).toContain('.q3 { background-color: rgba(254, 240, 138, 0.3); }');
    expect(writtenContent).toContain('.q4 { background-color: rgba(254, 202, 202, 0.3); }');
    
    // Verify layout styles
    expect(writtenContent).toContain('.month-container');
    expect(writtenContent).toContain('.calendar-grid');
    expect(writtenContent).toContain('.week-number');
    expect(writtenContent).toContain('.day-column');
    expect(writtenContent).toContain('.day-content');
    
    // Verify typography styles
    expect(writtenContent).toContain('font-family: Arial, sans-serif');
    expect(writtenContent).toContain('font-size: 24pt');
    expect(writtenContent).toContain('font-size: 18pt');
    expect(writtenContent).toContain('font-size: 10pt');
  });
}); 