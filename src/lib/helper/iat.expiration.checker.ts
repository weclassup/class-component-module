import key from "../json/key.name.json";
import classMoment from "../classMoment";
import jwt from "jsonwebtoken";
import { isNotSet } from "./format.checker";

export class IATExpiration {
  private token = window.localStorage.getItem(key.TEACHER_PHONE_ISSUE_TOKEN);

  constructor(private timeoutInSecond: number) {}

  check() {
    if (isNotSet(this.token)) return false;
    const iat = jwt.decode(this.token, { json: true })?.iat;
    if (isNotSet(iat)) return false;
    const currentMoment = classMoment();
    const expireMoment = classMoment(iat).add(this.timeoutInSecond, "seconds");

    return currentMoment.isBefore(expireMoment);
  }
}
