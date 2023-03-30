import * as THREE from "three";
import FileInputHandler from "../../misc/fileInputHandler";
import CSXFileParser from "../../parsers/csxFileParser";
import SBBFileParser from "../../parsers/sbbFileParser";
import SBCFileParser from "../../parsers/sbcFileParser";
import BuildingRenderer from "../../renderers/renderBuilding";
import OpenAndRenderSBBAction from "../actions/debug/openAndRenderSBB";
import OpenCityAction from "../actions/file/openCity";
import OpenCSXAction from "../actions/file/openCSX";
import KeyboardShortcuts from "../keyboardShortcuts";

export default function ioKeyboardShortcuts() {
  KeyboardShortcuts.addShortcut({
    name: "Load",
    description: "Load a map file",
    keyCombo: ["^", "o"],
    callback: OpenCityAction
  });

  KeyboardShortcuts.addShortcut({
    name: "Load CSX",
    description: "Load a CSX bundle file",
    keyCombo: ["^", "+", "o"],
    callback: OpenCSXAction
  });

  KeyboardShortcuts.addShortcut({
    name: "Debug: Load building",
    description: "Load a building file",
    keyCombo: ["^", "+", "b"],
    callback: OpenAndRenderSBBAction
  })

  KeyboardShortcuts.addShortcut({
    name: "Save",
    description: "Save the current project",
    keyCombo: ["^", "s"],
    callback: () => {
      // Save

      console.log("Saving...");
    },
  });

  KeyboardShortcuts.addShortcut({
    name: "New",
    description: "Create a new project",
    keyCombo: ["^", "n"],
    callback: () => {
      // New
    },
  });

  KeyboardShortcuts.addShortcut({
    name: "Export",
    description: "Export the current project",
    keyCombo: ["^", "e"],
    callback: () => {},
  });

  KeyboardShortcuts.addShortcut({
    name: "Import",
    description: "Import a project",
    keyCombo: ["^", "i"],
    callback: () => {},
  });

  KeyboardShortcuts.addShortcut({
    name: "Undo",
    description: "Undo the last action",
    keyCombo: ["^", "z"],
    callback: () => {
      // Undo
      console.log("Undo");
    },
  });

  KeyboardShortcuts.addShortcut({
    name: "Redo",
    description: "Redo the last action",
    keyCombo: ["^", "y"],
    callback: () => {},
  });

  KeyboardShortcuts.addShortcut({
    name: "Delete",
    description: "Delete the selected object",
    keyCombo: ["delete"],
    callback: () => {},
  });
}
