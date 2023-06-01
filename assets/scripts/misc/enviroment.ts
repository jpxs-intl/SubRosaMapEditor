import * as THREE from "three";
import Main from "../main";

export default class Enviroment {
  private static _instance: Enviroment;

  public groundPlane!: THREE.Mesh;
  public grid = new THREE.GridHelper(1000, 100, 0xff0000, 0x00ff00);

  public options = {
    showGrid: true,
    showGroundPlane: true,
    showFog: true,
  };

  public static get instance() {
    if (!this._instance) {
      this._instance = new Enviroment();
    }
    return this._instance;
  }

  public init() {
    Main.scene.background = new THREE.Color(0x000000);
    Main.scene.fog = new THREE.Fog(0x222222, 100, 700);

    this.groundPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(5000, 5000),
      new THREE.MeshBasicMaterial({ color: 0x999999, depthWrite: false })
    );

    this.groundPlane.rotation.x = -Math.PI / 2;
    this.groundPlane.position.y = -1;
    this.groundPlane.name = "enviroment_plane";
    Main.scene.add(this.groundPlane);

    this.grid.name = "enviroment_grid";
    Main.scene.add(this.grid);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 100, 0);
    light.name = "enviroment_light"
    Main.scene.add(light);

  }

  public update() {
    this.grid.visible = this.options.showGrid;
    this.groundPlane.visible = this.options.showGroundPlane;
    
    Main.scene.fog = this.options.showFog ? new THREE.Fog(0x222222, 100, 700) : null;
  }
}
