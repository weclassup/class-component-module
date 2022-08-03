import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import {
  fileHelper,
  FileType,
  Flexbox,
  Image,
  S3File,
  stringHandler,
  useFileSourceHandler,
} from "../../";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faVideo } from "@fortawesome/pro-solid-svg-icons";

interface Props {
  file: S3File | File;
  className?: string;
  iconClassName?: string;
  durationLabelClassName?: string;
  previewContentClassName?: string;
  clickHandler?: () => void;
  isPlayMode?: boolean;
  defaultSize?: boolean;
}

const formatDurationInTime = (duration: number) => {
  const second = Math.floor(duration % 60);
  const minute = Math.floor(duration / 60);

  return `${stringHandler.leadingZero(
    minute.toString(),
    2
  )}:${stringHandler.leadingZero(second.toString(), 2)}`;
};

export const FilePreviewer: React.FC<Props> = ({
  file,
  className,
  iconClassName,
  durationLabelClassName,
  clickHandler,
  isPlayMode,
  defaultSize = true,
  previewContentClassName,
  children,
}) => {
  const fileType = useMemo<FileType>(() => {
    const type = file instanceof File ? file.type : file.contentType;
    return fileHelper.getFileType(type);
  }, [file]);
  return (
    <div
      className={classNames(
        className,
        { "bg-grey4": !isPlayMode },
        defaultSize && ["w-full", "h-full"]
      )}
      onClick={clickHandler}
    >
      <FileSwitch
        fileType={fileType}
        file={file}
        iconClassName={iconClassName}
        durationLabelClassName={durationLabelClassName}
        isPlayMode={isPlayMode}
        previewContentClassName={previewContentClassName}
      />
      {children}
    </div>
  );
};

const FileSwitch: React.FC<
  { fileType?: FileType } & Pick<
    Props,
    | "file"
    | "iconClassName"
    | "durationLabelClassName"
    | "isPlayMode"
    | "previewContentClassName"
  >
> = ({
  fileType,
  file,
  iconClassName,
  durationLabelClassName,
  isPlayMode,
  previewContentClassName,
}) => {
  switch (fileType) {
    case "image":
      return (
        <ImagePreviewer
          previewContentClassName={previewContentClassName}
          file={file}
          isPlayMode={isPlayMode}
        />
      );
    case "audio":
      return (
        <Audio
          previewContentClassName={previewContentClassName}
          file={file}
          iconClassName={iconClassName}
          durationLabelClassName={durationLabelClassName}
          isPlayMode={isPlayMode}
        />
      );
    case "video":
      return (
        <Video
          previewContentClassName={previewContentClassName}
          file={file}
          iconClassName={iconClassName}
          durationLabelClassName={durationLabelClassName}
          isPlayMode={isPlayMode}
        />
      );
    default:
      return null;
  }
};

const Video: React.FC<
  Pick<
    Props,
    | "file"
    | "iconClassName"
    | "durationLabelClassName"
    | "isPlayMode"
    | "previewContentClassName"
  >
> = ({
  file,
  iconClassName,
  durationLabelClassName,
  isPlayMode,
  previewContentClassName,
}) => {
  const [duration, setDuration] = useState<number>(0);
  const { fileSource } = useFileSourceHandler(file);

  useEffect(() => {
    fileHelper.getMediaDuration("video", file).then((res) => setDuration(res));
  }, []);

  if (isPlayMode) {
    return (
      <video
        controls
        className={classNames(
          "w-full",
          "h-full",
          "object-cover",
          "lg:w-auto",
          previewContentClassName
        )}
      >
        <source src={fileSource.url} type={fileSource.mime} />
      </video>
    );
  }

  return (
    <Flexbox
      align={"center"}
      justify={"center"}
      direction={"col"}
      className={classNames(
        "w-full",
        "h-full",
        "relative",
        "p-4",
        previewContentClassName
      )}
    >
      <FontAwesomeIcon icon={faVideo} className={classNames(iconClassName)} />
      <p className={classNames("text-sm", durationLabelClassName)}>
        {formatDurationInTime(duration)}
      </p>
    </Flexbox>
  );
};

const Audio: React.FC<
  Pick<
    Props,
    | "file"
    | "iconClassName"
    | "durationLabelClassName"
    | "isPlayMode"
    | "previewContentClassName"
  >
> = ({
  file,
  iconClassName,
  durationLabelClassName,
  isPlayMode,
  previewContentClassName,
}) => {
  const [duration, setDuration] = useState<number>(0);
  const { fileSource } = useFileSourceHandler(file);

  useEffect(() => {
    fileHelper.getMediaDuration("audio", file).then((res) => setDuration(res));
  }, []);

  if (isPlayMode) {
    return (
      <Flexbox
        align={"center"}
        justify={"center"}
        className={classNames(
          "w-full",
          "h-full",
          "relative",
          "p-4",
          previewContentClassName
        )}
      >
        <audio
          controls
          controlsList={"nodownload"}
          className={classNames("h-10")}
          preload={"none"}
        >
          <source src={fileSource.url} type={fileSource.mime} />
        </audio>
      </Flexbox>
    );
  }

  return (
    <Flexbox
      align={"center"}
      justify={"center"}
      direction={"col"}
      className={classNames(
        "w-full",
        "h-full",
        "relative",
        "p-4",
        previewContentClassName
      )}
    >
      <FontAwesomeIcon
        icon={faMicrophone}
        className={classNames(iconClassName)}
      />
      <p className={classNames("text-sm", durationLabelClassName)}>
        {formatDurationInTime(duration)}
      </p>
    </Flexbox>
  );
};

const ImagePreviewer: React.FC<
  Pick<Props, "file" | "isPlayMode" | "previewContentClassName">
> = ({ file, isPlayMode, previewContentClassName }) => {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    if (file instanceof File) {
      fileHelper.toBase64(file).then((res) => {
        setUrl(res);
      });
    } else {
      setUrl(file?.url || "");
    }
  }, [file]);

  if (isPlayMode)
    return (
      <TransformWrapper>
        <TransformComponent wrapperClass={previewContentClassName}>
          <Image src={url} className={classNames("w-full", "h-full")} />
        </TransformComponent>
      </TransformWrapper>
    );

  return (
    <Image
      src={url}
      className={classNames("w-full", "h-full", "previewContentClassName")}
    />
  );
};
