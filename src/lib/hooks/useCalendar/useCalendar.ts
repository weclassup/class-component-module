import { createContainer } from "unstated-next";
import { useCallback, useMemo, useRef, useState } from "react";
import classMoment, { Moment } from "../../classMoment";
import { getCleanMoment } from "../../helper/moment.helper";
import { isSet } from "../../helper/format.checker";

export const dayname = {
	"0": "日",
	"1": "一",
	"2": "二",
	"3": "三",
	"4": "四",
	"5": "五",
	"6": "六",
};

interface Props {
	defaultMoment: Moment | string | null;
}

export const useCalendar = (props?: Props) => {
	const [openCalendar, setOpenCalendar] = useState<boolean>(false);
	const [openYearSelector, setOpenYearSelector] = useState<boolean>(false);
	const [openMonthSelector, setOpenMonthSelector] = useState<boolean>(false);
	const [currentYear, setCurrentYear] = useState<number>(
		new Date().getFullYear()
	);
	const [currentMonth, setCurrentMonth] = useState<number>(
		new Date().getMonth()
	);
	const [currentMoment, setCurrentMoment] = useState<Moment | null>(
		isSet(props?.defaultMoment) ? getCleanMoment(props?.defaultMoment) : null
	);

	const today = useRef(getCleanMoment()).current;

	const goPreviousMonth = useCallback(() => {
		setCurrentMonth((prev) => {
			const nextMonth = prev - 1;
			if (nextMonth < 0) {
				setCurrentYear((prev) => prev - 1);
				return 0;
			} else {
				return nextMonth;
			}
		});
	}, []);

	const goNextMonth = useCallback(() => {
		setCurrentMonth((prev) => {
			const nextMonth = prev + 1;
			if (nextMonth > 11) {
				setCurrentYear((prev) => prev + 1);
				return 0;
			} else {
				return nextMonth;
			}
		});
	}, []);

	const goToSpecificMonth = useCallback((month: number) => {
		setCurrentMonth(month);
	}, []);

	const goPreiousYear = useCallback(() => {
		setCurrentYear((prev) => prev - 1);
	}, []);
	const goNextYear = useCallback(() => {
		setCurrentYear((prev) => prev + 1);
	}, []);
	const goToSpecificYear = useCallback((year: number) => {
		setCurrentYear(year);
	}, []);

	const goToMonth = useCallback((month) => setCurrentMonth(month), []);
	const goToYear = useCallback((year) => setCurrentYear(year), []);
	const goToSpecificDay = (moment: Moment) => {
		setCurrentMoment(getCleanMoment(moment));
		setCurrentYear(moment.year());
		setCurrentMonth(moment.month());
	};

	const days = useMemo(() => {
		let dayAry: { moment: Moment; inMonth: boolean }[] = [];
		const currentMoment = classMoment().set({
			year: currentYear,
			month: currentMonth,
		});

		const daysInMonth = currentMoment.daysInMonth();
		const dayStartAt = currentMoment.clone().set({ date: 1 }).day();
		const dayEndAt = currentMoment.clone().set({ date: daysInMonth }).day();

		let startOffset = (dayStartAt + 6) % 7;
		let endOffset = 7 - dayEndAt;

		[...new Array(startOffset)].forEach((_, idx) => {
			const cellMoment = currentMoment
				.clone()
				.set({ date: idx - startOffset + 1 });
			dayAry.push({ moment: cellMoment, inMonth: false });
		});
		[...new Array(daysInMonth + endOffset)].forEach((_, idx) => {
			const date = idx + 1;
			const cellMoment = currentMoment.clone().set({ date });
			dayAry.push({ moment: cellMoment, inMonth: date <= daysInMonth });
		});

		return dayAry;
	}, [currentYear, currentMonth]);

	return {
		currentMonth,
		currentYear,
		currentMoment,
		goPreviousMonth,
		goNextMonth,
		goToSpecificMonth,
		goPreiousYear,
		goNextYear,
		goToSpecificYear,
		goToMonth,
		goToYear,
		goToSpecificDay,
		days,
		today,
		openCalendar,
		setOpenCalendar,
		openYearSelector,
		openMonthSelector,
		setOpenMonthSelector,
		setOpenYearSelector,
	};
};

export default createContainer(useCalendar);
