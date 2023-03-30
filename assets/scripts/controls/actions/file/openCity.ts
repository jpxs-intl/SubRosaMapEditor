import FileInputHandler from "../../../misc/fileInputHandler";
import SBCFileParser from "../../../parsers/sbcFileParser";

export default function OpenCityAction() {
    FileInputHandler.openFileInputDialog().then((files) => {
        if (files) {
          const file = files[0];
          
          file.arrayBuffer().then((buffer) => {
            SBCFileParser.load(buffer, file.name)
          })
        }
      });
}