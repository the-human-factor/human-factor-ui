import React from "react";

import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
  progress: {
    margin: 20,
    marginBottom: 30,
  },
  container: {
    padding: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
});

const BusyDialog = props => {
  const { title, open } = props;
  const classes = useStyles();

  return (
    <Dialog aria-labelledby="customized-dialog-title" open={open}>
      <DialogTitle id="customized-dialog-title">
        {title} 
      </DialogTitle>
      <DialogContent className={classes.container}>
        <CircularProgress size={70} className={classes.progress}/>
      </DialogContent>
    </Dialog>
  );
}

export default BusyDialog;
