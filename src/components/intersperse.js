/* intersperse: Return an array with the separator interspersed between
 * each element of the input array.
 *
 * > _([1,2,3]).intersperse(0)
 * [1,0,2,0,3]
 */
export default function intersperse(arr, sep) {
  if (arr.length === 0) {
    return [];
  }

  return arr.slice(1).reduce(
    (xs, x, idx) => {
      const separator = typeof sep === 'function' ? sep(idx) : sep;
      return xs.concat([separator, x]);
    },
    [arr[0]]
  );
}
