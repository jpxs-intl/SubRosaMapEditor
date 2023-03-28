import ToolbarFile from "./menus/file";
import ToolbarMenu from "./toolbarMenu";

export default class Toolbar {
  private static _instance: Toolbar;

  private _toolbar: HTMLDivElement;

  private _menus: Map<string, ToolbarMenu>;

  private constructor() {
    this._toolbar = document.getElementById("toolbar") as HTMLDivElement;
    this._menus = new Map();
  }

  public static get instance(): Toolbar {
    if (!Toolbar._instance) {
      Toolbar._instance = new Toolbar();
    }
    return Toolbar._instance;
  }

  public static get toolbar(): HTMLDivElement {
    return Toolbar.instance._toolbar;
  }

  public static hide(): void {
    Toolbar.instance._toolbar.style.display = "none";
  }

  public static show(): void {
    Toolbar.instance._toolbar.style.display = "block";
  }

  public static addMenu(name: string) {
    Toolbar.instance._menus.set(name, new ToolbarMenu());

    const menuButton = document.createElement("button");
    menuButton.innerHTML = name;
    menuButton.addEventListener("click", () => {
      const menu = Toolbar.getMenu(name);
      if (menu) {
        menu.show();
      }
    });

    Toolbar.toolbar.appendChild(menuButton);

    return Toolbar.getMenu(name) as ToolbarMenu;
  }

  public static removeMenu(name: string) {
    Toolbar.instance._menus.delete(name);
  }

  public static getMenu(name: string): ToolbarMenu | undefined {
    return Toolbar.instance._menus.get(name);
  }

  public static getMenus(): Map<string, ToolbarMenu> {
    return Toolbar.instance._menus;
  }

  public static addOption(menu: string, name: string, callback: () => void): void {
    const toolbarMenu = Toolbar.getMenu(menu);
    if (toolbarMenu) {
      toolbarMenu.addOption(name, callback);
    }
  }

  public static init(): void {
    // Add default menus
    ToolbarFile()

  }
}
