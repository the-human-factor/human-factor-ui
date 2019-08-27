import React from "react";
import { navigate } from "@reach/router";
import { compose } from "recompose";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';

import AdapterLink from "components/AdapterLink";
import * as UserActions from "modules/user/actions";
import { selectors as UserSelectors } from "modules/user";

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

const MenuButtons = props => {
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}

const UserMenu = props => {
  const { actions } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const openMenu = (event) => setAnchorEl(event.currentTarget);

  const menuClose = () => setAnchorEl(null);

  const logout = () => {
    actions.logout();
    menuClose();
  };

  const profile = () => {
    navigate("/profile");
    menuClose();
  };

  return (
    <React.Fragment>
      <IconButton onClick={openMenu}
                  aria-label="account of current user"
                  aria-controls="primary-search-account-menu"
                  aria-haspopup="true"
                  color="inherit">
        <AccountCircle />
      </IconButton>
      <Menu anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id="app-bar-account-menu"
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={menuClose}>
        <MenuItem onClick={profile}>Profile</MenuItem>
        <MenuItem onClick={logout}>Log Out</MenuItem>
      </Menu>
    </React.Fragment>
  );
}

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
            { props.isLoggedIn && (<MenuButtons />)}
          </div>
          <div>
            { props.isLoggedIn && (<UserMenu actions={actions}/>)}
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
