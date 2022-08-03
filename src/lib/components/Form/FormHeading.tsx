import React from "react";
import classNames from "classnames";
import Fonts from "../Fonts/Fonts";

interface Props {
	className?: React.HTMLAttributes<HTMLElement>["className"];
}

export const FormHeading: React.FC<Props> = ({ children, className }) => {
	return (
		<Fonts
			as="h1"
			fontSize="primaryHeading"
			className={classNames("text-grey1", className)}
		>
			{children}
		</Fonts>
	);
};

export default FormHeading;
