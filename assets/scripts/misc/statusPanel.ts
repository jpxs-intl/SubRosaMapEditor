export default class StatusPanel {
  private static _instance: StatusPanel;

  private _panel: HTMLDivElement;

  private constructor() {
    this._panel = document.getElementById("statusPanel") as HTMLDivElement;
  }

  public static get instance(): StatusPanel {
    if (!StatusPanel._instance) {
      StatusPanel._instance = new StatusPanel();
    }
    return StatusPanel._instance;
  }

  public static get panel(): HTMLDivElement {
    return StatusPanel.instance._panel;
  }

  public static set status(status: string) {
    StatusPanel.instance._panel.innerHTML = status;
  }

  public static set tempStatus(status: string) {
    StatusPanel.instance._panel.innerHTML = status;
    setTimeout(() => {
      StatusPanel.instance._panel.innerHTML = "Ready";
    }, 3000);
  }
}
