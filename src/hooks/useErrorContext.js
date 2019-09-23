import { useContext } from "react";
import ErrorContext from "components/ErrorContext";

function useErrorContext() {
  return useContext(ErrorContext);
}

export default useErrorContext;
