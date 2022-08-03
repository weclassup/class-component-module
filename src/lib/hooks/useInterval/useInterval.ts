import { useRef, useEffect } from "react";

export const useInterval = (cb: Function, delay: number | null) => {
	const savedCallback = useRef<Function | null>(null);

	useEffect(() => {
		savedCallback.current = cb;
	}, [cb]);

	// eslint-disable-next-line
	useEffect(() => {
		function tick() {
			if (savedCallback.current) {
				savedCallback.current();
			}
		}

		if (delay !== null) {
			let id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
};

export default useInterval;
