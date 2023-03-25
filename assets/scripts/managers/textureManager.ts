import * as THREE from "three";

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
          `/assets/${path}`,
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

  public loadTextures(textures: { [name: string]: string }): Promise<Array<THREE.Texture | undefined>> {
    return Promise.all(
      Object.keys(textures).map((name) => {
        return this.loadTexture(name, textures[name]);
      })
    );
  }
}

