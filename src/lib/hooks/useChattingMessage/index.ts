import {formatChecker, S3File, usePaginationFn} from "../../";
import merge from "lodash.merge";
import {useCallback, useEffect, useRef, useState} from "react";
import {AxiosResponse} from "axios";
import {ClassRequestConfig} from "../../api/class.api";
import {DeepPartial} from "react-hook-form";

export interface QuestionChatMessageDto {
    content: string;

    /** @format date-time */
    createdAt: string;
    fileIds: number[];
    files: S3File[];

    /** @format int32 */
    id: number;
    issuer: "STUDENT" | "TEACHER";

    /** @format int32 */
    issuerId: number;
}

interface ChattingMessageSearchOptions<Dto> extends SearchOptions<Dto> {
    idGreaterThan?: number;
    idLessThan?: number;
}

const DEFAULT_SEARCH_OPTIONS: ChattingMessageSearchOptions<QuestionChatMessageDto> =
    {
        paging: {
            page: 1,
            pageSize: 10,
        },
        sorting: {
            sort: "DESC",
            sortFields: ["createdAt"],
        },
    };

const DEFAULT_NEW_MESSAGE_SEARCH_OPTIONS: ChattingMessageSearchOptions<QuestionChatMessageDto> =
    {
        paging: {
            page: 1,
            pageSize: 20,
        },
        sorting: {
            sort: "DESC",
            sortFields: ["createdAt"],
        },
    };

const DEFAULT_PAGE_DTO: PageDto<any> = {
    atPage: 0,
    totalPages: 0,
    totalCount: 0,
    items: [],
};

interface GetMessagesApi<Dto extends QuestionChatMessageDto> {
    (
        questionId: number,
        options: SearchOptions<Dto>,
        params?: ClassRequestConfig
    ): Promise<AxiosResponse<PageDto<Dto>>>;
}

const sortByCreatedAt = (a: { createdAt: string }, b: { createdAt: string }) =>
    a.createdAt.localeCompare(b.createdAt);

export const useChattingMessage = <Dto extends QuestionChatMessageDto>(
    questionId: number,
    getMessagesApi: GetMessagesApi<Dto>
) => {
    const [newMessages, setNewMessages] = useState<Dto[]>([]);
    const newestId = useRef<number>(0);
    const idLessThan = useRef<number | undefined>(undefined);

    const getNewMessages = useCallback(async () => {
        const newestMessages = await getMessagesApi(
            questionId,
            merge<{},
                ChattingMessageSearchOptions<Dto>,
                Partial<ChattingMessageSearchOptions<Dto>>>({}, DEFAULT_NEW_MESSAGE_SEARCH_OPTIONS, {
                idGreaterThan: newestId.current,
            }),
            {disableLoader: true}
        ).then((res) => {
            const newestMessage = res.data.items[0];

            if (formatChecker.isSet(newestMessage)) {
                newestId.current = newestMessage.id;
            }
            return res.data.items.sort(sortByCreatedAt);
        });
        setNewMessages((prev) => [...prev, ...newestMessages]);
    }, [questionId]);

    const {
        data: {value: oldMessages = DEFAULT_PAGE_DTO, loading},
        callback: turnPageCallback,
    } = usePaginationFn(
        async (options: DeepPartial<ChattingMessageSearchOptions<Dto>> = {}) => {
            const {data} = await getMessagesApi(
                questionId,
                merge<{},
                    ChattingMessageSearchOptions<Dto>,
                    DeepPartial<ChattingMessageSearchOptions<Dto>>>({}, DEFAULT_SEARCH_OPTIONS, options)
            );
            newestId.current = data.items[0]?.id || 0;
            const newOrder = data.items.sort(sortByCreatedAt);
            return {...data, items: newOrder};
        },
        [questionId],
        true
    );

    const turnPageHandler = useCallback(async () => {
        if (loading) return;
        if (formatChecker.isNotSet(oldMessages)) return;
        if (oldMessages.atPage === oldMessages.totalPages) return;

        const {atPage, totalPages} = oldMessages;

        if (formatChecker.isNotSet(idLessThan.current)) {
            const items = oldMessages.items;
            const itemCount = items.length;
            const id = items[itemCount - 1]?.id;
            if (formatChecker.isSet(id)) {
                idLessThan.current = id - 1;
            }
        }

        if (atPage < totalPages) {
            await turnPageCallback({
                idLessThan: idLessThan.current,
                paging: {
                    page: atPage + 1,
                    pageSize: DEFAULT_SEARCH_OPTIONS.paging.pageSize,
                },
            });
        }
    }, [turnPageCallback, loading, oldMessages]);

    useEffect(() => {
        turnPageCallback();
    }, []);

    return {newMessages, getNewMessages, oldMessages, turnPageHandler};
};
