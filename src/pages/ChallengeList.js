import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

// TODO: Tell Webpack this JS file uses this image
import VideoPlaceholder from '../images/VideoPlaceholder.jpg';
import { ChallengesSelectors, ChallengesActions } from 'modules/challenges';
import AdapterLink from 'components/AdapterLink';
import PaperPage from 'components/PaperPage';
import { useErrorContext } from 'hooks';

const useStyles = makeStyles(theme => ({
  list: {
    maxWidth: theme.breakpoints.width('md'),
    [theme.breakpoints.down('md')]: {
      maxWidth: theme.breakpoints.width('sm'),
    },
  },
  divider: {
    margin: 15,
    marginBottom: 30,
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
  },
  text: {
    padding: 10,
    paddingTop: 0,
  },
  preview: {
    backgroundColor: '#333',
    width: 200,
    height: 150,
    [theme.breakpoints.down('md')]: {
      width: 100,
      height: 75,
    },
  },
}));

function ChallengeListItem({ challenge }) {
  const classes = useStyles();
  const video_thumbnail = challenge.video.thumbnail_url;
  const link = '/role-plays/' + challenge.id;
  const thumbnail = video_thumbnail ? video_thumbnail : VideoPlaceholder;
  const color = challenge.listed ? 'secondary' : 'primary';
  return (
    <div className={classes.item}>
      <div>
        <img className={classes.preview} src={thumbnail} alt="placeholder" />
      </div>
      <div className={classes.text}>
        <Typography variant="h4">
          <Link component={AdapterLink} to={link} color={color}>
            {challenge.listed ? '' : 'unlisted: '}
            {challenge.title}
          </Link>
        </Typography>
        <Typography variant="h5">
          Created by: {challenge.user.full_name}
        </Typography>
        <Typography variant="body1">{challenge.instructions}</Typography>
      </div>
    </div>
  );
}

const ChallengeList = props => {
  const classes = useStyles();

  const isLoading = useSelector(state => ChallengesSelectors.isLoading(state));
  const isLoaded = useSelector(state => ChallengesSelectors.isLoaded(state));
  const challenges = useSelector(state =>
    ChallengesSelectors.challenges(state)
  );
  const dispatch = useDispatch();
  const actions = bindActionCreators(ChallengesActions, dispatch);
  const errorHandler = useErrorContext();

  useEffect(
    () => {
      if (!isLoaded && !isLoading) {
        actions.fetchChallenges().catch(error => {
          errorHandler(error, 'Failed to load role plays', true);
        });
      }
    },
    [isLoaded, isLoading] // This wouldn't make sense to include other vars.
  );

  let challengeItems = Object.values(challenges).map(challenge => (
    <React.Fragment key={`${challenge.id}`}>
      <ChallengeListItem challenge={challenge} />
      <Divider variant="middle" className={classes.divider} />
    </React.Fragment>
  ));

  return (
    <PaperPage title="Role Plays">
      <div className={classes.list}>{challengeItems}</div>
    </PaperPage>
  );
};

export default ChallengeList;
