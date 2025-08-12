import { Course, CourseSection, CourseTime, BreakConstraint, Style } from '@/store/plannerStore';

export type Schedule = {
  id: string;
  courses: Array<{
    course: Course;
    section: CourseSection;
  }>;
  score: number;
  conflicts: string[];
  totalDays: number;
  gaps: Array<{
    day: string;
    start: string;
    end: string;
    duration: number;
  }>;
};

export type ScheduleGenerationOptions = {
  maxVariations?: number;
  minScore?: number;
  allowConflicts?: boolean;
};

// Convert time string to minutes for easier comparison
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Convert minutes back to time string
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Check if two time ranges overlap
function timesOverlap(time1: any, time2: any): boolean {
  // Check if any day overlaps
  const dayOverlap = time1.days?.some((day: string) => time2.days?.includes(day)) || 
                     time1.day === time2.day;
  
  if (!dayOverlap) return false;
  
  const start1 = timeToMinutes(time1.start);
  const end1 = timeToMinutes(time1.end);
  const start2 = timeToMinutes(time2.start);
  const end2 = timeToMinutes(time2.end);
  
  return start1 < end2 && start2 < end1;
}

// Check if a time conflicts with any break constraints
function conflictsWithBreak(time: any, breaks: BreakConstraint[]): boolean {
  return breaks.some(breakConstraint => {
    // Check if any day overlaps
    const dayOverlap = time.days?.includes(breakConstraint.day) || 
                       time.day === breakConstraint.day;
    
    if (!dayOverlap) return false;
    
    const courseStart = timeToMinutes(time.start);
    const courseEnd = timeToMinutes(time.end);
    const breakStart = timeToMinutes(breakConstraint.start);
    const breakEnd = timeToMinutes(breakConstraint.end);
    
    return courseStart < breakEnd && courseEnd > breakStart;
  });
}

// Calculate passing time between two consecutive classes
function calculatePassingTime(time1: any, time2: any, passingMins: number): number {
  // Check if any day overlaps
  const dayOverlap = time1.days?.some((day: string) => time2.days?.includes(day)) || 
                     time1.day === time2.day;
  
  if (!dayOverlap) return 0;
  
  const end1 = timeToMinutes(time1.end);
  const start2 = timeToMinutes(time2.start);
  const gap = start2 - end1;
  
  return Math.max(0, gap - passingMins);
}

// Generate all possible section combinations for the selected courses
function generateSectionCombinations(courses: Course[]): Array<Array<CourseSection>> {
  const combinations: Array<Array<CourseSection>> = [];
  
  function backtrack(index: number, current: CourseSection[]) {
    if (index === courses.length) {
      combinations.push([...current]);
      return;
    }
    
    const course = courses[index];
    for (const section of course.sections) {
      current.push(section);
      backtrack(index + 1, current);
      current.pop();
    }
  }
  
  backtrack(0, []);
  return combinations;
}

// Check for conflicts in a schedule
function checkConflicts(sections: CourseSection[]): string[] {
  const conflicts: string[] = [];
  
  for (let i = 0; i < sections.length; i++) {
    for (let j = i + 1; j < sections.length; j++) {
      const section1 = sections[i];
      const section2 = sections[j];
      
      for (const time1 of section1.times) {
        for (const time2 of section2.times) {
          if (timesOverlap(time1, time2)) {
            conflicts.push(`Time conflict: ${section1.id} and ${section2.id} overlap on ${time1.days?.join(', ') || time1.days}`);
          }
        }
      }
    }
  }
  
  return conflicts;
}

