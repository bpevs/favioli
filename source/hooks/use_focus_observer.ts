import { useEffect, useRef } from 'preact/hooks';

export default function useFocusObserver(
  // deno-lint-ignore no-explicit-any
  callback: (...args: any[]) => any | void,
  // deno-lint-ignore no-explicit-any
  ignoredRefs: any[],
) {
  // deno-lint-ignore no-explicit-any
  const ref = useRef<any>();

  useEffect(() => {
    // deno-lint-ignore no-explicit-any
    function handleClick(event: any) {
      if (
        ![ref, ...ignoredRefs].some(({ current }) => {
          if (!current?.contains) return false;
          return current.contains(event.target);
        })
      ) {
        callback();
      }
    }

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [ref]);

  return ref;
}
