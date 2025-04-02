import { useEffect } from 'react';
import { addDays } from 'date-fns';
import { CalendarState } from '@/types/calendar';

interface UseCalendarKeyboardProps {
  selectedDate: Date | null;
  currentDate: Date;
  onSelectDate: (date: Date) => void;
  onUpdateCurrentDate: (date: Date) => void;
}

export const useCalendarKeyboard = ({
  selectedDate,
  currentDate,
  onSelectDate,
  onUpdateCurrentDate,
}: UseCalendarKeyboardProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If no date is selected, select today when an arrow key is pressed
      if (!selectedDate) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          const today = new Date();
          onSelectDate(today);
          onUpdateCurrentDate(today);
          e.preventDefault();
          return;
        }
        return;
      }

      let newDate = new Date(selectedDate);
      
      switch (e.key) {
        case 'ArrowUp':
          // Move up one week (subtract 7 days)
          newDate = addDays(selectedDate, -7);
          break;
        case 'ArrowDown':
          // Move down one week (add 7 days)
          newDate = addDays(selectedDate, 7);
          break;
        case 'ArrowLeft':
          // Move left one day
          newDate = addDays(selectedDate, -1);
          break;
        case 'ArrowRight':
          // Move right one day
          newDate = addDays(selectedDate, 1);
          break;
        default:
          return;
      }
      
      // Update selected date
      onSelectDate(newDate);
      
      // Update current month view if selected date moves to different month
      if (newDate.getMonth() !== currentDate.getMonth() || 
          newDate.getFullYear() !== currentDate.getFullYear()) {
        onUpdateCurrentDate(newDate);
      }
      
      // Prevent default browser scrolling with arrow keys
      e.preventDefault();
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedDate, currentDate, onSelectDate, onUpdateCurrentDate]);
}; 