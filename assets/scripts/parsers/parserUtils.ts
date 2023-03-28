export default class ParserUtils {

    public static getString(dataView: DataView, offset: number, length: number): string {
        let string = "";
        for (let i = 0; i < length; i++) {
          const char = dataView.getUint8(offset + i);
          if (char === 0) break;
          string += String.fromCharCode(char);
        }
        return string;
      }

}