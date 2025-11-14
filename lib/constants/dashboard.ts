import {
  Home,
  BookOpen,
  Code2,
  // Map, // Temporarily removed - Roadmap hidden
  Mic,
  Trophy,
  Gift,
  type LucideIcon,
} from 'lucide-react';

// Navigation menu items for sidebar
export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Overview of your progress',
  },
  {
    title: 'Learning',
    href: '/dashboard/learning',
    icon: BookOpen,
    description: 'Structured learning paths',
  },
  {
    title: 'Challenges',
    href: '/dashboard/challenges',
    icon: Code2,
    description: 'Browse coding challenges',
  },
  // Temporarily hidden - Coming soon
  // {
  //   title: 'Roadmap',
  //   href: '/roadmap',
  //   icon: Map,
  //   description: 'Your learning path',
  // },
  {
    title: 'Mock Interviews',
    href: '/dashboard/interviews',
    icon: Mic,
    description: 'Practice technical interviews',
  },
  {
    title: 'Leaderboard',
    href: '/dashboard/leaderboard',
    icon: Trophy,
    description: 'Compete with developers worldwide',
  },
  // Temporarily hidden for beta - Coming soon
  // {
  //   title: 'Rewards',
  //   href: '/dashboard/rewards',
  //   icon: Gift,
  //   description: 'Redeem exclusive merch',
  // },
];

// Mobile navigation items (essential features)
export const MOBILE_NAV_ITEMS: NavItem[] = [
  NAV_ITEMS[0], // Dashboard
  NAV_ITEMS[1], // Learning
  NAV_ITEMS[2], // Challenges
  NAV_ITEMS[3], // Interviews
  NAV_ITEMS[4], // Leaderboard
];

// Experience levels and point thresholds
export type ExperienceLevel = {
  name: string;
  level: 'intern' | 'junior' | 'mid' | 'senior';
  minPoints: number;
  maxPoints: number;
  color: string;
  description: string;
};

export const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  {
    name: 'Intern',
    level: 'intern',
    minPoints: 0,
    maxPoints: 499,
    color: '#94A3B8', // slate-400
    description: 'Just getting started',
  },
  {
    name: 'Junior Developer',
    level: 'junior',
    minPoints: 500,
    maxPoints: 1499,
    color: '#3B82F6', // blue-500 (brand)
    description: 'Building fundamentals',
  },
  {
    name: 'Mid-Level Developer',
    level: 'mid',
    minPoints: 1500,
    maxPoints: 3499,
    color: '#8B5CF6', // violet-500
    description: 'Solid expertise',
  },
  {
    name: 'Senior Developer',
    level: 'senior',
    minPoints: 3500,
    maxPoints: 6999,
    color: '#EAB308', // yellow-500
    description: 'Expert knowledge',
  },
  {
    name: 'Lead Developer',
    level: 'senior', // Map to senior for DB
    minPoints: 7000,
    maxPoints: 14999,
    color: '#F97316', // orange-500
    description: 'Leading the way',
  },
  {
    name: 'Principal Engineer',
    level: 'senior', // Map to senior for DB
    minPoints: 15000,
    maxPoints: 29999,
    color: '#EC4899', // pink-500
    description: 'Mastery achieved',
  },
  {
    name: 'Distinguished Engineer',
    level: 'senior', // Map to senior for DB
    minPoints: 30000,
    maxPoints: Infinity,
    color: '#10B981', // emerald-500
    description: 'Legendary status',
  },
];

// Get experience level by points
export function getExperienceLevelByPoints(points: number): ExperienceLevel {
  return (
    EXPERIENCE_LEVELS.find(
      (level) => points >= level.minPoints && points <= level.maxPoints
    ) || EXPERIENCE_LEVELS[0]
  );
}

// Get next experience level
export function getNextExperienceLevel(
  currentLevel: ExperienceLevel
): ExperienceLevel | null {
  const currentIndex = EXPERIENCE_LEVELS.findIndex(
    (level) => level.name === currentLevel.name
  );
  return EXPERIENCE_LEVELS[currentIndex + 1] || null;
}

// Difficulty colors
export const DIFFICULTY_COLORS = {
  easy: 'text-green-600 bg-green-50 border-green-200',
  medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  hard: 'text-red-600 bg-red-50 border-red-200',
} as const;

// Status colors
export const STATUS_COLORS = {
  pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  passed: 'text-green-600 bg-green-50 border-green-200',
  failed: 'text-red-600 bg-red-50 border-red-200',
  error: 'text-red-600 bg-red-50 border-red-200',
  completed: 'text-green-600 bg-green-50 border-green-200',
  in_progress: 'text-blue-600 bg-blue-50 border-blue-200',
  not_started: 'text-slate-600 bg-slate-50 border-slate-200',
} as const;

// Category labels (Python removed for tier-based system)
export const CATEGORY_LABELS = {
  'office-fundamentals': 'Office Fundamentals',
  javascript: 'JavaScript',
  react: 'React',
  nextjs: 'Next.js',
  nodejs: 'Node.js',
} as const;

