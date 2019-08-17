import React from "react";
import { compose, lifecycle, branch, renderNothing } from "recompose";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import * as ResponseActions from "modules/responses/actions";
import { selectors as ResponseSelectors } from "modules/responses";

const styles = theme => ({
  paper: {
    padding: 10,
    minWidth: 650,
  },
  videoContainer: {
    padding: 10,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center"
  },
  toggleButton: {
    width: 640,
    margin: 5
  }
});

class ResponseViewer extends React.Component {
  constructor(props) {
    super(props);
    this.videoChallenge = React.createRef();
    this.videoResponse = React.createRef();
  }

  startPlaying = () => {
    let self = this;
    self.videoChallenge.current.play();
    self.videoResponse.current.play();
    // Mute the response video until the challenge is played.
    // This should be done more react-ily.
    self.videoResponse.current.volume = 0;
    self.videoChallenge.current.onended = () => {
      self.videoResponse.current.volume = 1;
    };
  };

  render() {
    const { classes, response } = this.props;
    // TODO(Alex): I don't understand why the branch below doesn't make
    // this unncessary.
    if (!response) {
      return (
        <Paper className={classes.paper}>
          <Typography variant="h2">
            Unknown Challenge
          </Typography>
        </Paper>
      );
    }
    const challenge = response.challenge;

    return (
      <Paper className={classes.paper}>
        <Typography variant="h2">
          {response.user.name} responds to {challenge.title}
        </Typography>

        <Container className={classes.instructionsContainer}>
          <Typography variant="h3">Instructions:</Typography>
          <div>{challenge.instructions}</div>
        </Container>

        <Container className={classes.videoContainer}>
          <video width="250" ref={this.videoChallenge}>
            <source src={challenge.video.url} type="video/webm" />
          </video>
          <video width="250" ref={this.videoResponse}>
            <source src={response.video.url} type="video/webm" />
          </video>

          <Button className={classes.toggleButton}
                  onClick={this.startPlaying}
                  variant="contained"
                  color="primary">
            Play
          </Button>
        </Container>
      </Paper>
    );
  }
}

export default compose(
  connect(
    (state, ownProps) => ({
      isLoading: ResponseSelectors.isLoading(state),
      response: ResponseSelectors.response(state, ownProps)
    }),
    dispatch => ({
      actions: bindActionCreators(ResponseActions, dispatch)
    })
  ),
  lifecycle({
    componentDidMount() {
      this.props.actions.fetchResponses();
    }
  }),
  branch(props => props.isLoading, renderNothing), // TODO: replace with a loading component
  withStyles(styles)
)(ResponseViewer);

