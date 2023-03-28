export default class Utils {

    public static snap(value: number, step: number): number {
        return Math.round(value / step) * step;
    }

    public static snapToGrid(value: number): number {
        return Utils.snap(value, 10);
    }

    public static getColorFromString(string: string): number {

        let hash = 0;
        for (let i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '0x';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xFF;
            color += ('00' + value.toString(16)).substr(-2);
        }

        return parseInt(color);

    }
}