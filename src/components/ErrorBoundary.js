import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';

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
    console.log('getDerivedStateFromError');
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('App.componentDidCatch');
    this.handleError(error, errorInfo);
  }

  handleError(error, errorInfo, isRecoverable = false) {
    console.log(`handleError ${errorInfo}, isRecoverable: ${isRecoverable}`);
    console.error(error);
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
