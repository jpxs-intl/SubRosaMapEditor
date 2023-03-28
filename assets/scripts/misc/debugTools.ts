import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import Main from "../main";
import BuildingManager from "../managers/buildingManager";
import { CityFile } from "../typings/cityFile";
import Utils from "./utils";

export default class DebugTools {
  public static keyCombos: Map<string, () => void>;
  public static debugBaseCombo = "^d";

  public static init() {}

  public static renderDebugCityInfo(cityData: CityFile) {
    // render intersections
    cityData.intersections.forEach((intersection, index) => {
      const intersectionMarker = new THREE.SphereGeometry(0.5, 32, 32);
      const intersectionMarkerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const intersectionMarkerMesh = new THREE.Mesh(intersectionMarker, intersectionMarkerMaterial);
      intersectionMarkerMesh.position.set(intersection.x, intersection.y, intersection.z);
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
      Main.scene.add(streetMesh);

      // render street name
      const streetName = new TextGeometry(street.streetName, {
        font: Main.font,
        size: 1,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: false,
      });

      const streetNameMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
      const streetNameMesh = new THREE.Mesh(streetName, streetNameMaterial);

      streetNameMesh.position.set(
        (intersectionA.x + intersectionB.x) / 2,
        (intersectionA.y + intersectionB.y) / 2 + 2,
        (intersectionA.z + intersectionB.z) / 2
      );

      Main.scene.add(streetNameMesh);
    });

      // render buildings

      cityData.buildings.forEach((buildingData, index) => {

        const building = BuildingManager.instance.getBuilding(buildingData.name);   

        if (!building) throw new Error(`Building ${buildingData.name} not found`);

        const position = new THREE.Vector3(buildingData.position[0] + building.offsetX, buildingData.position[1] + building.offsetY, buildingData.position[2] + building.offsetZ);
        const length = building.length;
        const width = building.width;
        const height = building.height;

        const buildingGeometry = new THREE.BoxGeometry(length, height, width);
        const buildingMaterial = new THREE.MeshBasicMaterial({ color: Utils.getColorFromString(buildingData.name)});
        const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
        buildingMesh.position.set(position.x, position.y, position.z);
        Main.scene.add(buildingMesh);

        // render building name
        const buildingName = new TextGeometry(buildingData.name, {
            font: Main.font,
            size: 1,
            height: 0.1,
            curveSegments: 12,
            bevelEnabled: false,
        });

        const buildingNameMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        const buildingNameMesh = new THREE.Mesh(buildingName, buildingNameMaterial);

        buildingNameMesh.position.set(position.x, position.y + height + 2, position.z);
        Main.scene.add(buildingNameMesh);


      })
  }
}
