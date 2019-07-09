import React from "react";
import { Link } from "@reach/router";
import { compose, lifecycle, branch, renderNothing } from "recompose";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import * as ChallengeActions from "modules/challenges/actions";
import { selectors as ChallengeSelectors } from "modules/challenges";

const AdapterLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} {...props} />
));

const styles = theme => ({
  paper: {
    padding: 10
  }
});

const useStyles = makeStyles({
  challengeCard: {
    margin: 15,
    marginBottom: 30
  }
});

function ChallengeCard(props) {
  const classes = useStyles();
  const link = "/challenges/" + props.id;
  return (
    <Link component={AdapterLink} to={link}>
      <Card className={classes.challengeCard}>
        <Typography variant="h2">{props.title}</Typography>
        <Typography variant="h3">Challenge {props.id}</Typography>
      </Card>
    </Link>
  );
}

const ChallengeList = props => {
  const { classes, challenges } = props;
  let challengeLinks = Object.values(challenges).map(challenge => (
    <ChallengeCard
      id={challenge.id}
      key={challenge.id}
      title={challenge.title}
    />
  ));

  return (
    <Paper className={classes.paper}>
      <Typography variant="h2">Challenges</Typography>
      <Container>{challengeLinks}</Container>
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
