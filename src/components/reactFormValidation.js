// Convience functions for React Forms
// from: https://redux-form.com/7.3.0/examples/fieldlevelvalidation/

export const required = value => (value ? undefined : 'Required');

export const isEmail = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined;

export const passwordsMatch = (value, allValues) =>
  value !== allValues.password ? 'Passwords do not match' : undefined;

export const validPassword = value =>
  value && !/(.{8,})/g.test(value)
    ? 'Requires 8 or more characters'
    : undefined;
