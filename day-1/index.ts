const file = Bun.file("./data.txt");
const text = await file.text();

// get first and last digit in string
// parse, and sum each digit
const lines = text.split("\n");

const WORD_TO_NUM = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

function replaceNumberWords(line: string): string {
  // iterate through num words
  // check if any word is present at start of string
  // if so, replace it, return replaceNumWords(rest)
  // else, return char + replaceNumWords(rest)
  if (line.length === 0) return line;

  for (const [word, number] of Object.entries(WORD_TO_NUM)) {
    // check if we have a match at the start
    if (line.startsWith(word)) {
      return word + number + word + replaceNumberWords(line.substring(1));
    }
  }

  // we've not matched a word at the beginning
  // move forward a char and try again
  return line.charAt(0) + replaceNumberWords(line.substring(1));
}

function getLineDigits(line: string) {
  let first;
  let last;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const parsed = parseInt(char, 10);
    if (parsed == char) {
      first = parsed;
      break;
    }
  }

  // start at the end, move inwards
  for (let i = line.length; i >= 0; i--) {
    const char = line[i];
    const parsed = parseInt(char, 10);
    if (parsed == char) {
      last = parsed;
      break;
    }
  }

  return parseInt(`${first}${last}`);
}

const digits = lines.map(replaceNumberWords).map(getLineDigits);

const sum = digits.reduce((acc, current) => acc + current, 0);

console.log(`Answer: ${sum}`);
