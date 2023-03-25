import * as THREE from "three";

export default class BuildingManager {
  private static _instance: BuildingManager;

  private _buildings: Map<string, ArrayBuffer>;

  private constructor() {
    this._buildings = new Map();
  }

  public static get instance(): BuildingManager {
    if (!BuildingManager._instance) {
      BuildingManager._instance = new BuildingManager();
    }
    return BuildingManager._instance;
  }

  public getBuilding(name: string): ArrayBuffer | undefined {
    return this._buildings.get(name);
  }

  public loadBuilding(name: string, path: string): Promise<ArrayBuffer | undefined> {
    return new Promise((resolve, reject) => {
      if (this._buildings.has(name)) {
        resolve(this._buildings.get(name));
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

  public loadBuildings(buildings: { [name: string]: string }): Promise<Array<ArrayBuffer | undefined>> {
    return Promise.all(
      Object.keys(buildings).map((name) => {
        return this.loadBuilding(name, buildings[name]);
      })
    );
  }
}
