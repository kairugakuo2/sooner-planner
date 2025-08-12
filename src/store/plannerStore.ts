import { create } from 'zustand';

export type Term = { year: number; semester: 'Spring' | 'Summer' | 'Fall' };
export type Course = { id: string; subject: string; number: string; title: string };
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
  
  // Derived state
  getRequiredValid: () => { courses: boolean; style: boolean };
  getAllRequiredValid: () => boolean;
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
  }
}));
