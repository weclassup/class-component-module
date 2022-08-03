import { formatChecker } from "../";

export const turnPageHandler = <Item>(
  currentPage: PageDto<Item> | null | undefined,
  nextPage: PageDto<Item>,
  newItemsBeforeOldItems?: boolean
): PageDto<Item> => {
  if (formatChecker.isNotSet(currentPage)) return nextPage;

  const { atPage } = nextPage;

  if (atPage <= 1) {
    return nextPage;
  } else {
    if (newItemsBeforeOldItems) {
      return { ...nextPage, items: [...nextPage.items, ...currentPage.items] };
    } else {
      return { ...nextPage, items: [...currentPage.items, ...nextPage.items] };
    }
  }
};
