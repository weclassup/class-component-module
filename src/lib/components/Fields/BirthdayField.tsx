import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Flexbox, TextField } from "../../index";
import classNames from "classnames";

interface Props {
  birthYearRegister: UseFormRegisterReturn;
  birthMonthRegister: UseFormRegisterReturn;
  birthDateRegister: UseFormRegisterReturn;
}
export const BirthdayField: React.FC<Props> = ({
  birthYearRegister,
  birthMonthRegister,
  birthDateRegister,
}) => {
  return (
    <div>
      <Flexbox align={"center"}>
        <div>
          <TextField
            register={birthYearRegister}
            placeholder={"2000"}
            inputMode={"numeric"}
          />
        </div>
        <span className={classNames("mx-2")}>/</span>
        <div>
          <TextField
            register={birthMonthRegister}
            placeholder={"01"}
            inputMode={"numeric"}
          />
        </div>
        <span className={classNames("mx-2")}>/</span>
        <div>
          <TextField
            register={birthDateRegister}
            placeholder={"01"}
            inputMode={"numeric"}
          />
        </div>
      </Flexbox>
    </div>
  );
};

export default BirthdayField;
