import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCalendarConfig } from '@/stores/calendarConfig';
import { Settings } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { format, parseISO } from 'date-fns';

const weekDays = [
  { value: '1', label: 'Monday (ISO Standard)' },
  { value: '0', label: 'Sunday (US, Japan)' },
  { value: '6', label: 'Saturday (Islamic)' },
];

const months = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

// Generate array of days 1-31
const days = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1)
}));

const CalendarConfig: React.FC = () => {
  const { config, setWeekStart, setQuarterStartDay, resetConfig } = useCalendarConfig();

  const handleWeekStartChange = (value: string) => {
    setWeekStart(Number(value) as 0 | 1 | 2 | 3 | 4 | 5 | 6);
  };

  const handleQuarterStartDayChange = (value: string) => {
    setQuarterStartDay(Number(value));
  };

  // Format date to show month and day
  const formatQuarterDate = (isoString: string) => {
    return format(parseISO(isoString), 'MMM d');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Open calendar settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Calendar Settings</SheetTitle>
          <SheetDescription>
            Customize your calendar view preferences
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 py-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Week Starts On</h4>
            <Select
              value={config.weekStartsOn.toString()}
              onValueChange={handleWeekStartChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select first day of week" />
              </SelectTrigger>
              <SelectContent>
                {weekDays.map((day) => (
                  <SelectItem key={day.value} value={day.value}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Quarter Start Day</h4>
              <Select
                value={config.quarterStartDay.toString()}
                onValueChange={handleQuarterStartDayChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select quarter start day" />
                </SelectTrigger>
                <SelectContent>
                  {days.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      Day {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                All quarters will start on this day of their respective months
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <h5 className="text-sm font-medium">Current Quarter Dates</h5>
              <div className="space-y-1 text-sm">
                {Object.entries(config.quarters).map(([quarter, { startDate, endDate }]) => (
                  <div key={quarter} className="flex justify-between items-center">
                    <span className="font-medium">Q{quarter}:</span>
                    <span className="text-muted-foreground">
                      {formatQuarterDate(startDate)} - {formatQuarterDate(endDate)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={resetConfig}
            >
              Reset to Defaults
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CalendarConfig; 