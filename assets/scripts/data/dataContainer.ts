export default class DataContainer {

    private static _instance: DataContainer;

    private _data: Map<string, any>;

    private constructor() {
        this._data = new Map();
    }

    public static get instance(): DataContainer {
        if (!DataContainer._instance) {
            DataContainer._instance = new DataContainer();
        }
        return DataContainer._instance;
    }

    public static get data() {
        return DataContainer.instance._data;
    }

    public static addData(name: string, data: any) {
        DataContainer.data.set(name, data);
    }

    public static removeData(name: string) {
        DataContainer.data.delete(name);
    }

    public static getData(name: string) {
        return DataContainer.data.get(name);
    }

    public static hasData(name: string) {
        return DataContainer.data.has(name);
    }

}