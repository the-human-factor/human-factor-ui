import React, { useState } from "react";

import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { navigate } from "@reach/router";

import Button from "@material-ui/core/Button";
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Close from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import BusyDialog from "components/BusyDialog";
import VideoRecorder from "components/VideoRecorder";
import { ResponsesActions } from "modules/responses";
import { useWindowSize, useWindowListener, useRefWithListeners, useCallbackRef, useErrorContext } from "hooks";
import { calcDims } from "utils/videoDims";
import { MINI_VIDEO_SCALE } from "utils/constants";

const FOOTER_HEIGHT = 40;

// TODO: Replace mode in accordance with Leo's comment on the PR:
// It seems like you could refactor this into multiple components,
// one per "mode". That way a lot of the styling can be inside of
// the component. I see many switch statements on mode. That to me
// is code smell that you could break it apart.
const MODE = {
  INSTRUCTIONS_WAITING: "INSTRUCTIONS_WAITING",
  INSTRUCTIONS_READY: "INSTRUCTIONS_READY",
  WATCHING: "WATCHING",
  RESPONDING: "RESPONDING",
  FINISHED: "FINISHED"
}

const size100Percent = { width: "100%", height: "100%" };
const absoluteTopLeft = { position: "absolute", top: 0, left: 0 };
const absoluteTopRight = { position: "absolute", top: 0, right: 0 };
const absoluteBottomRight = { position: "absolute", bottom: 0, right: 0 };

const useStyles = makeStyles(theme => ({
  dialogPaper: {
    margin: 0,
    maxWidth: "100%",
    maxHeight: "100%",
    backgroundColor: "#000"
  },
  footer: {
    height: FOOTER_HEIGHT,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  footerText: {
    paddingTop: theme.spacing(1),
    color: theme.palette.grey[400],
  },
  frame: {
    position: "relative",
    width: props => props.width,
    height: props => props.height
  },
  closeButton: {
    zIndex: 70,
    color: theme.palette.grey[300],
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: props => props.allowClose ? "block" : "none",
    ...absoluteTopRight,
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    }
  },

  instructions: {
    zIndex: 60,
    backgroundColor: "#000",
    display: props => props.showInstructions ? "flex" : "none",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: theme.palette.grey[300],
    ...size100Percent,
    ...absoluteTopLeft
  },
  instructionsText: {
    margin: theme.spacing(7)
  },
  mainOverlay: {
    zIndex: 41,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: props => props.mainOverlay ? "block" : "none",
    ...size100Percent,
    ...absoluteTopLeft
  },
  miniOverlay: {
    zIndex: 51,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: props => props.miniOverlay ? "block" : "none",
    width: props => props.miniWidth,
    height: props => props.miniHeight,
    ...absoluteBottomRight
  },
  challenge: {
    backgroundColor: "#000",
    display: props => props.challengeIsMain ? "block" : "none",
    // TODO: Show the challenge when not main, and sync it with the response.
    zIndex: props => props.challengeIsMain ? 40 : 50,
    width: props => props.challengeIsMain ? props.width : props.miniWidth,
    height: props => props.challengeIsMain ? props.height : props.miniHeight,
    ...absoluteTopLeft,
  },
  response: {
    backgroundColor: "#000",
    zIndex: props => props.challengeIsMain ? 50 : 40,
    width: props => props.challengeIsMain ? props.miniWidth : props.width,
    height: props => props.challengeIsMain ? props.miniHeight : props.height,
    ...absoluteBottomRight,
  }
}));

