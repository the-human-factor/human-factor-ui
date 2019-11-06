import React from 'react';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Link } from '@material-ui/core';
import { Notification } from 'react-admin';

import intersperse from '../intersperse';

const useStyles = makeStyles(theme => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flexGrow: 2,
    padding: theme.spacing(3),
    paddingTop: 0,
  },
  title: {
    color: theme.palette.grey[800],
    marginLeft: theme.spacing(1),
  },
  links: {
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
}));

const ResourceLink = ({ name }) => (
  <Link href={`/${name}`} variant="body2">
    {name}
  </Link>
);

const AdminLayout = props => {
  const { children, title } = props;
  const classes = useStyles();

  const admin = React.Children.only(children);
  const resources = React.Children.map(admin.props.children, child => {
    return <ResourceLink name={child.props.name} />;
  });

  return (
    <React.Fragment>
      <div className={classes.content}>
        <Typography variant="h4" className={classes.title}>
          {title}
        </Typography>
        <div className={classes.links}>{intersperse(resources, ' | ')}</div>
        {children}
      </div>
      <Notification />
    </React.Fragment>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  title: PropTypes.string.isRequired,
};

export default AdminLayout;
