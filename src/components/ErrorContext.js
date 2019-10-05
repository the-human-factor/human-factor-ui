import React from 'react';

export default React.createContext(
  (error, errorInfo = '', isRecoverable = false) => {
    console.error('ErrorContext default handler.');
    console.error(errorInfo);
    console.error(error);
  }
);
