import React, { useRef, useState } from "react";
import classNames from "classnames";

import { isFalse, isNotSet, isTrue } from "../../../helper/format.checker";
import { getHref } from "../../../helper/location.helper";
import useInteractiveOutsideTargetHandler from "../../../hooks/useInteractiveOutsideTargetHandler/useInteractiveOutsideTargetHandler";

import {
	faChalkboardTeacher,
	faUsers,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HambButton from "../../Button/HambButton";
import Header from "../../Header/Header";
import Button, { LinkButton } from "../../Button/Button";
import Fonts from "../../Fonts/Fonts";
import Flexbox from "../../Flexbox/Flexbox";
import Navigation from "../Navigation/Navigation";
import Div from "../../Element/Div";

interface SignInProps {
	isSignedIn?: boolean;
	signOutHandler?: () => void;
}

interface Props {
	isSignedIn?: undefined;
	signOutHandler?: undefined;
}

const AuthHeader: React.FC<Props | SignInProps> = ({
	isSignedIn,
	signOutHandler,
}) => {
	const [openNav, setOpenNav] = useState<boolean>(false);
	const [openSignInModal, setOpenSignInModal] = useState<boolean>(false);

	return (
		<React.Fragment>
			<Header>
				<HambButton
					open={openNav}
					onClick={() => setOpenNav((prev) => !prev)}
					className={classNames("ml-auto", "lg:hidden")}
				/>
				<Div
					condition={!isSignedIn}
					className={classNames("hidden", "lg:flex", "ml-4")}
				>
					<LinkButton
						to="/"
						className={classNames(
							"w-14",
							"h-9",
							"text-grey1",
							"hover-hover:hover:text-primary"
						)}
					>
						首頁
					</LinkButton>
				</Div>
				<Div
					condition={isFalse(isSignedIn) || isNotSet(isSignedIn)}
					className={classNames("hidden", "lg:flex", "ml-auto")}
				>
					<div className={classNames("relative")}>
						<Button
							as="button"
							type="button"
							defaultSize={false}
							className={classNames(
								"h-9",
								"w-14",
								"text-grey1",
								"hover-hover:hover:text-primary"
							)}
							onClick={() => setOpenSignInModal((prev) => !prev)}
						>
							登入
						</Button>
						<SignInList
							open={openSignInModal}
							close={() => setOpenSignInModal(false)}
						/>
					</div>
					<LinkButton
						to="/register"
						defaultSize={false}
						buttonStyle="primary"
						fill
						className={classNames("w-14", "h-9", "ml-4")}
					>
						註冊
					</LinkButton>
				</Div>
				<Div
					condition={isTrue(isSignedIn)}
					className={classNames("hidden", "lg:flex", "ml-auto")}
				>
					<Button
						onClick={signOutHandler}
						className={classNames("w-14", "h-9")}
						defaultSize={false}
						buttonStyle="primary"
						fill
					>
						登出
					</Button>
				</Div>
			</Header>
			<Navigation open={openNav} onClose={() => setOpenNav(false)} />
		</React.Fragment>
	);
};

export default AuthHeader;

interface SignInListProps {
	close: () => void;
	open: boolean;
}
const SignInList: React.FC<SignInListProps> = ({ close, open }) => {
	const ref = useRef<HTMLDivElement>(null);
	useInteractiveOutsideTargetHandler(ref.current, close);

	return (
		<div
			ref={ref}
			className={classNames(
				"absolute",
				"overflow-hidden",
				"right-3",
				"shadow-dropdown",
				"transition-max-height",
				"duration-300",
				"bg-white",
				"rounded-sm",
				open ? "max-h-[999px]" : "max-h-0"
			)}
		>
			<ul className={classNames("w-56", "py-1")}>
				<li>
					<Fonts
						as="a"
						href={`${getHref("student")}/sign_in`}
						className={classNames(
							"py-3",
							"px-6",
							"flex",
							"items-center",
							"hover-hover:hover:bg-primary",
							"hover-hover:hover:bg-opacity-10",
							"hover-hover:hover:text-primary"
						)}
					>
						<Flexbox
							as="span"
							justify="center"
							align="center"
							className={classNames("block", "w-8", "h-8", "mr-1")}
						>
							<FontAwesomeIcon icon={faUsers} />
						</Flexbox>
						學生登入
					</Fonts>
				</li>
				<li>
					<Fonts
						as="a"
						href={`${getHref("teacher")}/sign_in`}
						className={classNames(
							"py-3",
							"px-6",
							"flex",
							"items-center",
							"hover-hover:hover:bg-primary",
							"hover-hover:hover:bg-opacity-10",
							"hover-hover:hover:text-primary"
						)}
					>
						<Flexbox
							as="span"
							justify="center"
							align="center"
							className={classNames("block", "w-8", "h-8", "mr-1")}
						>
							<FontAwesomeIcon icon={faChalkboardTeacher} />
						</Flexbox>
						老師登入
					</Fonts>
				</li>
			</ul>
		</div>
	);
};
