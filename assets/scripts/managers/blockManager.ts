import * as THREE from "three";
import StatusPanel from "../misc/statusPanel";
import SBLFileParser from "../parsers/sblFileParser";
import { BlockFile } from "../typings/blockFile";

export default class BlockManager {
  private static _instance: BlockManager;

  private _blocks: Map<string, BlockFile>;

  private constructor() {
    this._blocks = new Map();
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

  public loadblock(name: string, path: string): Promise<BlockFile | undefined> {
    return new Promise((resolve, reject) => {
      if (this._blocks.has(name)) { 
        resolve(this._blocks.get(name));
      } else {
        fetch(`/assets/block/${path}`).then(async (response) => {
          if (response.ok) {
            const buffer = await response.arrayBuffer();

            try {
              const block = SBLFileParser.load(buffer, name);
              this._blocks.set(name, block);
              resolve(block);
            } catch (error) {
              console.error(`Failed to load block ${name}`);
              reject(error);
            }
          } else {
            reject(response.statusText);
          }
        });
      }
    });
  }

  public async loadblocks(): Promise<Array<BlockFile | undefined>> {
    const blocks: {
      name: string;
      file: string;
    }[] = await fetch("/list/block").then((response) => response.json());

    let blockCount = 0;
    let blockTotal = blocks.length;

    return Promise.all(
      blocks.map(async (block) => {
        const b = await this.loadblock(block.name, block.file);
        blockCount++;

        StatusPanel.status = `Loading blocks: ${blockCount}/${blockTotal}`;

        return b;
      })
    )
      .catch((error) => {
        // console.error(error);
      })
      .then((blocks) => {
        if (!blocks) return [];
        return blocks.filter((block) => block !== undefined);
      });
  }
}
