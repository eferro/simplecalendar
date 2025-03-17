
import React, { useState } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarDay as CalendarDayType } from '@/utils/calendarUtils';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useIsMobile } from '@/hooks/use-mobile';

interface CalendarDayProps {
  day: CalendarDayType;
  quarterColor: string;
  isSelected: boolean;
  onSelect: () => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ day, quarterColor, isSelected, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div
          className={cn(
            "calendar-day group relative cursor-pointer",
            quarterColor,
            day.isCurrentMonth ? "" : "opacity-40",
            day.isToday && 'today-highlight',
            isSelected && 'selected-highlight',
            isHovered && 'scale-[1.02]'
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={onSelect}
        >
          <div className="h-full flex flex-col">
            <div className="flex justify-between p-1">
              <span className="text-xs opacity-70 px-1 invisible">
                {day.dayOfYear}
              </span>
              {!isMobile && (
                <span className="text-xs opacity-70 px-1">
                  {day.dayOfYear}
                </span>
              )}
            </div>
            
            {/* Day number - centered, larger and bold */}
            <div className="flex-grow flex items-center justify-center">
              <span className="text-xl font-bold">
                {day.dayOfMonth}
              </span>
            </div>
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
            <p>Week {day.weekNumber} • Quarter {day.quarter} • Day {day.dayOfYear} of Year</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default CalendarDay;
