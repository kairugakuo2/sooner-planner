import { create } from 'zustand';
import { Schedule, generateSchedules, getScheduleStats } from '@/lib/scheduler';

export type Term = { year: number; semester: 'Spring' | 'Summer' | 'Fall' };

export type CourseTime = {
  days: string[];  // Array of days like ['Mon', 'Wed', 'Fri']
  start: string;
  end: string;
};

export type CourseSection = {
  id: string;
  instructor: string;
  room: string;
  times: CourseTime[];
};

export type Course = {
  id: string;
  subject: string;
  number: string;
  title: string;
  credits: number;
  sections: CourseSection[];
};

export type BreakConstraint = { day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'; start: string; end: string };
export type Style = 'compact' | 'balanced' | 'spread';

export interface PlannerState {
  term: Term;
  courses: Course[];
  breaks: BreakConstraint[];
  earliest?: string;   // '08:30'
  latest?: string;     // '18:30'
  noFriday?: boolean;
  avoidNights?: boolean;
  passingMins?: 0 | 10 | 15;
  style?: Style;
  
  // Schedule generation state
  schedules: Schedule[];
  selectedSchedule: Schedule | null;
  isGenerating: boolean;
  generationError: string | null;
  
  // UI state
  openStep: string | null;
  
  // Actions
  setTerm: (term: Term) => void;
  addCourse: (course: Course) => void;
  removeCourse: (courseId: string) => void;
  addBreak: (breakConstraint: BreakConstraint) => void;
  removeBreak: (index: number) => void;
  setTimePreferences: (prefs: Partial<Pick<PlannerState, 'earliest' | 'latest' | 'noFriday' | 'avoidNights' | 'passingMins'>>) => void;
  setStyle: (style: Style) => void;
  setOpenStep: (stepId: string | null) => void;
  
  // Schedule actions
  generateSchedules: () => Promise<void>;
  selectSchedule: (schedule: Schedule | null) => void;
  clearSchedules: () => void;
  
  // Derived state
  getRequiredValid: () => { courses: boolean; style: boolean };
  getAllRequiredValid: () => boolean;
  getScheduleStats: () => ReturnType<typeof getScheduleStats>;
}

export const usePlannerStore = create<PlannerState>((set, get) => ({
  // Initial state
  term: { year: 2025, semester: 'Fall' },
  courses: [],
  breaks: [],
  earliest: '08:30',
  latest: '18:30',
  noFriday: false,
  avoidNights: false,
  passingMins: 15,
  style: undefined,
  schedules: [],
  selectedSchedule: null,
  isGenerating: false,
  generationError: null,
  openStep: 'courses',
  
  // Actions
  setTerm: (term) => set({ term }),
  
  addCourse: (course) => set((state) => ({
    courses: [...state.courses, course]
  })),
  
  removeCourse: (courseId) => set((state) => ({
    courses: state.courses.filter(c => c.id !== courseId)
  })),
  
  addBreak: (breakConstraint) => set((state) => ({
    breaks: [...state.breaks, breakConstraint]
  })),
  
  removeBreak: (index) => set((state) => ({
    breaks: state.breaks.filter((_, i) => i !== index)
  })),
  
  setTimePreferences: (prefs) => set((state) => ({
    ...state,
    ...prefs
  })),
  
  setStyle: (style) => set({ style }),
  
  setOpenStep: (stepId) => set({ openStep: stepId }),
  
  // Schedule actions
  generateSchedules: async () => {
    const state = get();
    if (!state.style || state.courses.length === 0) {
      set({ generationError: 'Missing required information' });
      return;
    }
    
    set({ isGenerating: true, generationError: null });
    
    try {
      const schedules = generateSchedules(
        state.courses,
        state.style,
        state.earliest || '08:30',
        state.latest || '18:30',
        state.noFriday || false,
        state.avoidNights || false,
        state.passingMins || 15,
        state.breaks,
        { maxVariations: 15, minScore: 30 }
      );
      
      set({ 
        schedules,
        selectedSchedule: schedules.length > 0 ? schedules[0] : null,
        isGenerating: false 
      });
    } catch (error) {
      set({ 
        generationError: error instanceof Error ? error.message : 'Failed to generate schedules',
        isGenerating: false 
      });
    }
  },
  
  selectSchedule: (schedule) => set({ selectedSchedule: schedule }),
  
  clearSchedules: () => set({ 
    schedules: [], 
    selectedSchedule: null, 
    generationError: null 
  }),
  
  // Derived state
  getRequiredValid: () => {
    const state = get();
    return {
      courses: state.courses.length > 0,
      style: state.style !== undefined
    };
  },
  
  getAllRequiredValid: () => {
    const { courses, style } = get();
    return courses.length > 0 && style !== undefined;
  },
  
  getScheduleStats: () => {
    const { schedules } = get();
    return getScheduleStats(schedules);
  }
}));
