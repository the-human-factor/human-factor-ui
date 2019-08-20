import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log("App.componentDidCatch");
    console.error(error);
    console.error(errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Caught an Error at top level.</h1>
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;