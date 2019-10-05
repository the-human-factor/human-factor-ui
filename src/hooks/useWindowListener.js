import { useEffect, useRef } from 'react';

function useWindowListener(type, callback) {
  // Same pattern as useRefWithListeners, we don't want to keep setting and
  // clearing the callback.
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = event => savedCallback.current(event);

    window.addEventListener(type, handler);
    return () => {
      window.removeEventListener(type, handler);
    };
  }, [type]);
}

export default useWindowListener;
