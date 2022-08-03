import React, { useCallback, useState } from "react";
import classNames from "classnames";
import {
  Div,
  FilePreviewer,
  Flexbox,
  Fonts,
  formatChecker,
  S3File,
  ZoomInPreviewer,
} from "../../";
import { Swiper, SwiperSlide } from "swiper/react";

interface Props {
  files?: S3File[];
  label: string;
  labelClassName?: string;
}
export const PreviewSwiper: React.FC<Props> = ({
  files,
  label,
  labelClassName,
}) => {
  const [currentIndex, setCurrentIdx] = useState<number>(0);
  const [openPreviewer, setOpenPreviewer] = useState<boolean>(false);

  const itemClickHandler = useCallback((index: number) => {
    setCurrentIdx(index);
    setOpenPreviewer(true);
  }, []);

  if (formatChecker.isNotSet(files) || formatChecker.isEmptyArray(files))
    return null;

  return (
    <React.Fragment>
      <ZoomInPreviewer
        open={openPreviewer}
        closeHandler={() => setOpenPreviewer(false)}
        files={files}
        defaultIndex={currentIndex}
      />
      <Div className={classNames("relative")}>
        <Fonts
          fontSize={"primaryButton"}
          className={classNames(
            labelClassName,
            "px-2",
            "py-1",
            "absolute",
            "z-[2]",
            "rounded-xs",
            "top-4",
            "left-6",
            "md:top-0",
            "md:left-0"
          )}
        >
          {label}
        </Fonts>
        <Swiper
          onSwiper={(Swiper) => {
            Swiper.on("activeIndexChange", (e) => setCurrentIdx(e.activeIndex));
          }}
          className={classNames("w-[20rem]", "h-[15rem]", "md:hidden")}
        >
          {files.map((file, index) => (
            <SwiperSlide key={file.id}>
              <FilePreviewer
                clickHandler={() => itemClickHandler?.(index)}
                file={file}
                className={classNames("w-full", "h-full")}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className={classNames("hidden", "md:block")}>
          <FilePreviewer
            file={files[currentIndex]}
            clickHandler={() => itemClickHandler?.(currentIndex)}
            className={classNames(
              "w-[20.75rem]",
              "h-[15.375rem]",
              "mx-auto",
              "md:mb-4"
            )}
          />
          <Flexbox as={"ul"} justify={"center"}>
            {files.map((file, idx) => (
              <li key={idx} className={classNames("mr-4", "last:mr-0")}>
                <FilePreviewer
                  clickHandler={() => setCurrentIdx(idx)}
                  file={file}
                  defaultSize={false}
                  className={classNames(
                    "w-[3.75rem]",
                    "h-[3.75rem]",
                    "rounded-xs",
                    "overflow-hidden",
                    currentIndex === idx && [
                      "border-2",
                      "border-solid",
                      "border-dark-blue",
                    ]
                  )}
                />
              </li>
            ))}
          </Flexbox>
        </div>
        <p
          className={classNames(
            "px-2",
            "py-1",
            "bg-black",
            "bg-opacity-60",
            "rounded-xs",
            "absolute",
            "z-[2]",
            "bottom-4",
            "right-4",
            "text-white",
            "text-[0.75rem]",
            "md:hidden"
          )}
        >
          {currentIndex + 1}/{files.length}
        </p>
      </Div>
    </React.Fragment>
  );
};
