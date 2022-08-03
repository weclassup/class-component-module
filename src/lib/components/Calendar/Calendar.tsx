import React, { useEffect, useState } from "react";
import classNames from "classnames";

import useCalendar, { dayname } from "../../hooks/useCalendar/useCalendar";

import { getUTCFormat, getYMDFormat } from "../../helper/moment.helper";
import { Moment } from "../../classMoment/index";

import {
	faCalendarAlt,
	faChevronLeft,
	faChevronRight,
} from "@fortawesome/pro-light-svg-icons";
import Flexbox from "../Flexbox/Flexbox";
import Fonts from "../Fonts/Fonts";
import Portal from "../Portal/Portal";
import FontIconButton from "../Button/FontIconButton";
import Button from "../Button/Button";
import { ControllerRenderProps } from "react-hook-form";

interface CalendarProps extends Omit<ControllerRenderProps, "ref"> {
	defaultMoment?: Moment | null;
}

export const Calendar: React.FC<CalendarProps> = (props) => {
	return (
		<useCalendar.Provider
			initialState={{ defaultMoment: props.value || props.defaultMoment! }}
		>
			<CalendarComponent {...props} />
		</useCalendar.Provider>
	);
};

Calendar.defaultProps = { defaultMoment: null };

export default Calendar;

const CalendarComponent: React.FC<CalendarProps> = ({ onChange }) => {
	const { currentMoment } = useCalendar.useContainer();

	useEffect(() => {
		if (!currentMoment) return;
		const UTCFormat = getUTCFormat(currentMoment);
		onChange(UTCFormat);
		// eslint-disable-next-line
	}, [currentMoment]);

	return (
		<div>
			<Flexbox
				justify="between"
				align="center"
				className={classNames(
					"p-1",
					"pl-4",
					"border",
					"border-grey4",
					"rounded-sm",
					"text-grey2",
					"bg-white"
				)}
			>
				<DisplayDate />
			</Flexbox>
			<CalendarModal />
		</div>
	);
};

interface DisplayDateProps {}

const DisplayDate: React.FC<DisplayDateProps> = () => {
	const { currentMoment, setOpenCalendar } = useCalendar.useContainer();

	return (
		<React.Fragment>
			<Fonts fontSize="primaryBody">
				{currentMoment ? getYMDFormat(currentMoment) : "請選擇"}
			</Fonts>
			<FontIconButton
				onClick={() => setOpenCalendar((prev) => !prev)}
				type="button"
				fontProps={{ icon: faCalendarAlt }}
				className={classNames("w-10", "h-10", "text-[18px]")}
			/>
		</React.Fragment>
	);
};

const CalendarModal: React.FC = () => {
	const { openCalendar, setOpenCalendar } = useCalendar.useContainer();

	if (!openCalendar) return null;

	return (
		<Portal>
			<Flexbox
				align="center"
				justify="center"
				className={classNames(
					"fixed",
					"z-30",
					"top-0",
					"left-0",
					"w-screen",
					"h-screen"
				)}
				onClick={() => setOpenCalendar(false)}
			>
				<Flexbox
					as="div"
					onClick={(e) => e.stopPropagation()}
					direction="col"
					className={classNames(
						"p-4",
						"shadow-dropdown",
						"bg-white",
						"rounded-xs",
						"w-[312px]",
						"relative"
					)}
				>
					<CalendarHeader />
					<CalendarMonthSelector />
					<CalendarYearSelector />
					<CalendarDayName />
					<CalendarDate />
				</Flexbox>
			</Flexbox>
		</Portal>
	);
};

const CalendarHeader: React.FC = () => {
	const {
		currentMonth,
		currentYear,
		goPreviousMonth,
		goNextMonth,
		setOpenYearSelector,
		setOpenMonthSelector,
	} = useCalendar.useContainer();

	return (
		<Flexbox justify="between" className={classNames("relative", "mb-2")}>
			<FontIconButton
				fontProps={{ icon: faChevronLeft }}
				className={classNames("text-[18px]", "text-grey2")}
				type="button"
				onClick={goPreviousMonth}
			/>
			<Flexbox>
				<Fonts
					as="button"
					type="button"
					onClick={() => setOpenYearSelector(true)}
					fontSize="primaryButton"
					className={classNames(
						"text-grey1",
						"hover-hover:hover:text-primary",
						"mr-1"
					)}
				>
					{currentYear} 年
				</Fonts>
				<Fonts
					as="button"
					type="button"
					onClick={() => setOpenMonthSelector(true)}
					fontSize="primaryButton"
					className={classNames("text-grey1", "hover-hover:hover:text-primary")}
				>
					{currentMonth + 1} 月
				</Fonts>
			</Flexbox>
			<FontIconButton
				fontProps={{ icon: faChevronRight }}
				className={classNames("text-[18px]", "text-grey2")}
				type="button"
				onClick={goNextMonth}
			/>
		</Flexbox>
	);
};

