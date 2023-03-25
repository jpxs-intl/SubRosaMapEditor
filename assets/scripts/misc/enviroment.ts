import * as THREE from "three";
import Main from "../main";

export default class Enviroment {
    
    private static _instance: Enviroment;

    public static get instance() {
        if (!this._instance) {
            this._instance = new Enviroment();
        }
        return this._instance;
    }

    public init() {
        Main.scene.background = new THREE.Color(0x000000);
        Main.scene.fog = new THREE.Fog(0x222222, 0, 1000);

        const groundPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000),
            new THREE.MeshBasicMaterial({ color: 0x999999, depthWrite: false })
        );

        groundPlane.rotation.x = -Math.PI / 2;
        groundPlane.position.y = -0.5;
        Main.scene.add(groundPlane);

        const grid = new THREE.GridHelper(1000, 100, 0xff0000, 0x00ff00);
        Main.scene.add(grid);
        
    }

}