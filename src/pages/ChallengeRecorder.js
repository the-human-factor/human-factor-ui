import React, { useState } from 'react';

import { Form, Field } from 'react-final-form';
import { navigate } from '@reach/router';

import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button, Container, TextField } from '@material-ui/core';

import BusyDialog from '../components/BusyDialog';
import PaperPage from 'components/PaperPage';
import VideoRecorder from '../components/VideoRecorder';
import { ChallengesActions } from 'modules/challenges';
import {
  renderInputWithHelper,
  FileInput,
} from 'components/wrappableMuiFormElems';
import { required } from 'components/formValidation';
import {
  useActions,
  useCallbackRef,
  useWindowSize,
  useWindowListener,
  useErrorContext,
} from 'hooks';
import { calcDims } from 'utils/videoDims';
import { MINI_VIDEO_SCALE } from 'utils/constants';

const absoluteTopLeft = { position: 'absolute', top: 0, left: 0 };
const absoluteBottomRight = { position: 'absolute', bottom: 0, right: 0 };
const flexColumn = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
};
const flexRow = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
};

const useStyles = makeStyles(theme => ({
  videoAndSideBar: {
    ...flexRow,
  },
  notes: {
    display: props => (props.showNotes ? 'block' : 'none'),
  },
  buttons: {
    width: props => props.width,
    ...flexRow,
  },
  videoWithButton: {
    padding: theme.spacing(2),
    ...flexColumn,
  },
  toggleButton: {
    margin: theme.spacing(1),
    marginLeft: 0,
    width: '100%',
  },
  notesButton: {
    margin: theme.spacing(1),
    marginRight: 0,
    width: theme.spacing(2),
  },
  formContainer: {
    width: props => props.width,
  },
  pointersContainer: {
    marginTop: theme.spacing(5),
    padding: theme.spacing(2),
    width: props => props.width,
  },
  textField: {
    width: '100%',
    marginRight: theme.spacing(5),
  },
  submit: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  videoFrame: {
    position: 'relative',
    width: props => props.width,
    height: props => props.height,
  },
  recorder: {
    backgroundColor: '#000',
    zIndex: props => 40,
    width: props => props.width,
    height: props => props.height,
    ...absoluteTopLeft,
  },
  miniOverlay: {
    zIndex: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: props => (props.showMiniOverlay ? 'block' : 'none'),
    width: props => props.miniWidth,
    height: props => props.miniHeight,
    ...absoluteBottomRight,
  },
  list: {
    fontFamily: theme.typography.fontFamily,
    listStyleType: 'disc',
    paddingLeft: theme.spacing(3),
    margin: theme.spacing(1),
    '& li': {
      marginTop: theme.spacing(1),
    },
  },
}));

const ChallengeForm = ({ classes, onSubmit, validate, onFileChange }) => (
  <Form
    onSubmit={onSubmit}
    validate={validate}
    initialValues={{ instructions: '' }}
    render={({ handleSubmit, submitting, pristine, valid, values }) => (
      <form noValidate>
        <Field
          className={classes.textField}
          name="title"
          label="Challenge Title"
          component={renderInputWithHelper}
          validate={required}
        />

        <Field
          className={classes.textField}
          name="instructions"
          label="Instructions"
          placeholder="This will be displayed to the person taking the challenge."
          multiline
          rows="6"
          component={renderInputWithHelper}
        />

        <Field
          className={classes.textField}
          name="uploadExisting"
          label="Record a video above, or"
          component={FileInput}
          onFileChange={onFileChange}
          type="file"
          accept="video/*"
        />

        <Button
          className={classes.submit}
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={pristine || !valid || submitting}
        >
          Submit Challenge
        </Button>

        <BusyDialog title="Submitting Challenge" open={submitting} />
      </form>
    )}
  />
);

