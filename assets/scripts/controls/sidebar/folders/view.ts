import Enviroment from "../../../misc/enviroment";
import StatusPanel from "../../../misc/statusPanel";
import { MainPanel } from "../mainPanel";

export default function ViewOptions() {

    const viewFolder = MainPanel.addFolder("View");

    const envFolder = viewFolder.addFolder("Enviroment");

    MainPanel.addBoolean(envFolder, "Show Grid", Enviroment.instance.options.showGrid).onChange((value) => {
        Enviroment.instance.options.showGrid = value;
        StatusPanel.tempStatus = "Grid: " + value;

        Enviroment.instance.update();
    })

    MainPanel.addBoolean(envFolder, "Show Ground Plane", Enviroment.instance.options.showGroundPlane).onChange((value) => {
        Enviroment.instance.options.showGroundPlane = value;
        StatusPanel.tempStatus = "Ground Plane: " + value;

        Enviroment.instance.update();
    })

    MainPanel.addBoolean(envFolder, "Show Fog", Enviroment.instance.options.showFog).onChange((value) => {
        Enviroment.instance.options.showFog = value;
        StatusPanel.tempStatus = "Fog: " + value;

        Enviroment.instance.update();
    })

    const uiFolder = viewFolder.addFolder("UI");

    MainPanel.addBoolean(uiFolder, "Show Status Panel", StatusPanel.panel.style.display != "none").onChange((value) => {
        StatusPanel.panel.style.display = value ? "block" : "none";
        StatusPanel.tempStatus = "Status Panel: " + value;
    }

    )
}