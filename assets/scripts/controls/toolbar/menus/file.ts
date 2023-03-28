import Toolbar from "../toolbar";

export default function ToolbarFile() {

    const menu = Toolbar.addMenu("File");

    menu.addOption("New", () => {
        console.log("New");
    })

    menu.addOption("Open", () => {
        console.log("Open");
    })

    menu.addOption("Save", () => {
        console.log("Save");
    })
}