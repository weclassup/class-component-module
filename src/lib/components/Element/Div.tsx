import React from "react";

interface Props {
	condition?: boolean;
}

export const Div: React.FC<JSX.IntrinsicElements["div"] & Props> = ({
	condition = true,
	...props
}) => {
	if (!condition) return null;
	return <div {...props}></div>;
};

export default Div;
