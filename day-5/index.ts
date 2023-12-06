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
    public dependsUpon?: Map,
    public next?: Map
  ) { }
}

function buildMaps(input: string): Map[] {
  const parts = input.split("\n\n");
  const seeds = parts[0].split(": ")[1].split(" ").map(Number);
  console.log(seeds);

  const maps = parts.slice(1);

  const mapObjects: Map[] = [];

  let previousMap = undefined;

  for (const map of maps) {
    const name = map.split(" ")[0];

    const mapObject = new Map(name as MapTypes, [], previousMap);

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

  console.log(mapObjects);
}

const maps = buildMaps(rawData);
