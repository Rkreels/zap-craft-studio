
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { toast } from "@/hooks/use-toast";

interface ScheduleBuilderProps {
  onSave?: (schedule: ScheduleConfig) => void;
  initialSchedule?: ScheduleConfig;
}

export interface ScheduleConfig {
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'custom';
  time?: string;
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  customCron?: string;
  active: boolean;
}

export const ScheduleBuilder: React.FC<ScheduleBuilderProps> = ({
  onSave,
  initialSchedule = {
    frequency: 'daily',
    time: '09:00',
    active: false
  }
}) => {
  const [schedule, setSchedule] = useState<ScheduleConfig>(initialSchedule);
  
  // Voice guidance
  const schedulerVoiceProps = {
    elementName: "Schedule Builder",
    hoverText: "The Schedule Builder allows you to set recurring times for your workflow to run automatically.",
    clickText: "Select how frequently you want your workflow to run and configure the specific timing."
  };
  const schedulerGuidance = useVoiceGuidance(schedulerVoiceProps);
  
  const handleFrequencyChange = (value: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'custom') => {
    setSchedule(prev => ({ ...prev, frequency: value }));
  };
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSchedule(prev => ({ ...prev, time: e.target.value }));
  };
  
  const handleDayOfWeekChange = (value: string) => {
    setSchedule(prev => ({ ...prev, dayOfWeek: parseInt(value) }));
  };
  
  const handleDayOfMonthChange = (value: string) => {
    setSchedule(prev => ({ ...prev, dayOfMonth: parseInt(value) }));
  };
  
  const handleCustomCronChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSchedule(prev => ({ ...prev, customCron: e.target.value }));
  };
  
  const toggleActive = () => {
    setSchedule(prev => ({ ...prev, active: !prev.active }));
  };
  
  const handleSave = () => {
    if (onSave) {
      onSave(schedule);
    }
    
    toast({
      title: schedule.active ? "Schedule activated" : "Schedule saved",
      description: getScheduleDescription(),
    });
  };
  
  // Generate human-readable schedule description
  const getScheduleDescription = (): string => {
    switch (schedule.frequency) {
      case 'hourly':
        return "Runs every hour on the hour";
      case 'daily':
        return `Runs daily at ${schedule.time}`;
      case 'weekly':
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return `Runs every ${days[schedule.dayOfWeek || 0]} at ${schedule.time}`;
      case 'monthly':
        return `Runs on day ${schedule.dayOfMonth} of each month at ${schedule.time}`;
      case 'custom':
        return `Runs according to custom schedule: ${schedule.customCron}`;
      default:
        return "";
    }
  };
  
  return (
    <Card 
      className="w-full"
      onMouseEnter={schedulerGuidance.handleMouseEnter}
      onClick={schedulerGuidance.handleClick}
    >
      <CardHeader>
        <CardTitle>Schedule Workflow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Frequency</Label>
          <Select 
            value={schedule.frequency} 
            onValueChange={(value: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'custom') => handleFrequencyChange(value)}
          >
            <SelectTrigger>
              <SelectValue/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="custom">Custom (CRON)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {schedule.frequency !== 'hourly' && schedule.frequency !== 'custom' && (
          <div>
            <Label>Time</Label>
            <Input 
              type="time" 
              value={schedule.time} 
              onChange={handleTimeChange}
            />
          </div>
        )}
        
        {schedule.frequency === 'weekly' && (
          <div>
            <Label>Day of Week</Label>
            <Select 
              value={schedule.dayOfWeek?.toString() || "0"} 
              onValueChange={handleDayOfWeekChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Sunday</SelectItem>
                <SelectItem value="1">Monday</SelectItem>
                <SelectItem value="2">Tuesday</SelectItem>
                <SelectItem value="3">Wednesday</SelectItem>
                <SelectItem value="4">Thursday</SelectItem>
                <SelectItem value="5">Friday</SelectItem>
                <SelectItem value="6">Saturday</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        {schedule.frequency === 'monthly' && (
          <div>
            <Label>Day of Month</Label>
            <Select 
              value={schedule.dayOfMonth?.toString() || "1"} 
              onValueChange={handleDayOfMonthChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                  <SelectItem key={day} value={day.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {schedule.frequency === 'custom' && (
          <div>
            <Label>CRON Expression</Label>
            <Input 
              value={schedule.customCron || ''} 
              onChange={handleCustomCronChange}
              placeholder="* * * * *"
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: minute hour day-of-month month day-of-week
            </p>
          </div>
        )}
        
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox 
            id="schedule-active" 
            checked={schedule.active}
            onCheckedChange={toggleActive}
          />
          <Label htmlFor="schedule-active">
            Schedule active
          </Label>
        </div>
        
        {schedule.frequency && (
          <div className="bg-gray-50 p-3 rounded-md text-sm">
            <p className="font-medium">Summary:</p>
            <p>{getScheduleDescription()}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className="w-full">
          {schedule.active ? "Save & Activate Schedule" : "Save Schedule"}
        </Button>
      </CardFooter>
    </Card>
  );
};
