import React from "react";
import classNames from "classnames";

type FormProps = JSX.IntrinsicElements["form"];

export const Form: React.FC<FormProps> = ({
	children,
	className,
	...props
}) => {
	return (
		<form
			className={classNames(
				className,
				"relative",
				"px-6",
				"py-10",
				"bg-white",
				"border-t",
				"border-b",
				"border-grey4",
				"border-solid",
				"md:border",
				"md:rounded-xl",
				"md:py-12",
				"md:px-20"
			)}
			{...props}
		>
			{children}
		</form>
	);
};

export default Form;
