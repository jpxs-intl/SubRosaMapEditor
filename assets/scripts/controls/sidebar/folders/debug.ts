import Main from "../../../main";
import DebugTools from "../../../misc/debugTools";
import Enviroment from "../../../misc/enviroment";
import StatusPanel from "../../../misc/statusPanel";
import { MainPanel } from "../mainPanel";

export default function DebugOptions() {

    const debugFolder = MainPanel.addFolder("Debug");
    

    const debug = {}

    MainPanel.addBoolean(debugFolder, "Show Debug Tools", Main.DEBUG).onChange((value) => {
        Main.DEBUG = value;
        StatusPanel.tempStatus = "Debug Tools: " + value;
    })

  
    
}