import { DependencyList, useCallback, useEffect, useRef } from "react";
import { elementHelper, formatChecker } from "../../";
import throttle from "lodash.throttle";

interface Config {
  el: HTMLElement | null | undefined;
  onEndReached: () => void;
  onEndReachedThreshold?: number;
  eventThrottle?: number;
  opposite?: boolean;
}

export const useOnEndReach = (
  { el, onEndReached, onEndReachedThreshold, eventThrottle, opposite }: Config,
  deps: DependencyList = []
) => {
  const reachEndCallback = useRef(onEndReached);

  const endReachedHandler = useCallback(
    function (this: HTMLElement) {
      const scrollTop = this.scrollTop;

      if (opposite) {
        if (scrollTop <= 0) {
          reachEndCallback.current();
        }
      } else {
        const scrollHeight = this.scrollHeight;
        const viewportHeight = window.innerHeight;

        let triggerPosition = scrollTop + viewportHeight;

        if (formatChecker.isSet(onEndReachedThreshold)) {
          triggerPosition =
            triggerPosition - viewportHeight * onEndReachedThreshold;
        }

        if (triggerPosition >= scrollHeight) {
          reachEndCallback.current();
        }
      }
    },

    [opposite]
  );

  useEffect(() => {
    reachEndCallback.current = onEndReached;
  }, [onEndReached]);

  useEffect(() => {
    if (formatChecker.isNotSet(el)) return;
    const scrollParent = elementHelper.getScrollableParent(el);

    if (formatChecker.isNotSet(scrollParent)) return;
    const tick = throttle(endReachedHandler, eventThrottle, {
      leading: false,
      trailing: true,
    });
    scrollParent.addEventListener("wheel", tick);
    scrollParent.addEventListener("touchmove", tick);

    return () => {
      scrollParent.removeEventListener("wheel", tick);
      scrollParent.removeEventListener("touchmove", tick);
      tick.cancel();
    };
  }, [el, ...deps]);
};
