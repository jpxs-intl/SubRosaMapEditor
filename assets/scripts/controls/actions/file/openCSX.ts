import FileInputHandler from "../../../misc/fileInputHandler";
import CSXFileParser from "../../../parsers/csxFileParser";

export default function OpenCSXAction() {
  FileInputHandler.openFileInputDialog(".csx").then((files) => {
    if (files) {
      const file = files[0];
      file.arrayBuffer().then((buffer) => {
        CSXFileParser.load(buffer, file.name);
      });
    }
  });
}
