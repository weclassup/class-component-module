import React from "react";
import classNames from "classnames";

import { faCheck } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../../../../Modal/Modal";
import Fonts from "../../../../Fonts/Fonts";
import Flexbox from "../../../../Flexbox/Flexbox";
import Button from "../../../../Button/Button";

interface Props {
	show: boolean;
	onConfirm: () => void;
}

const StudentRegistrySuccessPrompt: React.FC<Props> = ({ show, onConfirm }) => {
	return (
		<Modal visible={show}>
			<div
				className={classNames(
					"p-6",
					"rounded-xl",
					"bg-white",
					"w-[272px]",
					"lg:w-[400px]",
					"lg:p-10"
				)}
			>
				<Flexbox align="center" className={classNames("mb-3", "lg:mb-4")}>
					<Fonts fontSize="primaryHeading" className={classNames("text-grey1")}>
						註冊成功
					</Fonts>
					<Fonts
						fontSize="secondaryHeading"
						className={classNames("ml-2", "text-green")}
					>
						<FontAwesomeIcon icon={faCheck} />
					</Fonts>
				</Flexbox>
				<Fonts
					fontSize="secondaryBody"
					className={classNames("text-grey2", "mb-8", "lg:mb-10")}
				>
					歡迎加入 CLASS！立即開始發問吧！
				</Fonts>
				<Button
					onClick={onConfirm}
					as="button"
					type="button"
					buttonStyle="primary"
					fill
				>
					確定
				</Button>
			</div>
		</Modal>
	);
};

export default StudentRegistrySuccessPrompt;
