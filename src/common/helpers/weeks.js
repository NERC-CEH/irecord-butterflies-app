import { observable } from 'mobx';
// https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
window.admin = observable({ currentWeek: null });

export default function getCurrentWeekNumber() {
  if (window.admin.currentWeek) {
    console.log(`Returning manually set week ${window.admin.currentWeek}`);
    return window.admin.currentWeek; // manual overwrite for testing
  }

  const d = new Date();
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}
