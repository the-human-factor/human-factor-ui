import React, { useEffect } from "react";


import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
// import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { makeStyles } from '@material-ui/styles';
import { red, green } from '@material-ui/core/colors';

import InstructionsListen from "../images/InstructionsListen.jpg";
import InstructionsRespond from "../images/InstructionsRespond.jpg";
import PaperPage from "components/PaperPage";
import FullPageLoader from "pages/FullPageLoader";
import Assessment from "components/Assessment/Assessment";
import { ChallengesSelectors, ChallengesActions } from "modules/challenges";
import { useActions, useSelectors } from "hooks";

const useStyles = makeStyles(theme => ({
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  bigButton: {
    fontSize: "3.5rem",
    lineHeight: 1,
    margin: theme.spacing(3),
    marginBottom: theme.spacing(8),
    [theme.breakpoints.between('xs', 'sm')]: {
      width: "250px",
      fontSize: "2.5rem"
    },
    [theme.breakpoints.up('md')]: {
      width: "400px"
    },
  },
  red: {
    color: red[500]
  },
  green: {
    color: green[500]
  },
  instructionsImage: {
    maxWidth: '400px',
    width: '100%'
  },
  alignLeft: {
    alignSelf: 'flex-start'
  }
}));

const TakeChallenge = props => {
  const { challengeId } = props;
  const { challenge,
          isLoaded,
          isLoading } = useSelectors(ChallengesSelectors,
                                     { challengeId: challengeId });

  const actions = useActions(ChallengesActions);

  const [openAssessment, setOpenAssessment] = React.useState(false);

  useEffect(
    () => {
      if (!isLoaded && !isLoading) {
        actions.fetchChallenges(); // This is overkill, we could just fetch the single challenge that is being responded
      }
    },
    [isLoaded, isLoading, actions]
  );

  const classes = useStyles();

  const launchChallenge = () => setOpenAssessment(true);
  const handleClose = () => setOpenAssessment(false);

  // const checkedCamera = true;
  // const cameraStyle = checkedCamera ? classes.green : classes.red;

  // const checkCamera = () => {
  //   console.log("Is your camera working?");
  // }

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!challenge || challenge === undefined) {
      return (
        <PaperPage title="Missing Challenge">
          <Typography variant="body1">
            Challenge 404
          </Typography>
        </PaperPage>
      );
    }

  return (
    <React.Fragment>
      <PaperPage title={challenge.title} superTitle="Challenge:">
        <div className={classes.content}>
          <Button onClick={launchChallenge}
                  size="large"
                  variant="contained"
                  color="secondary"
                  className={classes.bigButton}>
            Take Challenge
          </Button>
          <Typography variant="h2" className={classes.alignLeft}>
            Instructions
          </Typography>
          <Typography variant="h4" className={classes.alignLeft}>
            Listen to the challenge
          </Typography>
          <img className={classes.instructionsImage}
             src={InstructionsListen}
             alt="Listening to the challenge"/>
          <Typography variant="h4" className={classes.alignLeft}>
            Respond immediatly when it finishes
          </Typography>
          <img className={classes.instructionsImage}
             src={InstructionsRespond}
             alt="Responding to the challenge"/>
        </div>
      </PaperPage>
      <Assessment challengeId={challengeId}
                  challenge={challenge}
                  open={openAssessment}
                  onClose={handleClose} />
    </React.Fragment>
  );
};

// TODO: Implement this:
//   <Button onClick={checkCamera}>
//     <FiberManualRecordIcon className={cameraStyle}/>
//     Camera / Mic Check
//   </Button>

export default TakeChallenge;