import { observable } from 'mobx';
// https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
(window as any).admin = observable({ currentWeek: null });

export default function getCurrentWeekNumber(date?: string) {
  if ((window as any).admin.currentWeek) {
    console.log(
      `Returning manually set week ${(window as any).admin.currentWeek}`
    );
    return (window as any).admin.currentWeek; // manual overwrite for testing
  }

  const d: any = date ? new Date(date) : new Date();
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  const yearStart: any = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}
