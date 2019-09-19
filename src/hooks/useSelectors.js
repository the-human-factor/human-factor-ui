import { useSelector } from "react-redux";

function useSelectors(selectors, props = {}) {
  return useSelector(state => {
    const res = {};
    for (const [selector, func] of Object.entries(selectors)) {
      res[selector] = func(state, props);
    }
    return res;
  });
}

export default useSelectors;