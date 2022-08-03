import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import classNames from "classnames";
import { classEvent, formatChecker, useOnEndReach } from "../../";
import { DeepPartial } from "react-hook-form";

interface Props<Data extends PageDto<any>> {
  data: Data | undefined;
  renderItem: React.FC<Data extends PageDto<infer Item> ? Item : any>;
  keyExtractor: (
    item: Data extends PageDto<infer Item> ? Item : any,
    index: any
  ) => string;
  onEndReached?: (options?: DeepPartial<SearchOptions>) => void;
  loading?: boolean;
  renderEmpty?: React.FC;
  renderLoading?: React.FC;
  containerClassName?: string;
}

interface UListComponent extends FCWithoutComponent {
  <Data extends PageDto<any>>(
    props: PropsWithChildren<Props<Data>>,
    context?: any
  ): ReturnType<React.FC>;
}

export const UList: UListComponent = ({
  onEndReached,
  data,
  renderItem,
  loading,
  keyExtractor,
  renderEmpty,
  renderLoading,
  containerClassName,
}) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (formatChecker.isNotSet(onEndReached)) return;
    onEndReached();
  }, []);

  const turnPageHandler = useCallback(() => {
    if (formatChecker.isNotSet(onEndReached)) return;
    if (formatChecker.isNotSet(data)) return;
    if (data.atPage >= data.totalPages) return;
    if (loading) return;
    onEndReached({ paging: { page: data.atPage + 1 } });
  }, [data, loading, onEndReached]);

  useEffect(() => {
    if (formatChecker.isNotSet(onEndReached)) return;
    uListEventEmitter.on(onEndReached);
    return () => {
      uListEventEmitter.off(onEndReached);
    };
  }, [onEndReached]);

  useOnEndReach({ el: ref, onEndReached: turnPageHandler }, [data]);

  if (
    (formatChecker.isNotSet(data) || formatChecker.isEmptyArray(data.items)) &&
    !loading
  ) {
    if (formatChecker.isSet(renderEmpty))
      return React.createElement(renderEmpty);
    else return null;
  }

  return (
    <ul ref={setRef} className={classNames(containerClassName)}>
      {data?.items.map((item, index) =>
        React.createElement(renderItem, {
          key: keyExtractor(item, index),
          ...item,
        })
      )}
      {renderLoading && loading && React.createElement(renderLoading)}
    </ul>
  );
};

export const uListEventEmitter = {
  on: (fn: () => void) => classEvent.on("reload", fn),
  off: (fn: () => void) => classEvent.off("reload", fn),
  emit: () => classEvent.emit("reload"),
};
