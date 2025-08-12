import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Course } from "@/store/plannerStore"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function loadCourses(): Promise<Course[]> {
  try {
    // In a real app, this would be an API call
    // For now, we'll import the JSON directly
    const coursesData = await import('@/data/courses.json');
    const rawData = coursesData.default || coursesData;
    
    // Type assertion to ensure the data matches our Course type
    return rawData as Course[];
  } catch (error) {
    console.error('Failed to load courses:', error);
    return [];
  }
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function getDayAbbreviation(day: string): string {
  if (!day) return '';
  
  const dayMap: Record<string, string> = {
    'Mon': 'M',
    'Tue': 'T',
    'Wed': 'W',
    'Thu': 'Th',
    'Fri': 'F'
  };
  return dayMap[day] || day;
}
