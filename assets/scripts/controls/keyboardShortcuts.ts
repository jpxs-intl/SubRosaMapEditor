import ioKeyboardShortcuts from "./shortcuts/io";

export default class KeyboardShortcuts {
  private static _instance: KeyboardShortcuts;

  private _shortcuts: Map<
    string,
    {
      keys: string[];
      description?: string;
      callback: () => void;
    }
  >;
  private static readonly _modifiers = {
    ctrl: "^",
    shift: "+",
    alt: "%",
    meta: "#",
  };

  private constructor() {
    this._shortcuts = new Map();
  }

  public static get instance(): KeyboardShortcuts {
    if (!KeyboardShortcuts._instance) {
      KeyboardShortcuts._instance = new KeyboardShortcuts();
    }
    return KeyboardShortcuts._instance;
  }

  public static get shortcuts() {
    return KeyboardShortcuts.instance._shortcuts;
  }

  public static addShortcut(options: {
    name: string;
    keyCombo: string | string[];
    description?: string;
    callback: () => void;
  }) {
    let { name, keyCombo, description, callback } = options;

    if (typeof keyCombo === "string") keyCombo = keyCombo.split("");
    KeyboardShortcuts.shortcuts.set(name, {
      keys: keyCombo,
      description,
      callback,
    }); 
  }

  public static removeShortcut(name: string) {
    KeyboardShortcuts.shortcuts.delete(name);
  }

  public static getShortcut(keyCombo: string[]): (() => void) | undefined {
    const shortcuts = Array.from(KeyboardShortcuts.shortcuts.entries());

    for (const [name, shortcut] of shortcuts) {
      if (shortcut.keys.length !== keyCombo.length) continue;

      let match = true;
      for (let i = 0; i < shortcut.keys.length; i++) {
        if (shortcut.keys[i] !== keyCombo[i]) {
          match = false;
          break;
        }
      }

      if (match) return shortcut.callback;
    }

    return undefined;
  }

  public static init() {
    document.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();

      const keyCombo = [];
      if (event.ctrlKey) keyCombo.push(KeyboardShortcuts._modifiers.ctrl);
      if (event.shiftKey) keyCombo.push(KeyboardShortcuts._modifiers.shift);
      if (event.altKey) keyCombo.push(KeyboardShortcuts._modifiers.alt);
      if (event.metaKey) keyCombo.push(KeyboardShortcuts._modifiers.meta);
      keyCombo.push(key);

      const shortcut = KeyboardShortcuts.getShortcut(keyCombo);
      if (shortcut) {
        console.log(`Shortcut [${keyCombo.join(", ")}] triggered`);
        shortcut();
        event.preventDefault();
      }

      console.log(keyCombo);
    });

    // load shortcuts
    ioKeyboardShortcuts();
  }
}
