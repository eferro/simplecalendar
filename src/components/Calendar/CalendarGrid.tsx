import React from 'react';
import CalendarDay from './CalendarDay';
import { getQuarterColor } from '@/utils/calendarUtils';
import type { CalendarWeek } from '@/utils/calendarUtils';

interface CalendarGridProps {
  weeks: CalendarWeek[];
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ weeks }) => {
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const getWeekQuarterColor = (week: CalendarWeek) => {
    // Get all unique quarters in this week
    const quarters = [...new Set(week.days.map(day => day.quarter))];
    
    // If there's more than one quarter in this week, return a gradient
    if (quarters.length > 1) {
      const colors = quarters.map(q => getQuarterColor(q).replace('bg-', ''));
      return `bg-gradient-to-r from-${colors[0]} to-${colors[1]}`;
    }
    
    // Otherwise return the single quarter color
    return getQuarterColor(quarters[0]).replace('bg-', 'bg-muted/20');
  };
  
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
          <div 
            className={`week-number ${getWeekQuarterColor(week)}`}
          >
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
