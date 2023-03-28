import { BuildingFile } from "../typings/buildingFile";
import ParserUtils from "./parserUtils";

export default class SBBFileParser {
  public static load(buffer: ArrayBuffer, fileName: string): BuildingFile {
    const dataView = new DataView(buffer);

    const version = dataView.getUint32(0, true);
    const name = ParserUtils.getString(dataView, 4, 64);

    const width = dataView.getUint32(68, true);
    const length = dataView.getUint32(72, true);
    const height = dataView.getUint32(76, true);

    const offsetX = dataView.getUint32(80, true);
    const offsetY = dataView.getUint32(84, true);
    const offsetZ = dataView.getUint32(88, true);

    const textureQuanity = dataView.getUint32(92, true);

    let offset = 96;
    let textures: string[] = [];

    for (let i = 0; i < textureQuanity; i++) {
      textures.push(ParserUtils.getString(dataView, offset, 64));
      offset += 64;
    }

    const specialBlockQuanity = dataView.getUint32(offset, true);
    offset += 4;

    let specialBlocks: string[] = [];

    for (let i = 0; i < specialBlockQuanity; i++) {
      specialBlocks.push(ParserUtils.getString(dataView, offset, 64));
      offset += 64;
    }

    const buildBlockQuanity = dataView.getUint32(offset, true);
    offset += 4;

    let buildBlocks: string[] = [];

    for (let i = 0; i < buildBlockQuanity; i++) {
      buildBlocks.push(ParserUtils.getString(dataView, offset, 64));
      offset += 64;
    }

    const itemSetQuanity = dataView.getUint32(offset, true);
    offset += 4;

    let itemSets: string[] = [];

    for (let i = 0; i < itemSetQuanity; i++) {
      itemSets.push(ParserUtils.getString(dataView, offset, 64));
      offset += 64;
    }

    if (fileName == "burger") console.log(`${fileName}: BlockList starts at ${offset.toString(16)}`)

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
    }[][][] = []

    let i = 0

    for (let h = 0; h < height; h++) {
      for (let l = 0; l < length; l++) {
        for (let w = 0; w < width; w++) {

            const block = dataView.getUint32(offset, true);
            
            if (fileName == "burger") console.log(`${fileName}: BlockList[${h}][${l}][${w}] starts at ${offset.toString(16)} (${block})`)

            const interiorBlock = dataView.getUint32(offset + 4, true);
            const buildBlock = dataView.getUint32(offset + 8, true);
            const edgeX = dataView.getUint32(offset + 12, true);
            const edgeZ = dataView.getUint32(offset + 16, true);
            const floor = dataView.getUint32(offset + 20, true);

            offset += 24;

            const textures = [ // 2 bytes each
                dataView.getUint16(offset + 24, true),
                dataView.getUint16(offset + 26, true),
                dataView.getUint16(offset + 28, true),
                dataView.getUint16(offset + 30, true),
                dataView.getUint16(offset + 32, true),
                dataView.getUint16(offset + 34, true),
                dataView.getUint16(offset + 36, true),
                dataView.getUint16(offset + 38, true),
            ] as [number, number, number, number, number, number, number, number];

            offset += 16

            const interiorTextures = [ // 2 bytes each
                dataView.getUint16(offset + 40, true),
                dataView.getUint16(offset + 42, true),
                dataView.getUint16(offset + 44, true),
                dataView.getUint16(offset + 46, true),
                dataView.getUint16(offset + 48, true),
                dataView.getUint16(offset + 50, true),
                dataView.getUint16(offset + 52, true),
                dataView.getUint16(offset + 54, true),
            ] as [number, number, number, number, number, number, number, number];

            offset += 16

            const itemSet = dataView.getUint32(offset + 56, true);
            offset += 4

            if (!blocks[w]) blocks[w] = [];
            if (!blocks[w][l]) blocks[w][l] = [];
            if (!blocks[w][l][h]) blocks[w][l][h] = {
                block,
                interiorBlock,
                buildBlock,
                edgeX,
                edgeZ,
                floor,
                textures,
                interiorTextures,
                itemSet
            };

            i++
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
        blocks
    };
  }
}
