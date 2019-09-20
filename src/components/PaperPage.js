import React from "react";

import Paper from "@material-ui/core/Paper";
import { makeStyles } from '@material-ui/styles';
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";

const useStyles = makeStyles(theme => ({
  fullWidth: {
    display: "flex",
    flexDirection: "column",
    alignItems: props => props.stretch ? "stretch" : "center"
  },
  content: {
    padding: theme.spacing(2),
    paddingTop: 0,
  },
  superTitle: {
    paddingLeft: theme.spacing(1),
    marginBottom: theme.spacing(-.2)
  },
  title: {
    lineHeight: .8,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginTop: theme.spacing(-.8),
    marginBottom: theme.spacing(2)
  }
}));

export default function PaperPage(props) {
  const { children, title, superTitle, stretch, ...rest } = props;
  const classes = useStyles(props);

  return (
    <div className={classes.fullWidth}>
      <Paper className={classes.paper} {...rest}>
        <div>
          <Typography variant="subtitle2"
                      color="textSecondary"
                      className={classes.superTitle}>
            {superTitle}&nbsp;
          </Typography>
          <Typography variant="h2" className={classes.title}>
            {title}
          </Typography>
        </div>
        <div className={classes.content}>
          {children}
        </div>
      </Paper>
    </div>
  );
}

PaperPage.defaultProps = {
  stretch: false,
  superTitle: ""
}

PaperPage.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  superTitle: PropTypes.string,
  stretch: PropTypes.bool
};
