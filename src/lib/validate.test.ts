import { describe, expect, it } from 'vitest';
import { validateAccessForm } from './validate';

const ok = { name: 'Asha', email: 'asha@studio.in', brief: 'A booking app for a cinema.' };

describe('validateAccessForm', () => {
  it('accepts a complete form', () => {
    expect(validateAccessForm(ok)).toBeNull();
  });

  it('rejects an empty name, trimming whitespace', () => {
    expect(validateAccessForm({ ...ok, name: '   ' })).not.toBeNull();
  });

  it('rejects an empty brief', () => {
    expect(validateAccessForm({ ...ok, brief: '' })).not.toBeNull();
  });

  it.each(['asha', 'asha@', '@studio.in', 'asha@studio', 'as ha@studio.in'])('rejects email "%s"', (email) => {
    expect(validateAccessForm({ ...ok, email })).not.toBeNull();
  });

  it('accepts an email with surrounding spaces', () => {
    expect(validateAccessForm({ ...ok, email: '  asha@studio.in ' })).toBeNull();
  });
});
