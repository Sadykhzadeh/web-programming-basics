import fs from "fs";
import path from "path";

export const getFileData = (
  fileName: string,
  isJSON: boolean = true,
): JSON | string => {
  // file names are relative to the project folder (the parent of dist), not to
  // the directory the server happens to be started from
  const data = fs.readFileSync(path.join(__dirname, "..", fileName), "utf8");
  return isJSON ? JSON.parse(data) : data;
};
