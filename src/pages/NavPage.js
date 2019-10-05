import React from 'react';
import { navigate } from '@reach/router';

import AccountCircle from '@material-ui/icons/AccountCircle';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

import AdapterLink from 'components/AdapterLink';
import { UserSelectors, UserActions } from 'modules/user';
import { useActions, useSelectors } from 'hooks';

const useStyles = makeStyles(theme => ({
  fullPage: {
    minHeight: '95vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  appBar: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    paddingTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  toolBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 0,
    margin: 0,
  },
  footer: {
    color: theme.palette.grey[700],
    textAlign: 'center',
    paddingBottom: theme.spacing(2),
  },
  footerDivider: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
}));

const MenuButtons = ({ isAdmin }) => {
  return (
    <React.Fragment>
      <Button color="inherit" component={AdapterLink} to="/challenges/create">
        Create Challenge
      </Button>
      <Button color="inherit" component={AdapterLink} to="/challenges">
        Challenges
      </Button>
      <Button color="inherit" component={AdapterLink} to="/responses">
        My Responses
      </Button>

      {isAdmin && (
        <Button color="inherit" component={AdapterLink} to="/admin">
          Admin
        </Button>
      )}
    </React.Fragment>
  );
};

const UserMenu = props => {
  const actions = useActions(UserActions);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const openMenu = event => setAnchorEl(event.currentTarget);
  const menuClose = () => setAnchorEl(null);

  const logout = () => {
    actions.logout();
    menuClose();
  };

  const profile = () => {
    navigate('/profile');
    menuClose();
  };

  return (
    <React.Fragment>
      <IconButton
        onClick={openMenu}
        aria-label="account of current user"
        aria-controls="primary-search-account-menu"
        aria-haspopup="true"
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id="app-bar-account-menu"
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={menuClose}
      >
        <MenuItem onClick={profile}>Profile</MenuItem>
        <MenuItem onClick={logout}>Log Out</MenuItem>
      </Menu>
    </React.Fragment>
  );
};

const NavPage = props => {
  const classes = useStyles();
  const { isLoggedIn, isAdmin } = useSelectors(UserSelectors);

  return (
    <div className={classes.fullPage}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar className={classes.toolBar}>
          <div>
            <Typography variant="h1" color="inherit">
              The Human Factor
            </Typography>
            {isLoggedIn && <MenuButtons isAdmin={isAdmin} />}
          </div>
          <div>{isLoggedIn && <UserMenu />}</div>
        </Toolbar>
      </AppBar>
      <div className={classes.body}>{props.children}</div>
      <Container className={classes.footer}>
        <Divider variant="middle" className={classes.footerDivider} />
        <Typography variant="body2">
          The Human Factor © 2019
          <br />
          <Link href="mailto:contact@thehumanfactor.ai">
            contact@thehumanfactor.ai
          </Link>
        </Typography>
      </Container>
    </div>
  );
};

export default NavPage;
