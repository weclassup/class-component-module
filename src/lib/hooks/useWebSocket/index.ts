import { useEffect, useRef } from "react";
import Sockette, { SocketteOptions } from "sockette";
import { AxiosResponse } from "axios";

export interface WebSocketUrlDto {
  wsUr: string;
}

interface GetSocketUrlApi {
  (): Promise<AxiosResponse<WebSocketUrlDto>>;
}
export const useWebSocket = (
  getSocketUrlApi: GetSocketUrlApi,
  socketteOptions?: SocketteOptions
) => {
  const ws = useRef<Sockette>();
  useEffect(() => {
    getSocketUrlApi().then((res) => {
      const { data } = res;
      console.log("Connect to socket");
      console.log("Open socket");
      ws.current = new Sockette(data.wsUr, socketteOptions);
    });

    return () => {
      console.log("Close socket");
      ws.current?.close();
    };
  }, []);
};
