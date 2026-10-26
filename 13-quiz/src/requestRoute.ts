import { IncomingMessage, ServerResponse } from "http";
import { getFileData } from "./dataFromJSON";

// to pull data from external JSON file, once: the file never changes while the
// server runs, so there is no need to read and parse it again for every request
const data: JSON = getFileData("static/500_records.json", true) as JSON;

// convert JSON object to array
const dataArr = Object.values(data);

// answers /request?limit=N and returns true, or returns false for any other url
export const requestRoute = (
  req: IncomingMessage,
  res: ServerResponse,
): boolean => {
  if (req.url?.startsWith("/request?")) {
    // get the value of the "limit" parameter
    const limit = new URL(req.url, "http://localhost").searchParams.get("limit");

    // if limit is not defined, return all records, otherwise return limited number of records
    const limitValue: number = limit ? Number(limit) : dataArr[0].length;

    if (!Number.isInteger(limitValue) || limitValue < 0) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "limit must be a whole number" }));
      return true;
    }

    // return limited number of records
    const filteredArr: JSON[] = dataArr[0].filter((
      __item: any,
      index: number,
    ) => index < limitValue);

    // convert array to JSON object
    const filteredJSON: string = JSON.stringify(filteredArr, null, 2);

    // send 200 OK status and the JSON object to client
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(filteredJSON);
    return true;
  }
  return false;
};
