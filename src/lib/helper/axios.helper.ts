import { AxiosResponse } from "axios";

interface GetDataFromAxiosRespond {
  <Response extends AxiosResponse>(
    api: () => Promise<Response>,
    convertor?: undefined
  ): () => Promise<Response extends AxiosResponse<infer R> ? R : never>;

  <Response, ConvertedData>(
    api: () => Promise<AxiosResponse<Response>>,
    convertor?: (data: Response) => ConvertedData
  ): () => Promise<ConvertedData>;
}

export const getDataFromAxiosRespond: GetDataFromAxiosRespond =
  (api: any, convertor?: any) => async () =>
    await api().then((res: any) =>
      convertor ? convertor(res.data) : res.data
    );
