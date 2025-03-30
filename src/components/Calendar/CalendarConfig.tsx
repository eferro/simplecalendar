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

const CalendarConfig: React.FC = () => {
  const { config, setWeekStart, setQuarterConfig, resetConfig } = useCalendarConfig();

  const handleWeekStartChange = (value: string) => {
    setWeekStart(Number(value) as 0 | 1 | 2 | 3 | 4 | 5 | 6);
  };

  const handleQuarterChange = (quarter: number, type: 'start' | 'end', value: string) => {
    const currentConfig = config.quarters[quarter];
    setQuarterConfig(quarter, {
      ...currentConfig,
      [type + 'Month']: Number(value),
    });
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
            <h4 className="text-sm font-medium">Quarter Configuration</h4>
            {[1, 2, 3, 4].map((quarter) => (
              <div key={quarter} className="space-y-2">
                <h5 className="text-sm font-medium text-muted-foreground">Quarter {quarter}</h5>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground">Start Month</label>
                    <Select
                      value={config.quarters[quarter].startMonth.toString()}
                      onValueChange={(value) => handleQuarterChange(quarter, 'start', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select start month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">End Month</label>
                    <Select
                      value={config.quarters[quarter].endMonth.toString()}
                      onValueChange={(value) => handleQuarterChange(quarter, 'end', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select end month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
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