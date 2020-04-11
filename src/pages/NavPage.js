import React from 'react';
import { navigate } from '@reach/router';

import AccountCircle from '@material-ui/icons/AccountCircle';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
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
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  appBar: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    paddingTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    flexGrow: 1,
  },
  title: {
    marginTop: 0,
    marginLeft: theme.spacing(1),
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    flexGrow: 1000,
    padding: 0,
    margin: 0,
  },
  footer: {
    color: theme.palette.grey[700],
    textAlign: 'center',
    paddingBottom: theme.spacing(2),
    flexGrow: 1,
    '& a': {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    }
  },
  toolBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerDivider: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
}));

const MenuButtons = ({ isAdmin }) => {
  return (
    <React.Fragment>
      <Button color="inherit" component={AdapterLink} to="/role-play">
        Role Plays
      </Button>
      <Button color="inherit" component={AdapterLink} to="/responses">
        My Responses
      </Button>
      <Button color="inherit" component={AdapterLink} to="/role-play/create">
        Add Role Play
      </Button>

      {isAdmin && (
        <Button color="inherit" component={AdapterLink} to="/challengeAdmin">
          Admin
        </Button>
      )}
    </React.Fragment>
  );
};

const UserMenu = ({ user }) => {
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
        <MenuItem disabled={true}>{user.full_name}</MenuItem>
        <MenuItem onClick={profile}>Profile</MenuItem>
        <MenuItem onClick={logout}>Log Out</MenuItem>
      </Menu>
    </React.Fragment>
  );
};

const NavPage = props => {
  const classes = useStyles();
  const { isLoggedIn, isAdmin, user } = useSelectors(UserSelectors);

  return (
    <div className={classes.fullPage}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar className={classes.toolBar}>
          <Box color="white">
            <Link href="/" color="inherit" underline="none">
              <Typography variant="h1" className={classes.title}>
                The Human Factor
              </Typography>
            </Link>
            {isLoggedIn && <MenuButtons isAdmin={isAdmin} />}
          </Box>
          <div>{isLoggedIn && <UserMenu user={user} />}</div>
        </Toolbar>
      </AppBar>
      <div className={classes.body}>{props.children}</div>
      <Container className={classes.footer}>
        <Divider variant="middle" className={classes.footerDivider} />
        <Typography variant="body2">
          The Human Factor © 2020 \\ Works best in <b>Chrome</b>.
          <br />
          Contact:
          <Link href="mailto:exrhizo@gmail.com"> exrhizo@gmail.com</Link>
          \\
          <Link href="http://www.exrhizo.me/#!/thehumanfactor"> About</Link>
        </Typography>

      </Container>
    </div>
  );
};

export default NavPage;
