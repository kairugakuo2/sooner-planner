import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Clock, Calendar } from 'lucide-react';
import { usePlannerStore } from '@/store/plannerStore';
import { BreakConstraint } from '@/store/plannerStore';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const timeSlots = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
});

export const TimePrefsStep: React.FC = () => {
  const { breaks, earliest, latest, noFriday, avoidNights, passingMins, addBreak, removeBreak, setTimePreferences } = usePlannerStore();
  const [newBreak, setNewBreak] = useState<BreakConstraint>({
    day: 'Mon',
    start: '12:00',
    end: '13:00'
  });

  const handleAddBreak = () => {
    if (newBreak.start < newBreak.end) {
      addBreak(newBreak);
      setNewBreak({ day: 'Mon', start: '12:00', end: '13:00' });
    }
  };

  const handleRemoveBreak = (index: number) => {
    removeBreak(index);
  };

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
    return `${displayHour}:${minute} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      {/* Add Break Control */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Add Break</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Select value={newBreak.day} onValueChange={(day) => setNewBreak({ ...newBreak, day: day as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {days.map((day) => (
                <SelectItem key={day} value={day}>{day}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={newBreak.start} onValueChange={(start) => setNewBreak({ ...newBreak, start })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>{formatTime(time)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={newBreak.end} onValueChange={(end) => setNewBreak({ ...newBreak, end })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>{formatTime(time)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={handleAddBreak} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Break
          </Button>
        </div>
      </div>

      {/* Current Breaks */}
      {breaks.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Current Breaks ({breaks.length})</h4>
          <div className="space-y-2">
            {breaks.map((breakItem, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-900">{breakItem.day}</span>
                  <span className="text-gray-600">
                    {formatTime(breakItem.start)} - {formatTime(breakItem.end)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveBreak(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time Preferences */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Time Preferences</h4>
        
        {/* Earliest/Latest Times */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Earliest Start Time</label>
            <Select value={earliest || '08:30'} onValueChange={(time) => setTimePreferences({ earliest: time })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.slice(0, 24).map((time) => (
                  <SelectItem key={time} value={time}>{formatTime(time)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Latest End Time</label>
            <Select value={latest || '18:30'} onValueChange={(time) => setTimePreferences({ latest: time })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.slice(24).map((time) => (
                  <SelectItem key={time} value={time}>{formatTime(time)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">No Friday Classes</label>
              <p className="text-xs text-gray-500">Avoid scheduling classes on Fridays</p>
            </div>
            <Switch
              checked={noFriday || false}
              onCheckedChange={(checked) => setTimePreferences({ noFriday: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Avoid Night Classes</label>
              <p className="text-xs text-gray-500">Prefer classes before 6:00 PM</p>
            </div>
            <Switch
              checked={avoidNights || false}
              onCheckedChange={(checked) => setTimePreferences({ avoidNights: checked })}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Minimum Passing Time</label>
            <Select value={passingMins?.toString() || '15'} onValueChange={(value) => setTimePreferences({ passingMins: parseInt(value) as 0 | 10 | 15 })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No minimum</SelectItem>
                <SelectItem value="10">10 minutes</SelectItem>
                <SelectItem value="15">15 minutes (recommended)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
