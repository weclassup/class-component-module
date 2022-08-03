import { Message, Validate } from "react-hook-form";
import classMoment from "../classMoment";
import { isNumber, isSet } from "./format.checker"; // import { isSet } from "./format.checker";
// import { isSet } from "./format.checker";

export const emailRegEx =
  // eslint-disable-next-line
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const passwordRegEx =
  /^(?=.*?[a-zA-Z])(?=.*?[0-9])[0-9a-zA-Z#?!@$%^&*-.]{8,20}$/;

export const phoneRegEx = /^09[0-9]{8}$/;

export const required: Message = "此欄位為必須填寫";
export const requiredOption: Validate<number | undefined> = (optionId) =>
  isSet(optionId) && Number(optionId) !== 0 ? undefined : required;

export const emailValidate: Validate<string | undefined> = (value = "") =>
  emailRegEx.test(value) ? undefined : "請輸入正確的電子郵件格式";

export const codeValidate: Validate<string | undefined> = (value = "") =>
  /^([0-9]{6,6})$/.test(value) ? undefined : "請輸入正確的驗證碼格式";

export const passwordValidate: Validate<string | undefined> = (value = "") =>
  passwordRegEx.test(value) ? undefined : "請輸入正確的密碼格式";

export const phoneValidate: Validate<string | undefined> = (value) =>
  isSet(value) && phoneRegEx.test(value) ? undefined : "請輸入正確的手機號碼。";

export const numberCheck: Validate<string | undefined> = (value = "") =>
  isNaN(Number(value)) ? "請輸入數字" : undefined;

export const numberInRange =
  (maxThan: number, minThan: number): Validate<string | undefined> =>
  (value = "") => {
    const num = Number(value);
    return num > maxThan && num < minThan
      ? undefined
      : `範圍應該為${maxThan + 1} ~ ${minThan - 1}`;
  };

export const birthYearValidate: Validate<string | undefined> = (value = "") =>
  numberCheck(value) || numberInRange(1900, 2100)(value);

export const birthMonthValidate: Validate<string | undefined> = (value = "") =>
  numberCheck(value) || numberInRange(0, 13)(value);

export const birthDateValidate =
  (currentYear: string, currentMonth: string): Validate<string | undefined> =>
  (value = "") => {
    const year = Number(currentYear);
    const month = Number(currentMonth) - 1;
    if (isNumber(year) && isNumber(month)) {
      const daysInMonth = classMoment().set({ year, month }).daysInMonth();
      return numberCheck(value) || numberInRange(0, daysInMonth + 1)(value);
    } else {
      return "請輸入正確的年或月";
    }
  };
