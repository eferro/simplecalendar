import React from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import MiniCalendar from './MiniCalendar';
import PrintCalendar from './PrintCalendar';
import { getMonthData, getDayOfYear } from '@/utils/calendarUtils';
import { getQuarterName, getQuarterColor } from '@/utils/calendarUtils';
import { getWeek, addMonths, subMonths } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import CalendarConfig from './CalendarConfig';
import { useCalendarConfig } from '@/stores/calendarConfig';
import { useCalendarState } from '@/hooks/useCalendarState';
import { useCalendarKeyboard } from '@/hooks/useCalendarKeyboard';

const Calendar: React.FC = () => {
  const { config } = useCalendarConfig();
  const {
    state: { currentDate, selectedDate },
    handlePrevMonth,
    handleNextMonth,
    handleToday,
    handleSelectDay,
    handleUpdateCurrentDate,
  } = useCalendarState();

  const { weeks, monthName, year } = getMonthData(currentDate, config.weekStartsOn, config.quarters);
  const dayOfYear = selectedDate ? getDayOfYear(selectedDate) : '--';
  const weekNumber = selectedDate ? getWeek(selectedDate, { weekStartsOn: config.weekStartsOn }) : '--';
  
  const prevMonthDate = subMonths(currentDate, 1);
  const nextMonthDate = addMonths(currentDate, 1);

  // Use keyboard navigation hook
  useCalendarKeyboard({
    selectedDate,
    currentDate,
    onSelectDate: handleSelectDay,
    onUpdateCurrentDate: handleUpdateCurrentDate,
  });
  
  // Get all quarters for the legend (1-4)
  const allQuarters = [1, 2, 3, 4];
  
  // Find visible quarters in the current view (for highlighting current quarters)
  const visibleQuarters = [...new Set(weeks.flatMap(week => 
    week.days.map(day => day.quarter)
  ))].sort();
  
  return (
    <div 
      className="calendar-container"
      role="region"
      aria-label="Calendar"
      tabIndex={0}
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        {/* Left section: Month/Year */}
        <div className="flex flex-col items-center md:items-start w-[200px]">
          <h3 className="text-lg font-medium text-muted-foreground">{year}</h3>
          <h2 className="text-3xl font-bold tracking-tight w-full">{monthName}</h2>
        </div>
        
        {/* Center section: Navigation controls */}
        <div className="flex-1 flex justify-center items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="flex items-center gap-1"
            aria-label="Go to today"
          >
            <CalendarIcon className="h-4 w-4" aria-hidden="true" />
            <span>Today</span>
          </Button>
          
          <div className="flex space-x-1" role="group" aria-label="Month navigation">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevMonth}
              className={cn(
                "rounded-full transition-all duration-300 hover:bg-secondary hover:scale-105"
              )}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Previous month</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
              className={cn(
                "rounded-full transition-all duration-300 hover:bg-secondary hover:scale-105"
              )}
              aria-label="Next month"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Next month</span>
            </Button>
          </div>
        </div>

        {/* Right section: Print button and Settings */}
        <div className="hidden md:flex items-center space-x-2 w-[200px] justify-end">
          <CalendarConfig />
          <PrintCalendar currentDate={currentDate} />
        </div>
      </div>
      
      {/* Info section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 animate-slide-up">
        {/* Quarters legend - hidden on mobile */}
        <div 
          className="hidden md:flex items-center flex-wrap gap-3"
          role="group"
          aria-label="Calendar quarters"
        >
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
      
      <div 
        className="bg-card rounded-xl shadow-sm overflow-hidden border"
        role="grid"
        aria-label={`Calendar for ${monthName} ${year}`}
      >
        <CalendarGrid 
          weeks={weeks} 
          selectedDate={selectedDate}
          onSelectDay={handleSelectDay}
        />
      </div>
      
      {/* Mini Calendars */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
        role="group"
        aria-label="Adjacent months"
      >
        <MiniCalendar 
          date={prevMonthDate} 
          currentDate={currentDate}
          selectedDate={selectedDate}
          onSelectDay={(date) => {
            handleUpdateCurrentDate(prevMonthDate);
            handleSelectDay(date);
          }}
        />
        <MiniCalendar 
          date={nextMonthDate} 
          currentDate={currentDate}
          selectedDate={selectedDate}
          onSelectDay={(date) => {
            handleUpdateCurrentDate(nextMonthDate);
            handleSelectDay(date);
          }}
        />
      </div>
    </div>
  );
};

export default Calendar;
