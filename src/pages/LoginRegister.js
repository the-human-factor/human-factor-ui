import React from "react";
import { Link } from "@reach/router";
import { compose, lifecycle, branch, renderNothing } from "recompose";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Divider from '@material-ui/core/Divider';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import * as UserActions from "modules/user/actions";
import { selectors as UserSelectors } from "modules/user";

const styles = theme => ({
  paper: {
    padding: 10,
  },
  paperHeader: {
    margin: 15,
    marginBottom: 30,
  },
  divider: {
    margin: 15,
    marginBottom: 30,
  }
});

const Login = () => (
  <h2>Login</h2>
);

const LoginRegister = props => {
  const { classes } = props;
  if (props.mode == "login") {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h2" className={classes.paperHeader}>
            Login
        </Typography>
        <Container>
        </Container>
      </Paper>
    );
  } else if (props.mode == "register") {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h2" className={classes.paperHeader}>
            Register
        </Typography>
        <Container>
        </Container>
      </Paper>
    );
  } else {
    console.error(`Unexpected mode for LoginRegister, ${props.mode}`);
  }
};

export default compose(
  connect(
    state => ({
      isLoggedOn: UserSelectors.isLoggedOn(state),
      isLoggedOut: UserSelectors.isLoggedOut(state),
      isLoggingOn: UserSelectors.isLoggingOn(state)
    }),
    dispatch => ({
      actions: bindActionCreators(UserActions, dispatch)
    })
  ),
  withStyles(styles)
)(LoginRegister);
