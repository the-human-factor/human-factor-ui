import React from 'react';

import { Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Form, Field } from 'react-final-form';

import api from 'modules/api';
import PaperPage from 'components/PaperPage';
import { renderInputWithHelper } from 'components/wrappableMuiFormElems';
import {
  composeValidators,
  required,
  validPassword,
} from 'components/formValidation';
import { UserSelectors } from 'modules/user';
import { useSelectors } from 'hooks';

const useStyles = makeStyles(theme => ({
  textField: {
    marginRight: theme.spacing(5),
  },
  form: {
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
  },
}));

const ChangePasswordForm = ({ classes, onSubmit }) => (
  <Form
    onSubmit={onSubmit}
    validate={values =>
      values.password !== values.passwordConfirmation
        ? { password: 'Passwords must match' }
        : {}
    }
    render={({ handleSubmit, submitting, pristine, valid }) => (
      <form className={classes.form} onSubmit={handleSubmit}>
        <Typography variant="h4">Change Password:</Typography>
        <Field
          className={classes.textField}
          name="oldPassword"
          label="Old Password"
          type="password"
          component={renderInputWithHelper}
          validate={required}
        />

        <Field
          className={classes.textField}
          name="password"
          label="New Password"
          type="password"
          component={renderInputWithHelper}
          validate={composeValidators(required, validPassword)}
        />

        <Field
          className={classes.textField}
          name="passwordConfirmation"
          label="Re-enter New Password"
          type="password"
          component={renderInputWithHelper}
          validate={required}
        />

        <Button
          className={classes.submit}
          type="submit"
          variant="contained"
          color="primary"
          disabled={pristine || !valid || submitting}
        >
          Change Password
        </Button>
      </form>
    )}
  />
);

const changePassword = credentials =>
  api
    .changePassword(credentials)
    .then(res => {
      alert('Password successfully changed.');
    })
    .catch(error => {
      const message = (((error || {}).response || {}).data || {}).message;
      alert(`Failed to change password, ${message}`);
    });

const Profile = () => {
  const classes = useStyles();
  const { user } = useSelectors(UserSelectors);

  const title = `Hi ${user.full_name}!`;

  return (
    <PaperPage title={title}>
      <ChangePasswordForm classes={classes} onSubmit={changePassword} />
    </PaperPage>
  );
};

export default Profile;
