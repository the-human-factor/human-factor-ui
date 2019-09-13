import { useEffect } from "react";

function useKeyUp(targetCode, callback) {
  useEffect(() => {
    const upHandler = ({ code }) => {
      if (code === targetCode) {
        callback();
      }
    };
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetCode, callback]);
}

export default useKeyUp;