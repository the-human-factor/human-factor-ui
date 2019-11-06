import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

// TODO: Tell Webpack this JS file uses this image
import VideoPlaceholder from '../images/VideoPlaceholder.jpg';
import { ResponsesSelectors, ResponsesActions } from 'modules/responses';
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

const ResponseListItem = props => {
  const classes = useStyles();
  const link = '/responses/' + props.id;
  const thumbnail = props.thumbnail ? props.thumbnail : VideoPlaceholder;
  return (
    <div className={classes.item} key={props.id}>
      <div>
        <img className={classes.preview} src={thumbnail} alt="placeholder" />
      </div>
      <div className={classes.text}>
        <Typography variant="h4">
          <Link component={AdapterLink} to={link} color="secondary">
            {props.challengeTitle}
          </Link>
        </Typography>
        <Typography variant="h5">Responder: {props.responder}</Typography>
      </div>
    </div>
  );
};

const ResponseList = props => {
  const classes = useStyles();

  const isLoading = useSelector(state => ResponsesSelectors.isLoading(state));
  const isLoaded = useSelector(state => ResponsesSelectors.isLoaded(state));
  const responses = useSelector(state => ResponsesSelectors.responses(state));
  const dispatch = useDispatch();
  const actions = bindActionCreators(ResponsesActions, dispatch);
  const errorHandler = useErrorContext();

  useEffect(
    () => {
      if (!isLoaded && !isLoading) {
        actions.fetchResponses().catch(error => {
          errorHandler(error, 'Failed to load responses', true);
        });
      }
    },
    // TODO: Stop the warning from happening.
    [isLoaded, isLoading] // This wouldn't make sense to include other vars.
  );

  let responseItems = Object.values(responses).map(response => (
    <React.Fragment key={response.id}>
      <ResponseListItem
        id={response.id}
        challengeTitle={response.challenge.title}
        responder={response.user.full_name}
        thumbnail={response.video.thumbnail_url}
      />
      <Divider variant="middle" className={classes.divider} />
    </React.Fragment>
  ));

  return (
    <PaperPage title="Responses">
      <div>{responseItems}</div>
    </PaperPage>
  );
};

export default ResponseList;
