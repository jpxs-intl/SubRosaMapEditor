import FileInputHandler from "../../../misc/fileInputHandler";
import SBBFileParser from "../../../parsers/sbbFileParser";
import BuildingRenderer from "../../../renderers/renderBuilding";
import * as THREE from "three";

export default function OpenAndRenderSBBAction() {
    FileInputHandler.openFileInputDialog(".sbb").then((files) => {
        if (files) {
          const file = files[0];
          file.arrayBuffer().then((buffer) => {
            const fileName = file.name.split(".")[0];
            console.log(`Loading building ${fileName}`);
           const building = SBBFileParser.load(buffer, fileName);
           BuildingRenderer.render(building, new THREE.Vector3(0, 0, 0));
          })
        }
      });
}