export default class ToolbarMenu {

    public options: Map<string, () => void>;

    constructor() {
        this.options = new Map();
    }

    public addOption(name: string, callback: () => void): void {
        this.options.set(name, callback);
    }

    public removeOption(name: string): void {
        this.options.delete(name);
    }

    public getOption(name: string): (() => void) | undefined {
        return this.options.get(name);
    }

    public getOptions(): Map<string, () => void> {
        return this.options;
    }

    public show(): void {
        const menu = document.createElement("div");
        menu.classList.add("toolbar-menu");
        menu.style.display = "block";
        this.options.forEach((callback, name) => {
            const option = document.createElement("button");
            option.innerHTML = name;
            option.addEventListener("click", callback);
            menu.appendChild(option);
        });
        document.body.appendChild(menu);
    }
}