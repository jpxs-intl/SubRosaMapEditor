import StatusPanel from "../misc/statusPanel";
import SBBFileParser from "../parsers/sbbFileParser";
import { BuildingFile } from "../typings/buildingFile";
export default class BuildingManager {
  private static _instance: BuildingManager;

  private _buildings: Map<string, BuildingFile>;

  private constructor() {
    this._buildings = new Map();
  }

  public static get instance(): BuildingManager {
    if (!BuildingManager._instance) {
      BuildingManager._instance = new BuildingManager();
    }
    return BuildingManager._instance;
  }

  public getBuilding(name: string): BuildingFile | undefined {
    return this._buildings.get(name);
  }

  public getAllBuildings(): Map<string, BuildingFile> {
    return this._buildings;
  }

  public loadBuilding(name: string, path: string): Promise<BuildingFile | undefined> {
    return new Promise((resolve, reject) => {
      if (this._buildings.has(name)) {
        resolve(this._buildings.get(name));
      } else {
        fetch(`/assets/building/${path}`).then(async (response) => {
          if (response.ok) {
            const buffer = await response.arrayBuffer();
            const parsedBuilding = SBBFileParser.load(buffer, name);
            this._buildings.set(name, parsedBuilding);
            resolve(parsedBuilding);
          } else {
            reject(response.statusText);
          }
        });
      }
    });
  }

  public async loadBuildings(): Promise<Array<BuildingFile | undefined>> {
    const buildings: {
      name: string;
      file: string;
    }[] = await fetch("/list/building").then((response) => response.json());

    let buildingCount = 0;
    let buildingTotal = buildings.length;

    return await Promise.all(
      buildings.map(async (building) => {
        const b = await this.loadBuilding(building.name, building.file);
        buildingCount++;
        StatusPanel.status = `Loading buildings: ${buildingCount}/${buildingTotal}`;
        return b;
      })
    );
  }
}
