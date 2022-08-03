import moment, { Moment } from "moment";

export const classMoment = (...param: Parameters<typeof moment>): Moment => {
	return moment(...param)
		.utc()
		.utcOffset(8)
		.clone();
};

export type { Moment };

export default classMoment;
