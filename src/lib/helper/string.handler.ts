import { formatChecker } from "..";

export const leadingZero = (obj: any, count: number = 2) => {
  let res = obj;
  if (!formatChecker.isString(res)) res = res.toString();
  const length = obj.length;
  const gap = count - length;
  if (gap <= 0) return res;

  return res.padStart(gap, "0");
};
