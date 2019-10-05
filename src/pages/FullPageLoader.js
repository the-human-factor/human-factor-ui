import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles({
  progress: {
    margin: 10,
  },
  container: {
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const FullPageLoader = props => {
  const classes = useStyles();
  return (
    <Container className={classes.container}>
      <CircularProgress className={classes.progress} />
    </Container>
  );
};

export default FullPageLoader;
