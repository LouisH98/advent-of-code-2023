const file = Bun.file("./data.txt");
const rawData = await file.text();

type MapTypes =
  | "seed-to-soil"
  | "soil-to-fertilizer"
  | "fertilizer-to-water"
  | "water-to-light"
  | "light-to-temperature"
  | "temperature-to-humidity"
  | "humidity-to-location";

type Mapping = {
  source: number;
  destination: number;
  length: number;
};

class Map {
  constructor(
    public name: MapTypes,
    public mappings: Mapping[] = [],
    public seeds: number[],
    public dependsUpon?: Map,
    public next?: Map
  ) { }

  getMapForNumber(num: number) {
    for (const map of this.mappings) {
      if (num >= map.source && num <= map.source + map.length) {
        return map;
      }
    }
    return undefined;
  }


  getValue(input: number) {
    const mapping = this.getMapForNumber(input);


    if (mapping) {
      const offset = (mapping.destination - mapping.source);
      return input + offset;
    }

    return input
  }
}

function buildMaps(input: string, isSeedRange: boolean): { seeds: number[], mapObjects: Map[] } {
  const parts = input.split("\n\n");
  let seeds = parts[0].split(": ")[1].split(" ").map(Number);

  if (isSeedRange) {
    const seedRanges = [...seeds];
    seeds = [];

    for (let index = 0; index < seedRanges.length; index += 2) {
      const seedRangeStart = seedRanges[index];
      const seedRangeEnd = seedRangeStart + seedRanges[index + 1]


      for (let seed = seedRangeStart; seed < seedRangeEnd; seed++) {
        seeds.push(seed)
      }
    }
  }


  const maps = parts.slice(1);

  const mapObjects: Map[] = [];

  let previousMap = undefined;

  for (const map of maps) {
    const name = map.split(" ")[0];

    const mapObject: Map = new Map(name as MapTypes, [], seeds, previousMap);

    const mappings = map.split("\n").slice(1);

    for (const mapping of mappings) {
      const [destination, source, length] = mapping.split(" ").map(Number);

      mapObject.mappings.push({
        source,
        destination,
        length,
      });
    }

    mapObjects.push(mapObject);

    if (previousMap !== undefined) { previousMap.next = mapObject; }
    previousMap = mapObject;
  }

  return { seeds, mapObjects };
}




function getLocations(seeds, mapObjects) {
  let results = [];
  for (const seed of seeds) {
    let lastResult;
    for (const map of mapObjects) {
      if (lastResult === undefined) {
        lastResult = map.getValue(seed);
        continue;
      }
      lastResult = map.getValue(lastResult);
    }

    results.push(lastResult);
  }
  return results;
}

function part1() {
  const { seeds, mapObjects } = buildMaps(rawData, false);

  const locations = getLocations(seeds, mapObjects);

  console.log(`Answer: ${locations.sort((a, b) => (a - b))[0]}`)
}

function part2() {
  const { seeds, mapObjects } = buildMaps(rawData, true);

  const locations = getLocations(seeds, mapObjects);

  console.log(`Answer: ${locations.sort((a, b) => (a - b))[0]}`)
}


part1();
part2();