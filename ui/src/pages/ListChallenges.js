import React from "react";
import { Link } from "@reach/router";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import HumanApi from "../api";

const AdapterLink = React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />);

const styles = theme => ({
  paper: {
    padding: 10,
  }

});

const useStyles = makeStyles({
  challengeCard: {
    margin: 15,
    marginBottom: 30,
  }
});

function ChallengeCard(props) {
  const classes = useStyles();
  const link = "/challenge/" + props.id;
  return (
    <Card className={classes.challengeCard}>
      <Typography variant="h2">
          <Link component={AdapterLink} to={link}>{props.name}</Link>
      </Typography>
      <Typography variant="h3">
          Challenge {props.id}
      </Typography>
    </Card>
  )
}

class ListChallenges extends React.Component {
  constructor(props) {
    super(props);
    this.api = new HumanApi();
  }

  render() {
    const { classes } = this.props;
    let challengeLinks = this.api.getChallengeIds().map(
      (id) => {
        const challenge = this.api.getChallenge(id);
        return (
          <ChallengeCard id={id} name={challenge.name} />
        );
      }
    );

    return (
      <Paper className={classes.paper}>
        <Typography variant="h2">
          Challenges
        </Typography>

        <Container>
          {challengeLinks}
        </Container>
      </Paper>
    );
  }
}

export default withStyles(styles)(ListChallenges);
