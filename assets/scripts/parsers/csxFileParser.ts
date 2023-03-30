import TextureManager from "../managers/textureManager";
import StatusPanel from "../misc/statusPanel";
import ParserUtils from "./parserUtils";
import SBBFileParser from "./sbbFileParser";
import SBLFileParser from "./sblFileParser";

export default class CSXFileParser {
  public static load(buffer: ArrayBuffer, fileName: string) {
    // help from noche and checkraisefold with this

    /*
        4 bytes - Magic, value 0x017EF1C5
        4 bytes - Offset from beginning of file where lookup table starts
        4 bytes - Amount of 0x40 byte segments in lookup table/assets stored by CSX file
        
        Rest of file until offset - Data.
        Rest of file at/after offset - 0x40 byte segments for lookup table

        Lookup table segments:
        each starting with 0x02005A58 magic (02 can be 01 or 04 instead, file type?)
        4 bytes - Offset from start of file where beginning of 0x4C file header starts. This file header seems to be mostly useless information?
        4 bytes - File size. This ends at the actual last byte from the file if you offset from the start of the file header.
        52 bytes - File name. This is padded with 0x00 bytes at the end.
      */

    const dataView = new DataView(buffer);

    const magic = dataView.getUint32(0, true);
    const tableOffset = dataView.getUint32(4, true);
    const tableSize = dataView.getUint32(8, true);

    let offset = tableOffset;

    let fileTable: {
      name: string;
      offset: number;
      size: number;
      magic: number;
    }[] = [];

    for (let i = 0; i < tableSize; i++) {
      const magic = dataView.getUint8(offset);
      const fileOffset = dataView.getUint32(offset + 4, true);
      const fileSize = dataView.getUint32(offset + 8, true);
      const fileName = ParserUtils.getString(dataView, offset + 12, 52);

      fileTable.push({
        name: fileName,
        offset: fileOffset,
        size: fileSize,
        magic: magic,
      });

      console.log(`${i}/${tableSize}`, fileName, magic.toString(16));
      offset += 0x40;
    }

    // load files

    for (let i = 0; i < fileTable.length; i++) {
      const file = fileTable[i];
      switch (file.magic) {
        case 0x01: {
          const fileData = buffer.slice(file.offset, file.offset + file.size);
          SBLFileParser.loadBlock(fileData, file.name);
          break;
        }
        case 0x02: {
          const fileData = buffer.slice(file.offset, file.offset + file.size);
          console.log(file.name, file.offset.toString(16), file.size.toString(16));
          SBBFileParser.load(fileData, file.name);  
          break;
        }
        case 0x04: {
          const fileData = buffer.slice(file.offset + 0x4c, file.offset + file.size);
          TextureManager.instance.loadTextureFromBuffer(fileData, file.name);
          break;
        }
      }
    }

    StatusPanel.tempStatus = "CSX Parsing complete. Loaded " + fileTable.length + " files";
  }
}
