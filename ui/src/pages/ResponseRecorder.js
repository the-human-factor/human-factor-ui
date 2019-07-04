import React from "react";

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import VideoRecorder from "../components/VideoRecorder";
import HumanApi from "../api";

const styles = theme => ({
  paper: {
    padding: 10,
    minWidth: 650,
  },
  instructionsContainer: {
    padding: 10,
    width: 650,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
  },
  videoContainer: {
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoOverlay: {
    width: 640,
    height: 480,
    position: 'relative',
  },
  responseVideo: {
    backgroundColor: '#FFF',
    bottom: 0,
    right: 0,
    position: 'absolute',
  },
  challengeVideo: {
    position: 'absolute',
    bottom: 0,
  },
  toggleButton: {
    width: 640,
    margin: 5,
  },
  formContainer: {
    padding: 10,
    width: 650,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
  },
  formControl: {
    display: 'block',
    width: 400,
  },
  fullWidth: {
    width: "100%",
  },
  textField: {
    marginRight: theme.spacing(5),
  }
});

class ResponseRecorder extends React.Component {
  constructor(props) {
    super(props);
    this.challengeVideo = React.createRef();
    this.videoRecorder = React.createRef();

    this.api = new HumanApi();

    this.state = {
      challenge: this.api.getChallenge(this.props.challengeId),
      formData: {
        id: this.props.challengeId,
      },
      status: VideoRecorder.STATUS.WAITING_FOR_CAMERA,
      readyToSubmit: false,
      toggleBehavior: () => {},
      toggleString: "...",
      toggleDisabled: true,
    }

    this.onStatusChange = this.onStatusChange.bind(this);
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.submit = this.submit.bind(this);
    this.formChange = this.formChange.bind(this);
    this.updateReadyToSubmit = this.updateReadyToSubmit.bind(this);

  }

  startRecording() {
    this.challengeVideo.current.play();
    this.videoRecorder.current.startRecording();
  }

  stopRecording() {
    this.challengeVideo.current.pause();
    this.challengeVideo.current.currentTime = 0;
    this.challengeVideo.current.play();
    this.videoRecorder.current.stopRecording();
  }

  onStatusChange(status) {
    let toggleString = '...';
    let toggleBehavior = () => {};
    let toggleDisabled = false;
    switch(status) {
      case VideoRecorder.STATUS.WAITING_FOR_CAMERA:
        toggleString = 'START CHALLENGE';
        toggleDisabled = true;
        break;
      case VideoRecorder.STATUS.READY_TO_RECORD:
        toggleString = 'START CHALLENGE';
        toggleBehavior = this.startRecording;
        break;
      case VideoRecorder.STATUS.RECORDING:
        toggleString = 'FINISH';
        toggleBehavior = this.stopRecording;
        break;
      case VideoRecorder.STATUS.REPLAY:
        toggleDisabled = true;
        break;
      default:
        throw new Error("Unknown State" + this.state.status);
    }
    this.setState(() => {
      return { 
        status: status,
        toggleString: toggleString,
        toggleBehavior: toggleBehavior,
        toggleDisabled: toggleDisabled,
      };
    });
    this.updateReadyToSubmit();
  }

  formChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      formData: {
        ...this.state.formData,
        [name]: value
      }
    });
    // Todo: There is a bug where this doesn't update correctly,
    // because the state isn't updated yet.
    this.updateReadyToSubmit();
  }

  updateReadyToSubmit() {
    const valid = ["name", "email", "notes"].reduce((acum, field) => {
      return acum && Boolean(this.state.formData[field]);
    });
    this.setState({
      readyToSubmit: valid && Boolean(this.videoRecorder.current.getBlob()),
    });
  }

  submit(event) {
    event.preventDefault();
    const formData = this.state.formData;
    console.log(formData);
    console.log(this.videoRecorder.current.getBlob());
  }

  render() {
    const { classes } = this.props;
    if (this.challenge == null) {
      return (
        <Paper className={classes.paper}>
          <Typography variant="h2">
            Loading
          </Typography>
        </Paper>
      )
    }

    return (
      <Paper className={classes.paper}>
        <Typography variant="h2">
          Respond to challenge {this.state.challenge.id}:&nbsp;
          {this.state.challenge.title}
        </Typography>

        <Container className={classes.instructionsContainer}>
          <Typography variant="h3">Instructions:</Typography>
          <div>{this.state.challenge.instructions}</div>
        </Container>

        <Container className={classes.videoContainer}>
          <div className={classes.videoOverlay}>
            <video
              width="640"
              ref={this.challengeVideo}
              className={classes.challengeVideo}
            > 
              <source src ={this.state.challenge.link} type="video/webm" />
            </video>
            <div className={classes.responseVideo}>
            <VideoRecorder
              width="200"
              height="150"
              ref={this.videoRecorder}
              onStatusChange={this.onStatusChange}
            />
            </div>
          </div>
          <Button
            className={classes.toggleButton}
            onClick={this.state.toggleBehavior}
            variant="contained"
            color="primary"
            disabled={this.state.toggleDisabled}
          >
            {this.state.toggleString}
          </Button>
        </Container>

        <Container className={classes.formContainer}>
          <form className="recordForm" onChange={this.formChange}>

            <TextField
              className={classes.textField}
              name="name"
              label="Name"
              defaultValue=""
              margin="normal"
            />

            <TextField
              className={classes.textField}
              name="email"
              label="Email Address"
              margin="normal"
            />

            <TextField
              name="notes"
              label="Notes"
              multiline
              rows="6"
              style={{width: "100%"}}
              margin="normal"
            />

            <Button onClick={this.submit} variant="contained" color="primary" disabled={!this.state.readyToSubmit}>
              Submit Response
            </Button>
          </form>
        </Container>

      </Paper>
    );
  }
}

export default withStyles(styles)(ResponseRecorder);
