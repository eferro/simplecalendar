
import React from 'react';
import { format, isSameMonth, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { getMonthData, getQuarterColor } from '@/utils/calendarUtils';

interface MiniCalendarProps {
  date: Date;
  currentDate: Date;
  selectedDate: Date | null;
  onSelectDay?: (date: Date) => void;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ 
  date, 
  currentDate, 
  selectedDate,
  onSelectDay 
}) => {
  const { weeks, monthName, year } = getMonthData(date);
  // Update day names to use three-letter abbreviations
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <div className="mini-calendar rounded-lg border bg-card p-3 shadow-sm">
      <div className="text-center mb-2">
        <h3 className="text-sm font-medium">{monthName} {year}</h3>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((day, index) => (
          <div 
            key={index} 
            className="text-xs text-center text-muted-foreground h-6 flex items-center justify-center"
          >
            {day}
          </div>
        ))}
        
        {weeks.flatMap(week => 
          week.days.map((day, dayIndex) => (
            <div
              key={`${week.weekNumber}-${dayIndex}`}
              className={cn(
                "mini-calendar-day text-xs h-6 w-full flex items-center justify-center transition-colors",
                day.isCurrentMonth ? "hover:bg-muted cursor-pointer" : "opacity-40",
                day.isToday && "relative ring-1 ring-red-500",
                selectedDate && isSameDay(day.date, selectedDate) && "bg-primary text-primary-foreground",
                getQuarterColor(day.quarter)
              )}
              onClick={() => day.isCurrentMonth && onSelectDay?.(day.date)}
            >
              {day.dayOfMonth}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MiniCalendar;
