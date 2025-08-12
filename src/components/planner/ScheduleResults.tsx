import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Filter, Download, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { Schedule, getScheduleStats } from '@/lib/scheduler';
import { ScheduleDisplay } from './ScheduleDisplay';

interface ScheduleResultsProps {
  schedules: Schedule[];
  selectedSchedule: Schedule | null;
  onSelectSchedule: (schedule: Schedule) => void;
  onRegenerate?: () => void;
  isGenerating?: boolean;
}

export const ScheduleResults: React.FC<ScheduleResultsProps> = ({
  schedules,
  selectedSchedule,
  onSelectSchedule,
  onRegenerate,
  isGenerating = false
}) => {
  const [sortBy, setSortBy] = useState<'score' | 'days' | 'conflicts'>('score');
  const [filterConflicts, setFilterConflicts] = useState<'all' | 'no-conflicts' | 'with-conflicts'>('all');
  const [filterDays, setFilterDays] = useState<'all' | 'compact' | 'spread'>('all');

  if (schedules.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Schedules Generated</h3>
        <p className="text-gray-500 mb-4">
          Click the generate button to create schedule variations based on your preferences.
        </p>
        {onRegenerate && (
          <Button onClick={onRegenerate} disabled={isGenerating}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            Generate Schedules
          </Button>
        )}
      </div>
    );
  }

  const stats = getScheduleStats(schedules);
  
  // Filter and sort schedules
  let filteredSchedules = [...schedules];
  
  // Apply filters
  if (filterConflicts === 'no-conflicts') {
    filteredSchedules = filteredSchedules.filter(s => s.conflicts.length === 0);
  } else if (filterConflicts === 'with-conflicts') {
    filteredSchedules = filteredSchedules.filter(s => s.conflicts.length > 0);
  }
  
  if (filterDays === 'compact') {
    filteredSchedules = filteredSchedules.filter(s => s.totalDays <= 3);
  } else if (filterDays === 'spread') {
    filteredSchedules = filteredSchedules.filter(s => s.totalDays >= 4);
  }
  
  // Apply sorting
  filteredSchedules.sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.score - a.score;
      case 'days':
        return a.totalDays - b.totalDays;
      case 'conflicts':
        return a.conflicts.length - b.conflicts.length;
      default:
        return 0;
    }
  });

  const handleExportSchedule = (schedule: Schedule) => {
    // Create a text representation of the schedule
    let exportText = `Schedule ${schedule.id}\n`;
    exportText += `Score: ${schedule.score}/100\n`;
    exportText += `Total Days: ${schedule.totalDays}\n`;
    exportText += `Conflicts: ${schedule.conflicts.length}\n\n`;
    
    exportText += 'COURSES:\n';
    schedule.courses.forEach(({ course, section }) => {
      exportText += `${course.subject} ${course.number} - ${course.title}\n`;
      exportText += `Instructor: ${section.instructor}\n`;
      exportText += `Room: ${section.room}\n`;
      exportText += `Times: ${section.times.map(time => 
        `${time.day} ${time.start}-${time.end}`
      ).join(', ')}\n`;
      exportText += `Credits: ${course.credits}\n\n`;
    });
    
    if (schedule.gaps.length > 0) {
      exportText += 'GAPS BETWEEN CLASSES:\n';
      schedule.gaps.forEach(gap => {
        exportText += `${gap.day}: ${gap.start} - ${gap.end} (${gap.duration} min)\n`;
      });
      exportText += '\n';
    }
    
    if (schedule.conflicts.length > 0) {
      exportText += 'CONFLICTS:\n';
      schedule.conflicts.forEach(conflict => {
        exportText += `- ${conflict}\n`;
      });
    }
    
    // Create and download file
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schedule-${schedule.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-crimson-50 to-pink-50 rounded-lg p-6 border border-crimson-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-crimson-600" />
            <h2 className="text-2xl font-bold text-gray-900">Generated Schedules</h2>
          </div>
          {onRegenerate && (
            <Button onClick={onRegenerate} disabled={isGenerating} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
          )}
        </div>
        
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-crimson-600">{stats.totalSchedules}</div>
              <div className="text-sm text-gray-600">Total Options</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.averageScore}</div>
              <div className="text-sm text-gray-600">Avg Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.maxScore}</div>
              <div className="text-sm text-gray-600">Best Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.averageDays}</div>
              <div className="text-sm text-gray-600">Avg Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {filteredSchedules.length}
              </div>
              <div className="text-sm text-gray-600">Filtered</div>
            </div>
          </div>
        )}
      </div>

      {/* Filters and Sorting */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <span>Filter & Sort</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Score (High to Low)</SelectItem>
                  <SelectItem value="days">Days (Few to Many)</SelectItem>
                  <SelectItem value="conflicts">Conflicts (Few to Many)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Conflicts</label>
              <Select value={filterConflicts} onValueChange={(value: any) => setFilterConflicts(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Schedules</SelectItem>
                  <SelectItem value="no-conflicts">No Conflicts</SelectItem>
                  <SelectItem value="with-conflicts">With Conflicts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Day Distribution</label>
              <Select value={filterDays} onValueChange={(value: any) => setFilterDays(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Schedules</SelectItem>
                  <SelectItem value="compact">Compact (≤3 days)</SelectItem>
                  <SelectItem value="spread">Spread (≥4 days)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Badge variant="outline" className="bg-gray-50 text-gray-700">
                {filteredSchedules.length} of {schedules.length} schedules
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule List */}
      <div className="space-y-6">
        {filteredSchedules.length === 0 ? (
          <div className="text-center py-8">
            <Filter className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Schedules Match Filters</h3>
            <p className="text-gray-500">
              Try adjusting your filter criteria to see more schedule options.
            </p>
          </div>
        ) : (
          filteredSchedules.map((schedule, index) => (
            <div key={schedule.id} className="relative">
              {/* Rank Badge */}
              <div className="absolute -top-2 -left-2 z-10">
                <Badge className="bg-crimson-600 text-white text-xs px-2 py-1">
                  #{index + 1}
                </Badge>
              </div>
              
              <ScheduleDisplay
                schedule={schedule}
                onSelect={onSelectSchedule}
                isSelected={selectedSchedule?.id === schedule.id}
              />
              
              {/* Export Button */}
              <div className="mt-3 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportSchedule(schedule)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Schedule
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Selected Schedule Summary */}
      {selectedSchedule && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span>Selected Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-green-900">
                  Schedule {selectedSchedule.id.split('-')[1]} - Score: {selectedSchedule.score}/100
                </p>
                <p className="text-sm text-green-700">
                  {selectedSchedule.totalDays} days • {selectedSchedule.courses.length} courses
                </p>
              </div>
              <Button
                onClick={() => handleExportSchedule(selectedSchedule)}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-100"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Selected
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
