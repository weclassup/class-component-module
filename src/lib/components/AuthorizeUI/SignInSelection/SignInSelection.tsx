import React from "react";
import classNames from "classnames";

import { getHref } from "../../../helper/location.helper";

import { faChalkboardTeacher, faUsers } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Flexbox from "../../Flexbox/Flexbox";
import Fonts from "../../Fonts/Fonts";
import Modal from "../../Modal/Modal";

const SignInSelection: React.FC<{ show: boolean; onClose: () => void }> = ({
	show,
	onClose,
}) => {
	return (
		<Modal visible={show} onBackdrop={onClose}>
			<Flexbox
				as="ul"
				direction="col"
				className={classNames(
					"py-2",
					"w-56",
					"rounded-sm",
					"shadow-dropdown",
					"bg-white"
				)}
			>
				<li>
					<a href={`${getHref("student")}/sign_in`}>
						<Flexbox align="center" className={classNames("h-[55px]", "px-6")}>
							<Flexbox
								align="center"
								justify="center"
								className={classNames("w-8", "h-8", "text-[18px]", "mr-1")}
							>
								<FontAwesomeIcon icon={faUsers} />
							</Flexbox>
							<Fonts
								fontSize="primaryBody"
								className={classNames("text-grey1")}
							>
								學生登入
							</Fonts>
						</Flexbox>
					</a>
				</li>
				<li>
					<a href={`${getHref("teacher")}/sign_in`}>
						<Flexbox align="center" className={classNames("h-[55px]", "px-6")}>
							<Flexbox
								align="center"
								justify="center"
								className={classNames("w-8", "h-8", "text-[18px]", "mr-1")}
							>
								<FontAwesomeIcon icon={faChalkboardTeacher} />
							</Flexbox>
							<Fonts
								fontSize="primaryBody"
								className={classNames("text-grey1")}
							>
								老師登入
							</Fonts>
						</Flexbox>
					</a>
				</li>
			</Flexbox>
		</Modal>
	);
};

export default SignInSelection;
