import React, { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, BookOpen, Clock, User, MapPin } from 'lucide-react';
import { usePlannerStore } from '@/store/plannerStore';
import { Course, Term } from '@/store/plannerStore';
import { loadCourses, formatTime, getDayAbbreviation } from '@/lib/utils';

const terms: Term[] = [
  { year: 2025, semester: 'Fall' },
  { year: 2026, semester: 'Spring' },
  { year: 2026, semester: 'Summer' },
];

export const CourseStep: React.FC = () => {
  const { term, courses, setTerm, addCourse, removeCourse } = usePlannerStore();
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await loadCourses();
        setAvailableCourses(coursesData);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleAddCourse = (course: Course) => {
    if (!courses.find(c => c.id === course.id)) {
      addCourse(course);
    }
    setSearchValue('');
    setIsOpen(false);
  };

  const handleRemoveCourse = (courseId: string) => {
    removeCourse(courseId);
  };

  const filteredCourses = availableCourses.filter(course => {
    const searchLower = searchValue.toLowerCase();
    return (
      course.subject.toLowerCase().includes(searchLower) ||
      course.number.includes(searchValue) ||
      course.title.toLowerCase().includes(searchLower)
    );
  });

  const formatSchedule = (times: any[]) => {
    return times.map(time => 
      `${getDayAbbreviation(time.day)} ${formatTime(time.start)}-${formatTime(time.end)}`
    ).join(', ');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crimson-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Term Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Term:</span>
          <Select value={`${term.semester} ${term.year}`} onValueChange={(value) => {
            const [semester, year] = value.split(' ');
            setTerm({ semester: semester as 'Spring' | 'Summer' | 'Fall', year: parseInt(year) });
          }}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {terms.map((t) => (
                <SelectItem key={`${t.semester} ${t.year}`} value={`${t.semester} ${t.year}`}>
                  {t.semester} {t.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Course Search */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Search and add courses
        </label>
        <Command className="border border-gray-300 rounded-lg">
          <CommandInput
            placeholder="Search by subject + number (e.g., CS 2413)"
            value={searchValue}
            onValueChange={setSearchValue}
            onFocus={() => setIsOpen(true)}
          />
          {isOpen && (
            <CommandList className="max-h-60">
              <CommandEmpty>No courses found.</CommandEmpty>
              <CommandGroup>
                {filteredCourses.map((course) => (
                  <CommandItem
                    key={course.id}
                    onSelect={() => handleAddCourse(course)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <div className="font-medium">
                          {course.subject} {course.number}
                        </div>
                        <div className="text-sm text-gray-500">{course.title}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {course.credits} credit{course.credits !== 1 ? 's' : ''} • {course.sections.length} section{course.sections.length !== 1 ? 's' : ''}
                        </div>
                        {course.sections.length > 0 && (
                          <div className="text-xs text-gray-400 mt-1">
                            {formatSchedule(course.sections[0].times)}
                          </div>
                        )}
                      </div>
                      <Plus className="h-4 w-4 text-crimson-600" />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      </div>

      {/* Selected Courses */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Selected Courses ({courses.length})
          </label>
          {courses.length === 0 && (
            <span className="text-sm text-red-600">Add at least 1 course to continue.</span>
          )}
        </div>
        
        <div className="space-y-2">
          {courses.map((course) => (
            <div
              key={course.id}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {course.subject} {course.number}
                  </div>
                  <div className="text-sm text-gray-600">{course.title}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {course.credits} credit{course.credits !== 1 ? 's' : ''}
                  </div>
                  
                  {/* Course Sections */}
                  <div className="mt-2 space-y-2">
                    {course.sections.map((section) => (
                      <div key={section.id} className="bg-white p-2 rounded border border-gray-200">
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <User className="h-3 w-3" />
                          <span>{section.instructor}</span>
                          <MapPin className="h-3 w-3 ml-2" />
                          <span>{section.room}</span>
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-600">
                            {formatSchedule(section.times)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCourse(course.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
