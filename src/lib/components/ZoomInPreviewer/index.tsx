import React, { useEffect, useState } from "react";
import classNames from "classnames";
import {
  FilePreviewer,
  Flexbox,
  FontIconButton,
  formatChecker,
  Modal,
  S3File,
} from "../../index";

import { faTimes } from "@fortawesome/pro-light-svg-icons";

interface Props {
  defaultIndex?: number;
  open: boolean;
  closeHandler: () => void;
  files: (File | S3File)[];
}

export const ZoomInPreviewer: React.FC<Props> = ({
  defaultIndex,
  open,
  closeHandler,
  files,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (formatChecker.isNotSet(defaultIndex)) return;
    setCurrentIndex(defaultIndex);
  }, [open]);

  return (
    <Modal
      visible={open}
      backdrop={"invisible"}
      className={classNames("lg:pt-20", "lg:pb-[6rem]")}
    >
      <FontIconButton
        fontProps={{ icon: faTimes }}
        className={classNames(
          "absolute",
          "text-white",
          "text-2xl",
          "top-2",
          "right-2",
          "md:top-10",
          "md:right-10"
        )}
        onClick={closeHandler}
      />
      <FilePreviewer
        file={files[currentIndex]}
        isPlayMode
        defaultSize={false}
        className={classNames(
          "lg:max-h-full",
          "lg:flex",
          "lg:justify-center",
          "lg:items-center",
          "lg:overflow-hidden"
        )}
      />
      <Flexbox as={"ul"} className={classNames("absolute", "bottom-6")}>
        {files.map((file, index) => (
          <li
            key={index}
            className={classNames("hidden", "md:block", "mr-4", "last:mr-0")}
            onClick={() => setCurrentIndex(index)}
          >
            <FilePreviewer
              file={file}
              className={classNames(
                "w-[3.75rem]",
                "h-[3.75rem]",
                "rounded-xs",
                currentIndex === index && [
                  "border-2",
                  "border-solid",
                  "border-dark-blue",
                ]
              )}
            />
          </li>
        ))}
      </Flexbox>
    </Modal>
  );
};
