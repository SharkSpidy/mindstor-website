import { describe, expect, it } from 'vitest';
import { CORE_VALUES, MAKE_CARDS, NAV_LINKS } from './content';
import { LOGO } from './logo';

describe('content integrity', () => {
  it('lists the five core values in order, numbered 01 to 05', () => {
    expect(CORE_VALUES.map((v) => v.num)).toEqual(['01', '02', '03', '04', '05']);
  });

  it('keeps Straight Talk as value 03', () => {
    expect(CORE_VALUES[2].title).toBe('Straight Talk');
  });

  it('has no leftover chip / embedded positioning', () => {
    const all = JSON.stringify([CORE_VALUES, MAKE_CARDS, NAV_LINKS]).toLowerCase();
    expect(all).not.toMatch(/chip|embedded|firmware/);
  });

  it('points every nav link at an in-page anchor', () => {
    for (const l of NAV_LINKS) expect(l.href).toMatch(/^#[a-z]+$/);
  });

  it('does not include a careers link', () => {
    expect(NAV_LINKS.some((link) => link.href === '#careers')).toBe(false);
  });
});

describe('logo data', () => {
  it('has 13 facets', () => {
    expect(LOGO).toHaveLength(13);
  });

  it('gives every facet at least 3 corners and a hex color', () => {
    for (const f of LOGO) {
      expect(f.points.length).toBeGreaterThanOrEqual(3);
      expect(f.color).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});
