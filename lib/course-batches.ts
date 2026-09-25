// Batches a course can run in parallel. Each batch has its own live-class
// recordings; a learner's batch lives in the `course_enrollments` table
// (migration 075) and decides which recordings the course player shows.
//
// Ids must match the CHECK constraint on course_enrollments.batch.

export const BATCHES = {
  morning: { label: 'Morning batch' },
  afternoon: { label: 'Afternoon batch' },
  evening: { label: 'Evening batch' },
} as const;

export type BatchId = keyof typeof BATCHES;

export function isBatchId(value: unknown): value is BatchId {
  return typeof value === 'string' && value in BATCHES;
}
