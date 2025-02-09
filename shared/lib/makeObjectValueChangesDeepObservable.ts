/**
 * Recursively wraps an object in a Proxy so that any change (even on nested properties)
 * triggers the onChange callback.
 */
export function makeObjectValueChangesDeepObservable<T extends object>(
  obj: T,
  onChange: () => void,
): T {
  const handler: ProxyHandler<T> = {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      // If the retrieved value is an object (and not null), wrap it as well.
      if (value !== null && typeof value === "object") {
        // We cast value as object to satisfy the type constraint.
        return makeObjectValueChangesDeepObservable(value as object, onChange);
      }
      return value;
    },
    set(target, prop, value, receiver) {
      const result = Reflect.set(target, prop, value, receiver);
      onChange();
      return result;
    },
  };
  return new Proxy(obj, handler);
}
