export default class FileInputHandler {
  public static openFileInputDialog(): Promise<FileList | null> {
    const fileInputElement = document.createElement("input");
    fileInputElement.type = "file";
    fileInputElement.accept = ".sbc";

    return new Promise((resolve) => {
      fileInputElement.onchange = () => {
        resolve(fileInputElement.files);
      };
      fileInputElement.click();
    });
  }
}
