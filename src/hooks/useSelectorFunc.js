import { useSelector } from 'react-redux';

function useSelectorFunc(selectorFunc) {
  return useSelector(state => selectorFunc(state));
}

export default useSelectorFunc;
