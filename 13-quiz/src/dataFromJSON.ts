import fs from "fs";

export const getFileData = (
  fileName: string,
  isJSON: boolean = true,
): JSON | string => {
  const data = fs.readFileSync(fileName, "utf8");
  return isJSON ? JSON.parse(data) : data;
};
