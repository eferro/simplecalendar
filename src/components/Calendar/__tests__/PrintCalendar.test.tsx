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
  getMonthData: vi.fn(),
  getQuarterColor: vi.fn()
}));

describe('PrintCalendar', () => {
  const mockDay1: CalendarDay = {
    date: new Date(2024, 0, 1),
    dayOfMonth: 1,
    isCurrentMonth: true,
    isToday: false,
    weekNumber: 1,
    quarter: 1,
    dayOfYear: 1
  };

  const mockDay2: CalendarDay = {
    date: new Date(2024, 0, 2),
    dayOfMonth: 2,
    isCurrentMonth: true,
    isToday: false,
    weekNumber: 1,
    quarter: 1,
    dayOfYear: 2
  };

  const mockWeek: CalendarWeek = {
    weekNumber: 1,
    days: [mockDay1, mockDay2]
  };

  const mockMonthData = {
    weeks: [mockWeek],
    monthName: 'January',
    year: 2024
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockOpen.mockReset();
    vi.mocked(getMonthData).mockReturnValue(mockMonthData);
    
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

  it('applies correct quarter colors and transitions', () => {
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
    
    // Mock getMonthData to return different months
    const getMonthDataMock = vi.fn((date: Date) => {
      const month = date.getMonth();
      const quarter = Math.floor(month / 3) + 1;
      const day: CalendarDay = {
        date: new Date(2024, month, 1),
        dayOfMonth: 1,
        isCurrentMonth: true,
        isToday: false,
        weekNumber: 1,
        quarter,
        dayOfYear: 1
      };
      const week: CalendarWeek = {
        weekNumber: 1,
        days: [day]
      };
      return {
        weeks: [week],
        monthName: ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'][month],
        year: 2024
      };
    });
    
    // Update the mock implementation
    vi.mocked(getMonthData).mockImplementation(getMonthDataMock);
    
    render(<PrintCalendar currentDate={new Date(2024, 0, 1)} />);
    
    // Click print button
    fireEvent.click(screen.getByRole('button'));
    
    // Get the written content
    const writtenContent = mockPrintWindow.document.write.mock.calls[0][0];
    
    // Check quarter classes for each month
    expect(writtenContent).toContain('class="month-container q1"'); // January
    expect(writtenContent).toContain('class="month-container q2"'); // April
    expect(writtenContent).toContain('class="month-container q3"'); // July
    expect(writtenContent).toContain('class="month-container q4"'); // October
    
    // Check quarter transitions
    expect(writtenContent).toContain('class="month-container q1"'); // March
    expect(writtenContent).toContain('class="month-container q2"'); // April
    expect(writtenContent).toContain('class="month-container q2"'); // June
    expect(writtenContent).toContain('class="month-container q3"'); // July
    expect(writtenContent).toContain('class="month-container q3"'); // September
    expect(writtenContent).toContain('class="month-container q4"'); // October
    expect(writtenContent).toContain('class="month-container q4"'); // December
  });

  it('displays months in correct sequence', () => {
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
    
    // Mock getMonthData to return different months
    const getMonthDataMock = vi.fn((date: Date) => {
      const month = date.getMonth();
      const quarter = Math.floor(month / 3) + 1;
      const day: CalendarDay = {
        date: new Date(2024, month, 1),
        dayOfMonth: 1,
        isCurrentMonth: true,
        isToday: false,
        weekNumber: 1,
        quarter,
        dayOfYear: 1
      };
      const week: CalendarWeek = {
        weekNumber: 1,
        days: [day]
      };
      return {
        weeks: [week],
        monthName: ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'][month],
        year: 2024
      };
    });
    
    // Update the mock implementation
    vi.mocked(getMonthData).mockImplementation(getMonthDataMock);
    
    render(<PrintCalendar currentDate={new Date(2024, 0, 1)} />);
    
    // Click print button
    fireEvent.click(screen.getByRole('button'));
    
    // Get the written content
    const writtenContent = mockPrintWindow.document.write.mock.calls[0][0];
    
    // Check that months are displayed in correct sequence
    expect(writtenContent).toContain('January');
    expect(writtenContent).toContain('February');
    expect(writtenContent).toContain('March');
    expect(writtenContent).toContain('April');
    expect(writtenContent).toContain('May');
    expect(writtenContent).toContain('June');
    expect(writtenContent).toContain('July');
    expect(writtenContent).toContain('August');
    expect(writtenContent).toContain('September');
    expect(writtenContent).toContain('October');
    expect(writtenContent).toContain('November');
    expect(writtenContent).toContain('December');
    
    // Check that months are in the correct order
    const monthIndices = [
      writtenContent.indexOf('January'),
      writtenContent.indexOf('February'),
      writtenContent.indexOf('March'),
      writtenContent.indexOf('April'),
      writtenContent.indexOf('May'),
      writtenContent.indexOf('June'),
      writtenContent.indexOf('July'),
      writtenContent.indexOf('August'),
      writtenContent.indexOf('September'),
      writtenContent.indexOf('October'),
      writtenContent.indexOf('November'),
      writtenContent.indexOf('December')
    ];
    
    // Verify that each month appears after the previous one
    for (let i = 1; i < monthIndices.length; i++) {
      expect(monthIndices[i]).toBeGreaterThan(monthIndices[i - 1]);
    }
  });
}); 