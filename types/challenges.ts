/**
 * Type definitions for challenge-related features
 */

/**
 * Merge conflict resolution strategies (VS Code-style)
 */
export type MergeConflictResolution =
  | 'accept_current'
  | 'accept_incoming'
  | 'accept_both'
  | 'compare_changes';

/**
 * A single merge conflict scenario
 */
export interface MergeConflictScenario {
  id: number;
  context: string;
  description: string;
  currentBranch: string;
  incomingBranch: string;
  currentCode: string;
  incomingCode: string;
  correctAnswer: Exclude<MergeConflictResolution, 'compare_changes'>;
  explanation: string;
  filePath?: string;
}

/**
 * User's response to a single scenario
 */
export interface MergeConflictScenarioResponse {
  id: number;
  selected: MergeConflictResolution;
  reasoning?: string;
  timeSpent?: number;
}

/**
 * Complete merge conflict challenge response
 */
export interface MergeConflictChallengeResponse {
  scenarios: MergeConflictScenarioResponse[];
  totalTime?: number;
}

/**
 * Validation result for a single scenario
 */
export interface MergeConflictScenarioResult {
  scenarioId: number;
  isCorrect: boolean;
  selectedAnswer: MergeConflictResolution;
  correctAnswer: MergeConflictResolution;
  score: number;
  feedback: string;
  explanation: string;
}

/**
 * Complete validation result for merge conflict challenge
 */
export interface MergeConflictValidationResult {
  passed: boolean;
  totalScore: number;
  structureScore: number;
  qualityScore: number;
  scenarioResults: MergeConflictScenarioResult[];
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
}
