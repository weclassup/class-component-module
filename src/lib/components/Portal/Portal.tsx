import React from "react";
import { createPortal } from "react-dom";

interface Props {
	element?: HTMLElement;
}

export const Portal: React.FC<Props> = ({
	children,
	element = document.querySelector("body")!,
}) => {
	return createPortal(children, element);
};

export default Portal;
