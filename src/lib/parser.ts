export const inputParser = (input: string) => {
  if (input.includes("€")) {
    return priceParser(input);
  } else if (input.includes("CV")) {
    return hpParser(input);
  } else if (input.includes("s")) {
    return accelParser(input);
  } else if (input.includes("kg")) {
    return weightParser(input);
  }
};

const priceParser = (price: string) => {
  return Number((price).replace("€", "").trim());
};

const hpParser = (hp: string) => {
  return Number((hp.split(" "))[0].trim()); return
};

const accelParser = (accel: string) => {
  return Number((accel).replace("s", "").trim());
};

const weightParser = (weight: string) => {
  return Number((weight).replace("kg", "").trim());
};