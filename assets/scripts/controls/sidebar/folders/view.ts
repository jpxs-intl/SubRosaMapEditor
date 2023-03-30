import Enviroment from "../../../misc/enviroment";
import StatusPanel from "../../../misc/statusPanel";
import { MainPanel } from "../mainPanel";

export default function ViewOptions() {

    const viewFolder = MainPanel.addFolder("View");

    const view = {
            "Toggle Grid Helper": () => {
                Enviroment.instance.grid.visible = !Enviroment.instance.grid.visible;
                StatusPanel.tempStatus = "Grid Helper: " + Enviroment.instance.grid.visible;   
            },
            "Toggle Ground Plane": () => {
                Enviroment.instance.groundPlane.visible = !Enviroment.instance.groundPlane.visible;
                StatusPanel.tempStatus = "Ground Plane: " + Enviroment.instance.groundPlane.visible;
            }
        }

    viewFolder.add(view, "Toggle Grid Helper");
    viewFolder.add(view, "Toggle Ground Plane");
}