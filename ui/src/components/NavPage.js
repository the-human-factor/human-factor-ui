import React from 'react';
import { Link } from "@reach/router";
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  toolbar: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    'padding-top': 5,
    display: 'flex',
    'flex-direction': 'row',
    'justify-content': 'space-between',
  },
}));

export default function NavPage(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <div>
            <Typography variant="h3" color="inherit" className={classes.title}>
              The Human Factor
            </Typography>
            <Button color="inherit" to="/challenge/create">Create A Challenge</Button>
            <Button color="inherit" to="/challenge/list">List Challenges</Button>
          </div>
          <div>
            <Button color="inherit" to="/login">Login</Button>
          </div>
        </Toolbar>
      </AppBar>
      {props.children}
    </div>
  );
}
