import React from "react";
import { useSelector } from "react-redux";

import { makeStyles } from '@material-ui/styles';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import { selectors as UserSelectors } from "modules/user";

const useStyles = makeStyles({
  paper: {
    padding: 10,
    minWidth: 650,
  },
});

const Profile = () => {
  const classes = useStyles();
  const user = useSelector(state => UserSelectors.user(state));

  console.log(user);

  return (
    <Paper className={classes.paper}>
        <Typography variant="h2">
          Logged In As: {user.full_name}
        </Typography>
    </Paper>
  );
};

export default Profile;
