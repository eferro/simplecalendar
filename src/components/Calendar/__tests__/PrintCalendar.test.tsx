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
  format: vi.fn((date: Date, formatStr: string) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    if (formatStr === 'MMMM') return months[date.getMonth()];
    return date.toString();
  }),
  addMonths: vi.fn((date: Date, months: number) => new Date(date.getFullYear(), date.getMonth() + months, 1)),
  startOfYear: vi.fn((date: Date) => new Date(date.getFullYear(), 0, 1)),
  getMonth: vi.fn((date: Date) => date.getMonth())
}));

// Mock calendarUtils functions
vi.mock('@/utils/calendarUtils', () => ({
  getMonthData: vi.fn((date: Date) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month, daysInMonth);
    
    // Calculate day of year
    const yearStart = new Date(year, 0, 1);
    const firstDayOfYear = Math.floor((firstDay.getTime() - yearStart.getTime()) / (24 * 60 * 60 * 1000)) + 1;
    const lastDayOfYear = Math.floor((lastDay.getTime() - yearStart.getTime()) / (24 * 60 * 60 * 1000)) + 1;
    
    // Create days array
    const days: CalendarDay[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dayOfYear = firstDayOfYear + day - 1;
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
    
    // Group into weeks (Monday to Sunday)
    const weeks: CalendarWeek[] = [];
    let currentWeek: CalendarDay[] = [];
    
    // Find the first Monday
    let firstMonday = 1;
    while (new Date(year, month, firstMonday).getDay() !== 1) {
      firstMonday++;
    }
    
    // Add days before the first Monday
    for (let day = 1; day < firstMonday; day++) {
      const dateObj = new Date(year, month, day);
      const dayOfYear = firstDayOfYear + day - 1;
      const weekNumber = Math.floor((dayOfYear - 1) / 7) + 1;
      const quarter = Math.floor(month / 3) + 1;
      
      currentWeek.push({
        date: dateObj,
        dayOfMonth: day,
        isCurrentMonth: true,
        isToday: false,
        weekNumber,
        quarter,
        dayOfYear
      });
    }
    
    // Add remaining days
    for (let day = firstMonday; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dayOfYear = firstDayOfYear + day - 1;
      const weekNumber = Math.floor((dayOfYear - 1) / 7) + 1;
      const quarter = Math.floor(month / 3) + 1;
      
      currentWeek.push({
        date: dateObj,
        dayOfMonth: day,
        isCurrentMonth: true,
        isToday: false,
        weekNumber,
        quarter,
        dayOfYear
      });
      
      if (currentWeek.length === 7) {
        weeks.push({
          weekNumber: weekNumber,
          days: [...currentWeek]
        });
        currentWeek = [];
      }
    }
    
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
  getQuarterColor: vi.fn((quarter: number) => `q${quarter}`)
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

  it('opens print window with correct HTML structure', () => {
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
    
    // Check HTML structure
    expect(writtenContent).toContain('<html>');
    expect(writtenContent).toContain('<head>');
    expect(writtenContent).toContain('<title>Calendar 2024</title>');
    expect(writtenContent).toContain('<style>');
    expect(writtenContent).toContain('<body>');
    
    // Check month container structure
    expect(writtenContent).toContain('<div class="month-container q1">');
    expect(writtenContent).toContain('<div class="month-header">');
    expect(writtenContent).toContain('<div class="month-title">January</div>');
    expect(writtenContent).toContain('<div class="year">2024</div>');
    
    // Check month info
    expect(writtenContent).toContain('<div class="month-info">');
    expect(writtenContent).toContain('Day Range: 1-31');
    expect(writtenContent).toContain('Week Range: 1 - 5');
    
    // Check calendar grid structure
    expect(writtenContent).toContain('<table class="calendar-grid">');
    expect(writtenContent).toContain('<thead>');
    expect(writtenContent).toContain('<th class="week-number">Week</th>');
    expect(writtenContent).toContain('<th class="day-column">Monday</th>');
    
    // Check day content structure
    expect(writtenContent).toContain('<div class="day-content">');
    expect(writtenContent).toContain('<span class="day-of-month">');
    expect(writtenContent).toContain('<span class="day-of-year">');
    
    // Check week quarter indicators
    expect(writtenContent).toContain('<span class="week-quarter">Q1</span>');
  });

  it('includes correct print styles', () => {
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
    
    // Check print media query
    expect(writtenContent).toContain('@media print {');
    
    // Check page settings
    expect(writtenContent).toContain('@page {');
    expect(writtenContent).toContain('size: landscape');
    expect(writtenContent).toContain('margin: 0.5cm');
    
    // Check font styles
    expect(writtenContent).toContain('font-family: Arial, sans-serif');
    expect(writtenContent).toContain('font-size: 24pt'); // Month title
    expect(writtenContent).toContain('font-size: 18pt'); // Day of month
    expect(writtenContent).toContain('font-size: 10pt'); // Day of year
    
    // Check layout styles
    expect(writtenContent).toContain('display: flex');
    expect(writtenContent).toContain('flex-direction: column');
    expect(writtenContent).toContain('justify-content: space-between');
    
    // Check colors
    expect(writtenContent).toContain('.q1 { background-color: rgba(191, 219, 254, 0.3); }');
    expect(writtenContent).toContain('.q2 { background-color: rgba(187, 247, 208, 0.3); }');
    expect(writtenContent).toContain('.q3 { background-color: rgba(254, 240, 138, 0.3); }');
    expect(writtenContent).toContain('.q4 { background-color: rgba(254, 202, 202, 0.3); }');
  });

  it('handles page breaks correctly', () => {
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
    
    // Check page breaks
    const pageBreaks = writtenContent.match(/page-break-after: always/g);
    expect(pageBreaks).toHaveLength(11); // One after each month except December
    
    // Check month containers
    const monthContainers = writtenContent.match(/class="month-container/g);
    expect(monthContainers).toHaveLength(12); // One for each month
  });
}); 