import React from "react";
import { Link } from "@reach/router";
import { compose, lifecycle, branch, renderNothing } from "recompose";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

// TODO: Tell Webpack this JS file uses this image
import VideoPlaceholder from "../images/VideoPlaceholder.jpg";
import * as ResponseActions from "modules/responses/actions";
import { selectors as ResponseSelectors } from "modules/responses";

const AdapterLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} {...props} />
));

const styles = theme => ({
  paper: {
    padding: 10
  },
  paperHeader: {
    margin: 15,
    marginBottom: 30
  },
  divider: {
    margin: 15,
    marginBottom: 30
  }
});

const useItemStyles = makeStyles({
  item: {
    display: "flex",
    flexDirection: "row"
  },
  text: {
    padding: 10
  },
  preview: {
    width: 100,
    height: 75,
    backgroundColor: "#333"
  }
});

const ResponseListItem = props => {
  const classes = useItemStyles();
  const link = "/responses/" + props.id;
  return (
    <div className={classes.item} key={props.id}>
      <img
        className={classes.preview}
        src={VideoPlaceholder}
        alt="placeholder"
      />
      <div className={classes.text}>
        <Typography variant="h2">
          <Link component={AdapterLink} to={link}>
            {props.challengeTitle}
          </Link>
        </Typography>
        <Typography variant="h3">Responder: {props.user}</Typography>
      </div>
    </div>
  );
};

const ResponseList = props => {
  const { classes, responses } = props;
  let responseItems = Object.values(responses).map(response => (
    <React.Fragment key={response.id}>
      <ResponseListItem
        id={response.id}
        challengeTitle={response.challenge.title}
        user={response.user.name}
      />
      <Divider variant="middle" className={classes.divider} />
    </React.Fragment>
  ));

  return (
    <Paper className={classes.paper}>
      <Typography variant="h2" className={classes.paperHeader}>
        Responses
      </Typography>
      <Container>{responseItems}</Container>
    </Paper>
  );
};

export default compose(
  connect(
    state => ({
      isLoading: ResponseSelectors.isLoading(state),
      responses: ResponseSelectors.responses(state)
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
)(ResponseList);
