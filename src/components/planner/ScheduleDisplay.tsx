import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, User, Star, AlertTriangle, CheckCircle } from 'lucide-react';
import { Schedule } from '@/lib/scheduler';
import { formatTime, getDayAbbreviation } from '@/lib/utils';

interface ScheduleDisplayProps {
  schedule: Schedule;
  onSelect?: (schedule: Schedule) => void;
  isSelected?: boolean;
}

export const ScheduleDisplay: React.FC<ScheduleDisplayProps> = ({ 
  schedule, 
  onSelect, 
  isSelected = false 
}) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);
  
  // Group courses by day and time
  const scheduleByDay: Record<string, Array<{ course: any; section: any; time: any }>> = {};
  schedule.courses.forEach(({ course, section }) => {
    section.times.forEach((time) => {
      // Handle the days array structure
      if (time.days) {
        time.days.forEach((day: string) => {
          if (!scheduleByDay[day]) scheduleByDay[day] = [];
          scheduleByDay[day].push({ course, section, time: { ...time, day } });
        });
      } else if (time.day) {
        // Fallback for single day structure
        if (!scheduleByDay[time.day]) scheduleByDay[time.day] = [];
        scheduleByDay[time.day].push({ course, section, time });
      }
    });
  });
  
  // Sort courses by start time within each day
  Object.keys(scheduleByDay).forEach(day => {
    scheduleByDay[day].sort((a, b) => {
      const timeA = parseInt(a.time.start.split(':')[0]);
      const timeB = parseInt(b.time.start.split(':')[0]);
      return timeA - timeB;
    });
  });

  // Debug logging
  console.log('Schedule:', schedule);
  console.log('ScheduleByDay:', scheduleByDay);
  console.log('Days with courses:', Object.keys(scheduleByDay));

  const getTimeSlotHeight = (start: string, end: string) => {
    const startHour = parseInt(start.split(':')[0]);
    const endHour = parseInt(end.split(':')[0]);
    const startMin = parseInt(start.split(':')[1]);
    const endMin = parseInt(end.split(':')[1]);
    
    const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    return Math.max(duration / 60, 0.5); // Minimum height of 0.5
  };

  const getTimeSlotTop = (start: string) => {
    const hour = parseInt(start.split(':')[0]);
    const min = parseInt(start.split(':')[1]);
    return hour + min / 60;
  };

  return (
    <Card className={`${isSelected ? 'ring-2 ring-crimson-500' : ''} hover:shadow-lg transition-all`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-crimson-600" />
            <span>Schedule {schedule.id.split('-')[1]}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Score: {schedule.score}
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {schedule.totalDays} day{schedule.totalDays !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
        
        {schedule.conflicts.length > 0 && (
          <div className="flex items-center space-x-2 text-yellow-600 text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>{schedule.conflicts.length} conflict{schedule.conflicts.length !== 1 ? 's' : ''}</span>
          </div>
        )}
        
        {schedule.gaps.length > 0 && (
          <div className="flex items-center space-x-2 text-blue-600 text-sm">
            <Clock className="h-4 w-4" />
            <span>{schedule.gaps.length} gap{schedule.gaps.length !== 1 ? 's' : ''} between classes</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Weekly Calendar View */}
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-6 bg-gray-50 border-b">
            <div className="p-2 text-sm font-medium text-gray-700 border-r">Time</div>
            {days.map(day => (
              <div key={day} className="p-2 text-sm font-medium text-gray-700 border-r last:border-r-0">
                {getDayAbbreviation(day)}
              </div>
            ))}
          </div>
          
          <div className="relative" style={{ height: '400px' }}>
            {/* Time grid lines */}
            {timeSlots.map(hour => (
              <div
                key={hour}
                className="absolute left-0 right-0 border-t border-gray-100"
                style={{ top: `${(hour / 24) * 100}%` }}
              >
                <span className="absolute -top-2 left-1 text-xs text-gray-400 bg-white px-1">
                  {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </span>
              </div>
            ))}
            
            {/* Course blocks */}
            {Object.entries(scheduleByDay).map(([day, dayCourses]) => {
              const dayIndex = days.indexOf(day);
              if (dayIndex === -1) return null;
              
              return dayCourses.map(({ course, section, time }, index) => {
                const top = getTimeSlotTop(time.start);
                const height = getTimeSlotHeight(time.start, time.end);
                const left = `${(dayIndex + 1) * (100 / 6)}%`;
                const width = `${100 / 6}%`;
                
                console.log(`Rendering course ${course.subject} ${course.number} on ${day} at ${time.start}-${time.end}`);
                console.log(`Position: top=${top}, height=${height}, left=${left}, width=${width}`);
                
                return (
                  <div
                    key={`${day}-${index}`}
                    className="absolute bg-crimson-100 border border-crimson-300 rounded p-2 text-xs overflow-hidden hover:bg-crimson-200 transition-colors z-10"
                    style={{
                      top: `${(top / 24) * 100}%`,
                      left,
                      width,
                      height: `${(height / 24) * 100}%`,
                      minHeight: '40px'
                    }}
                  >
                    <div className="font-medium text-crimson-800">
                      {course.subject} {course.number}
                    </div>
                    <div className="text-crimson-700 truncate">
                      {time.start}-{time.end}
                    </div>
                    <div className="text-crimson-600 truncate">
                      {section.room}
                    </div>
                  </div>
                );
              });
            })}
            
            {/* Debug info - remove this later */}
            <div className="absolute top-2 right-2 bg-white p-2 rounded border text-xs text-gray-600 z-20">
              <div>Courses: {schedule.courses.length}</div>
              <div>Days: {Object.keys(scheduleByDay).length}</div>
              <div>Total times: {schedule.courses.reduce((sum, {section}) => sum + section.times.length, 0)}</div>
            </div>
          </div>
        </div>
        
        {/* Schedule Details */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Course Details</h4>
          <div className="space-y-2">
            {schedule.courses.map(({ course, section }) => (
              <div key={section.id} className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {course.subject} {course.number} - {course.title}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{section.instructor}</span>
                      </span>
                      <span className="flex items-center space-x-1 ml-3">
                        <MapPin className="h-3 w-3" />
                        <span>{section.room}</span>
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {section.times.map(time => 
                        `${time.days ? time.days.map(d => getDayAbbreviation(d)).join(', ') : getDayAbbreviation(time.day || '')} ${formatTime(time.start)}-${formatTime(time.end)}`
                      ).join(', ')}
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-crimson-50 text-crimson-700 border-crimson-200">
                    {course.credits} credit{course.credits !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Action Buttons */}
        {onSelect && (
          <div className="flex space-x-2 pt-2">
            <Button
              onClick={() => onSelect(schedule)}
              variant={isSelected ? "default" : "outline"}
              className="flex-1"
              disabled={isSelected}
            >
              {isSelected ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Selected
                </>
              ) : (
                <>
                  <Star className="h-4 w-4 mr-2" />
                  Select This Schedule
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
