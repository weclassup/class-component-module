import classNames from "classnames";
import React, { useMemo, useState } from "react";
import { isSet } from "../../helper/format.checker";
import Flexbox from "../Flexbox/Flexbox";

type ImageProps = JSX.IntrinsicElements["img"];
interface Props extends ImageProps {
	condition?: boolean;
	objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
	imagePlaceholder?: React.ReactElement;
	objectPosition?:
		| "bottom"
		| "center"
		| "left"
		| "left-bottom"
		| "left-top"
		| "right"
		| "right-bottom"
		| "right-top"
		| "top";
}

export const Image: React.FC<Props> = ({
	condition = true,
	className,
	alt,
	objectPosition = "center",
	objectFit = "cover",
	imagePlaceholder,
	...props
}) => {
	const [isError, setIsError] = useState<boolean>(false);

	const shouldPlaceholderShow = useMemo(() => {
		return isSet(imagePlaceholder) && (isError || !isSet(props.src));
	}, [isError, imagePlaceholder, props.src]);

	return (
		<Flexbox
			condition={condition}
			justify="center"
			align="center"
			className={classNames(className, "overflow-hidden")}
		>
			{shouldPlaceholderShow ? (
				imagePlaceholder
			) : (
				<img
					alt={alt}
					onLoad={() => setIsError(false)}
					onError={() => setIsError(true)}
					className={classNames(
						"w-full",
						"h-full",
						{
							"object-bottom": objectPosition === "bottom",
							"object-center": objectPosition === "center",
							"object-left": objectPosition === "left",
							"object-left-bottom": objectPosition === "left-bottom",
							"object-left-top": objectPosition === "left-top",
							"object-right": objectPosition === "right",
							"object-right-bottom": objectPosition === "right-bottom",
							"object-right-top": objectPosition === "right-top",
							"object-top": objectPosition === "top",
						},

						{
							"object-contain": objectFit === "contain",
							"object-cover": objectFit === "cover",
							"object-fill": objectFit === "fill",
							"object-none": objectFit === "none",
							"object-scale-down": objectFit === "scale-down",
						}
					)}
					{...props}
				/>
			)}
		</Flexbox>
	);
};

export default Image;
