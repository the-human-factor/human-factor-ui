import React from 'react';

import * as Sentry from '@sentry/browser';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Link,
  Paper,
} from '@material-ui/core';

import ErrorContext from 'components/ErrorContext';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: {},
      errorInfo: '',
      isRecoverable: false,
    };
    this.handleError = this.handleError.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
  }

  static getDerivedStateFromError(error) {
    console.log('ErrorBoundary.getDerivedStateFromError');
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('ErrorBoundary.componentDidCatch');
    this.handleError(error, errorInfo);
  }

  handleError(error, errorInfo, isRecoverable = false) {
    // TODO: Add user information / include redux state.
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo);
      const eventId = Sentry.captureException(error);
      this.setState({ eventId });
    });

    console.group('Error Caught in Boundary');
    console.log(`Info: ${errorInfo}`);
    console.log(`The error is ${isRecoverable ? '' : 'not '}recoverable.`);
    console.error(error);
    console.groupEnd();

    this.setState({
      hasError: true,
      error: error,
      errorInfo: errorInfo,
      isRecoverable: isRecoverable,
    });
  }

  closeAlert() {
    this.setState({ hasError: false });
  }

  render() {
    if (this.state.hasError && !this.state.isRecoverable) {
      return (
        <Paper>
          <Typography variant="h3" color="error">
            Error
          </Typography>
          <Typography variant="h3" color="error">
            <Button
              onClick={() =>
                Sentry.showReportDialog({ eventId: this.state.eventId })
              }
            >
              Report feedback.
            </Button>
          </Typography>
          <Typography variant="h4">{this.state.errorInfo}</Typography>
          <Typography variant="h5">{this.state.error.toString()}</Typography>
          <Typography variant="body1">{this.state.error.stack}</Typography>
          <Typography variant="h3" color="error">
            <Link href="/">To Home Page</Link>
          </Typography>
        </Paper>
      );
    }

    return (
      <ErrorContext.Provider value={this.handleError}>
        {this.props.children}

        <Dialog
          aria-labelledby="customized-dialog-title"
          open={this.state.hasError && this.state.isRecoverable}
        >
          <DialogTitle id="customized-dialog-title">
            {this.state.errorInfo}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.error.toString()}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.closeAlert();
                Sentry.showReportDialog({ eventId: this.state.eventId });
              }}
              color="primary"
              autoFocus
            >
              Report Feedback
            </Button>
            <Button onClick={this.closeAlert} color="secondary" autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </ErrorContext.Provider>
    );
  }
}

export default ErrorBoundary;
