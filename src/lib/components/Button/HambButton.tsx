import React from "react";
import classNames from "classnames";

interface Props extends ButtonProps {
	open: boolean;
}

export const HambButton: React.FC<Props> = ({ className, open, ...props }) => {
	return (
		<button
			{...props}
			className={classNames(
				className,
				"w-10",
				"h-10",
				"px-[11px]",
				"py-[13px]"
			)}
		>
			<div className={classNames("relative", "h-full")}>
				<div
					className={classNames(
						"w-full",
						"h-[2px]",
						"bg-grey1",
						"rounded-lg",
						"absolute",

						"transition-all",
						"transform",
						open ? ["top-[50%]", "-translate-y-px", "rotate-45"] : ["top-0"]
					)}
				/>
				<div
					className={classNames(
						"w-full",
						"h-[2px]",
						"bg-grey1",
						"rounded-lg",
						"absolute",

						"top-[50%]",
						"transform",
						"-translate-y-px",

						open && "hidden"
					)}
				/>
				<div
					className={classNames(
						"w-full",
						"h-[2px]",
						"bg-grey1",
						"rounded-lg",
						"absolute",

						"transition-all",
						"transform",
						open
							? ["bottom-[50%]", "translate-y-px", "-rotate-45"]
							: ["bottom-0"]
					)}
				/>
			</div>
		</button>
	);
};

export default HambButton;