const CalendarMonthSelector: React.FC = () => {
	const {
		currentYear,
		currentMonth,
		goPreiousYear,
		goNextYear,
		goToSpecificMonth,
		openMonthSelector,
		setOpenMonthSelector,
	} = useCalendar.useContainer();

	if (!openMonthSelector) return null;

	return (
		<Flexbox
			direction="col"
			className={classNames(
				"absolute",
				"p-4",
				"bg-white",
				"shadow-dropdown",
				"rounded-xs",
				"top-0",
				"left-0"
			)}
		>
			<Flexbox justify="between" className={classNames("mb-2")}>
				<FontIconButton
					onClick={goPreiousYear}
					fontProps={{ icon: faChevronLeft }}
					className={classNames("text-[18px]", "text-grey2")}
					type="button"
				/>
				<Fonts
					as="button"
					type="button"
					onClick={() => setOpenMonthSelector(false)}
					fontSize="primaryButton"
					className={classNames("text-grey1")}
				>
					{currentYear} 年
				</Fonts>
				<FontIconButton
					onClick={goNextYear}
					fontProps={{ icon: faChevronRight }}
					className={classNames("text-[18px]", "text-grey2")}
					type="button"
				/>
			</Flexbox>
			{[...new Array(3)].map((_, row) => {
				return (
					<Flexbox key={row}>
						{[...new Array(4)].map((_, col) => {
							const month = row * 4 + col;
							const isSelected = month === currentMonth;

							return (
								<Flexbox
									key={col}
									justify="center"
									align="center"
									className={classNames("w-16", "h-10", "mr-2", "last:mr-0")}
								>
									<Button
										onClick={() => {
											goToSpecificMonth(month);
											setOpenMonthSelector(false);
										}}
										type="button"
										className={classNames("w-[54px]", "h-8", {
											"hover-hover:hover:bg-grey5": !isSelected,
											"text-grey1": !isSelected,
											"text-white": isSelected,
											"bg-primary": isSelected,
										})}
									>
										<Fonts fontSize="primaryButton">{month + 1}月</Fonts>
									</Button>
								</Flexbox>
							);
						})}
					</Flexbox>
				);
			})}
		</Flexbox>
	);
};

const START_YEAR = 1911;
const END_YEAR = new Date().getFullYear() + 50;
const CalendarYearSelector: React.FC = () => {
	const { currentYear, openYearSelector } = useCalendar.useContainer();

	if (!openYearSelector) return null;

	return (
		<Flexbox
			direction="col"
			className={classNames(
				"absolute",
				"bg-white",
				"shadow-dropdown",
				"rounded-xs",
				"top-0",
				"left-0",
				"max-h-full",
				"overflow-hidden"
			)}
		>
			<Flexbox
				align="center"
				justify="center"
				className={classNames("w-[280px]", "h-10", "m-4", "mb-2")}
			>
				<Fonts fontSize="primaryButton" className={classNames("text-grey1")}>
					選擇年份
				</Fonts>
			</Flexbox>
			<ul className={classNames("mb-2", "flex-1", "overflow-scroll")}>
				{[...new Array(END_YEAR - START_YEAR)].map((_, idx) => {
					const year = START_YEAR + idx;
					const isSelected = currentYear === year;
					return (
						<CalendarYearOptionItem
							key={year}
							year={year}
							isSelected={isSelected}
						/>
					);
				})}
			</ul>
		</Flexbox>
	);
};

interface CalendarYearOptionItemProps {
	year: number;
	isSelected: boolean;
}
const CalendarYearOptionItem: React.FC<CalendarYearOptionItemProps> = ({
	year,
	isSelected,
}) => {
	const [ref, setRef] = useState<HTMLLIElement | null>(null);
	const { goToSpecificYear, setOpenYearSelector } = useCalendar.useContainer();

	useEffect(() => {
		if (!isSelected) return;
		if (!ref) return;
		ref.scrollIntoView();
	}, [isSelected, ref]);

	return (
		<Flexbox
			customRef={setRef}
			as="li"
			align="center"
			onClick={() => {
				goToSpecificYear(year);
				setOpenYearSelector(false);
			}}
			className={classNames("h-12", "px-4", {
				"hover-hover:hover:bg-grey5": !isSelected,
				"text-primary": isSelected,
				"bg-primary": isSelected,
				"bg-opacity-10": isSelected,
			})}
		>
			<Fonts
				fontSize="primaryBody"
				className={classNames({
					"text-grey1": !isSelected,
				})}
			>
				{year}
			</Fonts>
		</Flexbox>
	);
};

const CalendarDayName: React.FC = () => {
	return (
		<Flexbox as="ul">
			{[...new Array(7)].map((_, idx) => {
				const daynameIdx = `${(idx + 1) % 7}`;
				const name = dayname[daynameIdx as keyof typeof dayname];

				return (
					<Flexbox
						as="li"
						key={idx}
						justify="center"
						align="center"
						className={classNames("w-10", "h-10", "text-grey1")}
					>
						<Fonts fontSize="primaryButton">{name}</Fonts>
					</Flexbox>
				);
			})}
		</Flexbox>
	);
};

const CalendarDate: React.FC = () => {
	const { days, goToSpecificDay, currentMoment, setOpenCalendar } =
		useCalendar.useContainer();

	return (
		<Flexbox as="ul" wrap="wrap">
			{days.map(({ moment, inMonth }) => {
				const isSelected = moment.isSame(currentMoment, "day");

				return (
					<Flexbox
						as="li"
						key={moment.format()}
						justify="center"
						align="center"
						className={classNames("w-10", "h-10")}
					>
						<Fonts
							as="button"
							fontSize="primaryButton"
							type="button"
							disabled={!inMonth}
							onClick={() => {
								goToSpecificDay(moment);
								setOpenCalendar(false);
							}}
							className={classNames(
								"w-8",
								"h-8",
								"rounded-sm",
								{
									"text-white": isSelected,
									"bg-primary": isSelected,
									"text-grey1": !isSelected,
									"hover-hover:hover:bg-grey5": !isSelected,
								},
								"disabled:text-grey3"
							)}
						>
							<span>{moment.date()}</span>
						</Fonts>
					</Flexbox>
				);
			})}
		</Flexbox>
	);
};
