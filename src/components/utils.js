// Convience functions for React Forms
// from: https://redux-form.com/7.3.0/examples/fieldlevelvalidation/

export const validateRequired = value => (value ? undefined : 'Required')

export const validateEmail = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined