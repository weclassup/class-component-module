import { useCallback, useEffect, useState } from "react";

type Resolver<V extends any> =
  | ((...arg: V extends undefined ? [undefined] : [V]) => void)
  | null;
type Rejecter<V extends any> =
  | ((...arg: V extends undefined ? [undefined] : [V]) => void)
  | null;

export const useAsyncPrompt = <
  ResolveValue extends any,
  RejectValue extends any = ResolveValue
>() => {
  const [show, setShow] = useState<boolean>(false);
  const [resolver, setResolver] = useState<Resolver<ResolveValue>>(null);
  const [rejecter, setRejecter] = useState<Rejecter<RejectValue>>(null);
  const [forceShutdown, setForceShutdown] = useState<boolean>(false);

  useEffect(() => {
    if (!show) return;
    if (!forceShutdown) return;

    setRejecter(null);
    setResolver(null);
    setShow(false);
    setForceShutdown(false);
  }, [show, forceShutdown]);

  const prompt = useCallback(
    () =>
      new Promise<ResolveValue | RejectValue>((res) => {
        setShow(true);
        setResolver(
          () =>
            function (value: ResolveValue) {
              setResolver(null);
              setShow(false);
              res(value);
            }
        );
        setRejecter(
          () =>
            function (value: RejectValue) {
              setRejecter(null);
              setShow(false);
              res(value);
            }
        );
      }),
    // eslint-disable-next-line
    [show]
  );

  const handleConfirm = useCallback(
    (...arg: ResolveValue extends undefined ? [undefined] : [ResolveValue]) =>
      resolver?.(...arg),
    [resolver]
  );
  const handleClose = useCallback(
    (...arg: RejectValue extends undefined ? [undefined] : [RejectValue]) =>
      rejecter?.(...arg),
    [rejecter]
  );

  const forceStopAsyncPrompt = useCallback(() => {
    setForceShutdown(true);
  }, []);

  return {
    prompt,
    handleConfirm,
    handleClose,
    showAsyncPrompt: show,
    forceStopAsyncPrompt,
  };
};

export default useAsyncPrompt;
