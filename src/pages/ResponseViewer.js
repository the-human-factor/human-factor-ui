import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import { Button, Container, Paper, Typography } from '@material-ui/core';

import { ResponsesSelectors, ResponsesActions } from 'modules/responses';
import PaperPage from 'components/PaperPage';
import { useActions, useCallbackRef, useErrorContext } from 'hooks';

const useStyles = makeStyles(theme => ({
  videoContainer: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleCenterer: {
    width: '100%',
    textAlign: 'center',
  },
  toggleButton: {
    width: '80%',
    margin: theme.spacing(2),
  },
}));

const ResponseViewer = props => {
  const classes = useStyles();
  const [videoChallengeRef, videoChallenge] = useCallbackRef();
  const [videoResponseRef, videoResponse] = useCallbackRef();

  const isLoading = useSelector(state => ResponsesSelectors.isLoading(state));
  const isLoaded = useSelector(state => ResponsesSelectors.isLoaded(state));
  const response = useSelector(state =>
    ResponsesSelectors.response(state, props)
  );
  const challenge = (response || {}).challenge;
  const actions = useActions(ResponsesActions);
  const errorHandler = useErrorContext();

  useEffect(
    () => {
      if (!isLoaded && !isLoading) {
        actions.fetchResponses().catch(error => {
          errorHandler(error, 'Failed to load challenges', true);
        });
      }
    },
    // TODO: Stop the warning from happening.
    [isLoaded, isLoading] // This wouldn't make sense to include other vars.
  );

  const startPlaying = () => {
    videoChallenge.play();
    videoResponse.play();
    // Mute the response video until the challenge is played.
    // This should be done more react-ily.
    videoResponse.volume = 0;
    videoChallenge.onended = () => {
      videoResponse.volume = 1;
    };
  };

  if (!response || response === undefined) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h2">Unknown Challenge</Typography>
      </Paper>
    );
  }

  return (
    <PaperPage
      superTitle={`${response.user.full_name} responds to`}
      title={challenge.title}
    >
      <Container className={classes.instructionsContainer}>
        <Typography variant="h4">Instructions:</Typography>
        <Typography variant="body1">{challenge.instructions}</Typography>
      </Container>

      <div className={classes.videoContainer}>
        <video width="350" ref={videoChallengeRef}>
          <source src={challenge.video.url} type="video/webm" />
        </video>
        <video width="350" ref={videoResponseRef}>
          <source src={response.video.url} type="video/webm" />
        </video>
      </div>

      <div className={classes.toggleCenterer}>
        <Button
          className={classes.toggleButton}
          onClick={startPlaying}
          variant="contained"
          color="primary"
        >
          Play
        </Button>
      </div>
    </PaperPage>
  );
};

export default ResponseViewer;
