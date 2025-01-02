export const inputParser = (input: string) => {
  if (input.includes("€")) {
    return priceParser(input);
  }
};

const priceParser = (price: string) => {
  return Number((price).replace("€", "").trim());
};