import React from "react";
import { Link } from "@reach/router";
import { compose, lifecycle, branch, renderNothing } from "recompose";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Divider from '@material-ui/core/Divider';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

// TODO: Tell Webpack this JS file uses this image
import VideoPlaceholder from '../images/VideoPlaceholder.jpg';
import * as ChallengeActions from "modules/challenges/actions";
import { selectors as ChallengeSelectors } from "modules/challenges";

const AdapterLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} {...props} />
));

const styles = theme => ({
  paper: {
    padding: 10,
  },
  paperHeader: {
    margin: 15,
    marginBottom: 30,
  },
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
    padding: 10
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
  return (
    <div className={classes.item}>
      <img className={classes.preview} src={VideoPlaceholder} alt="placeholder"/>
      <div className={classes.text}>
        <Typography variant="h2">
            <Link component={AdapterLink} to={link}>{props.title}</Link>
        </Typography>
        <Typography variant="h3">
          Created by: {props.creator}
        </Typography>
        <div>
          {props.instructions}
        </div>
      </div>
    </div>
  )
}

const ChallengeList = props => {
  const { classes, challenges } = props;
  let challengeItems = Object.values(challenges).map(challenge => (
    <React.Fragment key={`${challenge.id}`}>
      <ChallengeListItem
        id={challenge.id}
        title={challenge.title}
        creator={challenge.name}
        instructions={challenge.instructions}
      />
      <Divider
        variant="middle"
        className={classes.divider}
      />
    </React.Fragment>
  ))

  return (
    <Paper className={classes.paper}>
      <Typography variant="h2" className={classes.paperHeader}>
          Challenges
        </Typography>
      <Container>
        {challengeItems}
      </Container>
    </Paper>
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
