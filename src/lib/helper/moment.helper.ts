import classMoment, { Moment } from "../classMoment/index";

export type WideMomentType = Moment | string | Date;

export const getCleanMoment = (moment?: WideMomentType): Moment =>
  classMoment(moment).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

export const getYMDFormat = (moment: WideMomentType) => {
  return classMoment(moment).format("YYYY 年 MM 月 DD 日");
};

export const getNormalFormat = (
  moment: WideMomentType,
  config?: { withoutTime?: boolean; withSecond?: boolean }
) => {
  const { withSecond, withoutTime } = config ?? {
    withSecond: false,
    withoutTime: false,
  };

  return classMoment(moment).format(
    `YYYY/MM/DD${withoutTime ? "" : ` HH:mm${withSecond ? ":SS" : ""}`}`
  );
};
export const getUTCFormat = (moment: Moment): string =>
  moment.utc().format("YYYY-MM-DDTHH:mm:SS.sss[Z]");

export const getLocalUTCFormat = (moment: Moment): string =>
  moment.format("YYYY-MM-DDTHH:mm:SS.sss[Z]");

export { classMoment };
