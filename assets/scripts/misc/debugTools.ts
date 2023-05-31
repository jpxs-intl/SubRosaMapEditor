import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import Main from "../main";
import BuildingManager from "../managers/buildingManager";
import BuildingRenderer from "../renderers/renderBuilding";
import { CityFile } from "../typings/cityFile";
import Utils from "./utils";
import BlockManager from "../managers/blockManager";
import { BlockFile } from "../typings/blockFile";
// import "../lib/jsmodeler.js";
// import "../lib/jsmodeler.ext.three.js";

export default class DebugTools {
  public static init() {}

  public static renderBlock(block: BlockFile, adjustVec: THREE.Vector3, blockName: string) {
    /*for (const surface of block.surfaces) {
      for (let surfL = 0; surfL < 4; surfL++) {
        for (let surfW = 0; surfW < 4; surfW++) {                    
          const surfaceData = surface.data[surfL][surfW];
          const vertexMarker = new THREE.BoxGeometry(0.5, 0.5, 0.5);
          const vertexMarkerMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
          });
          const vertexMarkerMesh = new THREE.Mesh(
            vertexMarker,
            vertexMarkerMaterial
          );
          vertexMarkerMesh.position.set(
            buildingData.position[0] +
              surfaceData.vertex[0] +
              l,
            buildingData.position[1] +
              surfaceData.vertex[1] +
              h,
            buildingData.position[2] +
              surfaceData.vertex[2] +
              w
          );
          Main.scene.add(vertexMarkerMesh);
        }
      }
    }*/
    // const boxMesh = new THREE.Object3D();
    // for (const box of block.boxes) {
    //   let highestVertex = [-Infinity, -Infinity, -Infinity];
    //   let lowestVertex = [Infinity, Infinity, Infinity];
    //   for (const vertex of box.vertices) {
    //     if (vertex[0] > highestVertex[0] || vertex[1] > highestVertex[1] || vertex[2] > highestVertex[2]) {
    //       highestVertex = [...vertex];
    //     }
    //     if (vertex[0] < lowestVertex[0] || vertex[1] < lowestVertex[1] || vertex[2] < lowestVertex[2]) {
    //       lowestVertex = [...vertex];
    //     }
    //   }
    //   let minVec = new THREE.Vector3(lowestVertex[0], lowestVertex[1], lowestVertex[2]);
    //   let maxVec = new THREE.Vector3(highestVertex[0], highestVertex[1], highestVertex[2]);
    //   let dimensions = new THREE.Vector3().subVectors(maxVec, minVec);
    //   //if(tile.buildBlock.search("stairwell") != -1)
    //   //console.log(maxVec, minVec, tile.buildBlock)
    //   const boxGeo = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z);
    //   const matrix = new THREE.Matrix4().setPosition(
    //     dimensions.addVectors(minVec, maxVec).multiplyScalar(0.5).add(adjustVec)
    //   );
    //   boxGeo.applyMatrix4(matrix);
    //   const material = new THREE.MeshBasicMaterial({
    //     color: Utils.getColorFromString(blockName),
    //   });
    //   const mesh = new THREE.Mesh(boxGeo, material);
    //   boxMesh.add(mesh);
    /*const buildName = new TextGeometry(tile.buildBlock, {
        font: Main.font,
        size: 1,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: false,
      });

      const buildNameMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
      });
      const buildNameMesh = new THREE.Mesh(buildName, buildNameMaterial);

      buildNameMesh.position.copy(maxVec.add(adjustVec).add(new THREE.Vector3(0, 5, 0)))
      Main.scene.add(buildNameMesh);
    }*/
    // }
    // Main.scene.add(boxMesh);
  }

