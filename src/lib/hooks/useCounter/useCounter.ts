import { useEffect, useState } from "react";
import useInterval from "../useInterval/useInterval";

export const useCounter = (count: number) => {
	const [counter, setCounter] = useState<number>(0);
	const [delay, setDelay] = useState<number | null>(1000);

	useEffect(() => {
		setCounter(count);

		if (count !== 0) {
			setDelay(1000);
		}
	}, [count]);

	const counting = () => {
		if (counter === 0) {
			setDelay(null);
		} else {
			setCounter((prev) => prev - 1);
		}
	};

	const restart = () => {
		setDelay(1000);
		setCounter(count);
	};

	useInterval(counting, delay);

	return { counter, restart };
};

export default useCounter;
