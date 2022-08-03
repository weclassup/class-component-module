import React from "react";
import classNames from "classnames";
import { ControllerRenderProps } from "react-hook-form";

import {
  isAry,
  isNotEmptyArray,
  isNotSet,
  isSet,
} from "../../helper/format.checker";

import { faCloudUpload, faTimesCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Flexbox from "../Flexbox/Flexbox";
import Fonts from "../Fonts/Fonts";
import { S3File } from "../..";

interface Props
  extends Omit<
    ControllerRenderProps<
      Record<string, File | S3File | null | undefined>,
      string
    >,
    "ref"
  > {
  customRef: React.LegacyRef<HTMLInputElement>;
  multiple?: false;
  defaultFile?: S3File;
}

interface MultipleFileProps
  extends Omit<
    ControllerRenderProps<
      Record<string, (File | S3File | undefined)[]>,
      string
    >,
    "ref"
  > {
  customRef: React.LegacyRef<HTMLInputElement>;
  multiple?: true;
  defaultFile?: S3File[];
}

export const DocumentField: React.FC<Props | MultipleFileProps> = ({
  customRef,
  value,
  onChange,
  multiple = false,
  name,
}) => {
  const changeHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (isNotSet(files)) return;

    if (multiple) {
      if (isAry(value)) {
        let fileAry: any[] = [...(value as any[])];
        for (let i = 0; i < files.length; i++) {
          const file = files.item(i);
          if (isSet(file)) fileAry.push(file);
        }
        onChange(fileAry);
      }
    } else {
      onChange(files.item(0));
    }

    e.target.files = null;
    e.target.value = "";
  };

  const removeHandler = (index?: number) => {
    if (multiple) {
      if (isAry(value)) {
        const fileAry = (value as any[]).filter((_, idx) => idx !== index);
        onChange(fileAry);
      }
    } else {
      onChange(null);
    }
  };

  if (isSet(value) && !multiple)
    return <DocumentItem value={value as File} removeHandler={removeHandler} />;

  return (
    <div>
      <Flexbox
        as="label"
        htmlFor={name}
        align="center"
        className={classNames(
          "border",
          "border-solid",
          "rounded-sm",
          "p-1",
          "text-grey2",
          "cursor-pointer",
          "mb-2",
          "last:mb-0",
          "hover-hover:hover:cursor-pointer"
        )}
      >
        <Flexbox
          align="center"
          justify="center"
          className={classNames("h-10", "w-10", "text-lg", "mr-1")}
        >
          <FontAwesomeIcon icon={faCloudUpload} />
        </Flexbox>
        <Fonts fontSize="primaryButton">新增檔案</Fonts>
        <input
          ref={customRef}
          id={name}
          className={classNames("hidden")}
          type="file"
          onChange={changeHandler}
          multiple={multiple}
        />
      </Flexbox>
      <Flexbox
        direction="col"
        as="ul"
        condition={multiple && isNotEmptyArray(value)}
      >
        {multiple &&
          isAry(value) &&
          value.map((file, idx) => (
            <li key={idx} className={classNames("mb-2", "last:mb-0")}>
              <DocumentItem
                key={idx}
                value={file}
                removeHandler={() => removeHandler(idx)}
              />
            </li>
          ))}
      </Flexbox>
    </div>
  );
};

export default DocumentField;

interface DocumentItemProps {
  value: File | S3File | undefined;
  removeHandler: () => void;
}

const DocumentItem: React.FC<DocumentItemProps> = ({
  value,
  removeHandler,
}) => {
  return (
    <Flexbox
      align="center"
      className={classNames(
        "border",
        "border-solid",
        "border-primary",
        "border-opacity-5",
        "rounded-sm",
        "bg-primary",
        "bg-opacity-5",
        "text-primary",
        "p-1",
        "pl-4"
      )}
    >
      <Fonts
        fontSize="primaryButton"
        className={classNames(
          "flex-1",
          "overflow-ellipsis",
          "overflow-hidden",
          "whitespace-nowrap"
        )}
      >
        {value?.name}
      </Fonts>
      <button
        onClick={removeHandler}
        className={classNames("h-10", "w-10", "text-lg", "mr-1")}
      >
        <FontAwesomeIcon icon={faTimesCircle} />
      </button>
    </Flexbox>
  );
};
