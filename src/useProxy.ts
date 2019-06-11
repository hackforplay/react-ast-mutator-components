import { useRef } from 'react';
import { useForceUpdate } from './utils';

export function useProxy<T extends object>(stableObject: T) {
  const forceUpdate = useForceUpdate();

  const prevValue = useRef<T>(stableObject);
  const subscription = useRef<Subscription<T>>(
    subscribe(stableObject, forceUpdate)
  );
  if (prevValue.current !== stableObject) {
    if (subscription.current) {
      subscription.current.unsubscribe();
    }
    subscription.current = subscribe(stableObject, forceUpdate);
    prevValue.current = stableObject;
  }

  return subscription.current.value;
}

interface Subscription<T> {
  value: T;
  unsubscribe: () => void;
}

function subscribe<T extends object>(
  sourceObject: T,
  callback: () => void
): Subscription<T> {
  let active = true;
  return {
    value: new Proxy(sourceObject, {
      set(target: any, p, value) {
        if (active && target[p] !== value) {
          // setImmediate が必要なのかどうかは試していない
          setImmediate(() => {
            callback();
          });
        }
        return true;
      }
    }),
    unsubscribe: () => {
      active = false;
    }
  };
}
