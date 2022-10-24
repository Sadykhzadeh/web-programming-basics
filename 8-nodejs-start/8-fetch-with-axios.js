// fetching with axios
import axios from "axios";

const url = "http://jsonplaceholder.typicode.com/posts/2";

try {
  const res = await axios(url);
  console.log(`Status code: ${res.status}`);
  console.log(`URL: ${res.config.url}`);
  console.log(res.data);
} catch (error) {
  console.error(error);
}
