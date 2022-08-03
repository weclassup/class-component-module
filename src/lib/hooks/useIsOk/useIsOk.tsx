import React, { useCallback, useState } from "react";
import classNames from "classnames";

import { isFalse, isSet, isTrue } from "../../helper/format.checker";
import { sleep } from "../../helper/sleep";

import {
	FontAwesomeIcon,
	FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import Flexbox from "../../components/Flexbox/Flexbox";
import Image from "../../components/Image/Image";
import Modal from "../../components/Modal/Modal";

export const useIsOk = () => {
	const [isOk, setIsOk] = useState<boolean | null>(null);

	const resultHandler = useCallback(async (isOk: boolean) => {
		setIsOk(isOk);
		await sleep(1500);
		setIsOk(null);
	}, []);

	return { resultHandler, isOk };
};

export default useIsOk;

interface StatueOptions {
	text: string;
	image?: string;
	iconProps?: FontAwesomeIconProps;
}

interface Props {
	success?: StatueOptions;
	failure?: StatueOptions;
	isOk: boolean | null;
}

export const IsOkModal: React.FC<Props> = ({ success, failure, isOk }) => {
	const uiContent = () => {
		let result: StatueOptions | null = null;

		if (isTrue(isOk)) {
			result = success ? success : null;
		} else if (isFalse(isOk)) {
			result = failure ? failure : null;
		} else {
			return null;
		}

		return (
			<React.Fragment>
				<Image
					condition={isSet(result?.image)}
					alt="is_ok"
					src={result?.image}
					className={classNames("w-[100px]", "h-[100px]", "mb-1")}
				/>
				<Flexbox
					justify="center"
					align="center"
					condition={isSet(result?.iconProps)}
					className={classNames("w-[100px]", "h-[100px]", "mb-1")}
				>
					<FontAwesomeIcon {...result?.iconProps!} />
				</Flexbox>
				<p className={classNames("text-2xl", "text-grey1", "font-bold")}>
					{result?.text}
				</p>
			</React.Fragment>
		);
	};

	return (
		<Modal visible={isSet(isOk)}>
			<Flexbox
				direction="col"
				align="center"
				justify="center"
				className={classNames(
					"w-56",
					"h-56",
					"bg-white",
					"rounded-xl",
					"lg:w-60",
					"lg:h-60"
				)}
			>
				{uiContent()}
			</Flexbox>
		</Modal>
	);
};
