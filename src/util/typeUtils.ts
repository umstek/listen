/**
 * Sets the correct type for a fulfilled promise result
 * 
 * @param item A settled promise
 * @returns Whether the promise has been fulfilled (resolved)
 */
export function isPromiseFulfilled<T>(
  item: PromiseSettledResult<T>,
): item is PromiseFulfilledResult<T> {
  return item.status === 'fulfilled';
}
