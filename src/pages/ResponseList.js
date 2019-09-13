import React from "react";
import { Link } from "@reach/router";
import { compose, lifecycle, branch, renderNothing } from "recompose";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

// TODO: Tell Webpack this JS file uses this image
import VideoPlaceholder from "../images/VideoPlaceholder.jpg";
import * as ResponseActions from "modules/responses/actions";
import { selectors as ResponseSelectors } from "modules/responses";
import AdapterLink from "components/AdapterLink";
import PaperPage from "components/PaperPage";

const styles = theme => ({
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
  const thumbnail = (props.thumbnail) ? props.thumbnail : VideoPlaceholder;
  return (
    <div className={classes.item} key={props.id}>
      <img className={classes.preview}
           src={thumbnail}
           alt="placeholder"/>
      <div className={classes.text}>
        <Typography variant="h4">
          <Link component={AdapterLink} to={link}>
            {props.challengeTitle}
          </Link>
        </Typography>
        <Typography variant="h5">Responder: {props.responder}</Typography>
      </div>
    </div>
  );
};

const ResponseList = props => {
  const { classes, responses } = props;
  let responseItems = Object.values(responses).map(response => (
    <React.Fragment key={response.id}>
      <ResponseListItem id={response.id}
                        challengeTitle={response.challenge.title}
                        responder={response.user.full_name}
                        thumbnail={response.video.thumbnail_url}/>
      <Divider variant="middle" className={classes.divider} />
    </React.Fragment>
  ));

  return (
    <PaperPage title="Responses">
      <Container>{responseItems}</Container>
    </PaperPage>
  )
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
