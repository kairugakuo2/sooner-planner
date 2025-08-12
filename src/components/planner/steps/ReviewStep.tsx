import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Calendar, BookOpen, Clock, Users, AlertTriangle, CheckCircle, GraduationCap } from 'lucide-react';
import { usePlannerStore } from '@/store/plannerStore';
import { formatTime, getDayAbbreviation } from '@/lib/utils';

export const ReviewStep: React.FC = () => {
  const { term, courses, breaks, style, earliest, latest, getAllRequiredValid, getRequiredValid } = usePlannerStore();
  
  const requiredValid = getRequiredValid();
  const allRequiredValid = getAllRequiredValid();

  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

  const handleGenerate = () => {
    if (!allRequiredValid) {
      // Find first invalid step and scroll to it
      if (!requiredValid.courses) {
        // Scroll to courses step
        document.getElementById('step-courses')?.scrollIntoView({ behavior: 'smooth' });
      } else if (!requiredValid.style) {
        // Scroll to style step
        document.getElementById('step-style')?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    
    // TODO: Implement actual schedule generation
    console.log('Generating schedule with:', {
      term,
      courses,
      breaks,
      style,
      earliest,
      latest
    });
  };

  const getStyleDisplayName = (style: string) => {
    switch (style) {
      case 'compact': return 'Compact Days';
      case 'balanced': return 'Balanced Mix';
      case 'spread': return 'Spread Out';
      default: return 'Not selected';
    }
  };

  const hasWarnings = courses.length > 0 && courses.some(course => 
    course.subject === 'CS' && parseInt(course.number) >= 3000
  );

  const formatSchedule = (times: any[]) => {
    return times.map(time => 
      `${getDayAbbreviation(time.day)} ${formatTime(time.start)}-${formatTime(time.end)}`
    ).join(', ');
  };

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Summary</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <Calendar className="h-4 w-4 text-crimson-600" />
            <span className="text-sm text-gray-700">
              {term.semester} {term.year}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <BookOpen className="h-4 w-4 text-crimson-600" />
            <span className="text-sm text-gray-700">
              {courses.length} course{courses.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <GraduationCap className="h-4 w-4 text-crimson-600" />
            <span className="text-sm text-gray-700">
              {totalCredits} credit{totalCredits !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <Clock className="h-4 w-4 text-crimson-600" />
            <span className="text-sm text-gray-700">
              {breaks.length} break{breaks.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <Users className="h-4 w-4 text-crimson-600" />
            <span className="text-sm text-gray-700">
              {style ? getStyleDisplayName(style) : 'Not selected'}
            </span>
          </div>
        </div>
      </div>

      {/* Course List */}
      {courses.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Selected Courses</h4>
          <div className="space-y-2">
            {courses.map((course) => (
              <div
                key={course.id}
                className="p-3 bg-green-50 rounded-lg border border-green-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {course.subject} {course.number}
                        </div>
                        <div className="text-sm text-gray-600">{course.title}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {course.credits} credit{course.credits !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    
                    {/* Course Sections */}
                    <div className="mt-2 space-y-1">
                      {course.sections.map((section) => (
                        <div key={section.id} className="bg-white p-2 rounded border border-green-200 ml-7">
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">Section {section.id.split('-')[1]}:</span> {section.instructor} • {section.room}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatSchedule(section.times)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    Added
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {hasWarnings && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Some courses have limited sections available. We'll do our best to find compatible schedules.
          </AlertDescription>
        </Alert>
      )}

      {/* Validation Status */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Validation Status</h4>
        
        <div className="space-y-2">
          <div className={`flex items-center justify-between p-3 rounded-lg border ${
            requiredValid.courses 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              {requiredValid.courses ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm font-medium">Courses Selection</span>
            </div>
            <Badge variant="outline" className={
              requiredValid.courses 
                ? 'bg-green-100 text-green-800 border-green-200' 
                : 'bg-red-100 text-red-800 border-red-200'
            }>
              {requiredValid.courses ? 'Valid' : 'Required'}
            </Badge>
          </div>
          
          <div className={`flex items-center justify-between p-3 rounded-lg border ${
            requiredValid.style 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              {requiredValid.style ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm font-medium">Schedule Style</span>
            </div>
            <Badge variant="outline" className={
              requiredValid.style 
                ? 'bg-green-100 text-green-800 border-green-200' 
                : 'bg-red-100 text-red-800 border-red-200'
            }>
              {requiredValid.style ? 'Valid' : 'Required'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="text-center pt-6 border-t border-gray-200">
        <Button
          onClick={handleGenerate}
          disabled={!allRequiredValid}
          size="lg"
          className={`px-8 py-4 text-lg ${
            allRequiredValid
              ? 'bg-crimson-600 hover:bg-crimson-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Generate Schedule</span>
          </div>
        </Button>
        
        {!allRequiredValid && (
          <p className="text-red-500 text-sm mt-2">
            Please complete all required steps before generating your schedule.
          </p>
        )}
      </div>
    </div>
  );
};
