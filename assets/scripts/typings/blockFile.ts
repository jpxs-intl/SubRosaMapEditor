export interface BlockFile {
  version: number;
  size0: number;
  size1: number;
  size2: number;
  floor: number;
  ceiling: number;
  wall1: number;
  wall2: number;
  wall3: number;
  wall4: number;
  surfaces: any[];
  boxes: Box[];
}

export interface Box {
  vertices: number[][];
  textures: number[];
  sideFlag: number;
}
