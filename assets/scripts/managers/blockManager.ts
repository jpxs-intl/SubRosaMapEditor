import StatusPanel from "../misc/statusPanel";
import { IfEquals } from "../misc/utilTypes";
import SBLFileParser from "../parsers/sblFileParser";
import { BlockFile, PortalFile } from "../typings/blockFile";

export default class BlockManager {
  private static _instance: BlockManager

  private _blocks: Map<string, BlockFile>;
  private _portals: Map<string, PortalFile>;

  private constructor() {
    this._blocks = new Map();
    this._portals = new Map();
  }

  public static get instance(): BlockManager {
    if (!BlockManager._instance) {
      BlockManager._instance = new BlockManager();
    }
    return BlockManager._instance;
  }

  public getblock(name: string): BlockFile | undefined {
    return this._blocks.get(name);
  }

  public getPortal(name: string): PortalFile | undefined {
    return this._portals.get(name);
  }

  public loadblock(name: string, path: string, type: "block" | "buildblock"): Promise<BlockFile | PortalFile | undefined> {
    return new Promise((resolve, reject) => {
      if (this._blocks.has(name)) { 
        resolve(this._blocks.get(name));
      } else {
        fetch(`/assets/${type}/${path}`).then(async (response) => {
          if (response.ok) {
            const buffer = await response.arrayBuffer();

            try {
              const block = type === "block" ? SBLFileParser.loadBlock(buffer, name) : SBLFileParser.loadPortal(buffer, name);
              type === "block" ? this._blocks.set(name, block as BlockFile) : this._portals.set(name, block as PortalFile);
              resolve(block);
            } catch (error) {
              console.error(`Failed to load ${type} ${name}`);
              console.error(error);
              reject(error);
            }
          } else {
            reject(response.statusText);
          }
        });
      }
    });
  }

  public async loadblocks<T extends "block" | "buildblock">(type: T): Promise<Array<T extends "block" ? (BlockFile | undefined) : (PortalFile | undefined)>> {
    const blocks: {
      name: string;
      file: string;
    }[] = await fetch(`/list/${type}`).then((response) => response.json());

    let blockCount = 0;
    let blockTotal = blocks.length;

    return Promise.all(
      blocks.map(async (block) => {
        const b = await this.loadblock(block.name, block.file, type);
        blockCount++;

        StatusPanel.status = `Loading ${type}s: ${blockCount}/${blockTotal}`;

        return b;
      })
    )
      .catch((error) => {
        // console.error(error);
      })
      .then((blocks) => {
        if (!blocks) return [];
        return blocks.filter((block) => block !== undefined);
      }) as Promise<Array<T extends "block" ? (BlockFile | undefined) : (PortalFile | undefined)>>
  }
}