// Category colors
export const CATEGORY_COLORS = {
  'office-fundamentals': 'text-orange-600 bg-orange-50 border-orange-200',
  javascript: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  react: 'text-cyan-600 bg-cyan-50 border-cyan-200',
  nextjs: 'text-slate-600 bg-slate-50 border-slate-200',
  nodejs: 'text-green-600 bg-green-50 border-green-200',
} as const;

// ============================================================================
// TIER-BASED CHALLENGE SYSTEM
// ============================================================================

export type ChallengeTier = 'beginner' | 'intermediate' | 'office-workflow' | 'advanced';

export type TierInfo = {
  id: ChallengeTier;
  name: string;
  icon: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  totalChallenges: number;
  unlockRequirement: {
    type: 'none' | 'tier_completion';
    previousTier?: ChallengeTier;
    requiredCount?: number;
    description: string;
  };
};

export const TIERS: Record<ChallengeTier, TierInfo> = {
  beginner: {
    id: 'beginner',
    name: 'Beginner',
    icon: '🎯',
    description: 'Pure coding basics - Build your foundation',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    totalChallenges: 10,
    unlockRequirement: {
      type: 'none',
      description: 'Unlocked by default',
    },
  },
  intermediate: {
    id: 'intermediate',
    name: 'Intermediate',
    icon: '⚡',
    description: 'Feature & bug-level tasks - Level up your skills',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    totalChallenges: 10,
    unlockRequirement: {
      type: 'tier_completion',
      previousTier: 'beginner',
      requiredCount: 5,
      description: 'Complete 5 Beginner challenges',
    },
  },
  'office-workflow': {
    id: 'office-workflow',
    name: 'Office Workflow',
    icon: '📋',
    description: 'Full workflow tasks - Master professional practices',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    totalChallenges: 10,
    unlockRequirement: {
      type: 'tier_completion',
      previousTier: 'intermediate',
      requiredCount: 8,
      description: 'Complete 8 Intermediate challenges',
    },
  },
  advanced: {
    id: 'advanced',
    name: 'Advanced',
    icon: '🚀',
    description: 'Full simulations - Real-world scenarios',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    totalChallenges: 5,
    unlockRequirement: {
      type: 'tier_completion',
      previousTier: 'office-workflow',
      requiredCount: 3,
      description: 'Complete 3 Office Workflow challenges',
    },
  },
};

// Get all tiers in order
export const TIER_ORDER: ChallengeTier[] = [
  'beginner',
  'intermediate',
  'office-workflow',
  'advanced',
];

// Get tier info by id
export function getTierInfo(tier: ChallengeTier): TierInfo {
  return TIERS[tier];
}

// Get next tier
export function getNextTier(currentTier: ChallengeTier): ChallengeTier | null {
  const currentIndex = TIER_ORDER.indexOf(currentTier);
  return TIER_ORDER[currentIndex + 1] || null;
}

// Check if tier is unlocked
export function isTierUnlocked(
  tier: ChallengeTier,
  completedChallengesByTier: Record<ChallengeTier, number>
): boolean {
  const tierInfo = TIERS[tier];

  if (tierInfo.unlockRequirement.type === 'none') {
    return true;
  }

  if (
    tierInfo.unlockRequirement.type === 'tier_completion' &&
    tierInfo.unlockRequirement.previousTier &&
    tierInfo.unlockRequirement.requiredCount
  ) {
    const previousTier = tierInfo.unlockRequirement.previousTier;
    const requiredCount = tierInfo.unlockRequirement.requiredCount;
    const completed = completedChallengesByTier[previousTier] || 0;
    return completed >= requiredCount;
  }

  return false;
}

// Motivational messages based on time of day
export function getGreetingMessage(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning';
  } else if (hour < 18) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
}

// Motivational subtitles based on progress
export function getMotivationalSubtitle(stats?: {
  challengesCompleted: number;
  currentStreak: number;
  totalPoints: number;
}): string {
  if (!stats) {
    return "Ready to start coding?";
  }

  const { challengesCompleted, currentStreak, totalPoints } = stats;

  if (totalPoints === 0) {
    return "Let's start your coding journey today!";
  } else if (currentStreak > 7) {
    return `${currentStreak} day streak! You're unstoppable!`;
  } else if (challengesCompleted > 10) {
    return `${challengesCompleted} challenges conquered! Keep it up!`;
  } else if (challengesCompleted > 0) {
    return "Great progress! Keep learning!";
  } else {
    return "Time to tackle some challenges!";
  }
}

// Days of week for Code Friday
export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

// Check if today is Friday or close to it
export function isCodeFridayActive(): boolean {
  const today = new Date().getDay();
  // Show Code Friday on Thursday (4), Friday (5), and Saturday (6)
  return today >= 4 && today <= 6;
}

// Get days until Friday
export function getDaysUntilFriday(): number {
  const today = new Date().getDay();
  if (today <= 5) {
    return 5 - today;
  } else {
    return 5 + (7 - today);
  }
}
