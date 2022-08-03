import { S3File } from "..";

const BYTE = 1024;
const KB = 1024 * BYTE;
const MB = 1024 * KB;

export const toBase64 = (file: File) =>
  new Promise<string>((res, rej) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => res(reader.result as string);
    reader.onerror = () => rej(reader.result);
  });

export const getMediaDuration = (
  type: "video" | "audio",
  file: File | S3File
) =>
  new Promise<number>(async (res) => {
    const el =
      type === "audio"
        ? document.createElement("audio")
        : document.createElement("video");
    if (file instanceof File) {
      el.src = URL.createObjectURL(file);
    } else {
      el.src = file.url || "";
    }
    el.preload = "metadata";

    el.onloadedmetadata = () => {
      window.URL.revokeObjectURL(el.src);
      const duration = el.duration;
      res(duration);
    };
  });

export type FileType = "image" | "audio" | "video" | "else";
export const getFileType = (type: string): FileType => {
  if (/^image\/+/.test(type)) {
    return "image";
  } else if (/^audio\/+/.test(type)) {
    return "audio";
  } else if (/^video\/+/.test(type)) {
    return "video";
  } else {
    return "else";
  }
};

export const getFileSize = (size: number): string => {
  if (size <= BYTE) {
    return `${size}byte`;
  } else if (size <= KB) {
    return `${Math.floor(size / BYTE)}KB`;
  } else if (size <= MB) {
    return `${Math.floor(size / KB)}MB`;
  } else {
    return `${size}`;
  }
};
