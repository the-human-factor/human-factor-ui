import { useState, useCallback } from "react";

function useCallbackRef() {
  const [node, setNode] = useState(null);

  const ref = useCallback(newNode => {
    setNode(newNode);
  }, []);

  return [ref, node]
}

export default useCallbackRef;