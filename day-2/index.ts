import { toLines } from "../util";

const lines = await toLines("./data.txt");

type Colour = "red" | "green" | "blue";
type Cubes = {
  [colour in Colour]: number;
};

type Game = {
  id: number;
  contents: Cubes;
};

function parseReveal(reveal: string): Cubes {
  const colours = reveal.split(", ");

  let contents: Cubes = {
    red: 0,
    green: 0,
    blue: 0,
  };

  for (const colourEntry of colours) {
    const [amount, colour] = colourEntry.split(" ");

    contents[colour as Colour] = parseInt(amount, 10);
  }

  return contents;
}

function max(current: Cubes, compare: Required<Cubes>): Required<Cubes> {
  let largest = { ...compare };

  for (let key of Object.keys(largest)) {
    let tKey = key as keyof Cubes;
    if (current[tKey] !== undefined && (current[tKey] ?? 0) > largest[tKey]) {
      largest[tKey] = current[tKey]!;
    }
  }

  return largest;
}

function power(cubes: Cubes): number {
  return cubes.red * cubes.blue * cubes.green;
}

function parse(input: string[]): Game[] {
  const games: Game[] = [];

  for (const line of input) {
    const [game, input] = line.split(":");
    const gameId = parseInt(game.split(" ")[1], 10);

    const reveals = input.split(";");

    let highest: Cubes = {
      red: 0,
      green: 0,
      blue: 0,
    };

    for (const reveal of reveals) {
      const parsedReveal = parseReveal(reveal.trim());
      highest = max(parsedReveal, highest);
    }

    games.push({ id: gameId, contents: highest });
  }

  return games;
}

function filterByCriteria(games: Game[], criteria: Cubes): Game[] {
  let passed: Game[] = [];

  for (const game of games) {
    const { contents } = game;
    const { red, blue, green } = contents;
    if (
      red <= criteria.red &&
      blue <= criteria.blue &&
      green <= criteria.green
    ) {
      passed.push(game);
    }
  }

  return passed;
}

const games = parse(lines);

const criteria: Cubes = { red: 12, green: 13, blue: 14 };

const passed = filterByCriteria(games, criteria);

const answerPart1 = passed.reduce((acc, game) => acc + game.id, 0);
const answerPart2 = games
  .map(({ contents }) => power(contents))
  .reduce((acc, pow) => acc + pow, 0);

console.log(`Answer 1 ${answerPart1}`);
console.log(`Answer 2 ${answerPart2}`);
