import * as THREE from "three";
import Main from "../main";
import MouseCastHandler from "./mouseCastHandler";
import StatusPanel from "../misc/statusPanel";
import Utils from "../misc/utils";

export default class SelectionHandler {
  private static _instance: SelectionHandler;

  private _tileSelected = new THREE.Vector2(0, 0);
  private _tileHovered = new THREE.Vector2(0, 0);
  private _inHeightSelectionMode = false;
  private _initialSelectionHeight = 0;
  private _selectionHeight = 0;
  private _mousePosition = new THREE.Vector2(0, 0);
  private _startMouseHeight = 0;

  private _selectionBox = new THREE.Mesh(
    new THREE.BoxGeometry(10, 100, 10),
    new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
  );

  private _heightPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  );

  public static get instance(): SelectionHandler {
    if (!this._instance) {
      this._instance = new SelectionHandler();
    }
    return this._instance;
  }

  public get tileSelected(): THREE.Vector2 {
    return this._tileSelected;
  }

  public set tileSelected(tile: THREE.Vector2) {
    this._tileSelected = tile;
  }

  public setTileSelectedByCoords(x: number, y: number) {
    this._tileSelected = new THREE.Vector2(Utils.snapToGrid(x), Utils.snapToGrid(y));
  }

  private onKeyDown(event: KeyboardEvent) {
    if (event.key === "Shift") {
      // enter height selection mode
      Main.disableControls();

      // enable height plane
      this._inHeightSelectionMode = true;

      // map selection height to up and down mouse movement
      this._startMouseHeight = this._mousePosition.y;
      this._initialSelectionHeight = this._selectionHeight;

      console.log("Entered height selection mode");
    }
  }

  private onKeyUp(event: KeyboardEvent) {
    if (event.key === "Shift") {
      // exit height selection mode
      Main.enableControls();
      this._inHeightSelectionMode = false;

      // lock selection height
      this._selectionHeight = Math.round(this._heightPlane.position.y);

      console.log(`Left height selection mode. Selection height: ${this._selectionHeight}`);

        // update status panel
        StatusPanel.status = `Ready`;
    }
  }

  public onMouseMove(event: MouseEvent) {
    this._mousePosition = new THREE.Vector2(event.clientX, event.clientY);

    if (this._inHeightSelectionMode) {
      // update selection height
      this._heightPlane.position.setY(Utils.snap((this._startMouseHeight - this._mousePosition.y ) / 10, 10) + this._initialSelectionHeight);
        if (this._heightPlane.position.y < 0) {
            this._heightPlane.position.setY(0);
        }

        if (this._heightPlane.position.y > 100) {
            this._heightPlane.position.setY(100);
        }

        StatusPanel.status = `Selection height: ${Math.round(this._heightPlane.position.y / 10)}`;
    }
  }

  public onMousedown(event: MouseEvent) {
    if (event.button === 0) {
        const mousePos = MouseCastHandler.lastMosePosition;
        this.setTileSelectedByCoords(mousePos.x, mousePos.y);
        this._selectionBox.position.set(this._tileSelected.x * 10 + 5, 50, this._tileSelected.y * 10 + 5);

        // update status panel
        StatusPanel.tempStatus = `Selected tile: ${this._tileSelected.x}, ${this._tileSelected.y}`;
    }
}

  public init() {
    this._selectionBox.position.set(0, 50, 0);
    this._selectionBox.visible = true;

    this._heightPlane.position.set(0, 0, 0);
    this._heightPlane.rotation.x = -Math.PI / 2;
    
    Main.scene.add(this._selectionBox);
    Main.scene.add(this._heightPlane);

    window.addEventListener("keydown", this.onKeyDown.bind(this));
    window.addEventListener("keyup", this.onKeyUp.bind(this));
    window.addEventListener("mousemove", this.onMouseMove.bind(this));
    window.addEventListener("mousedown", this.onMousedown.bind(this));
  }
}