// Calculate schedule score based on preferences
function calculateScheduleScore(
  sections: CourseSection[],
  style: Style,
  earliest: string,
  latest: string,
  noFriday: boolean,
  avoidNights: boolean,
  passingMins: number,
  breaks: BreakConstraint[]
): { score: number; totalDays: number; gaps: Array<{ day: string; start: string; end: string; duration: number }> } {
  let score = 100;
  const days = new Set<string>();
  const gaps: Array<{ day: string; start: string; end: string; duration: number }> = [];
  
  // Collect all times and sort by day and start time
  const allTimes: Array<{ section: CourseSection; time: any }> = [];
  sections.forEach(section => {
    section.times.forEach(time => {
      // Handle both data structures (days array and single day)
      if (time.days) {
        time.days.forEach((day: string) => {
          allTimes.push({ section, time: { ...time, day } });
        });
      } else {
        allTimes.push({ section, time });
      }
    });
  });
  
  // Group by day and sort by start time
  const timesByDay: Record<string, Array<{ section: CourseSection; time: any }>> = {};
  allTimes.forEach(({ section, time }) => {
    const day = time.day;
    if (!timesByDay[day]) timesByDay[day] = [];
    timesByDay[day].push({ section, time });
  });
  
  Object.keys(timesByDay).forEach(day => {
    days.add(day);
    const dayTimes = timesByDay[day].sort((a, b) => timeToMinutes(a.time.start) - timeToMinutes(b.time.start));
    
    // Check for gaps between classes
    for (let i = 0; i < dayTimes.length - 1; i++) {
      const current = dayTimes[i];
      const next = dayTimes[i + 1];
      const gap = calculatePassingTime(current.time, next.time, passingMins);
      
      if (gap > 0) {
        gaps.push({
          day,
          start: current.time.end,
          end: next.time.start,
          duration: gap
        });
        
        // Penalize long gaps
        if (gap > 60) score -= 5;
        if (gap > 120) score -= 10;
      }
    }
    
    // Check earliest/latest preferences
    dayTimes.forEach(({ time }) => {
      const startMinutes = timeToMinutes(time.start);
      const endMinutes = timeToMinutes(time.end);
      const earliestMinutes = timeToMinutes(earliest);
      const latestMinutes = timeToMinutes(latest);
      
      if (startMinutes < earliestMinutes) score -= 15;
      if (endMinutes > latestMinutes) score -= 15;
      
      // Check for night classes
      if (avoidNights && endMinutes > timeToMinutes('18:00')) score -= 10;
    });
    
    // Check Friday preference
    if (noFriday && day === 'Fri') score -= 20;
    
    // Check break conflicts
    dayTimes.forEach(({ time }) => {
      if (conflictsWithBreak(time, breaks)) score -= 25;
    });
  });
  
  // Apply style preferences
  switch (style) {
    case 'compact':
      // Prefer fewer days
      if (days.size > 3) score -= 20;
      if (days.size > 4) score -= 30;
      break;
    case 'balanced':
      // Prefer moderate day distribution
      if (days.size === 1) score -= 15;
      if (days.size === 5) score -= 15;
      break;
    case 'spread':
      // Prefer more days
      if (days.size < 3) score -= 20;
      if (days.size < 4) score -= 10;
      break;
  }
  
  return { score: Math.max(0, score), totalDays: days.size, gaps };
}

// Main schedule generation function
export function generateSchedules(
  courses: Course[],
  style: Style,
  earliest: string,
  latest: string,
  noFriday: boolean,
  avoidNights: boolean,
  passingMins: number,
  breaks: BreakConstraint[],
  options: ScheduleGenerationOptions = {}
): Schedule[] {
  const { maxVariations = 10, minScore = 50, allowConflicts = false } = options;
  
  if (courses.length === 0) return [];
  
  const sectionCombinations = generateSectionCombinations(courses);
  const schedules: Schedule[] = [];
  
  for (const sections of sectionCombinations) {
    const conflicts = checkConflicts(sections);
    
    // Skip if conflicts aren't allowed
    if (!allowConflicts && conflicts.length > 0) continue;
    
    const { score, totalDays, gaps } = calculateScheduleScore(
      sections, style, earliest, latest, noFriday, avoidNights, passingMins, breaks
    );
    
    // Skip if score is too low
    if (score < minScore) continue;
    
    const schedule: Schedule = {
      id: `schedule-${schedules.length + 1}`,
      courses: sections.map((section, index) => ({
        course: courses[index],
        section
      })),
      score,
      conflicts,
      totalDays,
      gaps
    };
    
    schedules.push(schedule);
    
    // Stop if we have enough variations
    if (schedules.length >= maxVariations) break;
  }
  
  // Sort by score (highest first)
  return schedules.sort((a, b) => b.score - a.score);
}

// Validate if a schedule meets all constraints
export function validateSchedule(schedule: Schedule, breaks: BreakConstraint[]): boolean {
  if (schedule.conflicts.length > 0) return false;
  
  // Check if any course times conflict with breaks
  for (const { section } of schedule.courses) {
    for (const time of section.times) {
      if (conflictsWithBreak(time, breaks)) return false;
    }
  }
  
  return true;
}

// Get schedule statistics
export function getScheduleStats(schedules: Schedule[]) {
  if (schedules.length === 0) return null;
  
  const scores = schedules.map(s => s.score);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  
  const totalDays = schedules.map(s => s.totalDays);
  const avgDays = totalDays.reduce((a, b) => a + b, 0) / totalDays.length;
  
  return {
    totalSchedules: schedules.length,
    averageScore: Math.round(avgScore),
    maxScore,
    minScore,
    averageDays: Math.round(avgDays),
    bestSchedule: schedules[0]
  };
}
