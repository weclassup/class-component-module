import { DependencyList, useCallback, useRef, useState } from "react";
import { useMountedState } from "react-use";
import { turnPageHandler } from "../../";
import { DeepPartial } from "react-hook-form";

interface PaginationCallback<SearchOptions, Item> {
  (options?: Partial<SearchOptions>): Promise<PageDto<Item>>;
}
export const usePaginationFn = <SearchOptions, Item>(
  fn: PaginationCallback<DeepPartial<SearchOptions>, Item>,
  deps: DependencyList = [],
  newItemsBeforeOldItems?: boolean
) => {
  const lastCallId = useRef(0);
  const [data, setData] = useState<{
    value: PageDto<Item> | undefined;
    loading: boolean;
  }>({ value: undefined, loading: false });
  const isMounted = useMountedState();

  const callback = useCallback(
    async (options?: DeepPartial<SearchOptions>) => {
      const callId = ++lastCallId.current;
      setData((prev) => ({ ...prev, loading: true }));
      const nextPage = await fn(options);
      if (isMounted() && lastCallId.current === callId) {
        setData((prev) => {
          return {
            value: turnPageHandler(
              prev.value,
              nextPage,
              newItemsBeforeOldItems
            ),
            loading: false,
          };
        });
      }
    },
    [deps]
  );

  return { data, callback };
};
