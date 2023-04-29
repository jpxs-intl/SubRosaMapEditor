import { BuildingFile } from "../typings/buildingFile";
import ParserUtils from "./parserUtils";

export default class SBBFileParser {
  public static load(buffer: ArrayBuffer, fileName: string): BuildingFile {
    const dataView = new DataView(buffer);

    // console.log(`${fileName}: ${dataView.byteLength.toString(16)}`)

    const version = dataView.getUint32(0, true); // 4
    const name = ParserUtils.getString(dataView, 4, 64); // 68

    const width = dataView.getUint32(68, true); // 72
    const length = dataView.getUint32(72, true); // 76
    const height = dataView.getUint32(76, true); // 80

    const offsetX = dataView.getUint32(80, true); // 84
    const offsetY = dataView.getUint32(84, true); // 88
    const offsetZ = dataView.getUint32(88, true); // 92

    const textureQuantity = dataView.getUint32(92, true); // 96

    let offset = 96;
    let textures: string[] = [];
    
    for (let i = 0; i < textureQuantity; i++) {
      textures.push(ParserUtils.getString(dataView, offset, 64)) // 64 byte strings;
      offset += 64;
    }

    const specialBlockQuantity = dataView.getUint32(offset, true); // 4
    offset += 4;

    let specialBlocks: string[] = [];

    for (let i = 0; i < specialBlockQuantity; i++) {
      specialBlocks.push(ParserUtils.getString(dataView, offset, 64)); // 64 byte strings
      offset += 64;
    }

    const buildBlockQuantity = dataView.getUint32(offset, true); // 4
    offset += 4;

    let buildBlocks: string[] = [];

    for (let i = 0; i < buildBlockQuantity; i++) {
      buildBlocks.push(ParserUtils.getString(dataView, offset, 64)); // 64 byte strings
      offset += 64;
    }

    const itemSetQuantity = dataView.getUint32(offset, true); // 4
    offset += 4;

    let itemSets: string[] = [];

    for (let i = 0; i < itemSetQuantity; i++) {
      itemSets.push(ParserUtils.getString(dataView, offset, 64)); // 64 byte strings
      offset += 64;
    }

    if (fileName == "burger") console.log(`${fileName}: BlockList starts at ${offset.toString(16)}`);

    let tiles: {
      block?: string | number;
      interiorBlock?: string | number;
      buildBlock?: string;
      edgeX: number;
      edgeZ: number;
      floor: number;

      textures: [string, string, string, string, string, string, string, string];

      interiorTextures: [string, string, string, string, string, string, string, string];

      itemSet?: string;
    }[][][] = [];

    for (let h = 0; h < height; h++) {
      for (let l = 0; l < length; l++) {
        for (let w = 0; w < width; w++) {
          let block: string | number = dataView.getUint32(offset, true); // 4
          let interiorBlock: string | number = dataView.getUint32(offset + 4, true); // 8
          let buildBlock: string = buildBlocks[dataView.getUint32(offset + 8, true)]; // 12
          const edgeX = dataView.getUint32(offset + 12, true); // 16
          const edgeZ = dataView.getUint32(offset + 16, true); // 20
          const floor = dataView.getUint32(offset + 20, true); // 24

          if(Math.abs(block & 0xE0000000) == 0x80000000)
            block = specialBlocks[block & 0x3FF]

          if(Math.abs(interiorBlock & 0xE0000000) == 0x80000000)
            interiorBlock = specialBlocks[interiorBlock & 0x3FF]

          // console.log(dataView.getUint32(offset + 8, true), interiorBlock.toString(16), block.toString(16))
          // @TODO: #FF0 | Handle edge case where block == 0x40000000 and interiorBlock == 0xffff. buildBlock is undefined in this case.
          // Above todo seems to have been fixed by new parser changes, keeping for now until testing is done.


          offset += 24;

          const tileTextures: string[] = [];
          for (let i = 0; i < 8; i++) {
            tileTextures.push(textures[dataView.getUint16(offset, true)]);
            offset += 2;
          }

          const interiorTextures: string[] = [];
          for (let i = 0; i < 8; i++) {
            interiorTextures.push(textures[dataView.getUint16(offset, true)]);
            offset += 2;
          }

          const itemSet = itemSets[dataView.getUint32(offset + 56, true)];
          offset += 4;

          if (!tiles[w]) tiles[w] = [];
          if (!tiles[w][l]) tiles[w][l] = [];
          if (!tiles[w][l][h])
            tiles[w][l][h] = {
              block,
              interiorBlock,
              buildBlock,
              edgeX,
              edgeZ,
              floor,
              textures: tileTextures as [string, string, string, string, string, string, string, string],
              interiorTextures: interiorTextures as [string, string, string, string, string, string, string, string],
              itemSet,
            };
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
      tiles,
    };
  }
}