
import React, { useState } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarDay as CalendarDayType } from '@/utils/calendarUtils';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface CalendarDayProps {
  day: CalendarDayType;
  quarterColor: string;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ day, quarterColor }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div
          className={cn(
            "calendar-day group",
            day.isCurrentMonth ? quarterColor : 'bg-background opacity-40',
            day.isToday && 'border-2 border-black dark:border-white',
            isHovered && 'scale-[1.02]'
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="h-full flex flex-col">
            <span 
              className={cn(
                "text-xs md:text-sm font-medium p-1 rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center",
                day.isToday ? 'bg-primary text-primary-foreground' : 'group-hover:bg-background/80'
              )}
            >
              {day.dayOfMonth}
            </span>
            <div className="flex-grow"></div>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent 
        className="hover-card-content w-64"
        side="top"
        align="center"
      >
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">{format(day.date, 'EEEE, MMMM d, yyyy')}</h4>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>Week {day.weekNumber} • Quarter {day.quarter}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default CalendarDay;