const ChallengeRecorder = props => {
  const actions = useActions(ChallengesActions);
  const errorHandler = useErrorContext();
  const [videoRecorderRef, videoRecorder] = useCallbackRef();

  // TODO: Validate on setStatus
  const [status, setStatus] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [uploadFile, setUploadFile] = useState();

  // Create all the dimensions based on what's available
  const windowSize = useWindowSize();
  const sourceDims = { width: 640, height: 480 }; // TODO: use real video dims.
  const frameDims = calcDims(sourceDims, windowSize, MINI_VIDEO_SCALE, {
    extraWidth: 60,
    extraHeight: 30,
  });

  let toggleString = '...';
  let toggleBehavior = () => {};
  let recorderReplay = false;

  switch (status) {
    case VideoRecorder.STATUS.READY_TO_RECORD:
      toggleString = 'START RECORDING';
      toggleBehavior = videoRecorder.startRecording;
      break;
    case VideoRecorder.STATUS.RECORDING:
      toggleString = 'STOP';
      toggleBehavior = videoRecorder.stopRecording;
      break;
    case VideoRecorder.STATUS.REPLAY:
      toggleString = 'CLEAR RECORDING';
      toggleBehavior = videoRecorder.resetForRecording;
      recorderReplay = true;
      break;
    default:
      break;
  }

  useWindowListener('keydown', event => {
    if (event.code === 'Space') {
      const nodeName = event.target.nodeName;
      if (!recorderReplay && nodeName !== 'INPUT' && nodeName !== 'TEXTAREA') {
        toggleBehavior();
        event.preventDefault();
      }
    }
  });

  const videoValidate = values => {
    if (!recorderReplay && uploadFile === undefined) {
      return { error: 'this is not shown' };
    }
    if (recorderReplay && uploadFile !== undefined) {
      // TODO: disable the other option, when one is used.
      return { uploadExisting: 'Error, Uploaded and Recorded video both set.' };
    }
  };

  const onFileChange = files => {
    if (files.length === 1) {
      setUploadFile(files[0]);
    } else {
      setUploadFile(undefined);
    }
  };

  const submitChallenge = formValues => {
    const videoBlob = recorderReplay ? videoRecorder.getBlob() : uploadFile;
    return actions
      .createChallenge({
        ...formValues,
        videoBlob: videoBlob,
      })
      .then(challenge => {
        navigate(`/challenges/${challenge.id}`);
      })
      .catch(err => {
        errorHandler(err, 'Error submitting challenge', true);
      });
  };

  const classes = useStyles({
    showMiniOverlay: !recorderReplay,
    showNotes: showNotes,
    ...frameDims,
  });

  const toggleShowNotes = () => setShowNotes(!showNotes);

  return (
    <PaperPage title="Record A Challenge">
      <div className={classes.videoAndSideBar}>
        <Container className={classes.videoWithButton}>
          <div className={classes.videoFrame}>
            <VideoRecorder
              className={classes.recorder}
              ref={videoRecorderRef}
              onStatusChange={setStatus}
              width={frameDims.width}
              height={frameDims.height}
              allowReview
            />
            <div className={classes.miniOverlay} />
          </div>

          <div className={classes.buttons}>
            <Button
              className={classes.toggleButton}
              onClick={toggleBehavior}
              variant="contained"
              color="primary"
            >
              {toggleString}
            </Button>
            <Button
              className={classes.notesButton}
              onClick={toggleShowNotes}
              variant="contained"
              color="primary"
            >
              {' '}
              {showNotes ? '<' : '>'}{' '}
            </Button>
          </div>
        </Container>

        <TextField
          className={classes.notes}
          name="actorNotes"
          label="Actor Notes"
          placeholder="These are not saved. For use during recording"
          multiline
          rows="23"
          style={{ width: '100%' }}
          margin="normal"
        />
      </div>

      <Container className={classes.formContainer}>
        <ChallengeForm
          classes={classes}
          onFileChange={onFileChange}
          onSubmit={submitChallenge}
          validate={videoValidate}
        />
      </Container>
      <Container className={classes.pointersContainer}>
        <Typography variant="h4">Pointers</Typography>
        <ul className={classes.list}>
          <li>Imagine the person you are talking to, they are the camera.</li>
          <li>
            Aim for 10-15 second length, if it's really short, that can be
            great!
          </li>
          <li>
            Have the video be general and we can make the instructions detailed.
          </li>
          <li>
            It can be powerful to end on confusion, disconnection or defeat.
          </li>
          <li>
            Use <em>&lt;space&gt;</em> to start and stop recording.
          </li>
        </ul>
        <Typography variant="body1">
          If there are issues or you don't see you're webcam image,{' '}
          <b>try Chrome.</b>
        </Typography>
      </Container>
    </PaperPage>
  );
};

export default ChallengeRecorder;
