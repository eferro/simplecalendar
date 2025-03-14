
import React from 'react';
import CalendarDay from './CalendarDay';
import { getQuarterColor } from '@/utils/calendarUtils';
import type { CalendarWeek } from '@/utils/calendarUtils';

interface CalendarGridProps {
  weeks: CalendarWeek[];
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ weeks }) => {
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <div className="calendar-grid animate-fade-in">
      <div className="grid grid-cols-8 gap-px mb-px">
        <div className="h-12 bg-muted/30 flex items-center justify-center font-medium text-sm">
          Week
        </div>
        {dayNames.map((day) => (
          <div 
            key={day} 
            className="h-12 bg-muted/30 flex items-center justify-center font-medium text-sm"
          >
            {day}
          </div>
        ))}
      </div>
      
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="grid grid-cols-8 gap-px mb-px">
          <div className="week-number bg-muted/20">
            {week.weekNumber}
          </div>
          
          {week.days.map((day, dayIndex) => (
            <CalendarDay 
              key={dayIndex} 
              day={day} 
              quarterColor={getQuarterColor(day.quarter)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default CalendarGrid;
