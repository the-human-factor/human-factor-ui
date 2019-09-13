import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
// import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { makeStyles } from '@material-ui/styles';
import { red, green } from '@material-ui/core/colors';

import PaperPage from "components/PaperPage";
import FullPageLoader from "pages/FullPageLoader";
import Assessment from "components/Assessment/Assessment";
import * as ChallengeSelectors from "modules/challenges/selectors";
import * as ChallengeActions from "modules/challenges/actions";

const useStyles = makeStyles(theme => ({
  buttons: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  bigButton: {
    fontSize: "3.5rem",
    lineHeight: 1,
    margin: theme.spacing(3),
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
  }
}));

const TakeChallenge = props => {
  const { challengeId } = props;
  const challenge = useSelector(
    state => ChallengeSelectors.challenge(state, {challengeId: challengeId})
  );
  const isLoaded = useSelector(state => ChallengeSelectors.isLoaded(state));
  const isLoading = useSelector(state => ChallengeSelectors.isLoading(state));
  const dispatch = useDispatch();
  const actions = bindActionCreators(ChallengeActions, dispatch);

  const [openAssessment, setOpenAssessment] = React.useState(false);

  useEffect(() => {
    if (!isLoaded && !isLoading) {
      actions.fetchChallenges(); // This is overkill, we could just fetch the single challenge that is being responded
    }
  });

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
        <div className={classes.buttons}>
          <Button onClick={launchChallenge}
                  size="large"
                  variant="contained"
                  color="secondary"
                  className={classes.bigButton}>
            Take Challenge
          </Button>
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