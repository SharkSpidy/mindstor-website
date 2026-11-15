import { describe, expect, it } from 'vitest';
import { getTimeLeft, LAUNCH_AT, pad2 } from './countdown';

describe('getTimeLeft', () => {
  it('splits a duration into days, hours, minutes and seconds', () => {
    const t = getTimeLeft(0, ((1 * 24 + 2) * 60 + 3) * 60 * 1000 + 4000);
    expect(t).toEqual({ days: 1, hours: 2, minutes: 3, seconds: 4, done: false });
  });

  it('clamps at zero once the launch has passed', () => {
    expect(getTimeLeft(LAUNCH_AT + 5000)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, done: true });
  });

  it('targets 1 Jan 2027 00:00 IST', () => {
    expect(new Date(LAUNCH_AT).toISOString()).toBe('2026-12-31T18:30:00.000Z');
  });
});

describe('pad2', () => {
  it('zero-pads single digits only', () => {
    expect(pad2(7)).toBe('07');
    expect(pad2(123)).toBe('123');
  });
});
