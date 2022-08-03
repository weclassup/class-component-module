import { useEffect, useState } from "react";
import { fileHelper, S3File } from "../../";

interface FileSource {
  url: string;
  mime: string;
}

export const useFileSourceHandler = (file: S3File | File) => {
  const [fileSource, setFileSource] = useState<FileSource>({
    url: "",
    mime: "",
  });

  useEffect(() => {
    if (file instanceof File) {
      fileHelper.toBase64(file).then((url) => {
        setFileSource({ url, mime: file.type });
      });
    } else {
      setFileSource({ url: file.url || "", mime: file.contentType });
    }
  }, [file]);

  return { fileSource };
};
