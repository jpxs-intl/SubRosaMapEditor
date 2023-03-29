export default class FileInputHandler {
  public static openFileInputDialog(extension?: string): Promise<FileList | null> {
    const fileInputElement = document.createElement("input");
    fileInputElement.type = "file";
    fileInputElement.accept = extension || ".sbc";

    return new Promise((resolve) => {
      fileInputElement.onchange = () => {
        resolve(fileInputElement.files);
      };
      fileInputElement.click();
    });
  }
}
