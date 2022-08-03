import { useEffect } from "react";

export const usePreventDefaultScroll = (condition: boolean) => {
	useEffect(() => {
		if (!condition) return;
		const cb = (e: WheelEvent | TouchEvent | Event) => {
			e.preventDefault();
		};
		document
			.querySelector("html")
			?.addEventListener("wheel", cb, { passive: false });
		document
			.querySelector("html")
			?.addEventListener("scroll", cb, { passive: false });
		document
			.querySelector("html")
			?.addEventListener("touchmove", cb, { passive: false });

		return () => {
			document.querySelector("html")?.removeEventListener("wheel", cb);
			document.querySelector("html")?.removeEventListener("scroll", cb);
			document.querySelector("html")?.removeEventListener("touchmove", cb);
		};
	}, [condition]);
};

export default usePreventDefaultScroll;
