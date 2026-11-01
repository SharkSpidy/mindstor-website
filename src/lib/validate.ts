export interface AccessForm {
  name: string;
  email: string;
  brief: string;
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Returns an error message the visitor can act on, or null when the form is valid.
 * Values are trimmed before checking, so whitespace-only input is rejected.
 */
export function validateAccessForm(form: AccessForm): string | null {
  const name = form.name.trim();
  const email = form.email.trim();
  const brief = form.brief.trim();
  if (!name || !brief || !EMAIL_RE.test(email)) {
    return 'Add your name, a valid work email, and a short description of what you are building.';
  }
  return null;
}
