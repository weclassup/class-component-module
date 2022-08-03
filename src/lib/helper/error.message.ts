export const getErrorMessageFromResponse = (e: any) =>
  e?.response?.data?.messages?.[0];

export const getErrorNameFromResponse = (e: any) => e?.response?.data?.name;
