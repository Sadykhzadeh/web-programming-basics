// basic fetching from API
import https from "https";

const url = "https://jsonplaceholder.typicode.com/posts/2";

https.get(url, (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    console.log(JSON.parse(data));
  });
});
