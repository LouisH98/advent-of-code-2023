import { toLines } from "../util";

const lines = await toLines("./data.txt");

type Card = {
  id: number;
  winning: number[];
  ours: number[];
};

function parseInput(input: string[]): Card[] {
  const cards: Card[] = [];

  for (const line of input) {
    const [card, numbers] = line.split(": ");
    const cardId = parseInt(card.split(/ +/)[1]);
    const [winning, ours] = numbers.trim().split(/ \| /);

    const winningNumers = winning
      .split(" ")
      .filter((str) => str.length > 0)
      .map((num) => parseInt(num));

    const ourNumbers = ours
      .split(" ")
      .filter((str) => str.length > 0)
      .map((num) => parseInt(num));

    cards.push({
      id: cardId,
      winning: winningNumers,
      ours: ourNumbers,
    });
  }
  return cards;
}

function getCardWins(card: Card): number {
  return card.ours.filter((number) => card.winning.includes(number)).length;
}

function getCardScore(wins: number): number {
  if (wins === 0) return 0;

  return Math.pow(2, wins - 1);
}

const cards = parseInput(lines);

const part1 = cards.reduce(
  (acc, card) => acc + getCardScore(getCardWins(card)),
  0
);

console.log(`Part one: ${part1}`);

// iterate through all cards
// have another array to keep track of quantities of each card
// use the previous value to calculate the current value

function part2(cards: Card[]) {
  let quantities = new Array(cards.length).fill(1);
  for (let index = 0; index < cards.length; index++) {
    const card = cards[index];
    const cardWins = getCardWins(card);

    for (let j = index + 1; j <= cardWins + index; j++) {
      quantities[j] += 1 * quantities[index];
    }
  }

  return quantities.reduce((acc, quant) => acc + quant, 0);
}
const start = performance.now();
const part2answer = part2(cards);
const end = performance.now();

console.log(part2(cards), end - start);
