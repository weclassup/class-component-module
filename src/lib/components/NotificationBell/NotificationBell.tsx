import React, { useEffect, useState } from "react";
import { useAsync, useMountedState } from "react-use";
import { AxiosResponse } from "axios";
import classNames from "classnames";
import merge from "lodash.merge";

import classMoment from "../../classMoment";
import { getDataFromAxiosRespond } from "../../helper/axios.helper";

import { faBell } from "@fortawesome/pro-regular-svg-icons";
import { faTimes } from "@fortawesome/pro-light-svg-icons";

import { usePaginationFn } from "../../hooks/usePagenationFn";
import { useWebSocket, WebSocketUrlDto } from "../../hooks/useWebSocket";
import { UList } from "../UList";
import Fonts from "../Fonts/Fonts";
import FontIconButton from "../Button/FontIconButton";
import ConditionalFragment from "../ConditionalFragment";
import Flexbox from "../Flexbox/Flexbox";
import Modal from "../Modal/Modal";
import { DeepPartial } from "react-hook-form";

interface NotificationInfoDto {
  /** @format int32 */
  unReadCount: number;

  /** @format date-time */
  readAt?: string;
}

interface PagingAndSortingRequest {
  /** 分頁 */
  paging: PagingRequest;

  /** 排序 */
  sorting?: SortingRequest;

  /** 排序(new) */
  sorts?: SortField[];
}

interface PagingRequest {
  /**
   * 頁次（從1開始）
   * @format int32
   */
  page: number;

  /**
   * 每頁數量
   * @format int32
   */
  pageSize: number;
}

/**
 * 排序(new)
 */
interface SortField {
  /** 排序方式 */
  sort?: "ASC" | "DESC";

  /** 排序欄位 */
  field?: string;
}

/**
 * 排序
 */
interface SortingRequest {
  /** 排序方式 */
  sort: "ASC" | "DESC";

  /** 排序欄位 */
  sortFields: string[];
}

export interface PageDtoNotificationMessageDto {
  /** @format int32 */
  atPage: number;

  /** @format int32 */
  totalPages: number;
  items: NotificationMessageDto[];

  /** @format int64 */
  totalCount: number;
}

export interface NotificationMessageDto {
  /** @format int32 */
  id: number;

  /** @format date-time */
  createdAt: string;

  /** 訊息內容 */
  content: string;

  /** 關聯物件 */
  ref?: "QUESTION";

  /**
   * 關聯物件
   * @format int32
   */
  refId?: number;
}

const NotificationBell: React.FC<{
  className?: string;
  triggerNotificationList: () => void;
  isOpen: boolean;
  api: {
    getInfo: (params?: any) => Promise<AxiosResponse<NotificationInfoDto>>;
    updateRead: (params?: any) => Promise<AxiosResponse<NotificationInfoDto>>;
    getWebSocket: (params?: any) => Promise<AxiosResponse<WebSocketUrlDto>>;
    searchNotification: (
      data: PagingAndSortingRequest
    ) => Promise<AxiosResponse<PageDtoNotificationMessageDto>>;
  };
}> = ({
  triggerNotificationList,
  isOpen,
  api: { getInfo, updateRead, getWebSocket, searchNotification },
  className,
}) => {
  const [hasNewMessages, setHasNewMessages] = useState<boolean>(false);
  const isMounted = useMountedState();

  const { value: notificationInfo } = useAsync(
    getDataFromAxiosRespond(getInfo),
    []
  );

  useEffect(() => {
    if (!notificationInfo) return;
    if (notificationInfo.unReadCount > 0) {
      setHasNewMessages(true);
    }
  }, [notificationInfo]);

  useEffect(() => {
    if (isOpen && hasNewMessages) {
      updateRead().then((_) => {
        if (isMounted()) setHasNewMessages(false);
      });
    }
  }, [isOpen]);

  useWebSocket(getWebSocket, {
    onmessage: function (this, event) {
      const data = JSON.parse(event.data) as {
        action: "QUESTION_NOTIFICATION";
        data: { questionId: number };
      };
      if (data.action === "QUESTION_NOTIFICATION") {
        setHasNewMessages(true);
      }
    },
  });

  return (
    <div className={classNames("relative", className)}>
      <NotificationList
        isOpen={isOpen}
        onClose={triggerNotificationList}
        searchNotification={searchNotification}
      />
      <FontIconButton
        fontProps={{ icon: faBell }}
        className={classNames("relative", "text-xl")}
        onClick={triggerNotificationList}
      >
        <ConditionalFragment condition={hasNewMessages}>
          <span
            className={classNames(
              "absolute top-[6px] right-[6px]",
              "block",
              "w-[6px] h-[6px]",
              "rounded-cl",
              "bg-red"
            )}
          />
        </ConditionalFragment>
      </FontIconButton>
    </div>
  );
};

