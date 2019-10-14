import React from 'react';

import { Form, Field } from 'react-final-form';
import { navigate } from '@reach/router';
import { Typography, Link, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import AdapterLink from 'components/AdapterLink';
import PaperPage from 'components/PaperPage';
import {
  composeValidators,
  isEmail,
  required,
  validPassword,
} from 'components/formValidation';
import { renderInputWithHelper } from 'components/wrappableMuiFormElems';
import { useActions, useSelectors, useErrorContext } from 'hooks';
import { UserSelectors, UserActions } from 'modules/user';

const useStyles = makeStyles(theme => ({
  divider: {
    margin: 15,
    marginBottom: 30,
  },
  form: {
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
  },
  textField: {
    marginRight: theme.spacing(5),
  },
  submit: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(7),
    width: theme.spacing(30),
  },
}));

const LoginForm = ({ classes, onSubmit }) => (
  <Form
    onSubmit={onSubmit}
    render={({ handleSubmit, submitting, pristine, valid }) => (
      <form className={classes.form} onSubmit={handleSubmit}>
        <Field
          className={classes.textField}
          name="email"
          label="Email"
          component={renderInputWithHelper}
          validate={composeValidators(required, isEmail)}
        />

        <Field
          className={classes.textField}
          name="password"
          label="Password"
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
          Log In
        </Button>

        <Typography variant="h5">Don't have an account?</Typography>
        <Typography variant="h5">
          Please{' '}
          <Link component={AdapterLink} to="/register">
            Register.
          </Link>
        </Typography>

        <Typography variant="body1">
          Forgot password or username?
          <br />
          Please <Link href="mailto:contact@thehumanfactor.ai">Email us.</Link>
        </Typography>
      </form>
    )}
  />
);

const RegisterForm = ({ classes, onSubmit }) => (
  <Form
    onSubmit={onSubmit}
    validate={values =>
      values.password !== values.passwordConfirmation
        ? { password: 'Passwords must match' }
        : {}
    }
    render={({ handleSubmit, submitting, pristine, valid }) => (
      <form className={classes.form} onSubmit={handleSubmit}>
        <Field
          className={classes.textField}
          name="fullName"
          label="Full Name"
          component={renderInputWithHelper}
          validate={required}
        />

        <Field
          className={classes.textField}
          name="email"
          label="Email"
          component={renderInputWithHelper}
          validate={composeValidators(required, isEmail)}
        />

        <Field
          className={classes.textField}
          name="password"
          label="Password"
          type="password"
          component={renderInputWithHelper}
          validate={composeValidators(required, validPassword)}
        />

        <Field
          className={classes.textField}
          name="passwordConfirmation"
          label="Re-enter Password"
          type="password"
          component={renderInputWithHelper}
          validate={composeValidators(required, validPassword)}
        />

        <Button
          className={classes.submit}
          type="submit"
          variant="contained"
          color="primary"
          disabled={pristine || !valid || submitting}
        >
          Register
        </Button>
        <Typography variant="h5">
          Back to{' '}
          <Link component={AdapterLink} to="/login">
            Log In.
          </Link>
        </Typography>
      </form>
    )}
  />
);

const LoginRegister = props => {
  const classes = useStyles();
  const actions = useActions(UserActions);
  const selectors = useSelectors(UserSelectors);
  const errorHandler = useErrorContext();

  const loginWithRedirect = credentials => {
    return actions
      .login(credentials)
      .then(res => {
        navigate(selectors.returnToRoute, { replace: true });
      })
      .catch(error => {
        errorHandler(error, `Log In failed, ${error.message}`, true);
      });
  };

  const registerWithRedirect = credentials => {
    return actions
      .register(credentials)
      .then(res => {
        navigate(selectors.returnToRoute, { replace: true });
      })
      .catch(error => {
        errorHandler(error, `Register failed, ${error.message}`, true);
      });
  };

  if (selectors.isLoggedIn) {
    return (
      <PaperPage title="">
        <Button
          className={classes.submit}
          onClick={actions.logout}
          variant="contained"
          color="primary"
        >
          Log Out
        </Button>
      </PaperPage>
    );
  } else if (props.mode === 'login') {
    return (
      <PaperPage title="Login">
        <LoginForm classes={classes} onSubmit={loginWithRedirect} />
      </PaperPage>
    );
  } else if (props.mode === 'register') {
    return (
      <PaperPage title="Register">
        <RegisterForm classes={classes} onSubmit={registerWithRedirect} />
      </PaperPage>
    );
  } else {
    console.error(`Unexpected mode for LoginRegister, ${props.mode}`);
  }
};

export default LoginRegister;
