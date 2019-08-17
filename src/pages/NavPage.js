import React from "react";
import { Link } from "@reach/router";
import { compose } from "recompose";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import * as UserActions from "modules/user/actions";
import { selectors as UserSelectors } from "modules/user";

const AdapterLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} {...props} />
));

const styles = theme => ({
  fullPage: {
    backgroundColor: "#EEE",
    minHeight: "100vh",
    paddingBottom: 10
  },
  toolBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  appBar: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    paddingTop: 5,
    marginBottom: 15
  },
  body: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
});

const NavPage = props => {
  const { classes, actions } = props;

  return (
    <div className={classes.fullPage}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar className={classes.toolBar}>
          <div>
            <Typography variant="h1" color="inherit">
              The Human Factor
            </Typography>
            { props.isLoggedIn && (
              <>
                <Button color="inherit"
                        component={AdapterLink}
                        to="/challenges/create">
                  Create A Challenge
                </Button>
                <Button color="inherit"
                        component={AdapterLink}
                        to="/challenges">
                  List Challenges
                </Button>
                <Button color="inherit"
                        component={AdapterLink}
                        to="/responses">
                  List Responses
                </Button>
              </>
            )}
          </div>
          <div>
            { props.isLoggedIn && (
            <Button color="inherit"
                    component={AdapterLink}
                    onClick={actions.logout}>
              Login
            </Button>
            )}

          </div>
        </Toolbar>
      </AppBar>
      <Container className={classes.body}>
        {props.children}
      </Container>
    </div>
  );
}

export default compose(
  connect(
    state => ({
      isLoggedIn: UserSelectors.isLoggedIn(state)
    }),
    dispatch => ({
      actions: bindActionCreators(UserActions, dispatch)
    })
  ),
  withStyles(styles)
)(NavPage);
