import { useCallback, useEffect, useState } from 'preact/hooks';

export interface ListState<Type> {
  contents: Type[];
  addItem: (item: Type) => void;
  updateItem: (index: number, item: Type) => void;
  deleteItem: (index: number) => void;
}

export default function useListState<Type>(
  initialValue: Type[],
): ListState<Type> {
  const [contents, setContents] = useState<Type[]>(initialValue);

  useEffect(() => setContents(initialValue), [initialValue]);

  return {
    contents,

    addItem: useCallback((listItem: Type) => {
      setContents([...contents, listItem]);
    }, [contents]),

    updateItem: useCallback(
      (indexToUpdate: number, newListItem: Type) => {
        const newList: Type[] = contents
          .map((oldListItem, index) =>
            index === indexToUpdate ? newListItem : oldListItem
          );
        setContents(newList);
      },
      [contents],
    ),

    deleteItem: useCallback((itemIndex: number) => {
      setContents(contents.filter((_, index) => index !== itemIndex));
    }, [contents]),
  };
}