export default NotificationBell;

const NotificationList: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  searchNotification: (
    data: PagingAndSortingRequest,
    param: { disableLoader: boolean }
  ) => Promise<AxiosResponse<PageDtoNotificationMessageDto>>;
}> = ({ isOpen, onClose, searchNotification }) => {
  const {
    data: { value, loading },
    callback,
  } = usePaginationFn(
    async (options: DeepPartial<PagingAndSortingRequest> = {}) =>
      await searchNotification(
        merge<
          {},
          PagingAndSortingRequest,
          DeepPartial<PagingAndSortingRequest>
        >(
          {},
          {
            paging: { page: 1, pageSize: 20 },
            sorting: { sortFields: ["createdAt"], sort: "DESC" },
          },
          options
        ),
        { disableLoader: true }
      ).then((res) => ({
        ...res.data,
        items: res.data.items.map(({ ref, ...item }) => ({
          ...item,
          _ref: ref,
        })),
      }))
  );

  if (!isOpen) return null;

  return (
    <React.Fragment>
      <Modal visible={isOpen} className={classNames("lg:hidden")}>
        <Flexbox
          direction={"col"}
          className={classNames("w-full h-full", "bg-white")}
        >
          <Flexbox
            align={"center"}
            justify={"center"}
            className={classNames(
              "relative",
              "py-4",
              "border-solid border-b border-grey4"
            )}
          >
            <Fonts fontSize={"title"}>通知</Fonts>
            <FontIconButton
              fontProps={{ icon: faTimes }}
              className={classNames("absolute right-2", "text-2xl")}
              onClick={onClose}
            />
          </Flexbox>
          <UList
            data={value}
            loading={loading}
            onEndReached={callback}
            keyExtractor={(item) => `${item.id}`}
            containerClassName={classNames(
              "flex-1 overflow-scroll",
              "divide-y divide-grey4"
            )}
            renderEmpty={() => (
              <p className={classNames("py-4", "text-center")}>
                沒有任何通知喔
              </p>
            )}
            renderLoading={() => (
              <li className={classNames("py-4", "text-center")}>
                載入中。。。
              </li>
            )}
            renderItem={NotificationCard}
          />
        </Flexbox>
      </Modal>
      <div
        className={classNames(
          "absolute py-2 overflow-scroll z-10 right-0 top-[calc(100%+1rem)]",
          "lg:w-[25rem] lg:max-h-[18.4375rem]",
          "bg-white",
          "rounded-xl shadow-2xl"
        )}
      >
        <UList
          data={value}
          loading={loading}
          onEndReached={callback}
          keyExtractor={(item) => `${item.id}`}
          containerClassName={classNames(
            "h-full w-full overflow-scroll",
            "divide-y divide-grey4"
          )}
          renderEmpty={() => (
            <p className={classNames("py-4", "text-center")}>沒有任何通知喔</p>
          )}
          renderLoading={() => (
            <li className={classNames("py-4", "text-center")}>載入中。。。</li>
          )}
          renderItem={NotificationCard}
        />
      </div>
    </React.Fragment>
  );
};

const NotificationCard: React.FC<NotificationMessageDto> = ({
  content,
  createdAt,
}) => {
  return (
    <li className={classNames("py-3 px-6")}>
      <Fonts fontSize={"secondaryBody"} className={classNames("mb-1.5")}>
        {content}
      </Fonts>
      <Fonts fontSize={"tiny"} className={classNames("text-grey2")}>
        {countAgo(createdAt)}
      </Fonts>
    </li>
  );
};

const countAgo = (time: string) => {
  const now = classMoment();
  const updateAtMoment = classMoment(time);
  const diff = now.diff(updateAtMoment) / 1000;
  let agoValue = diff;
  let unit = "sec";

  const sec = 1;
  const min = 60 * sec;
  const hour = 60 * min;
  const day = 24 * hour;
  const week = 7 * day;

  if (diff >= min && diff < hour) {
    agoValue = diff / min;
    unit = "min";
  } else if (diff >= hour && diff < day) {
    agoValue = diff / hour;
    unit = "hr";
  } else if (diff >= day && diff < week) {
    agoValue = diff / day;
    unit = "day";
  } else if (diff >= week) {
    agoValue = diff / week;
    unit = "week";
  }

  return `${Math.floor(agoValue)} ${unit}`;
};
