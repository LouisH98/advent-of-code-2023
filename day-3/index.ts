import { toLines } from "../util";

const lines = await toLines("./data.txt");

const charLines = lines.map((line) => Array.from(line));

function isSymbol(char: string) {
  return isNaN(parseInt(char, 10)) && char !== ".";
}

function isNumeric(char: string) {
  return !isNaN(parseInt(char, 10));
}

let found: any = {};

function recordFound(i: number, j: number) {
  if (!(i in found)) {
    found[i] = {};
  }

  found[i][j] = true;
}
function getPart(schematic: string[][], i: number, j: number): number {
  const line = schematic[i];

  while (isNumeric(line[j - 1])) {
    j--;
  }

  let partNumber = "";

  while (isNumeric(line[j])) {
    recordFound(i, j);
    partNumber += line[j++];
  }

  return parseInt(partNumber, 10);
}

function findPartsForSymbol(
  schematic: string[][],
  i: number,
  j: number
): number[] {
  const parts: number[] = [];
  for (const x of [-1, 0, 1]) {
    for (const y of [-1, 0, 1]) {
      if (
        isNumeric(schematic[i + x][j + y]) &&
        found[i + x]?.[j + y] === undefined
      ) {
        parts.push(getPart(schematic, i + x, j + y));
      }
    }
  }

  return parts;
}

function getEngineParts(input: string[][]): number[] {
  const numbers: number[] = [];

  for (let i = 0; i < input.length; i++) {
    const line = input[i];
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (isSymbol(char)) {
        numbers.push(...findPartsForSymbol(input, i, j));
      }
    }
  }

  return numbers;
}

function getGearRatio(input: string[][]): number[] {
  const ratios: number[] = [];

  for (let i = 0; i < input.length; i++) {
    const line = input[i];
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === "*") {
        const numbers = findPartsForSymbol(input, i, j);
        if (numbers.length >= 2) {
          const ratio = numbers.reduce((acc, number) => acc * number);
          ratios.push(ratio);
        }
      }
    }
  }

  return ratios;
}

const parts = getEngineParts(charLines);

const answer = parts.reduce((acc, part) => acc + part, 0);

found = {};

const gearRatios = getGearRatio(charLines);

const answer2 = gearRatios.reduce((acc, ratio) => acc + ratio, 0);
console.log(answer);
console.log(answer2);
