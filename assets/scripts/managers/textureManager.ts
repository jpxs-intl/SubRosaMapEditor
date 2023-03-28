import * as THREE from "three";
import StatusPanel from "../misc/statusPanel";

export default class TextureManager {
  private static _instance: TextureManager;

  private _textures: Map<string, THREE.Texture>;

  private constructor() {
    this._textures = new Map();
  }

  public static get instance(): TextureManager {
    if (!TextureManager._instance) {
      TextureManager._instance = new TextureManager();
    }
    return TextureManager._instance;
  }

  public getTexture(name: string): THREE.Texture | undefined {
    return this._textures.get(name);
  }

  public loadTexture(name: string, path: string): Promise<THREE.Texture | undefined> {
    return new Promise((resolve, reject) => {
      if (this._textures.has(name)) {
        resolve(this._textures.get(name));
      } else {
        const loader = new THREE.TextureLoader();
        loader.load(
          `/assets/texture/${path}`,
          (texture) => {
            this._textures.set(name, texture);
            resolve(texture);
          },
          undefined,
          (error) => {
            reject(error);
          }
        );
      }
    });
  }

  public async loadTextures(): Promise<Array<THREE.Texture | undefined>> {
    
    const textures: {
      name: string;
      file: string;
    }[] = await fetch("/list/texture").then((response) => response.json());
    
    let textureCount = 0;
    let textureTotal = textures.length;

    return await Promise.all(
        textures.map(async (texture) => {
        const t = await this.loadTexture(texture.name, texture.file);
        textureCount++;
        StatusPanel.status = `Loading textures: ${textureCount}/${textureTotal}`;
        return t;
      })
    );
  }
}

