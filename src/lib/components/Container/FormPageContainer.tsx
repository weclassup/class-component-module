import classNames from "classnames";
import React from "react";

interface Props {
	customRef?: React.LegacyRef<HTMLDivElement> | undefined;
	className?: string;
}

export const FormPageContainer: React.FC<Props> = ({
	customRef,
	className,
	children,
}) => {
	return (
		<div
			ref={customRef}
			className={classNames(
				className,
				"py-6",
				"md:w-[560px]",
				"md:mx-auto",
				"md:py-20"
			)}
		>
			{children}
		</div>
	);
};

export default FormPageContainer;
