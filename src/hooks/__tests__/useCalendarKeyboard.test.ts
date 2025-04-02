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
}); 