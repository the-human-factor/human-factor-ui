import React from "react";
import { Link, navigate } from "@reach/router";
import { compose } from "recompose";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { bindActionCreators } from "redux";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import * as UserActions from "modules/user/actions";
import { selectors as UserSelectors } from "modules/user";
import { validateEmail, validateRequired } from "components/utils"

const AdapterLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} {...props} />
));

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

const renderTextField = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => (
  <TextField label={label}
             error={touched && error}
             {...input}
             {...custom}/>
)

const Login = props => {
  const { handleSubmit, pristine, submitting, classes, onSubmit } = props;
  return (
    <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
      <Field className={classes.textField}
             name="email"
             label="Email"
             component={renderTextField}
             validate={[validateRequired, validateEmail]}/>

      <Field className={classes.textField}
             name="password"
             label="Password"
             type="password"
             component={renderTextField}
             validate={[validateRequired]}/>

      <Button className={classes.submit}
              type="submit"
              variant="contained"
              color="primary"
              disabled={pristine || submitting}>
        Log In
      </Button>
      <br />
      <Link component={AdapterLink} to="/register">Register</Link>
    </form>
  );
};


// TODO: How to validate password is the same?
const Register = props => {
  const { handleSubmit, pristine, submitting, classes, onSubmit } = props;
  return (
    <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
      <Field className={classes.textField}
             name="name"
             label="Name"
             component={renderTextField}
             validate={[validateRequired]}/>

      <Field className={classes.textField}
             name="email"
             label="Email"
             component={renderTextField}
             validate={[validateRequired, validateEmail]}/>

      <Field className={classes.textField}
             name="password"
             label="Password"
             type="password"
             component={renderTextField}
             validate={[validateRequired]}/>

      <Field className={classes.textField}
             name="password2"
             label="Re-enter Password"
             type="password"
             component={renderTextField}
             validate={[validateRequired]}/>

      <Button className={classes.submit}
              type="submit"
              variant="contained"
              color="primary"
              disabled={pristine || submitting}>
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
        alert(`login failed, ${error.message}`);
      });
  };

  const registerWithRedirect = (credentials) => {
    actions.register(credentials)
      .then((res) => {
        navigate(props.returnToRoute, { replace: true });
      })
      .catch((error) => {
        alert(`login failed, ${error.message}`);
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
