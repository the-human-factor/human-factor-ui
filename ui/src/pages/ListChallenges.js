import React from "react";
import { Link } from "@reach/router";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import VideoPlaceholder from '../images/VideoPlaceholder.jpg'; // Tell Webpack this JS file uses this image
import HumanApi from "../api";

const AdapterLink = React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />);

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

const useChallengeStyles = makeStyles({
  challenge: {
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

function ChallengeCard(props) {
  const classes = useChallengeStyles();
  const link = "/challenge/" + props.id;
  return (
    <div className={classes.challenge} key={props.id}>
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

class ListChallenges extends React.Component {
  constructor(props) {
    super(props);
    this.api = new HumanApi();

    this.state = {
      status: 'WAITING_FOR_DATA',
      challenges: {},
      users: {}
    }

    this.gotChallenges = this.gotChallenges.bind(this);
    this.gotUsers = this.gotUsers.bind(this);

    //TODO: Probably put on ComponentWillMount?
    this.api.getChallenges(this.gotChallenges);
  }

  gotChallenges(result) {
    this.setState({
      challenges: result,
    });
    let usersIds = result.map(challenge => {return challenge.creator});
    this.api.getUsers(usersIds, this.gotUsers);
  }

  gotUsers(result) {
    let users = result.reduce((map, user) => {
      map[user.id] = user;
      return map;
    }, {});
    this.setState({
      users: users,
      status: 'GOT_DATA',
    });
  }

  render() {
    const { classes } = this.props;

    let challengeLinks = null;
    if (this.state.status === 'GOT_DATA') {
      const challenges = this.state.challenges;
      challengeLinks = challenges.map(challenge => {
        const user = this.state.users[challenge.creator];
        return (
          <ChallengeCard
            id={challenge.id}
            title={challenge.title}
            creator={user.name}
            instructions={challenge.instructions}
          />
        );
      }).reduce((prev, curr) => 
        [prev, <Divider variant="middle" className={classes.divider} />, curr]
      );
    }
    
    return (
      <Paper className={classes.paper}>
        <Typography variant="h2" className={classes.paperHeader}>
          Challenges
        </Typography>
        <Container>
          {challengeLinks ? challengeLinks : '...'}
        </Container>
      </Paper>
    );
  }
}

export default withStyles(styles)(ListChallenges);
