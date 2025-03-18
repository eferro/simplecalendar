
import React, { useState, useEffect } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import MiniCalendar from './MiniCalendar';
import { getMonthData, navigateMonth, getDayOfYear } from '@/utils/calendarUtils';
import { getQuarterName, getQuarterColor } from '@/utils/calendarUtils';
import { addMonths, subMonths, getWeek, addDays } from 'date-fns';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()); // Today's date is selected by default
  const { weeks, monthName, year } = getMonthData(currentDate);
  const dayOfYear = selectedDate ? getDayOfYear(selectedDate) : '--';
  const weekNumber = selectedDate ? getWeek(selectedDate, { weekStartsOn: 1 }) : '--';
  
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
      <CalendarHeader
        monthName={monthName}
        year={year}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 animate-slide-up">
        <div className="flex items-center flex-wrap gap-3 mb-2 md:mb-0">
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
            Day of Year: <span className="font-bold">{dayOfYear}</span>
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
