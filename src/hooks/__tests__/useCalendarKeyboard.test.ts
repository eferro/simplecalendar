import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCalendarKeyboard } from '../useCalendarKeyboard';
import { fireEvent } from '@testing-library/dom';

describe('useCalendarKeyboard', () => {
  // Mock functions
  const mockOnSelectDate = vi.fn();
  const mockOnUpdateCurrentDate = vi.fn();
  
  // Test dates
  const today = new Date(2024, 0, 15); // January 15, 2024
  const currentDate = new Date(2024, 0, 15);
  
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Set a consistent date for testing
    vi.setSystemTime(today);
  });

  it('should select today when arrow key is pressed with no date selected', () => {
    // Render the hook with no selected date
    renderHook(() => useCalendarKeyboard({
      selectedDate: null,
      currentDate,
      onSelectDate: mockOnSelectDate,
      onUpdateCurrentDate: mockOnUpdateCurrentDate,
    }));

    // Simulate arrow key press
    fireEvent.keyDown(document, { key: 'ArrowRight' });

    // Check if today was selected
    expect(mockOnSelectDate).toHaveBeenCalledWith(today);
    expect(mockOnUpdateCurrentDate).toHaveBeenCalledWith(today);
  });

  it('should navigate days with left and right arrow keys', () => {
    const selectedDate = new Date(2024, 0, 15); // January 15, 2024
    
    renderHook(() => useCalendarKeyboard({
      selectedDate,
      currentDate,
      onSelectDate: mockOnSelectDate,
      onUpdateCurrentDate: mockOnUpdateCurrentDate,
    }));

    // Test right arrow
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(mockOnSelectDate).toHaveBeenCalledWith(new Date(2024, 0, 16)); // Jan 16

    // Reset mocks
    vi.clearAllMocks();

    // Test left arrow
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(mockOnSelectDate).toHaveBeenCalledWith(new Date(2024, 0, 14)); // Jan 14
  });

  it('should navigate weeks with up and down arrow keys', () => {
    const selectedDate = new Date(2024, 0, 15); // January 15, 2024
    
    renderHook(() => useCalendarKeyboard({
      selectedDate,
      currentDate,
      onSelectDate: mockOnSelectDate,
      onUpdateCurrentDate: mockOnUpdateCurrentDate,
    }));

    // Test down arrow
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    expect(mockOnSelectDate).toHaveBeenCalledWith(new Date(2024, 0, 22)); // Jan 22

    // Reset mocks
    vi.clearAllMocks();

    // Test up arrow
    fireEvent.keyDown(document, { key: 'ArrowUp' });
    expect(mockOnSelectDate).toHaveBeenCalledWith(new Date(2024, 0, 8)); // Jan 8
  });

  it('should update current month when navigating to different month', () => {
    const selectedDate = new Date(2024, 0, 31); // January 31, 2024
    
    renderHook(() => useCalendarKeyboard({
      selectedDate,
      currentDate,
      onSelectDate: mockOnSelectDate,
      onUpdateCurrentDate: mockOnUpdateCurrentDate,
    }));

    // Navigate to next month
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    
    // Check if date was selected and month was updated
    expect(mockOnSelectDate).toHaveBeenCalledWith(new Date(2024, 1, 1)); // Feb 1
    expect(mockOnUpdateCurrentDate).toHaveBeenCalledWith(new Date(2024, 1, 1));
  });

  it('should prevent default event behavior', () => {
    const selectedDate = new Date(2024, 0, 15);
    
    renderHook(() => useCalendarKeyboard({
      selectedDate,
      currentDate,
      onSelectDate: mockOnSelectDate,
      onUpdateCurrentDate: mockOnUpdateCurrentDate,
    }));

    // Test with all arrow keys
    ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].forEach(key => {
      const event = new KeyboardEvent('keydown', { key });
      Object.defineProperty(event, 'preventDefault', {
        value: vi.fn(),
      });
      
      document.dispatchEvent(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  it('should not respond to non-arrow keys', () => {
    const selectedDate = new Date(2024, 0, 15);
    
    renderHook(() => useCalendarKeyboard({
      selectedDate,
      currentDate,
      onSelectDate: mockOnSelectDate,
      onUpdateCurrentDate: mockOnUpdateCurrentDate,
    }));

    // Test with non-arrow key
    fireEvent.keyDown(document, { key: 'Enter' });
    
    expect(mockOnSelectDate).not.toHaveBeenCalled();
    expect(mockOnUpdateCurrentDate).not.toHaveBeenCalled();
  });

  it('should cleanup event listener on unmount', () => {
    const selectedDate = new Date(2024, 0, 15);
    
    // Spy on event listener methods
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    
    const { unmount } = renderHook(() => useCalendarKeyboard({
      selectedDate,
      currentDate,
      onSelectDate: mockOnSelectDate,
      onUpdateCurrentDate: mockOnUpdateCurrentDate,
    }));

    // Check if event listener was added
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    // Unmount the hook
    unmount();

    // Check if event listener was removed
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('should navigate between quarters with arrow keys', () => {
    // Create dates at midnight to avoid timezone issues
    const createDate = (year: number, month: number, day: number) => {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      return date;
    };

    let selectedDate = createDate(2024, 0, 15); // Q1
    
    const { rerender } = renderHook(() => useCalendarKeyboard({
      selectedDate,
      currentDate: selectedDate,
      onSelectDate: mockOnSelectDate,
      onUpdateCurrentDate: mockOnUpdateCurrentDate,
    }));

    // Navigate to Q2 (April)
    fireEvent.keyDown(document, { key: 'ArrowRight', shiftKey: true });
    const q2Date = createDate(2024, 3, 15); // April 15 (Q2)
    expect(mockOnSelectDate).toHaveBeenCalledWith(q2Date);
    expect(mockOnUpdateCurrentDate).toHaveBeenCalledWith(q2Date);

    // Update selected date and rerender hook
    selectedDate = q2Date;
    rerender();
    vi.clearAllMocks();

    // Navigate to Q3 (July)
    fireEvent.keyDown(document, { key: 'ArrowRight', shiftKey: true });
    const q3Date = createDate(2024, 6, 15); // July 15 (Q3)
    expect(mockOnSelectDate).toHaveBeenCalledWith(q3Date);
    expect(mockOnUpdateCurrentDate).toHaveBeenCalledWith(q3Date);

    // Update selected date and rerender hook
    selectedDate = q3Date;
    rerender();
    vi.clearAllMocks();

    // Navigate to Q4 (October)
    fireEvent.keyDown(document, { key: 'ArrowRight', shiftKey: true });
    const q4Date = createDate(2024, 9, 15); // October 15 (Q4)
    expect(mockOnSelectDate).toHaveBeenCalledWith(q4Date);
    expect(mockOnUpdateCurrentDate).toHaveBeenCalledWith(q4Date);
  });

  it('should handle quarter transitions with keyboard', () => {
    const createDate = (year: number, month: number, day: number) => {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      return date;
    };

    const selectedDate = createDate(2024, 2, 31); // March 31 (Q1)
    
    renderHook(() => useCalendarKeyboard({
      selectedDate,
      currentDate: selectedDate,
      onSelectDate: mockOnSelectDate,
      onUpdateCurrentDate: mockOnUpdateCurrentDate,
    }));

    // Navigate to Q2
    fireEvent.keyDown(document, { key: 'ArrowRight', shiftKey: true });
    expect(mockOnSelectDate).toHaveBeenCalledWith(createDate(2024, 5, 30)); // June 30 (Q2)
    expect(mockOnUpdateCurrentDate).toHaveBeenCalledWith(createDate(2024, 5, 30));
  });

  it('should handle year transitions with keyboard', () => {
    const createDate = (year: number, month: number, day: number) => {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      return date;
    };

    const selectedDate = createDate(2024, 11, 31); // December 31 (Q4)
    
    renderHook(() => useCalendarKeyboard({
      selectedDate,
      currentDate: selectedDate,
      onSelectDate: mockOnSelectDate,
      onUpdateCurrentDate: mockOnUpdateCurrentDate,
    }));

    // Navigate to Q1 of next year
    fireEvent.keyDown(document, { key: 'ArrowRight', shiftKey: true });
    expect(mockOnSelectDate).toHaveBeenCalledWith(createDate(2025, 2, 31)); // March 31 (Q1)
    expect(mockOnUpdateCurrentDate).toHaveBeenCalledWith(createDate(2025, 2, 31));
  });
}); 