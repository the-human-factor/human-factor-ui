// Validators for final-form
// from: https://final-form.org/docs/react-final-form/examples/field-level-validation

export const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined);

export const required = value => (value ? undefined : 'Required');

export const isEmail = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined;

export const validPassword = value =>
  value && !/(.{8,})/g.test(value)
    ? 'Requires 8 or more characters'
    : undefined;
