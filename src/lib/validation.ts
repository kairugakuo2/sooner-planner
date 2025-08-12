import { z } from 'zod';

export const termSchema = z.object({
  year: z.number().min(2020).max(2030),
  semester: z.enum(['Spring', 'Summer', 'Fall'])
});

export const courseSchema = z.object({
  id: z.string(),
  subject: z.string().min(1),
  number: z.string().min(1),
  title: z.string().min(1)
});

export const breakConstraintSchema = z.object({
  day: z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']),
  start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
});

export const timePreferencesSchema = z.object({
  earliest: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  latest: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  noFriday: z.boolean().optional(),
  avoidNights: z.boolean().optional(),
  passingMins: z.enum(['0', '10', '15']).optional()
});

export const styleSchema = z.enum(['compact', 'balanced', 'spread']);

export const plannerStateSchema = z.object({
  term: termSchema,
  courses: z.array(courseSchema).min(1),
  breaks: z.array(breakConstraintSchema),
  earliest: z.string().optional(),
  latest: z.string().optional(),
  noFriday: z.boolean().optional(),
  avoidNights: z.boolean().optional(),
  passingMins: z.enum(['0', '10', '15']).optional(),
  style: styleSchema.optional()
});

export type Term = z.infer<typeof termSchema>;
export type Course = z.infer<typeof courseSchema>;
export type BreakConstraint = z.infer<typeof breakConstraintSchema>;
export type TimePreferences = z.infer<typeof timePreferencesSchema>;
export type Style = z.infer<typeof styleSchema>;
export type PlannerState = z.infer<typeof plannerStateSchema>;
