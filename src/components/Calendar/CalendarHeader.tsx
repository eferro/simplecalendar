
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarHeaderProps {
  monthName: string;
  year: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  monthName,
  year,
  onPrevMonth,
  onNextMonth,
  onToday
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 animate-slide-down gap-4">
      <div className="flex flex-col">
        <h3 className="text-lg font-medium text-muted-foreground">{year}</h3>
        <h2 className="text-3xl font-bold tracking-tight">{monthName}</h2>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="flex items-center gap-1"
        >
          <CalendarIcon className="h-4 w-4" />
          <span>Today</span>
        </Button>
        
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
    </div>
  );
};

export default CalendarHeader;
