import * as THREE from "three";
import Main from "../main";
import StatusPanel from "./statusPanel";

export default class MapRecenter {
  public static recenterMap(): void {

    console.log("Recentering map...");
    StatusPanel.status = "Auto-centering map..."

    const objects = Main.scene.children.filter((object) => object.name !== "enviroment");

    // Calculate the center of the map
    const center = objects.reduce((center, object) => {
      center.x += object.position.x;
      center.y += object.position.y;
      center.z += object.position.z;
      return center;
    }, new THREE.Vector3(0, 0, 0));

    center.x /= objects.length;
    center.y /= objects.length;
    center.z /= objects.length;

    // shift all objects to the center
    objects.forEach((object) => {
      object.position.x -= center.x;
      object.position.z -= center.z;
    });

    StatusPanel.tempStatus = "Map auto-centered."
  }
}
