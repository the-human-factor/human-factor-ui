import React from "react";

import Button from "@material-ui/core/Button";
import { Field, reduxForm } from "redux-form";
import { Link, navigate } from "@reach/router";
import { makeStyles } from "@material-ui/core/styles";

import PaperPage from "components/PaperPage";
import AdapterLink from "components/AdapterLink";
import { isEmail, required, passwordsMatch, validPassword } from "components/reactFormValidation";
import { renderInputWithHelper } from "components/wrappableMuiFormElems";
import { UserSelectors, UserActions } from "modules/user";
import { useActions, useSelectors } from "hooks";

const useStyles = makeStyles(theme => ({
  divider: {
    margin: 15,
    marginBottom: 30,
  },
  form: {
    padding: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "left"
  },
  textField: {
    marginRight: theme.spacing(5)
  },
  submit: {
    marginTop: theme.spacing(5),
    width: theme.spacing(30)
  }
}));

const Login = props => {
  const { handleSubmit, pristine, submitting, valid, classes, onSubmit } = props;
  return (
    <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
      <Field className={classes.textField}
             name="email"
             label="Email"
             component={renderInputWithHelper}
             validate={[required, isEmail]}/>

      <Field className={classes.textField}
             name="password"
             label="Password"
             type="password"
             component={renderInputWithHelper}
             validate={[required]}/>

      <Button className={classes.submit}
              type="submit"
              variant="contained"
              color="primary"
              disabled={pristine || !valid || submitting}>
        Log In
      </Button>
      <br />
      <Link component={AdapterLink} to="/register">Register</Link>
    </form>
  );
};

const Register = props => {
  const { handleSubmit, pristine, submitting, valid, classes, onSubmit } = props;
  return (
    <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
      <Field className={classes.textField}
             name="fullName"
             label="Name"
             component={renderInputWithHelper}
             validate={[required]}/>

      <Field className={classes.textField}
             name="email"
             label="Email"
             component={renderInputWithHelper}
             validate={[required, isEmail]}/>

      <Field className={classes.textField}
             name="password"
             label="Password"
             type="password"
             component={renderInputWithHelper}
             validate={[required, validPassword]}/>

      <Field className={classes.textField}
             name="passwordConfirmation"
             label="Re-enter Password"
             type="password"
             component={renderInputWithHelper}
             validate={[required, passwordsMatch]}/>

      <Button className={classes.submit}
              type="submit"
              variant="contained"
              color="primary"
              disabled={pristine || !valid || submitting}>
        Register
      </Button>
      <br />
      <Link component={AdapterLink} to="/login">Log In</Link>
    </form>
  );
};

const ReduxLogin = reduxForm({ form: "login" })(Login);
const ReduxRegister = reduxForm({ form: "register"})(Register);



const LoginRegister = props => {
  const classes = useStyles();
  const actions = useActions(UserActions);
  const selectors = useSelectors(UserSelectors);

  const loginWithRedirect = (credentials) => {
    actions.login(credentials)
      .then((res) => {
        navigate(selectors.returnToRoute, { replace: true });
      })
      .catch((error) => {
        alert(`Log In failed, ${error.message}`);
      });
  };

  const registerWithRedirect = (credentials) => {
    actions.register(credentials)
      .then((res) => {
        navigate(selectors.returnToRoute, { replace: true });
      })
      .catch((error) => {
        alert(`Register failed, ${error.message}`);
      });
  };

  if (selectors.isLoggedIn) {
    return (
      <PaperPage title="">
        <Button className={classes.submit}
                onClick={actions.logout}
                variant="contained"
                color="primary">
          Log Out
        </Button>
      </PaperPage>
    )
  } else if (props.mode === "login") {
    return (
      <PaperPage title="Login">
        <ReduxLogin classes={classes} onSubmit={loginWithRedirect} />
      </PaperPage>
    );
  } else if (props.mode === "register") {
    return (
      <PaperPage title="Register">
        <ReduxRegister classes={classes} onSubmit={registerWithRedirect} />
      </PaperPage>
    );
  } else {
    console.error(`Unexpected mode for LoginRegister, ${props.mode}`);
  }
};

export default LoginRegister;
