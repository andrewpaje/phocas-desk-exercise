export function reorderSubArray<T>(
  array: T[],
  start: number,
  end: number,
  reOrderLogic: (subArray: T[]) => T[]
): T[] {
  // Guard for the start and end indices
  if(start < 0 || end >= array.length || start > end) {
    console.warn(`start:${start} or end:${end} invalid. Returning original array.`)
    return array
  }

  // Get before and after the subarray
  const before = array.slice(0, start);
  const after = array.slice(end + 1);

  // Use start and end to get the target subarray
  const targetSubarray = array.slice(start, end + 1);
 
  // Combine all together
  return [...before, ...reOrderLogic(targetSubarray), ...after]
}
