import React from "react";

import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { bindActionCreators } from "redux";
import { compose } from "recompose";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { Link, navigate } from "@reach/router";
import { withStyles } from "@material-ui/core/styles";

import * as UserActions from "modules/user/actions";
import AdapterLink from "components/AdapterLink";
import { isEmail, required, passwordsMatch, validPassword } from "components/reactFormValidation";
import { renderInputWithHelper } from "components/wrappableMuiFormElems";
import { selectors as UserSelectors } from "modules/user";

const styles = theme => ({
  paper: {
    padding: 10,
    maxWidth: theme.spacing(80)
  },
  paperHeader: {
    margin: 15,
    marginBottom: 30,
  },
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
});



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
  const { classes, actions } = props;

  const loginWithRedirect = (credentials) => {
    actions.login(credentials)
      .then((res) => {
        navigate(props.returnToRoute, { replace: true });
      })
      .catch((error) => {
        alert(`Log In failed, ${error.message}`);
      });
  };

  const registerWithRedirect = (credentials) => {
    actions.register(credentials)
      .then((res) => {
        navigate(props.returnToRoute, { replace: true });
      })
      .catch((error) => {
        alert(`Register failed, ${error.message}`);
      });
  };

  if (props.isLoggedIn) {
    return (
      <Paper className={classes.paper}>
        <Button className={classes.submit}
                onClick={actions.logout}
                variant="contained"
                color="primary">
          Log Out
        </Button>
      </Paper>
    )
  } else if (props.mode === "login") {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h2" className={classes.paperHeader}>
          Login
        </Typography>
        <ReduxLogin classes={classes} onSubmit={loginWithRedirect} />
      </Paper>
    );
  } else if (props.mode === "register") {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h2" className={classes.paperHeader}>
            Register
        </Typography>
        <ReduxRegister classes={classes} onSubmit={registerWithRedirect} />
      </Paper>
    );
  } else {
    console.error(`Unexpected mode for LoginRegister, ${props.mode}`);
  }
};

export default compose(
  connect(
    state => ({
      isLoggedIn: UserSelectors.isLoggedIn(state),
      returnToRoute: UserSelectors.returnToRoute(state)
    }),
    dispatch => ({
      actions: bindActionCreators(UserActions, dispatch)
    })
  ),
  withStyles(styles)
)(LoginRegister);
