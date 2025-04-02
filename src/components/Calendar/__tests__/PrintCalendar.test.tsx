import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PrintCalendar from '../PrintCalendar';
import { format, addMonths, startOfYear, getMonth } from 'date-fns';

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
}); 