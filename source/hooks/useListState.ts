import { useCallback, useState } from 'preact/hooks';

// deno-lint-ignore no-explicit-any
type ListItem = any;

export interface ListState<Type> {
  listItems: Type[];
  addListItem: (item: Type) => void;
  updateListItem: (index: number, item: Type) => void;
  deleteListItem: (index: number) => void;
}

export default (initialValue: ListItem[]) => {
  const [listItems, setListItems] = useState(initialValue);

  return {
    listItems,

    addListItem: useCallback((listItem: ListItem) => {
      setListItems([...listItems, listItem]);
    }, []),

    updateListItem: useCallback(
      (listItemIndex: number, nextListItem: ListItem) => {
        const nextlistItems: ListItem[] = listItems.map(
          (listItem, index) => {
            return index === listItemIndex ? nextListItem : listItem;
          },
        );

        setListItems(nextlistItems);
      },
      [],
    ),

    deleteListItem: useCallback((listItemIndex: number) => {
      const nextlistItems = listItems.filter(
        (_, index) => index !== listItemIndex,
      );

      setListItems(nextlistItems);
    }, []),
  };
};
