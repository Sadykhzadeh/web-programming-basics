import { getFileData } from "./dataFromJSON";

export const requestRoute = (req, res) => {
  if (req.url.startsWith("/request?")) {
    // send 200 OK status
    res.writeHead(200, { "Content-Type": "application/json" });

    // to pull data from external JSON file.
    const data: JSON = getFileData("static/500_records.json", true) as JSON;

    // convert JSON object to array
    const dataArr = Object.values(data);

    // get all query parameters
    const query = req.url.split("?")[1].split("&");

    // get the value of the "limit" parameter
    const limit = query.find((item) => item.startsWith("limit="));

    // if limit is not defined, return all records, otherwise return limited number of records
    const limitValue: number = limit
      ? parseInt(limit.split("=")[1])
      : dataArr[1];

    // return limited number of records
    const filteredArr: JSON[] = dataArr[0].filter((
      __item: any,
      index: number,
    ) => index < limitValue);

    // convert array to JSON object
    const filteredJSON: string = JSON.stringify(filteredArr, null, 2);

    // send JSON object to client
    res.end(filteredJSON);
  }
  // else {
  //   res.writeHead(404, { "Content-Type": "text/html" });
  //   res.write("404");
  // }
  // res.end();
};
