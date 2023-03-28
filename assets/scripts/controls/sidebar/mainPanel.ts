import * as dat from "dat.gui";

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
        folder.addColor(color, name);
    }

    public static addNumber(folder: dat.GUI, name: string, value: number, min: number, max: number) {
        folder.add({ value }, "value", min, max).name(name);
    }

    public static addBoolean(folder: dat.GUI, name: string, value: boolean) {
        folder.add({ value }, "value").name(name);
    }

    public static addString(folder: dat.GUI, name: string, value: string) {
        folder.add({ value }, "value").name(name);
    }

}