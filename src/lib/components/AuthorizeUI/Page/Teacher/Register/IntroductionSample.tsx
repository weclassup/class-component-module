import React from "react";
import classNames from "classnames";

import Modal from "../../../../Modal/Modal";
import Fonts from "../../../../Fonts/Fonts";
import Button from "../../../../Button/Button";

interface Props {
	show: boolean;
	onClose: () => void;
}

const IntroductionSample: React.FC<Props> = ({ show, onClose }) => {
	return (
		<Modal visible={show}>
			<div
				className={classNames(
					"p-6",
					"bg-white",
					"rounded-xl",
					"w-[272px]",
					"lg:w-[400px]",
					"lg:p-10"
				)}
			>
				<Fonts
					fontSize="primaryHeading"
					className={classNames("text-grey1", "mb-5", "lg:mb-6")}
				>
					介紹範例
				</Fonts>
				<Fonts
					fontSize="primaryBody"
					className={classNames("text-grey1", "mb-6", "lg:mb-10")}
				>
					我已經有十年家教經驗，有耐心和熱情，擅長引導學生理解題目核心，訓練閱讀題目的能力。我已經有十年家教經驗，有耐心和熱情，擅長引導學生理解題目核心，訓練閱讀題目的能力。
				</Fonts>
				<Button
					buttonStyle="primary"
					fill
					as="button"
					type="button"
					onClick={onClose}
				>
					關閉
				</Button>
			</div>
		</Modal>
	);
};

export default IntroductionSample;
