import React from "react";
import classNames from "classnames";
import { isEmptyArray } from "../../helper/format.checker";
import { FilePreviewer, Flexbox, S3File } from "../../index";

interface FileListForCard {
  files: S3File[];
  hasContent: boolean;
}

export const FileListForCard: React.FC<FileListForCard> = ({
  files,
  hasContent,
}) => {
  if (isEmptyArray(files)) return null;

  return (
    <div className={classNames({ "mr-2": hasContent }, "md:mr-4")}>
      <Flexbox as={"ul"} className={classNames("mb-1", "md:mb-0")}>
        {files.map((file) => (
          <li
            key={file.id}
            className={classNames(
              "mr-2",
              "last:mr-0",
              "first:block",
              "md:block",
              {
                hidden: hasContent,
              }
            )}
          >
            <FilePreviewer
              file={file}
              defaultSize={false}
              durationLabelClassName={classNames("md:hidden")}
              className={classNames(
                "w-[3.75rem]",
                "h-[3.75rem]",
                "flex-shrink-0",
                "md:w-10",
                "md:h-10",
                "rounded-xs",
                "overflow-hidden"
              )}
            />
          </li>
        ))}
      </Flexbox>
      <p className={classNames("text-grey2", "text-[0.75rem]", "md:hidden")}>
        {files.length} 個附件
      </p>
    </div>
  );
};
