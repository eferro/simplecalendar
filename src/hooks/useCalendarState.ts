import { useState, useCallback } from 'react';
import { CalendarState } from '@/types/calendar';
import { navigateMonth } from '@/utils/calendarUtils';

export const useCalendarState = () => {
  const [state, setState] = useState<CalendarState>({
    currentDate: new Date(),
    selectedDate: new Date(),
  });

  const handlePrevMonth = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentDate: navigateMonth(prev.currentDate, 'prev'),
    }));
  }, []);

  const handleNextMonth = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentDate: navigateMonth(prev.currentDate, 'next'),
    }));
  }, []);

  const handleToday = useCallback(() => {
    const today = new Date();
    setState({
      currentDate: today,
      selectedDate: today,
    });
  }, []);

  const handleSelectDay = useCallback((date: Date) => {
    setState(prev => ({
      ...prev,
      selectedDate: prev.selectedDate && prev.selectedDate.getTime() === date.getTime() ? null : date,
    }));
  }, []);

  const handleUpdateCurrentDate = useCallback((date: Date) => {
    setState(prev => ({
      ...prev,
      currentDate: date,
    }));
  }, []);

  return {
    state,
    handlePrevMonth,
    handleNextMonth,
    handleToday,
    handleSelectDay,
    handleUpdateCurrentDate,
  };
}; 