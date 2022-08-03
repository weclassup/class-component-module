import EE from "eventemitter3";

export const classEvent = new EE();

export const loadingEventEmitter = {
	on: (fn: (isLoading: boolean) => void) => classEvent.on("loading", fn),
	off: (fn: (isLoading: boolean) => void) => classEvent.off("loading", fn),
	emit: (isLoading: boolean) => classEvent.emit("loading", isLoading),
};
