import type { CompItem } from "../types/types";

export const compare = (items: CompItem[]): CompItem[] => {
  // 0-worse, 1-equal, 2-better
  const i = 0;
  comparePrice(items);
  compareHp(items);
  compareAccel(items);
  compareWeight(items);
  return items;
};

const compareWeight = (items: CompItem[]) => {
    const i = 0;
    if (items[i].weight === items[i + 1].weight) {
        items[i].weight = 1;
        items[i + 1].weight = 1;
    } else if (items[i].weight > items[i + 1].weight) {
        items[i].weight = 0;
        items[i + 1].weight = 2;
    } else {
        items[i].weight = 2;
        items[i + 1].weight = 0;
    }
}

const compareAccel = (items: CompItem[]) => {
    const i = 0;
    if (items[i].accel === items[i + 1].accel) {
        items[i].accel = 1;
        items[i + 1].accel = 1;
    } else if (items[i].accel > items[i + 1].accel) {
        items[i].accel = 0;
        items[i + 1].accel = 2;
    } else {
        items[i].accel = 2;
        items[i + 1].accel = 0;
    }
}

const compareHp = (items: CompItem[]) => {
    const i = 0;
    if (items[i].hp === items[i + 1].hp) {
        items[i].hp = 1;
        items[i + 1].hp = 1;
    } else if (items[i].hp > items[i + 1].hp) {
        items[i].hp = 2;
        items[i + 1].hp = 0;
    } else {
        items[i].hp = 0;
        items[i + 1].hp = 2;
    }
}

const comparePrice = (items: CompItem[]) => {
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
};