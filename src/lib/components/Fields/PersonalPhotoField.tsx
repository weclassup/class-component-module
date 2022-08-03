import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { ControllerRenderProps } from "react-hook-form";

import { isSet } from "../../helper/format.checker";
import { toBase64 } from "../../helper/file.helper";
import { S3File } from "../../index";

import Image from "../Image/Image";
import Flexbox from "../Flexbox/Flexbox";
import Avatar from "../../assets/cls-avatar-default-80-img.svg";

type InputProps = JSX.IntrinsicElements["input"];

interface Props
  extends Omit<
    InputProps,
    "type" | "accept" | "value" | "onChange" | "onBlur" | "ref"
  > {
  error?: boolean;
  customRef: React.LegacyRef<HTMLInputElement> | undefined;
  buttonType: "primary" | "secondary";
}

export const PersonalPhotoField: React.FC<
  Props &
    Omit<
      ControllerRenderProps<
        Record<string, File | S3File | null | undefined>,
        string
      >,
      "ref"
    >
> = ({
  children,
  className,
  value,
  error,
  customRef,
  onChange,
  buttonType,
  ...props
}) => {
  const [photo, setPhoto] = useState<string>(Avatar);

  useEffect(() => {
    if (!isSet(value)) return;
    (async () => {
      if (value instanceof File) {
        const base64 = await toBase64(value);
        setPhoto(base64);
      } else {
        setPhoto(value.url || "");
      }
    })();
  }, [value]);

  const changeHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.item(0);
    onChange(file);
    e.target.files = null;
    e.target.value = "";
  };

  return (
    <Flexbox
      justify="between"
      align="center"
      className={classNames("lg:justify-center", "relative")}
    >
      <input
        ref={customRef}
        id="photo"
        type="file"
        accept="image/*"
        className={classNames("hidden")}
        onChange={changeHandler}
        {...props}
      />
      <Image
        src={photo}
        className={classNames(
          "w-20",
          "h-20",
          "rounded-cl",
          "text-[80px]",
          "text-grey3",
          "border-grey3",
          "border",
          "border-solid",
          "lg:mx-auto"
        )}
      />
      <Flexbox
        htmlFor="photo"
        as="label"
        justify="center"
        align="center"
        className={classNames(
          "border",
          "border-solid",
          "border-primary",
          "text-primary",
          "rounded-sm",
          "w-24",
          "h-12",
          "hover-hover:hover:cursor-pointer",
          "lg:absolute",
          "lg:right-0"
        )}
      >
        上傳照片
      </Flexbox>
    </Flexbox>
  );
};

export default PersonalPhotoField;
