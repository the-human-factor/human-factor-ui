import React from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { navigate } from "@reach/router";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";

import VideoRecorder from "../components/VideoRecorder";
import BusyDialog from "../components/BusyDialog";
import * as ChallengeActions from "modules/challenges/actions";
import PaperPage from "components/PaperPage";

const styles = theme => ({
  videoContainer: {
    padding: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  toggleButton: {
    width: 640,
    margin: 5
  },
  formContainer: {
    padding: 10,
    width: 650,
    display: "flex",
    flexDirection: "column",
    alignItems: "left"
  },
  formControl: {
    display: "block",
    width: 400
  },
  fullWidth: {
    width: "100%"
  },
  textField: {
    marginRight: theme.spacing(5)
  }
});

class ChallengeRecorder extends React.Component {
  constructor(props) {
    super(props);
    this.videoRecorder = React.createRef();

    this.state = {
      status: VideoRecorder.STATUS.WAITING_FOR_CAMERA,
      toggleBehavior: () => {},
      toggleString: "...",
      formData: {
        gradingNotes: ""
      },
      readyToSubmit: false,
      waitingForSubmit: false
    };

    this.onStatusChange = this.onStatusChange.bind(this);
    this.submit = this.submit.bind(this);
    this.formChange = this.formChange.bind(this);
    this.updateReadyToSubmit = this.updateReadyToSubmit.bind(this);
  }

  onStatusChange(status) {
    let toggleString = "...";
    let toggleBehavior = () => {};
    if (!this.videoRecorder.current) {
      console.error("Can't change state of uninstatiated videoRecorder");
      return;
    }
    switch (status) {
      case VideoRecorder.STATUS.WAITING_FOR_CAMERA:
        break;
      case VideoRecorder.STATUS.READY_TO_RECORD:
        toggleString = "START RECORDING";
        toggleBehavior = this.videoRecorder.current.startRecording;
        break;
      case VideoRecorder.STATUS.RECORDING:
        toggleString = "STOP";
        toggleBehavior = this.videoRecorder.current.stopRecording;
        break;
      case VideoRecorder.STATUS.REPLAY:
        toggleString = "CLEAR RECORDING";
        toggleBehavior = this.videoRecorder.current.resetForRecording;
        break;
      default:
        throw new Error("Unknown State" + this.state.status);
    }
    this.setState(() => {
      return {
        status: status,
        toggleString: toggleString,
        toggleBehavior: toggleBehavior
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
    const valid = [
      "instructions",
      "title"
    ].reduce((acum, field) => {
      return acum && Boolean(this.state.formData[field]);
    });
    this.setState({
      readyToSubmit: valid && Boolean(this.videoRecorder.current.getBlob())
    });
  }

  submit = event => {
    event.preventDefault();
    let challenge = {
      ...this.state.formData,
      videoBlob: this.videoRecorder.current.getBlob()
    };
    this.setState({ waitingForSubmit: true });
    this.props.actions
      .createChallenge(challenge)
      .then(challenge => {
        this.setState({ waitingForSubmit: false });
        navigate(`/challenges/${challenge.id}`);
      })
      .catch(err => {
        this.setState({ waitingForSubmit: false });
        console.error(err);
        alert("Error submitting challenge");
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <PaperPage title="Record A Challenge">
        <Container className={classes.videoContainer}>
          <VideoRecorder ref={this.videoRecorder}
                         onStatusChange={this.onStatusChange}
                         allowReview/>
          <Button className={classes.toggleButton}
                  onClick={this.state.toggleBehavior}
                  variant="contained"
                  color="primary">
            {this.state.toggleString}
          </Button>
        </Container>
        <Container className={classes.formContainer}>
          <form onChange={this.formChange}>
            <TextField className={classes.textField}
                       name="title"
                       label="Challenge Title"
                       style={{ width: "100%" }}
                       margin="normal"/>

            <TextField name="instructions"
                       label="Instructions"
                       placeholder="This will be displayed to the person taking the challenge."
                       multiline
                       rows="6"
                       style={{ width: "100%" }}
                       margin="normal"/>

            <TextField name="gradingNotes"
                       label="Grading Notes"
                       placeholder="Instructions for the grader to know what to look for."
                       multiline
                       rows="6"
                       style={{ width: "100%" }}
                       margin="normal"/>

            <Button onClick={this.submit}
                    variant="contained"
                    color="primary"
                    disabled={!this.state.readyToSubmit}>
              Submit Challenge
            </Button>
          </form>
        </Container>
        <BusyDialog title="Submitting Challenge"
                    open={this.state.waitingForSubmit}/>
      </PaperPage>
    );
  }
}

export default compose(
  withStyles(styles),
  connect(
    () => ({}), // Nothing here for now
    dispatch => ({
      actions: bindActionCreators(ChallengeActions, dispatch)
    })
  )
)(ChallengeRecorder);
