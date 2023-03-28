export default class DragAndDropHandler {
  private static _instance: DragAndDropHandler;

  private _input: HTMLDivElement;
  private _canvas: HTMLCanvasElement;

  private constructor() {
    this._input = document.getElementById("drop_zone") as HTMLDivElement;
    this._canvas = document.getElementById("c") as HTMLCanvasElement;

    this._canvas.addEventListener("dragenter", DragAndDropHandler._onDragEnter);
    this._input.addEventListener("dragleave", DragAndDropHandler._onDragLeave);
    this._canvas.addEventListener("dragover", DragAndDropHandler._onDragOver);
    this._input.addEventListener("drop", DragAndDropHandler._onDrop);
    this._canvas.addEventListener("drop", DragAndDropHandler._onDrop);
  }

  private static _onDragOver(event: DragEvent) {
    event.preventDefault();
    console.log("dragging");
  }

  private static _onDragEnter(event: DragEvent) {
    event.preventDefault();
    DragAndDropHandler.input.classList.add("dragging");
  }

  private static _onDragLeave(event: DragEvent) {
    event.preventDefault();
    DragAndDropHandler.input.classList.remove("dragging");

  }

  private static _onDrop(event: DragEvent) {
        event.preventDefault();
        DragAndDropHandler.input.classList.remove("dragging");
        const files = event.dataTransfer?.files;

        console.log(files);

  }

  public static get instance(): DragAndDropHandler {
    if (!DragAndDropHandler._instance) {
      DragAndDropHandler._instance = new DragAndDropHandler();
    }
    return DragAndDropHandler._instance;
  }

  public static get input(): HTMLDivElement {
    return DragAndDropHandler.instance._input;
  }

  public static init() {
    DragAndDropHandler.instance;
  }

}
