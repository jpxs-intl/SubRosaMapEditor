import { BuildingFile } from "../typings/buildingFile";
import ParserUtils from "./parserUtils";

export default class SBBFileParser {
  public static load(buffer: ArrayBuffer, fileName: string): BuildingFile {
    const dataView = new DataView(buffer);

    console.log(`${fileName}: ${dataView.byteLength.toString(16)}`)

    const version = dataView.getUint32(0, true); // 4
    const name = ParserUtils.getString(dataView, 4, 64); // 68

    const width = dataView.getUint32(68, true); // 72
    const length = dataView.getUint32(72, true); // 76
    const height = dataView.getUint32(76, true); // 80

    const offsetX = dataView.getUint32(80, true); // 84
    const offsetY = dataView.getUint32(84, true); // 88
    const offsetZ = dataView.getUint32(88, true); // 92

    const textureQuanity = dataView.getUint32(92, true); // 96

    let offset = 96;
    let textures: string[] = [];
    
    for (let i = 0; i < textureQuanity; i++) {
      textures.push(ParserUtils.getString(dataView, offset, 64)) // 64 byte strings;
      offset += 64;
    }

    const specialBlockQuanity = dataView.getUint32(offset, true); // 4
    offset += 4;

    let specialBlocks: string[] = [];

    for (let i = 0; i < specialBlockQuanity; i++) {
      specialBlocks.push(ParserUtils.getString(dataView, offset, 64)); // 64 byte strings
      offset += 64;
    }

    const buildBlockQuanity = dataView.getUint32(offset, true); // 4
    offset += 4;

    let buildBlocks: string[] = [];

    for (let i = 0; i < buildBlockQuanity; i++) {
      buildBlocks.push(ParserUtils.getString(dataView, offset, 64)); // 64 byte strings
      offset += 64;
    }

    const itemSetQuanity = dataView.getUint32(offset, true); // 4
    offset += 4;

    let itemSets: string[] = [];

    for (let i = 0; i < itemSetQuanity; i++) {
      itemSets.push(ParserUtils.getString(dataView, offset, 64)); // 64 byte strings
      offset += 64;
    }

    if (fileName == "burger") console.log(`${fileName}: BlockList starts at ${offset.toString(16)}`);

    let blocks: {
      block: number;
      interiorBlock: number;
      buildBlock: number;
      edgeX: number;
      edgeZ: number;
      floor: number;

      textures: [number, number, number, number, number, number, number, number];

      interiorTextures: [number, number, number, number, number, number, number, number];

      itemSet: number;
    }[][][] = [];

    let i = 0;

    for (let h = 0; h < height; h++) {
      for (let l = 0; l < length; l++) {
        for (let w = 0; w < width; w++) {
          const block = dataView.getUint32(offset, true); // 4
          const interiorBlock = dataView.getUint32(offset + 4, true); // 8
          const buildBlock = dataView.getUint32(offset + 8, true); // 12
          const edgeX = dataView.getUint32(offset + 12, true); // 16
          const edgeZ = dataView.getUint32(offset + 16, true); // 20
          const floor = dataView.getUint32(offset + 20, true); // 24

          offset += 24;

          const textures: number[] = [];
          for (let i = 0; i < 8; i++) {
            textures.push(dataView.getUint16(offset, true));
            offset += 2;
          }

          const interiorTextures: number[] = [];
          for (let i = 0; i < 8; i++) {
            interiorTextures.push(dataView.getUint16(offset, true));
            offset += 2;
          }

          const itemSet = dataView.getUint32(offset + 56, true);
          offset += 4;

          if (!blocks[w]) blocks[w] = [];
          if (!blocks[w][l]) blocks[w][l] = [];
          if (!blocks[w][l][h])
            blocks[w][l][h] = {
              block,
              interiorBlock,
              buildBlock,
              edgeX,
              edgeZ,
              floor,
              textures: textures as [number, number, number, number, number, number, number, number],
              interiorTextures: interiorTextures as [
                number,
                number,
                number,
                number,
                number,
                number,
                number,
                number
              ],
              itemSet,
            };

          i++;
        }
      }
    }

    return {
      version,
      name,
      width,
      length,
      height,
      offsetX,
      offsetY,
      offsetZ,
      textures,
      specialBlocks,
      buildBlocks,
      itemSets,
      blocks,
    };
  }
}
