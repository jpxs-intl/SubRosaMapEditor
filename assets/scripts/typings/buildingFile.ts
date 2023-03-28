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
  blocks: Block[][][];
}

export interface Block {
  block: number;
  interiorBlock: number;
  buildBlock: number;
  edgeX: number;
  edgeZ: number;
  floor: number;
  textures: [number, number, number, number, number, number, number, number];
  interiorTextures: [number, number, number, number, number, number, number, number];
  itemSet: number;
}
