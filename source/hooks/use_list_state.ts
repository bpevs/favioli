import { useCallback, useEffect, useState } from 'preact/hooks';

// deno-lint-ignore no-explicit-any
type ListItem = any;

export interface ListState<Type> {
  contents: Type[];
  addItem: (item: Type) => void;
  updateItem: (index: number, item: Type) => void;
  deleteItem: (index: number) => void;
}

export default (initialValue: ListItem[]) => {
  const [contents, setContents] = useState(initialValue);

  useEffect(() => setContents(initialValue) , [ initialValue ]);

  return {
    contents,

    addItem: useCallback((listItem: ListItem) => {
      setContents([...contents, listItem]);
    }, [contents]),

    updateItem: useCallback(
      (indexToUpdate: number, updatedListItem: ListItem) => {
        const updatedListItems: ListItem[] = contents.map(
          (prevListItem, index) =>
            index === indexToUpdate ? updatedListItem : prevListItem,
        );
        setContents(updatedListItems);
      },
      [contents],
    ),

    deleteItem: useCallback((listItemIndex: number) => {
      const nextlistItems = contents.filter(
        (_, index) => index !== listItemIndex,
      );
      setContents(nextlistItems);
    }, [contents]),
  };
};
