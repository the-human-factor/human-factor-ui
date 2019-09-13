import React from "react";
import { Link } from "@reach/router";
import { compose, lifecycle, branch, renderNothing } from "recompose";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";

// TODO: Tell Webpack this JS file uses this image
import VideoPlaceholder from '../images/VideoPlaceholder.jpg';
import * as ChallengeActions from "modules/challenges/actions";
import { selectors as ChallengeSelectors } from "modules/challenges";
import AdapterLink from "components/AdapterLink";
import PaperPage from "components/PaperPage";

const styles = theme => ({
  divider: {
    margin: 15,
    marginBottom: 30,
  }
});

const useItemStyles = makeStyles({
  item: {
    display: 'flex',
    flexDirection: 'row',
  },
  text: {
    padding: 10,
    paddingTop: 0
  },
  preview: {
    width: 100,
    height: 75,
    backgroundColor: '#333'
  },
});

function ChallengeListItem(props) {
  const classes = useItemStyles();
  const link = "/challenges/" + props.id;
  const thumbnail = (props.thumbnail) ? props.thumbnail : VideoPlaceholder;
  return (
    <div className={classes.item}>
      <img className={classes.preview} src={thumbnail} alt="placeholder"/>
      <div className={classes.text}>
        <Typography variant="h4">
            <Link component={AdapterLink} to={link}>{props.title}</Link>
        </Typography>
        <Typography variant="h5">
          Created by: {props.creator}
        </Typography>
        <Typography variant="body1">
          {props.instructions}
        </Typography>
      </div>
    </div>
  )
}

const ChallengeList = props => {
  const { classes, challenges } = props;
  let challengeItems = Object.values(challenges).map(challenge => (
    <React.Fragment key={`${challenge.id}`}>
      <ChallengeListItem id={challenge.id}
                         title={challenge.title}
                         creator={challenge.user.full_name}
                         instructions={challenge.instructions}
                         thumbnail={challenge.video.thumbnail_url}/>
      <Divider variant="middle"
               className={classes.divider}/>
    </React.Fragment>
  ))

  return (
    <PaperPage title="Challenges">
      <Container>
        {challengeItems}
      </Container>
    </PaperPage>
  );
};

export default compose(
  connect(
    state => ({
      isLoading: ChallengeSelectors.isLoading(state),
      challenges: ChallengeSelectors.challenges(state)
    }),
    dispatch => ({
      actions: bindActionCreators(ChallengeActions, dispatch)
    })
  ),
  lifecycle({
    componentDidMount() {
      this.props.actions.fetchChallenges();
    }
  }),
  branch(props => props.isLoading, renderNothing), // TODO: replace with a loading component
  withStyles(styles)
)(ChallengeList);
