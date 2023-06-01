import DynamicLoader from "../managers/dynamicLoader";
import DebugTools from "../misc/debugTools";
import MapRecenter from "../misc/mapRecenter";
import StatusPanel from "../misc/statusPanel";
import { CityFile } from "../typings/cityFile";
import ParserUtils from "./parserUtils";

export default class SBCFileParser {
  public static async load(buffer: ArrayBuffer, fileName: string) {
    const dataView = new DataView(buffer);

    const version = dataView.getUint32(0, true); // 4

    StatusPanel.status = `Loading ${fileName}... (version: ${version})`;

    const itemSetQuanity = dataView.getUint32(4, true); // 8

    let offset = 8;
    let itemSets: string[] = [];
    for (let i = 0; i < itemSetQuanity; i++) {
      // 64 byte strings
      const itemSet = ParserUtils.getString(dataView, offset, 64);
      itemSets.push(itemSet);
      offset += 64;
    }

    const interscetionQuanity = dataView.getUint32(offset, true); // 4
    offset += 4;

    let intersections: {
      x: number;
      y: number;
      z: number;
    }[] = [];

    for (let i = 0; i < interscetionQuanity; i++) {
      const x = dataView.getUint32(offset, true);
      const y = dataView.getUint32(offset + 4, true);
      const z = dataView.getUint32(offset + 8, true);
      offset += 12;

      intersections.push({
        x,
        y,
        z,
      });
    }

    const streetQuanity = dataView.getUint32(offset, true); // 4
    offset += 4;

    let streets: {
      intersectionNumber: [number, number];
      direction: number;
      leftLane: number;
      rightLane: number;
      streetName: string;
    }[] = [];
    for (let i = 0; i < streetQuanity; i++) {
      const intersectionNumber: [number, number] = [
        dataView.getUint32(offset, true),
        dataView.getUint32(offset + 4, true),
      ];
      offset += 8;

      const direction = dataView.getUint32(offset, true);
      offset += 4;

      const leftLane = dataView.getUint32(offset, true);
      offset += 4;

      const rightLane = dataView.getUint32(offset, true);
      offset += 4;

      const streetName = ParserUtils.getString(dataView, offset, 64);
      offset += 32;

      streets.push({
        intersectionNumber,
        direction,
        leftLane,
        rightLane,
        streetName,
      });
    }

    const buildingQuanity = dataView.getUint32(offset, true); // 4
    offset += 4;

    let buildings: {
      name: string;
      position: [number, number, number];
      rotation: number;
    }[] = [];

    for (let i = 0; i < buildingQuanity; i++) {
      const name = ParserUtils.getString(dataView, offset, 64);
      offset += 64;

      const position: [number, number, number] = [
        dataView.getUint32(offset, true),
        dataView.getUint32(offset + 4, true),
        dataView.getUint32(offset + 8, true),
      ];
      offset += 12;

      const rotation = dataView.getUint32(offset, true);
      offset += 4;

      buildings.push({
        name,
        position,
        rotation,
      });
    }

    const sectorQuanity = dataView.getUint32(offset, true); // 4
    offset += 4;

    let sectors: {
      areaNumber: number;
      sectorX: number;
      sectorY: number;
      sectorZ: number;

      blocks: number[]
      textures: number[]
      itemsets: number[]
    }[] = [];

    for (let i = 0; i < sectorQuanity; i++) {
        const areaNumber = dataView.getUint32(offset, true);
        const sectorX = dataView.getUint32(offset + 4, true);
        const sectorY = dataView.getUint32(offset + 8, true);
        const sectorZ = dataView.getUint32(offset + 12, true);
        offset += 16;

        const blocks: number[] = [];

        for (let i = 0; i < 512; i++) {
            blocks.push(dataView.getUint32(offset, true));
            offset += 4;
        }

        const textures: number[] = [];
        
        for (let i = 0; i < 4096; i++) {
            textures.push(dataView.getUint16(offset, true));
            offset += 2;
        }
        
        const itemsets: number[] = [];

        for (let i = 0; i < 512; i++) {
            itemsets.push(dataView.getUint16(offset, true));
            offset += 4;
        }

        sectors.push({
            areaNumber,
            sectorX,
            sectorY,
            sectorZ,
            blocks,
            textures,
            itemsets
        })

    }

    //const waypointCount = dataView.getUint32(offset, true);
    const waypointCount = 0

    offset += 4;

    const waypoints: {
      x: number;
      y: number;
      z: number;
    }[] = []


    for (let i = 0; i < waypointCount; i++) {
        const x = dataView.getUint32(offset, true);
        const y = dataView.getUint32(offset + 4, true);
        const z = dataView.getUint32(offset + 8, true);
        offset += 12;

        waypoints.push({
            x,
            y,
            z
        })
    }

    const cityData: CityFile = {
      version,
      itemSetQuanity,
      itemSets,
      interscetionQuanity,
      intersections,
      streetQuanity,
      streets,
      buildingQuanity,
      buildings,
      sectorQuanity,
      sectors,
      waypoints
    };

    StatusPanel.status = `Loaded ${fileName}`;

    console.log("Loaded", fileName);
    console.log(JSON.stringify(cityData, null))

   // await DynamicLoader.getRequiredData(cityData);

    DebugTools.renderDebugCityInfo(cityData);

    // MapRecenter.recenterMap()
  }
}
