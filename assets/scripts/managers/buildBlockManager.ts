import StatusPanel from "../misc/statusPanel";
import SBLFileParser from "../parsers/sblFileParser";
import { BlockFile } from "../typings/blockFile";

export default class BuildBlockManager {
  private static _instance: BuildBlockManager;

  private _blocks: Map<string, BlockFile>;

  private constructor() {
    this._blocks = new Map();
  }

  public static get instance(): BuildBlockManager {
    if (!BuildBlockManager._instance) {
      BuildBlockManager._instance = new BuildBlockManager();
    }
    return BuildBlockManager._instance;
  }

  public getblock(name: string): BlockFile | undefined {
    return this._blocks.get(name);
  }

  public loadblock(name: string, path: string): Promise<BlockFile | undefined> {
    return new Promise((resolve, reject) => {
      if (this._blocks.has(name)) {
        resolve(this._blocks.get(name));
      } else {
        fetch(`/assets/buildblock/${path}`).then(async (response) => {
          if (response.ok) {
            const buffer = await response.arrayBuffer();

            try {
              const blockFile = SBLFileParser.load(buffer, name);
              this._blocks.set(name, blockFile);
            resolve(blockFile);
            } catch (error) {
              console.error(`Failed to load buildblock ${name}`);
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
    }[] = await fetch("/list/buildblock").then((response) => response.json());

    let blockCount = 0;
    let blockTotal = blocks.length;

    return Promise.all(
      blocks.map(async (block) => {
        const b = await this.loadblock(block.name, block.file);
        blockCount++;

        StatusPanel.status = `Loading buildblocks: ${blockCount}/${blockTotal}`;

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
