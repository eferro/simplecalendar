import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCalendarState } from '../useCalendarState';
import { navigateMonth } from '@/utils/calendarUtils';

// Mock calendarUtils
vi.mock('@/utils/calendarUtils', () => ({
  navigateMonth: vi.fn((date, direction) => {
    const newDate = new Date(date);
    if (direction === 'next') {
      newDate.setMonth(date.getMonth() + 1);
    } else {
      newDate.setMonth(date.getMonth() - 1);
    }
    return newDate;
  }),
}));

describe('useCalendarState', () => {
  const today = new Date(2024, 0, 15); // January 15, 2024

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Set a consistent date for testing
    vi.setSystemTime(today);
  });

  it('should initialize with current date', () => {
    const { result } = renderHook(() => useCalendarState());
    
    expect(result.current.state.currentDate).toEqual(today);
    expect(result.current.state.selectedDate).toEqual(today);
  });

  it('should navigate to previous month', () => {
    const { result } = renderHook(() => useCalendarState());
    
    act(() => {
      result.current.handlePrevMonth();
    });

    const expectedDate = new Date(2023, 11, 15); // December 15, 2023
    expect(navigateMonth).toHaveBeenCalledWith(today, 'prev');
    expect(result.current.state.currentDate).toEqual(expectedDate);
    // Selected date should remain unchanged
    expect(result.current.state.selectedDate).toEqual(today);
  });

  it('should navigate to next month', () => {
    const { result } = renderHook(() => useCalendarState());
    
    act(() => {
      result.current.handleNextMonth();
    });

    const expectedDate = new Date(2024, 1, 15); // February 15, 2024
    expect(navigateMonth).toHaveBeenCalledWith(today, 'next');
    expect(result.current.state.currentDate).toEqual(expectedDate);
    // Selected date should remain unchanged
    expect(result.current.state.selectedDate).toEqual(today);
  });

  it('should handle today button click', () => {
    const { result } = renderHook(() => useCalendarState());
    
    // First navigate to a different month
    act(() => {
      result.current.handleNextMonth();
    });
    
    // Then click today
    act(() => {
      result.current.handleToday();
    });

    // Both current and selected date should be set to today
    expect(result.current.state.currentDate).toEqual(today);
    expect(result.current.state.selectedDate).toEqual(today);
  });

  it('should handle date selection and deselection', () => {
    const { result } = renderHook(() => useCalendarState());
    const newDate = new Date(2024, 0, 20); // January 20, 2024
    
    // Select a date
    act(() => {
      result.current.handleSelectDay(newDate);
    });
    
    expect(result.current.state.selectedDate).toEqual(newDate);
    expect(result.current.state.currentDate).toEqual(today); // Current date unchanged

    // Select the same date again (should deselect)
    act(() => {
      result.current.handleSelectDay(newDate);
    });
    
    expect(result.current.state.selectedDate).toBeNull();
    expect(result.current.state.currentDate).toEqual(today); // Current date unchanged
  });

  it('should update current date', () => {
    const { result } = renderHook(() => useCalendarState());
    const newDate = new Date(2024, 2, 15); // March 15, 2024
    
    act(() => {
      result.current.handleUpdateCurrentDate(newDate);
    });

    expect(result.current.state.currentDate).toEqual(newDate);
    expect(result.current.state.selectedDate).toEqual(today); // Selected date unchanged
  });

  it('should maintain selected date when navigating months', () => {
    const { result } = renderHook(() => useCalendarState());
    const selectedDate = new Date(2024, 0, 20); // January 20, 2024
    
    // First select a date
    act(() => {
      result.current.handleSelectDay(selectedDate);
    });
    
    // Navigate to next month
    act(() => {
      result.current.handleNextMonth();
    });
    
    // Selected date should remain unchanged while current date updates
    expect(result.current.state.selectedDate).toEqual(selectedDate);
    expect(result.current.state.currentDate).toEqual(new Date(2024, 1, 15));
    
    // Navigate back
    act(() => {
      result.current.handlePrevMonth();
    });
    
    // Selected date should still remain unchanged
    expect(result.current.state.selectedDate).toEqual(selectedDate);
    expect(result.current.state.currentDate).toEqual(today);
  });

  it('should handle year transitions correctly', () => {
    const { result } = renderHook(() => useCalendarState());
    
    // Set current date to December 2024
    act(() => {
      result.current.handleUpdateCurrentDate(new Date(2024, 11, 15));
    });
    
    // Navigate to next month (should go to January 2025)
    act(() => {
      result.current.handleNextMonth();
    });
    
    expect(result.current.state.currentDate).toEqual(new Date(2025, 0, 15));
    
    // Navigate back to December 2024
    act(() => {
      result.current.handlePrevMonth();
    });
    
    expect(result.current.state.currentDate).toEqual(new Date(2024, 11, 15));
  });

  it('should navigate between quarters correctly', () => {
    const { result } = renderHook(() => useCalendarState());
    
    // Start in Q1 (January)
    act(() => {
      result.current.handleUpdateCurrentDate(new Date(2024, 0, 15));
    });
    
    // Navigate to Q2 (April)
    act(() => {
      result.current.handleUpdateCurrentDate(new Date(2024, 3, 15));
    });
    expect(result.current.state.currentDate).toEqual(new Date(2024, 3, 15));
    
    // Navigate to Q3 (July)
    act(() => {
      result.current.handleUpdateCurrentDate(new Date(2024, 6, 15));
    });
    expect(result.current.state.currentDate).toEqual(new Date(2024, 6, 15));
    
    // Navigate to Q4 (October)
    act(() => {
      result.current.handleUpdateCurrentDate(new Date(2024, 9, 15));
    });
    expect(result.current.state.currentDate).toEqual(new Date(2024, 9, 15));
  });

  it('should handle quarter transitions with selected date', () => {
    const { result } = renderHook(() => useCalendarState());
    
    // Start in Q1 and select a date
    act(() => {
      result.current.handleUpdateCurrentDate(new Date(2024, 0, 15));
      result.current.handleSelectDay(new Date(2024, 0, 20));
    });
    
    // Navigate to Q2
    act(() => {
      result.current.handleUpdateCurrentDate(new Date(2024, 3, 15));
    });
    
    // Selected date should remain unchanged
    expect(result.current.state.selectedDate).toEqual(new Date(2024, 0, 20));
    expect(result.current.state.currentDate).toEqual(new Date(2024, 3, 15));
  });

  it('should handle year transitions during quarter navigation', () => {
    const { result } = renderHook(() => useCalendarState());
    
    // Start in Q4 2024
    act(() => {
      result.current.handleUpdateCurrentDate(new Date(2024, 9, 15));
    });
    
    // Navigate to Q1 2025
    act(() => {
      result.current.handleUpdateCurrentDate(new Date(2025, 0, 15));
    });
    
    expect(result.current.state.currentDate).toEqual(new Date(2025, 0, 15));
    
    // Navigate back to Q4 2024
    act(() => {
      result.current.handleUpdateCurrentDate(new Date(2024, 9, 15));
    });
    
    expect(result.current.state.currentDate).toEqual(new Date(2024, 9, 15));
  });
}); 