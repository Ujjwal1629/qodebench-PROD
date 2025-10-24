/**
 * Format a number with thousand separators
 * @example formatPoints(1234) => "1,234"
 */
export function formatPoints(points: number): string {
  return points.toLocaleString('en-US');
}

/**
 * Format a date relative to now (e.g., "2 hours ago", "Yesterday")
 */
export function formatDate(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffInMs = now.getTime() - then.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} month${months === 1 ? '' : 's'} ago`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years} year${years === 1 ? '' : 's'} ago`;
  }
}

/**
 * Format a date as a readable string
 * @example formatDateLong(new Date()) => "January 15, 2025"
 */
export function formatDateLong(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get ordinal suffix for a rank (1st, 2nd, 3rd, etc.)
 */
export function getRankSuffix(rank: number): string {
  const j = rank % 10;
  const k = rank % 100;

  if (j === 1 && k !== 11) {
    return `${rank}st`;
  }
  if (j === 2 && k !== 12) {
    return `${rank}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${rank}rd`;
  }
  return `${rank}th`;
}

/**
 * Get formatted experience level label
 */
export function getExperienceLevelLabel(
  level: string | null | undefined
): string {
  const levelMap: Record<string, string> = {
    intern: 'Intern',
    junior: 'Junior Developer',
    mid: 'Mid-Level Developer',
    senior: 'Senior Developer',
  };

  return levelMap[level || 'intern'] || 'Developer';
}

/**
 * Format time in minutes to human-readable string
 * @example formatTime(90) => "1h 30m"
 */
export function formatTime(minutes: number | null): string {
  if (minutes === null || minutes === undefined) {
    return 'N/A';
  }

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Get percentage with formatting
 * @example formatPercentage(0.856) => "86%"
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Get current day of week and formatted date
 * @example getCurrentDayInfo() => { day: "Monday", date: "January 15, 2025" }
 */
export function getCurrentDayInfo(): { day: string; date: string } {
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' });
  const date = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return { day, date };
}

/**
 * Calculate percentage from two numbers
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Get motivational message based on streak
 */
export function getStreakMessage(streak: number): string {
  if (streak === 0) {
    return "Start your coding journey today!";
  } else if (streak === 1) {
    return "Great start! Keep the momentum going!";
  } else if (streak < 7) {
    return `${streak} days strong! You're building a habit!`;
  } else if (streak < 30) {
    return `${streak} day streak! You're on fire! 🔥`;
  } else if (streak < 100) {
    return `${streak} days! Consistency is your superpower!`;
  } else {
    return `${streak} days! You're a coding legend!`;
  }
}

/**
 * Get progress percentage between two values
 */
export function getProgressPercentage(
  current: number,
  min: number,
  max: number
): number {
  if (current <= min) return 0;
  if (current >= max) return 100;
  return Math.round(((current - min) / (max - min)) * 100);
}
