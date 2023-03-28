export interface CityFile {
  version: number;
  itemSetQuanity: number;
  itemSets: string[];
  interscetionQuanity: number;
  intersections: Intersection[];
  streetQuanity: number;
  streets: Street[];
  buildingQuanity: number;
  buildings: Building[];
  sectorQuanity: number;
  sectors: Sector[];
  waypoints: Waypoint[];
}

export interface Street {
  intersectionNumber: [number, number];
  direction: number;
  leftLane: number;
  rightLane: number;
  streetName: string;
}

export interface Intersection {
  x: number;
  y: number;
  z: number;
}

export interface Building {
  name: string;
  position: [number, number, number];
  rotation: number;
}

export interface Sector {
  areaNumber: number;
  sectorX: number;
  sectorY: number;
  sectorZ: number;
  blocks: number[];
  textures: number[];
  itemsets: number[];
}

export interface Waypoint {
  x: number;
  y: number;
  z: number;
}