  public static renderDebugCityInfo(cityData: CityFile) {
    // render intersections
    cityData.intersections.forEach((intersection, index) => {
      const intersectionMarker = new THREE.SphereGeometry(1, 5, 5);
      const intersectionMarkerMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
      });
      const intersectionMarkerMesh = new THREE.Mesh(intersectionMarker, intersectionMarkerMaterial);
      intersectionMarkerMesh.position.set(intersection.x, intersection.y, intersection.z);

      intersectionMarkerMesh.name = `intersection-${index}`;

      Main.scene.add(intersectionMarkerMesh);
    });

    // render streets
    cityData.streets.forEach((street, index) => {
      if (
        !cityData.intersections[street.intersectionNumber[0]] ||
        !cityData.intersections[street.intersectionNumber[1]]
      )
        throw new Error(
          `Street ${index} has invalid intersection numbers | ${street.intersectionNumber[0]} ${street.intersectionNumber[1]}`
        );

      const intersectionA = cityData.intersections[street.intersectionNumber[0]];
      const intersectionB = cityData.intersections[street.intersectionNumber[1]];

      // draw street
      const streetGeometry = new THREE.BoxGeometry();
      const streetMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff });
      const streetMesh = new THREE.Mesh(streetGeometry, streetMaterial);
      streetMesh.position.set(
        (intersectionA.x + intersectionB.x) / 2,
        (intersectionA.y + intersectionB.y) / 2,
        (intersectionA.z + intersectionB.z) / 2
      );
      streetMesh.scale.set(
        0.5,
        0.5,
        Math.sqrt(
          Math.pow(intersectionA.x - intersectionB.x, 2) + Math.pow(intersectionA.z - intersectionB.z, 2)
        )
      );
      streetMesh.lookAt(intersectionB.x, intersectionB.y, intersectionB.z);

      streetMesh.name = `street_${index}_${street.streetName}_${street.intersectionNumber[0]}-${street.intersectionNumber[1]}`;

      Main.scene.add(streetMesh);

      // render street name
      const streetName = new TextGeometry(street.streetName, {
        font: Main.font,
        size: 1,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: false,
      });

      const streetNameMaterial = new THREE.MeshBasicMaterial({
        color: 0x0000ff,
      });
      const streetNameMesh = new THREE.Mesh(streetName, streetNameMaterial);

      streetNameMesh.position.set(
        (intersectionA.x + intersectionB.x) / 2,
        (intersectionA.y + intersectionB.y) / 2 + 2,
        (intersectionA.z + intersectionB.z) / 2
      );

      Main.scene.add(streetNameMesh);
    });

    // render buildings

    for (let buildingData of cityData.buildings) {
      const building = BuildingManager.instance.getBuilding(buildingData.name);
      // if (!building) throw new Error(`Building ${buildingData.name} not found!`);

      // for (let h = 0; h < building.height; h++) {
      //   for (let l = 0; l < building.length; l++) {
      //     for (let w = 0; w < building.width; w++) {
      //       const tile = building.tiles[w][l][h];
      //       if (!tile) continue;

      //       if (tile.buildBlock || tile.interiorBlock || tile.block) {
      //         let block: BlockFile | undefined = undefined;
      //         let interiorBlock: BlockFile | undefined = undefined;
      //         let buildBlock: BlockFile | undefined = undefined;

      //         let adjustVec = new THREE.Vector3(
      //           buildingData.position[0] + l,
      //           buildingData.position[1] + h,
      //           buildingData.position[2] + w
      //         );

      //         if (typeof tile.block != "number" && tile.block)
      //           block = BlockManager.instance.getblock(tile.block);
      //         if (typeof tile.interiorBlock != "number" && tile.interiorBlock)
      //           interiorBlock = BlockManager.instance.getblock(tile.interiorBlock);
      //         if (tile.buildBlock) buildBlock = BlockManager.instance.getblock(tile.buildBlock);

      //         if (block) this.renderBlock(block, adjustVec, tile.block as string);
      //         if (interiorBlock) this.renderBlock(interiorBlock, adjustVec, tile.interiorBlock as string);
      //         if (buildBlock) this.renderBlock(buildBlock, adjustVec, tile.buildBlock as string);

      //         /*if (!block && !buildBlock && !interiorBlock) {
      //           //throw new Error(`Block ${tile.buildBlock} not found!`)
      //           // console.log("funny not there", tile.buildBlock);
      //           continue;
      //         }*/

      //         // console.log(block.floor, block.ceiling, block.wall1, block.wall2, block.wall3, block.wall4, tile.buildBlock, block.size0, block.size1, block.size2)

      //         //console.log(tile.buildBlock, block.surfaces.length)
      //       }
      //     }
      //   }
      // }

      /*const cube = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({
        color: Utils.getColorFromString(buildingData.name),
      });
      const mesh = new THREE.Mesh(cube, material);
      mesh.position.set(
        buildingData.position[0],
        buildingData.position[1],
        buildingData.position[2]
      );
      mesh.scale.set(building.width, building.height, building.length);

      Main.scene.add(mesh);*/
    }

    // render sectors

    for (let sector of cityData.sectors) {
      let sectorSize = 8;
      let blockIndex = 0;

      for (let h = 0; h < sectorSize; h++) {
        for (let l = 0; l < sectorSize; l ++) {
          for (let w = 0; w < sectorSize; w++) {

            if (sector.blocks[blockIndex] != 0) {
              
              const box = new THREE.BoxGeometry();
              const material = new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                wireframe: false,
              });

              const blockMesh = new THREE.Mesh(box, material);

              blockMesh.position.set(sector.sectorX * sectorSize + w, sector.sectorY * sectorSize + h, sector.sectorZ * sectorSize + l);
              blockMesh.scale.set(1, 1, 1);

              blockMesh.name = `sector_${sector.sectorX}_${sector.sectorY}_${sector.sectorZ}_block_${w}_${h}_${l}`;
              Main.scene.add(blockMesh);
             
            }

            
            blockIndex++;
          }
        }
      }

    }
  }
}
