import { contextBridge } from "electron";
import fs from "fs";
import path from "path";

contextBridge.exposeInMainWorld("storage", {
  getData: (type: "block" | "buildblock" | "building" | "font" | "texture" | "bundle" | "csx", name: string) => {
    const allowedTypes = ["block", "buildblock", "building", "font", "texture", "bundle", "csx"];
    if (!allowedTypes.includes(type)) {
      return {
        error: "ACTION_NOT_ALLOWED",
        message: `You are not allowed to access files in ${type}.`,
      };
    }

    const filePath = path.resolve(`./assets/data/${type}/${name}`);

    if (!filePath.includes(type)) {
      return {
        error: "ACTION_NOT_ALLOWED",
        message: `Invalid Path.`,
      };
    }

    return fs.readFileSync(filePath);
  },
  list: (folder: "block" | "buildblock" | "building" | "font" | "texture" | "bundle") => {
    return fs.readdirSync(path.resolve(`./assets/data/${folder}`)).map((f) => {
      return {
        name: f.split(".")[0],
        file: f,
      };
    });
  },
});
