import type { CompItem } from "../types/types";

export const compare = (items: CompItem[]): CompItem[] => {
  // 0-worse, 1-equal, 2-better
  let result = [];
  const i = 0;
  if (items[i].price === items[i + 1].price) {
    items[i].price = 1;
    items[i + 1].price = 1;
  } else if (items[i].price > items[i + 1].price) {
    items[i].price = 0;
    items[i + 1].price = 2;
  } else {
    items[i].price = 2;
    items[i + 1].price = 0;
  }
  console.log(items);
  return items;
};
