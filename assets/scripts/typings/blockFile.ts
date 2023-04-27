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
  surfaces: Surface[];
  boxes: Box[];
}

export interface Box {
  vertices: number[][];
  textures: number[];
  sideFlag: number;
}

export interface Surface {
  orderX: number;
  orderY: number;
  tessX: number;
  tessY: number;
  texture: number;
  projectTexture: number;
  data: {
    vertex: [number, number, number];
    texCoord: [number, number];
  }[][]
}

export interface PortalFile {
  version: number
  portals: Portal[]
}

export interface Portal {
  type: number
  x: number
  width: number
  y: number
  height: number
  doors: Door[]
  windows: Window[]
  beams: Beam[]
}

export interface Door {
  doorType: number
  x: number
  y: number
}

export interface Window {
  windowType: number
  x: number
  y: number
  width: number
  height: number
}

export interface Beam {
  beamType: number
  x: number
  y: number
  width: number
  height: number
}