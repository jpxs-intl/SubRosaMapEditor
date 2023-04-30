import { Beam, Door, Portal, PortalFile, Window } from "../typings/blockFile";

export default class SBLFileParser {
  public static loadBlock(buffer: ArrayBuffer, fileName: string) {
    const dataView = new DataView(buffer);

    const version = dataView.getUint32(0, true);

   if (version !== 1) throw new Error(`SBL version ${version} is not supported.`);

    const size0 = dataView.getUint32(4, true);
    const size1 = dataView.getUint32(8, true);
    const size2 = dataView.getUint32(12, true);

    const floor = dataView.getUint32(16, true);
    const ceiling = dataView.getUint32(20, true);

    const wall1 = dataView.getUint32(24, true);
    const wall2 = dataView.getUint32(28, true);
    const wall3 = dataView.getUint32(32, true);
    const wall4 = dataView.getUint32(36, true);

    const surfaceQuanity = dataView.getUint32(40, true);

    let surfaces: {
      orderX: number;
      orderY: number;
      tessX: number;
      tessY: number;
      texture: number;
      projectTexture: number;
      data: {
        vertex: [number, number, number];
        texCoord: [number, number];
      }[][];
    }[] = [];

    let offset = 44;

    for (let i = 0; i < surfaceQuanity; i++) {
      const orderX = dataView.getUint32(offset, true);
      const orderY = dataView.getUint32(offset + 4, true);
      const tessX = dataView.getUint32(offset + 8, true);
      const tessY = dataView.getUint32(offset + 12, true);
      const texture = dataView.getUint32(offset + 16, true);
      const projectTexture = dataView.getUint32(offset + 20, true);

      offset += 24;

      let data: {
        vertex: [number, number, number];
        texCoord: [number, number];
      }[][] = [];

      for (let j = 0; j < 4; j++) {
        for (let k = 0; k < 4; k++) {
          if (!data[j]) data[j] = [];
          if (!data[j][k])
            data[j][k] = {
              vertex: [0, 0, 0],
              texCoord: [0, 0],
            };

          data[j][k].vertex[0] = dataView.getFloat32(offset, true);
          data[j][k].vertex[1] = dataView.getFloat32(offset + 4, true);
          data[j][k].vertex[2] = dataView.getFloat32(offset + 8, true);

          data[j][k].texCoord[0] = dataView.getFloat32(offset + 12, true);
          data[j][k].texCoord[1] = dataView.getFloat32(offset + 16, true);

          offset += 20;
        }
      }

     // console.log(data, fileName)

      const surface = {
        orderX,
        orderY,
        tessX,
        tessY,
        texture,
        projectTexture,
        data,
      };

      surfaces.push(surface);
    }

    const boxQuanity = dataView.getUint32(offset, true);
    offset += 4;

    let boxes: {
      vertices: [number, number, number][];
      textures: number[];
      sideFlag: number;
    }[] = [];

    for (let i = 0; i < boxQuanity; i++) {
      let vertices: [number, number, number][] = [];
      let textures: number[] = [];

      for (let j = 0; j < 8; j++) {
        vertices.push([
          dataView.getFloat32(offset, true),
          dataView.getFloat32(offset + 4, true),
          dataView.getFloat32(offset + 8, true),
        ]);

        offset += 12;
      }

      for (let j = 0; j < 6; j++) {
        textures.push(dataView.getUint32(offset, true));
        offset += 4
      }

      const sideFlag = dataView.getUint32(offset, true);
      offset += 4;

      const box = {
        vertices,
        textures,
        sideFlag,
      };

      boxes.push(box);
    }

    const block = {
      version,
      size0,
      size1,
      size2,
      floor,
      ceiling,
      wall1,
      wall2,
      wall3,
      wall4,
      surfaces,
      boxes,
    };

    //console.log(surfaceQuanity, boxQuanity)
    return block;
  }


  public static loadPortal(buffer: ArrayBuffer, fileName: string): PortalFile {

    const dataView = new DataView(buffer);
    const version = dataView.getUint32(0, true);

    let portals: Portal[] = [];

    let offset = 4;
    for (let i = 0; i < 16; i++) {
  
      const type = dataView.getUint32(offset, true);
      const x = dataView.getUint32(offset + 4, true);
      const width = dataView.getUint32(offset + 8, true);
      const y = dataView.getUint32(offset + 12, true);
      const height = dataView.getUint32(offset + 16, true);

      const doorCount = dataView.getUint32(offset + 20, true);
      
      offset += 24;

      let doors:Door[] = [];

      for (let j = 0; j < doorCount; j++) {
        const doorType = dataView.getUint32(offset, true);
        const x = dataView.getUint32(offset + 4, true);
        const y = dataView.getUint32(offset + 8, true);

        offset += 12;

        doors.push({
          doorType,
          x,
          y,
        });
      }

      const windowCount = dataView.getUint32(offset, true);
      offset += 4;

      let windows: Window[] = [];

      for (let j = 0; j < windowCount; j++) {
        const windowType = dataView.getUint32(offset, true);
        const x = dataView.getUint32(offset + 4, true);
        const width = dataView.getUint32(offset + 8, true);
        const y = dataView.getUint32(offset + 12, true);
        const height = dataView.getUint32(offset + 16, true);

        offset += 20;

        windows.push({
          windowType,
          x,
          width,
          y,
          height,
        });
      }

      const beamCount = dataView.getUint32(offset, true);
      offset += 4;

      let beams: Beam[] = [];

      for (let j = 0; j < beamCount; j++) {
        const beamType = dataView.getUint32(offset, true);
        const x = dataView.getUint32(offset + 4, true);
        const width = dataView.getUint32(offset + 8, true);
        const y = dataView.getUint32(offset + 12, true);
        const height = dataView.getUint32(offset + 16, true);

        offset += 20;

        beams.push({
          beamType,
          x,
          width,
          y,
          height,
        });
      }

      const portal = {
        type,
        x,
        width,
        y,
        height,
        doors,
        windows,
        beams,
      };
  
      portals.push(portal);
    }

    return {
      version,
      portals,
    }

  }

}
