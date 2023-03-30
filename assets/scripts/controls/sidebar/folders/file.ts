import OpenCityAction from "../../actions/file/openCity";
import OpenCSXAction from "../../actions/file/openCSX";
import { MainPanel } from "../mainPanel";

export default function FileOptions() {

    const fileFolder = MainPanel.addFolder("File");

    const file = {
            "Open City": () => {
                OpenCityAction();
            },
            "Open CSX": () => {
                OpenCSXAction();
            }
    }

    fileFolder.add(file, "Open City");
    fileFolder.add(file, "Open CSX");

    
}