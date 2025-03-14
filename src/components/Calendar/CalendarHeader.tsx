
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarHeaderProps {
  monthName: string;
  year: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  monthName,
  year,
  onPrevMonth,
  onNextMonth
}) => {
  return (
    <div className="flex items-center justify-between mb-6 animate-slide-down">
      <div className="flex flex-col">
        <h3 className="text-lg font-medium text-muted-foreground">{year}</h3>
        <h2 className="text-3xl font-bold tracking-tight">{monthName}</h2>
      </div>
      
      <div className="flex space-x-1">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrevMonth}
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
          onClick={onNextMonth}
          className={cn(
            "rounded-full transition-all duration-300 hover:bg-secondary hover:scale-105"
          )}
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
