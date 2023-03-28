import { Texture } from "three";
import StatusPanel from "../misc/statusPanel";
import { BlockFile } from "../typings/blockFile";
import { BuildingFile } from "../typings/buildingFile";
import { CityFile } from "../typings/cityFile";
import BlockManager from "./blockManager";
import BuildBlockManager from "./buildBlockManager";
import BuildingManager from "./buildingManager";
import TextureManager from "./textureManager";

export default class DynamicLoader {
  public static async loadBlocks(blockNames: string[]): Promise<Array<BlockFile | undefined>> {
    const blocks: {
      name: string;
      file: string;
    }[] = await fetch("/list/block")
      .then((response) => response.json())
      .then((blocks) => {
        return blocks.filter((block: { name: string; file: string }) => blockNames.includes(block.name));
      });

    let blockCount = 0;
    let blockTotal = blocks.length;

    return Promise.all(
      blocks.map(async (block) => {
        await BlockManager.instance.loadblock(block.name, block.file);
        blockCount++;
        StatusPanel.status = `Dynamically loading blocks: ${blockCount}/${blockTotal}`;
      })
    )
      .then(() => {
        StatusPanel.status = "Done loading blocks";
        return blockNames.map((name) => BlockManager.instance.getblock(name));
      })
      .catch((error) => {
        console.error(error);
      })
      .then((blocks) => {
        if (!blocks) {
          return [] as Array<BlockFile | undefined>;
        }
        return blocks;
      });
  }

  public static async loadBuildBlocks(blockNames: string[]): Promise<Array<BlockFile | undefined>> {
    const blocks: {
      name: string;
      file: string;
    }[] = await fetch("/list/buildblock")
      .then((response) => response.json())
      .then((blocks) => {
        return blocks.filter((block: { name: string; file: string }) => blockNames.includes(block.name));
      });

    let blockCount = 0;
    let blockTotal = blocks.length;

    return Promise.all(
      blocks.map(async (block) => {
        await BuildBlockManager.instance.loadblock(block.name, block.file);
        blockCount++;
        StatusPanel.status = `Dynamically loading build blocks: ${blockCount}/${blockTotal}`;
      })
    )
      .then(() => {
        StatusPanel.status = "Done loading build blocks";
        return blockNames.map((name) => BuildBlockManager.instance.getblock(name));
      })
      .catch((error) => {
        console.error(error);
      })
      .then((blocks) => {
        if (!blocks) {
          return [] as Array<BlockFile | undefined>;
        }
        return blocks;
      });
  }

  public static async loadBuildings(buildingNames: string[]): Promise<Array<BuildingFile | undefined>> {
    const buildings: {
      name: string;
      file: string;
    }[] = await fetch("/list/building")
      .then((response) => response.json())
      .then((buildings) => {
        return buildings.filter((building: { name: string; file: string }) =>
          buildingNames.includes(building.name)
        );
      });

    let buildingCount = 0;
    let buildingTotal = buildings.length;

    return Promise.all(
      buildings.map(async (building) => {
        await BuildingManager.instance.loadBuilding(building.name, building.file);
        buildingCount++;
        StatusPanel.status = `Dynamically loading buildings: ${buildingCount}/${buildingTotal}`;
      })
    ).then(() => {
      StatusPanel.status = "Done loading buildings";
      return buildingNames.map((name) => BuildingManager.instance.getBuilding(name));
    });
  }

  public static async loadTextures(textureNames: string[]): Promise<Array<Texture | undefined>> {
    const textures: {
      name: string;
      file: string;
    }[] = await fetch("/list/texture")
      .then((response) => response.json())
      .then((textures) => {
        return textures.filter((texture: { name: string; file: string }) =>
          textureNames.includes(texture.name)
        );
      });

    let textureCount = 0;
    let textureTotal = textures.length;

    return Promise.all(
      textures.map(async (texture) => {
        await TextureManager.instance.loadTexture(texture.name, texture.file);
        textureCount++;
        StatusPanel.status = `Dynamically loading textures: ${textureCount}/${textureTotal}`;
      })
    ).then(() => {
      StatusPanel.status = "Done loading textures";
      return textureNames.map((name) => TextureManager.instance.getTexture(name));
    });
  }

  public static async getRequiredData(city: CityFile) {
    await this.loadBuildings(city.buildings.map((building) => building.name));

    const blocksToGet = Array.from(BuildingManager.instance.getAllBuildings().values())
      .map((building) => building.specialBlocks)
      .reduce((acc, val) => acc.concat(val), []);

    await this.loadBlocks(blocksToGet);

    const buildBlocksToGet = Array.from(BuildingManager.instance.getAllBuildings().values())
      .map((building) => building.buildBlocks)
      .reduce((acc, val) => acc.concat(val), []);

    await this.loadBuildBlocks(buildBlocksToGet);

    const texturesToGet = Array.from(BuildingManager.instance.getAllBuildings().values())
      .map((building) => building.textures)
      .reduce((acc, val) => acc.concat(val), []);

    await this.loadTextures(texturesToGet);

    return;
  }
}
