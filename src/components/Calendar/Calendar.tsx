import React, { useState, useEffect } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import MiniCalendar from './MiniCalendar';
import PrintCalendar from './PrintCalendar';
import { getMonthData, navigateMonth, getDayOfYear } from '@/utils/calendarUtils';
import { getQuarterName, getQuarterColor } from '@/utils/calendarUtils';
import { addMonths, subMonths, getWeek, addDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import CalendarConfig from './CalendarConfig';
import { useCalendarConfig } from '@/stores/calendarConfig';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()); // Today's date is selected by default
  const { config } = useCalendarConfig();
  const { weeks, monthName, year } = getMonthData(currentDate, config.weekStartsOn, config.quarters);
  const dayOfYear = selectedDate ? getDayOfYear(selectedDate) : '--';
  const weekNumber = selectedDate ? getWeek(selectedDate, { weekStartsOn: config.weekStartsOn }) : '--';
  
  const prevMonthDate = subMonths(currentDate, 1);
  const nextMonthDate = addMonths(currentDate, 1);
  
  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => navigateMonth(prevDate, 'prev'));
  };
  
  const handleNextMonth = () => {
    setCurrentDate((prevDate) => navigateMonth(prevDate, 'next'));
  };
  
  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };
  
  const handleSelectDay = (date: Date) => {
    // If the clicked date is already selected, unselect it
    setSelectedDate(prevDate => 
      prevDate && prevDate.getTime() === date.getTime() ? null : date
    );
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedDate) {
      // If no date is selected, select today when an arrow key is pressed
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        handleToday();
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
    setSelectedDate(newDate);
    
    // Update current month view if selected date moves to different month
    if (newDate.getMonth() !== currentDate.getMonth() || 
        newDate.getFullYear() !== currentDate.getFullYear()) {
      setCurrentDate(newDate);
    }
    
    // Prevent default browser scrolling with arrow keys
    e.preventDefault();
  };
  
  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedDate, currentDate]);
  
  // Get all quarters for the legend (1-4)
  const allQuarters = [1, 2, 3, 4];
  
  // Find visible quarters in the current view (for highlighting current quarters)
  const visibleQuarters = [...new Set(weeks.flatMap(week => 
    week.days.map(day => day.quarter)
  ))].sort();
  
  return (
    <div className="calendar-container">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        {/* Left section: Month/Year */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-medium text-muted-foreground">{year}</h3>
          <h2 className="text-3xl font-bold tracking-tight">{monthName}</h2>
        </div>
        
        {/* Center section: Navigation controls */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="flex items-center gap-1"
          >
            <CalendarIcon className="h-4 w-4" />
            <span>Today</span>
          </Button>
          
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevMonth}
              className={cn(
                "rounded-full transition-all duration-300 hover:bg-secondary hover:scale-105"
              )}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous month</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
              className={cn(
                "rounded-full transition-all duration-300 hover:bg-secondary hover:scale-105"
              )}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next month</span>
            </Button>
          </div>
        </div>

        {/* Right section: Print button and Settings */}
        <div className="hidden md:flex items-center space-x-2">
          <CalendarConfig />
          <PrintCalendar currentDate={currentDate} />
        </div>
      </div>
      
      {/* Info section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 animate-slide-up">
        {/* Quarters legend - hidden on mobile */}
        <div className="hidden md:flex items-center flex-wrap gap-3">
          <span className="text-sm font-medium">Quarters:</span>
          {allQuarters.map((quarter) => {
            const isVisible = visibleQuarters.includes(quarter);
            return (
              <div key={quarter} className="flex items-center">
                <div 
                  className={`${getQuarterColor(quarter)} w-4 h-4 rounded mr-1 ${!isVisible ? 'opacity-40' : ''}`}
                  aria-hidden="true"
                ></div>
                <span className={`text-sm ${!isVisible ? 'text-muted-foreground' : ''}`}>
                  {getQuarterName(quarter)}
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="flex gap-4 text-sm font-medium">
          <div>
            Week: <span className="font-bold">{weekNumber}</span>
          </div>
          <div>
            Day: <span className="font-bold">{dayOfYear}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-xl shadow-sm overflow-hidden border">
        <CalendarGrid 
          weeks={weeks} 
          selectedDate={selectedDate}
          onSelectDay={handleSelectDay}
        />
      </div>
      
      {/* Mini Calendars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <MiniCalendar 
          date={prevMonthDate} 
          currentDate={currentDate}
          selectedDate={selectedDate}
          onSelectDay={(date) => {
            setCurrentDate(prevMonthDate);
            handleSelectDay(date);
          }}
        />
        <MiniCalendar 
          date={nextMonthDate} 
          currentDate={currentDate}
          selectedDate={selectedDate}
          onSelectDay={(date) => {
            setCurrentDate(nextMonthDate);
            handleSelectDay(date);
          }}
        />
      </div>
    </div>
  );
};

export default Calendar;
