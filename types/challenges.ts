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

/**
 * Advanced challenge metadata for office simulation challenges
 */
export interface AdvancedChallengeMetadata {
  ticketId: string;
  ctoMessage: string;
  ctoName?: string;
  ctoRole?: string;
  impact: 'Low' | 'Medium' | 'High' | 'Critical';
  urgency: 'P1' | 'P2' | 'P3' | 'P4';
  affectedModules: string[];
  stepsToReproduce: string[];
  expectedBehavior: string;
  actualBehavior: string;
  acceptanceCriteria: string[];
  sampleRequest?: string;
  sampleResponse?: string;
  architectureNotes?: string;
  seniorHint?: string;
  learningObjectives?: string[];
  exampleTestCases?: {
    input: string;
    expected: string;
    description: string;
  }[];
}

/**
 * Product planning challenge metadata for feature planning scenarios
 */
export interface ProductPlanningMetadata {
  pmMessage: string;
  pmName?: string;
  pmRole?: string;
  jiraSummary: string;
  teamDiscussion?: string;
  scenario?: string;
  taskItems: string[];
  learningObjectives?: string[];
}
