import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";

function useActions(actions) {
  const dispatch = useDispatch();
  return bindActionCreators(actions, dispatch);
}

export default useActions;
