export default class Utils {

    public static snap(value: number, step: number): number {
        return Math.round(value / step) * step;
    }

    public static snapToGrid(value: number): number {
        return Utils.snap(value, 10);
    }
}