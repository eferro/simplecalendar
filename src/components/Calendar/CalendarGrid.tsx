import React from 'react';
import CalendarDay from './CalendarDay';
import { getQuarterColor } from '@/utils/calendarUtils';
import type { CalendarWeek } from '@/utils/calendarUtils';
import { useCalendarConfig } from '@/stores/calendarConfig';

interface CalendarGridProps {
  weeks: CalendarWeek[];
  selectedDate: Date | null;
  onSelectDay: (date: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ weeks, selectedDate, onSelectDay }) => {
  const { config } = useCalendarConfig();
  const allDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Rotate the day names array based on weekStartsOn
  const dayNames = [
    ...allDayNames.slice(config.weekStartsOn === 0 ? 6 : config.weekStartsOn - 1),
    ...allDayNames.slice(0, config.weekStartsOn === 0 ? 6 : config.weekStartsOn - 1)
  ];
  
  const getWeekQuarterColor = (week: CalendarWeek) => {
    // Get all unique quarters in this week
    const quarters = [...new Set(week.days.map(day => day.quarter))];
    
    // If there's more than one quarter in this week, return a gradient
    if (quarters.length > 1) {
      // Sort quarters to ensure consistent gradient direction
      quarters.sort();
      
      // Return a directly styled element with the gradient with reduced opacity
      return `bg-gradient-to-r from-quarter-q${quarters[0]}/40 to-quarter-q${quarters[1]}/40`;
    }
    
    // Otherwise return the single quarter color with reduced opacity
    const baseColor = getQuarterColor(quarters[0]);
    return `${baseColor}/40`;
  };
  
  return (
    <div className="calendar-grid animate-fade-in border-2 border-gray-200">
      <div className="grid grid-cols-8 gap-px mb-px">
        <div className="h-12 bg-muted/30 flex items-center justify-center font-medium text-sm border-2 border-gray-200">
          Week
        </div>
        {dayNames.map((day) => (
          <div 
            key={day} 
            className="h-12 bg-muted/30 flex items-center justify-center font-medium text-sm border-2 border-gray-200"
          >
            {day}
          </div>
        ))}
      </div>
      
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="grid grid-cols-8 gap-px mb-px">
          <div 
            className={`week-number ${getWeekQuarterColor(week)} border-2 border-gray-200`}
          >
            {week.weekNumber}
          </div>
          
          {week.days.map((day, dayIndex) => (
            <CalendarDay 
              key={dayIndex} 
              day={day} 
              quarterColor={getQuarterColor(day.quarter)}
              isSelected={selectedDate ? day.date.getTime() === selectedDate.getTime() : false}
              onSelect={() => onSelectDay(day.date)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default CalendarGrid;
