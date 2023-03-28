import * as THREE from "three";
import Main from "../main";

export default class Enviroment {
    
    private static _instance: Enviroment;
    private _parent!: THREE.Object3D;

    public static get instance() {
        if (!this._instance) {
            this._instance = new Enviroment();
        }
        return this._instance;
    }

    public init() {
        
        Main.scene.background = new THREE.Color(0x000000);
        Main.scene.fog = new THREE.Fog(0x222222, 100, 700);

        this._parent = new THREE.Object3D();
        this._parent.name = "enviroment";

        const groundPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(5000, 5000),
            new THREE.MeshBasicMaterial({ color: 0x999999, depthWrite: false })
        );



        groundPlane.rotation.x = -Math.PI / 2;
        groundPlane.position.y = -0.5;
        this._parent.add(groundPlane);

        const grid = new THREE.GridHelper(1000, 100, 0xff0000, 0x00ff00);
        this._parent.add(grid);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 100, 0);
        this._parent.add(light);

        Main.scene.add(this._parent);
        
    }

}