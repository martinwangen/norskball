/**
 * Utility functions for formatting data
 */
import { date } from 'quasar';
import { Status } from '../gql/__generated__/graphql';

/**
 * Format a date for display in match list
 * @param dateString ISO date string
 * @returns Formatted date string (e.g., "Jan 1, 2024 - 7:30 PM")
 */
export function formatMatchDate(dateString: string): string {
  try {
    return date.formatDate(dateString, 'MMMM D, YYYY - HH:mm');
  } catch {
    return dateString;
  }
}

/**
 * Format a date for display in match details
 * @param dateString ISO date string
 * @returns Formatted date string (e.g., "Monday, January 1, 2024 - 19:30")
 */
export function formatMatchDetailDate(dateString: string): string {
  return date.formatDate(dateString, 'dddd, MMMM D, YYYY - HH:mm');
}

/**
 * Get match status text based on status
 * @param status Match status
 * @returns Status text
 */
export function getMatchStatusText(status: Status): string {
  switch (status) {
    case Status.Scheduled: return 'Scheduled';
    case Status.InProgress: return 'In Progress';
    case Status.Completed: return 'Finished';
    case Status.Postponed: return 'Postponed';
    case Status.Cancelled: return 'Cancelled';
    default: return 'Unknown';
  }
}

/**
 * Get match status color based on status
 * @param status Match status
 * @returns Status color
 */
export function getMatchStatusColor(status: Status): string {
  switch (status) {
    case Status.Scheduled: return 'blue';
    case Status.InProgress: return 'green';
    case Status.Completed: return 'grey';
    case Status.Postponed: return 'orange';
    case Status.Cancelled: return 'red';
    default: return 'grey';
  }
}

/**
 * Format a number with thousands separators
 * @param num Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Format a currency value
 * @param amount Amount to format
 * @param currency Currency code (default: EUR)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

export default {
  formatMatchDate,
  formatMatchDetailDate,
  getMatchStatusText,
  getMatchStatusColor,
  formatNumber,
  formatCurrency
};
