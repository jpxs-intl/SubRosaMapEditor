import MapRecenter from "../../misc/mapRecenter";
import KeyboardShortcuts from "../keyboardShortcuts";

export default function EditKeyboardShortcuts() {

    KeyboardShortcuts.addShortcut({
        name: "Center Map",
        description: "Shift all objects to be centered around the origin",
        keyCombo: ["^", "#", "c"],
        callback: () => {
            MapRecenter.recenterMap();
        }
    });

}