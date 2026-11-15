/**
 * Launch moment: 1 Jan 2027, 00:00 IST (UTC+05:30), so every visitor counts down to the same instant
 * regardless of their own time zone. Change this one line to move the launch.
 */
export const LAUNCH_AT = Date.parse('2027-01-01T00:00:00+05:30');

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

export function getTimeLeft(now: number, target: number = LAUNCH_AT): TimeLeft {
  const ms = Math.max(0, target - now);
  const total = Math.floor(ms / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    done: ms === 0,
  };
}

export const pad2 = (n: number): string => String(n).padStart(2, '0');
