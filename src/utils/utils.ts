import { redirect } from 'next/navigation';

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: 'error' | 'success',
  path: string,
  message: string
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Week management utilities
export interface WeekRange {
  start: Date;
  end: Date;
  label: string;
  key: string;
}

/**
 * Get the start of the week (Monday) for a given date
 */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0); // Set to start of day
  return d;
}

/**
 * Get the end of the week (Sunday) for a given date
 */
export function getWeekEnd(date: Date): Date {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

/**
 * Format a week range for display
 */
export function formatWeekLabel(start: Date, end: Date): string {
  const now = new Date();

  const normalizedStart = getWeekStart(start);
  const thisWeekStart = getWeekStart(now);

  // Check if it's this week
  if (normalizedStart.getTime() === thisWeekStart.getTime()) {
    return 'This Week';
  }

  // Check if it's next week
  const nextWeekStart = new Date(thisWeekStart);
  nextWeekStart.setDate(thisWeekStart.getDate() + 7);
  if (normalizedStart.getTime() === getWeekStart(nextWeekStart).getTime()) {
    return 'Next Week';
  }

  // Check if it's last week
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(thisWeekStart.getDate() - 7);
  if (normalizedStart.getTime() === getWeekStart(lastWeekStart).getTime()) {
    return 'Last Week';
  }

  // For other weeks, show the month and date range
  const currentYear = now.getFullYear();
  const weekYear = start.getFullYear();
  const showYear = weekYear !== currentYear;

  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  const startDay = start.getDate();
  const endDay = end.getDate();

  let dateLabel: string;
  if (startMonth === endMonth) {
    dateLabel = `${startMonth} ${startDay}-${endDay}`;
  } else {
    dateLabel = `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  }

  return showYear ? `${dateLabel} ${weekYear}` : dateLabel;
}

/**
 * Generate a list of weeks around the current week
 */
export function generateWeekRanges(
  weeksBack: number = 26,
  weeksForward: number = 3
): WeekRange[] {
  const weeks: WeekRange[] = [];
  const today = new Date();

  // Use a set to prevent duplicates caused by DST shifts
  const weekKeys = new Set<string>();

  // Generate past weeks
  for (let i = weeksBack; i > 0; i--) {
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - i * 7);
    const weekStart = getWeekStart(pastDate);
    const key = `week-${weekStart.getTime()}`;

    if (!weekKeys.has(key)) {
      const weekEnd = getWeekEnd(weekStart);
      weeks.push({
        start: weekStart,
        end: weekEnd,
        label: formatWeekLabel(weekStart, weekEnd),
        key,
      });
      weekKeys.add(key);
    }
  }

  // Generate current and future weeks
  for (let i = 0; i <= weeksForward; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + i * 7);
    const weekStart = getWeekStart(futureDate);
    const key = `week-${weekStart.getTime()}`;

    if (!weekKeys.has(key)) {
      const weekEnd = getWeekEnd(weekStart);
      weeks.push({
        start: weekStart,
        end: weekEnd,
        label: formatWeekLabel(weekStart, weekEnd),
        key,
      });
      weekKeys.add(key);
    }
  }

  // Sort weeks chronologically
  weeks.sort((a, b) => a.start.getTime() - b.start.getTime());

  return weeks;
}

/**
 * Get the current week range
 */
export function getCurrentWeekRange(): WeekRange {
  const now = new Date();
  const start = getWeekStart(now);
  const end = getWeekEnd(now);

  return {
    start,
    end,
    label: formatWeekLabel(start, end),
    key: `week-${start.getTime()}`,
  };
}
