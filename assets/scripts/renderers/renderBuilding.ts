import * as THREE from "three";
import Main from "../main";
import BlockManager from "../managers/blockManager";
import { BuildingFile } from "../typings/buildingFile";

export default class BuildingRenderer {
  public static render(building: BuildingFile, position: THREE.Vector3) {
    const buildingGroup = new THREE.Group();
    buildingGroup.position.set(position.x, position.y, position.z);

    console.log(
      `Loading ${building.width * building.height * building.length} tiles for ${building.name}...`
    );

    console.table(building.specialBlocks);

    for (let x = 0; x < building.width; x++) {
      for (let y = 0; y < building.height; y++) {
        for (let z = 0; z < building.length; z++) {
          const tile = building.tiles[x][y][z];

          if (tile && tile.buildBlock != undefined) {
            const buildBlock = BlockManager.instance.getblock(tile.buildBlock);
            if (!buildBlock) {
              // console.log(`No build block found for ${tile.buildBlock}`);
              // console.log(tile.block, tile.interiorBlock);
              continue;
            }

            console.log(`Found build block ${tile.buildBlock}`);

            const debugCube = new THREE.Mesh(
              new THREE.BoxGeometry(1, 1, 1),
              new THREE.MeshBasicMaterial({ color: 0x00ff00 })
            );

            debugCube.position.set(x + position.x, y + position.y, z + position.z);
            console.log(debugCube.position);
            buildingGroup.add(debugCube);
          } else {
            // console.log("no build block");
          }
        }
      }
    }

    Main.scene.add(buildingGroup);
  }
}
