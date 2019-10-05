import { useState, useCallback, useRef, useEffect } from 'react';

function useRefWithListeners(listeners) {
  const [node, setNode] = useState(null);
  const savedListeners = useRef();

  // Update savedListeners.current value if listeners change.
  //
  // This allows our effect below to always get latest handler
  // without us needing to pass it in effect deps array
  // and potentially cause effect to re-run every render.
  useEffect(() => {
    savedListeners.current = listeners;
  }, [listeners]);

  // This gets called often, but underlying object stays the same, so
  // listeners don't get added again.
  const ref = useCallback(newNode => {
    setNode(newNode);
  }, []);

  // Join the names so that Object.is sees that the dependency is the same.
  const joinedNames = Object.keys(listeners).join(',');

  useEffect(() => {
    if (!node) {
      return;
    }

    const handler = e => savedListeners.current[e.type](e);
    const names = joinedNames.split(',');

    names.forEach(eventName => {
      node.addEventListener(eventName, handler);
    });

    return () => {
      names.forEach(eventName => {
        node.removeEventListener(eventName, handler);
      });
    };
  }, [joinedNames, node]);

  return [ref, node];
}

export default useRefWithListeners;
