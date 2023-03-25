import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import blockList from "./lists/blockList";
import BuildingList from "./lists/buildingList";
import TextureList from "./lists/textureList";
import BlockManager from "./managers/blockManager";
import BuildingManager from "./managers/buildingManager";
import TextureManager from "./managers/textureManager";
import Enviroment from "./misc/enviroment";
import MouseCastHandler from "./misc/mouseCastHandler";
import SelectionHandler from "./misc/selectionHandler";
import StatusPanel from "./misc/statusPanel";

export default class Main {
  private static _instance: Main;
  private _canvas: HTMLCanvasElement;
  private _renderer: THREE.WebGLRenderer;
  private _scene: THREE.Scene;
  private _camera: THREE.PerspectiveCamera;
  private _controls: OrbitControls;

  private _lastTime: number = 0;

  public static DEBUG = true;

  private constructor() {
    this._canvas = document.getElementById("c") as HTMLCanvasElement;
    this._renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this._canvas });

    this._canvas.width = window.innerWidth;
    this._canvas.height = window.innerHeight;

    this._renderer.setSize(this._canvas.width, this._canvas.height);

    this._scene = new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);

    this._camera.position.set(0, 0, 2);

    this._controls = new OrbitControls(this._camera, this._canvas);

    this._controls.enableDamping = false;
    this._controls.enableZoom = true;
  }

  private render(time: number) {
    const delta = time - this._lastTime;
    this._lastTime = time;
    this._renderer.render(this._scene, this._camera);
    requestAnimationFrame(this.render.bind(this));
  }

  public static get instance(): Main {
    if (!Main._instance) {
      Main._instance = new Main();
    }
    return Main._instance;
  }

  public static get canvas(): HTMLCanvasElement {
    return Main.instance._canvas;
  }

  public static get renderer(): THREE.WebGLRenderer {
    return Main.instance._renderer;
  }

  public static get scene(): THREE.Scene {
    return Main.instance._scene;
  }

  public static get camera(): THREE.PerspectiveCamera {
    return Main.instance._camera;
  }

  public static get controls(): OrbitControls {
    return Main.instance._controls;
  }

  public static enableControls() {
    Main.instance._controls.enabled = true;
  }

  public static disableControls() {
    Main.instance._controls.enabled = false;
  }

  public async init() {
    // load editor modules
    StatusPanel.status = "Loading textures...";
    await TextureManager.instance.loadTextures(TextureList);
    StatusPanel.status = "Loading blocks...";
    await BlockManager.instance.loadblocks(blockList)
    StatusPanel.status = "Loading buildings...";
    await BuildingManager.instance.loadBuildings(BuildingList);
    StatusPanel.status = "Loading enviroment...";
    Enviroment.instance.init();
    MouseCastHandler.init();
    SelectionHandler.instance.init();

    StatusPanel.status = "Ready";

    this.start();

    window.addEventListener("resize", () => {
      this._canvas.width = window.innerWidth;
      this._canvas.height = window.innerHeight;
      this._renderer.setSize(this._canvas.width, this._canvas.height);
    });
  }

  public start() {
    this.render(0);
  }
}