const Assessment = props => {
  const { challengeId, challenge, open, onClose } = props;

  const dispatch = useDispatch();
  const actions = bindActionCreators(ResponsesActions, dispatch);
  const errorHandler = useErrorContext();
  
  const [mode, setMode] = useState(MODE.INSTRUCTIONS_WAITING);
  const [hasChallenge, setHasChallenge] = useState(false);
  const [canRecord, setCanRecord] = useState(false);
  const [waitingForSubmit, setWaitingForSubmit] = useState(false);
  const [responseVideoRef, responseVideo] = useCallbackRef();

  if (canRecord && hasChallenge && mode === MODE.INSTRUCTIONS_WAITING) {
    setMode(MODE.INSTRUCTIONS_READY);
  }

  // These will be set by useRefWithListeners.
  let challengeVideo = null;
  let challengeVideoRef = null;

  // Create all the dimensions based on what's available
  const windowSize = useWindowSize();
  const sourceDims = { width: 640, height: 480 }; // TODO: use real video dims.
  const frameDims = calcDims(sourceDims,
                             windowSize,
                             MINI_VIDEO_SCALE,
                             { extraHeight: FOOTER_HEIGHT + 4 });


  const canPlayThrough = event => setHasChallenge(true);

  const onStatusChange = (status) => {
    switch (status) {
      case VideoRecorder.STATUS.WAITING_FOR_CAMERA:
        setCanRecord(false);
        break;
      case VideoRecorder.STATUS.READY_TO_RECORD:
        setCanRecord(true);
        break;
      case VideoRecorder.STATUS.RECORDING:
        break;
      case VideoRecorder.STATUS.REPLAY:
        break;
      default:
        errorHandler(new Error(`Unknown VideoRecorder status: ${status}`),
                     "Unknown VideoRecorder status",
                     false);
        break;
    }
  };

  const tryAdvance = event => {
    switch(mode) {
      case MODE.INSTRUCTIONS_READY:
        challengeVideo.play();
        responseVideo.startRecording();
        setMode(MODE.WATCHING);
        break;
      case MODE.RESPONDING:
        responseVideo.stopRecording();
        setMode(MODE.FINISHED);
        break;
      default:
        break;
    }
  };

  const challengePlaybackEnded = event => {
    if (mode === MODE.WATCHING) {
      setMode(MODE.RESPONDING);
    } else {
      errorHandler(new Error(`Unexpected mode for challengePlaybackEnded, ${mode}`),
                   "Unexpected mode for challengePlaybackEnded",
                   false);
      throw new Error();
    }
  }
  
  const retake = () => {
    setMode(MODE.INSTRUCTIONS_WAITING);
    setCanRecord(false);
    responseVideo.resetForRecording();
  };

  const forceClose = event => {
    setMode(MODE.INSTRUCTIONS_WAITING);
    setCanRecord(false);
    event.stopPropagation();
    onClose();
  }

  const tryClose = () => {
    if (mode === MODE.INSTRUCTIONS_WAITING ||
        mode === MODE.INSTRUCTIONS_READY) {
      onClose();
    }
  };

  const submit = () => {
    setWaitingForSubmit(true);

    const response = {
      challengeId: challengeId,
      videoBlob: responseVideo.getBlob()
    };

    actions
      .createResponse(response)
      .then(newResponse => {
        setWaitingForSubmit(false);
        navigate(`/responses/${newResponse.id}`);
      })
      .catch(err => {
        setWaitingForSubmit(false);
        errorHandler(err,
                    "Error submitting response",
                    false);
        throw new Error(`Failed to submit response, ${mode}`);
      });
  };

  [challengeVideoRef, challengeVideo] = useRefWithListeners({
    canplaythrough: canPlayThrough,
    ended: challengePlaybackEnded
  });

  useWindowListener("keyup", (event) => {
    if (event.code === "Space") {
      tryAdvance();
    }
  });

  const classes = useStyles({
    showInstructions: mode === MODE.INSTRUCTIONS_WAITING || mode === MODE.INSTRUCTIONS_READY,
    mainOverlay: mode === MODE.RESPONDING,
    miniOverlay: mode === MODE.WATCHING,
    challengeIsMain: mode !== MODE.FINISHED,
    allowClose: mode === MODE.INSTRUCTIONS_WAITING || mode === MODE.INSTRUCTIONS_READY || mode === MODE.FINISHED,
    ...frameDims
  });

  const waitingMessage = (hasChallenge ? "" : "Loading video") +
                         (!hasChallenge && !canRecord ? " and " : "") +
                         (canRecord ? "" : "Starting Camera") + "...";

  
  const FOOTER_COMPONENT_FOR_MODE = {
    [MODE.INSTRUCTIONS_WAITING]: (
      <React.Fragment>
        <CircularProgress size={FOOTER_HEIGHT / 2} />
        <Typography variant="body1" className={classes.footerText}>
          {waitingMessage}
        </Typography>
      </React.Fragment>
    ),
    [MODE.INSTRUCTIONS_READY]: (
      <Typography variant="body1" className={classes.footerText}>
        Click card or hit &lt;space&gt; to begin.
      </Typography>
    ),
    [MODE.WATCHING]: (
      <Typography variant="body1" className={classes.footerText}>
        Respond when video stops...
      </Typography>
    ),
    [MODE.RESPONDING]: (
      <Typography variant="body1" className={classes.footerText}>
        Respond then click or hit &lt;space&gt; to finish.
      </Typography>
    ),
    [MODE.FINISHED]: (
      <ButtonGroup color="primary" fullWidth>
        <Button onClick={submit}>Submit</Button>
        <Button onClick={retake}>Retake</Button>
      </ButtonGroup>
    )
  }

  const Footer = () => FOOTER_COMPONENT_FOR_MODE[mode];

  return (
    <Dialog aria-labelledby="customized-dialog-title"
            open={open}
            onClose={tryClose}
            maxWidth={false}
            PaperProps={{className: classes.dialogPaper,
                         onClick: tryAdvance}}>
      <div>
        <div className={classes.frame}>
          <IconButton aria-label="close"
                      color="primary"
                      size="small"
                      className={classes.closeButton}
                      onClick={forceClose}>
            <Close fontSize="large" />
          </IconButton>
          <div className={classes.instructions}>
            <div>
              <Typography variant="h2" className={classes.instructionsText}>
                {challenge.title}
              </Typography>
              <Typography variant="body1" className={classes.instructionsText}>
                {challenge.instructions}
              </Typography>
              <Typography variant="body2" className={classes.instructionsText}>
                Respond after the shown video.
              </Typography>
            </div>
          </div>
          <div className={classes.mainOverlay} />>
          <video className={classes.challenge}
                 width={frameDims.width}
                 height={frameDims.height}
                 ref={challengeVideoRef}>
            <source src={challenge.video.url} type="video/webm" />
          </video>
          <div className={classes.miniOverlay} />
          <VideoRecorder className={classes.response}
                         width={frameDims.miniWidth}
                         height={frameDims.miniHeight}
                         ref={responseVideoRef}
                         onStatusChange={onStatusChange}
                         allowReview/>
        </div>
        <div className={classes.footer}>
          <Footer />
        </div>
      </div>
      <BusyDialog title="Submitting Response"
                  open={waitingForSubmit}/>
    </Dialog>
  );
}

export default Assessment;
