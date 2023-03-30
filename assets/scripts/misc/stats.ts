import Stats from 'three/examples/jsm/libs/stats.module';

export default class StatsPanel {

    public static stats: Stats

    public static init() {
        this.stats = Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);
        return this.stats;
    }

    public static update() {
        this.stats.update();
    }
}