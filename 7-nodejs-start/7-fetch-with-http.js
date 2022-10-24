// basic fetching from API
import http from "http";

const url = "http://jsonplaceholder.typicode.com/posts/2";

http.get(url, (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    console.log(JSON.parse(data));
  });
});
