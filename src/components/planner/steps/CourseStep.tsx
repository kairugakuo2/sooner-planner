import React, { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, BookOpen } from 'lucide-react';
import { usePlannerStore } from '@/store/plannerStore';
import { Course, Term } from '@/store/plannerStore';

// Mock course data - replace with real API call
const mockCourses: Course[] = [
  { id: '1', subject: 'CS', number: '2413', title: 'Data Structures' },
  { id: '2', subject: 'CS', number: '2614', title: 'Computer Organization' },
  { id: '3', subject: 'MATH', number: '2123', title: 'Calculus III' },
  { id: '4', subject: 'ENGL', number: '1213', title: 'Composition II' },
  { id: '5', subject: 'PHYS', number: '2514', title: 'Physics for Scientists' },
  { id: '6', subject: 'CS', number: '3613', title: 'Algorithms' },
  { id: '7', subject: 'MATH', number: '3113', title: 'Linear Algebra' },
  { id: '8', subject: 'HIST', number: '1483', title: 'American History' },
];

const terms: Term[] = [
  { year: 2025, semester: 'Fall' },
  { year: 2026, semester: 'Spring' },
  { year: 2026, semester: 'Summer' },
];

export const CourseStep: React.FC = () => {
  const { term, courses, setTerm, addCourse, removeCourse } = usePlannerStore();
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

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

  const filteredCourses = mockCourses.filter(course => {
    const searchLower = searchValue.toLowerCase();
    return (
      course.subject.toLowerCase().includes(searchLower) ||
      course.number.includes(searchValue) ||
      course.title.toLowerCase().includes(searchLower)
    );
  });

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
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div>
                <div className="font-medium text-gray-900">
                  {course.subject} {course.number}
                </div>
                <div className="text-sm text-gray-600">{course.title}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveCourse(course.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
