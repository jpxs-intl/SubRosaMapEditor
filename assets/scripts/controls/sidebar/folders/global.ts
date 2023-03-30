import Main from "../../../main";
import { MainPanel } from "../mainPanel";

export default function GlobalOptions() {
    
        const globalFolder = MainPanel.addFolder("Globals");

        const globals = {
                "Reset Camera": () => {
                        Main.camera.position.set(100, 50, 100);
                        Main.camera.lookAt(0, 0, 0);
                        }
        }


        globalFolder.add(globals, "Reset Camera");

        globalFolder.open();
}