import * as dat from "dat.gui";
import DebugOptions from "./folders/debug";
import FileOptions from "./folders/file";
import GlobalOptions from "./folders/global";
import ViewOptions from "./folders/view";

export class MainPanel {
  private static _instance: MainPanel;

  private _gui: dat.GUI;

  private constructor() {
    this._gui = new dat.GUI();
  }

  public static get instance(): MainPanel {
    if (!MainPanel._instance) {
      MainPanel._instance = new MainPanel();
    }
    return MainPanel._instance;
  }

  public static get gui() {
    return MainPanel.instance._gui;
  }

  public static addFolder(name: string) {
    return MainPanel.gui.addFolder(name);
  }

  public static removeFolder(folder: dat.GUI) {
    MainPanel.gui.removeFolder(folder);
  }

  public static addColor(folder: dat.GUI, name: string, color: THREE.Color) {
    return folder.addColor(color, name);
  }

  public static addNumber(folder: dat.GUI, name: string, value: number, min: number, max: number) {
    return folder.add({ value }, "value", min, max).name(name);
  }

  public static addBoolean(folder: dat.GUI, name: string, value: boolean) {
    return folder.add({ value }, "value").name(name);
  }

  public static addString(folder: dat.GUI, name: string, value: string) {
    return folder.add({ value }, "value").name(name);
  }

  public static init() {
    MainPanel.gui.open();
    GlobalOptions();
    FileOptions();
    ViewOptions();
    DebugOptions();
  }
}
