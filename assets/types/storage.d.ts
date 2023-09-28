class storage {
  public static getData: (
    type: "block" | "buildblock" | "building" | "font" | "texture" | "bundle" | "csx",
    name: string
  ) => Buffer;
  public static list: (folder: "block" | "buildblock" | "building" | "font" | "texture" | "bundle") => Array<{
    name: string;
    file: string;
  }>;
}
