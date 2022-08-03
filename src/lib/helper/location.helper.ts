import { useLocation } from "react-router-dom";

export const getHref = (type: "student" | "teacher"): string => {
  const protocal = window.location.protocol;
  let subdomain: string = type;
  let port = "";
  let domain = "weclass.com.tw";
  let suffix = "";

  if (import.meta.env.VITE_ENV === "production") {
    subdomain = (import.meta.env.VITE_SUBDOMAIN as string) || subdomain;
  } else if (import.meta.env.VITE_ENV === "staging") {
    suffix = "-chikramine";
  } else {
    domain = "example.com";
    port = `:${window.location.port}`;
  }

  return `${protocal}//${subdomain}${suffix}.${domain}${port}`;
};

export const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};
