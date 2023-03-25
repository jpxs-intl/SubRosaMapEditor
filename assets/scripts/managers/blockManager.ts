import * as THREE from "three";

export default class BlockManager {
  private static _instance: BlockManager;

  private _blocks: Map<string, ArrayBuffer>;

  private constructor() {
    this._blocks = new Map();
  }

  public static get instance(): BlockManager {
    if (!BlockManager._instance) {
      BlockManager._instance = new BlockManager();
    }
    return BlockManager._instance;
  }

  public getblock(name: string): ArrayBuffer | undefined {
    return this._blocks.get(name);
  }

  public loadblock(name: string, path: string): Promise<ArrayBuffer | undefined> {
    return new Promise((resolve, reject) => {
      if (this._blocks.has(name)) {
        resolve(this._blocks.get(name));
      } else {
        fetch(`/assets/${path}`).then((response) => {
          if (response.ok) {
            resolve(response.arrayBuffer());
          } else {
            reject(response.statusText);
          }
        });
      }
    });
  }

  public loadblocks(blocks: string[]): Promise<Array<ArrayBuffer | undefined>> {
    return Promise.all(
        blocks.map((name) => {
            return this.loadblock(name, `${name}.sbl`);
        })
    );
  }
}
