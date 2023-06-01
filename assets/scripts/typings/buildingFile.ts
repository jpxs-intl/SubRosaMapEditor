export interface BuildingFile {
  version: number;
  name: string;
  width: number;
  length: number;
  height: number;
  offsetX: number;
  offsetY: number;
  offsetZ: number;
  textures: string[];
  specialBlocks: string[];
  buildBlocks: string[];
  itemSets: string[];
  tiles: Tile[][][];
}

export interface Tile {
  block?: string | number;
  interiorBlock?: string | number;
  buildBlock?: string;
  edgeX: number;
  edgeZ: number;
  floor: number;
  textures: [string, string, string, string, string, string, string, string];
  interiorTextures: [string, string, string, string, string, string, string, string];
  itemSet?: string;
}
