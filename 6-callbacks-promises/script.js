let posts = [
    {
      "title": "Post 1",
      "body":
        "This is my first post here, wow... I can't really believe into it!",
    },
    {
      "title": "Post 2",
      "body": "This is my second post here, wow... Wonderful!!!!",
    },
    {
      "title": "Post 3",
      "body": "This is my third post here, wow... Unimaginable!",
    },
  ],
  beautifyPost = ({ title, body }) => `<h3>${title}</h3><p>${body}</p><br>`,
  pasteContent = (docStr, str) => {
    document.getElementById(docStr).innerHTML = `${str}`;
  },
  customerBeutify = (customer) => `
            <ul>
                <li>ID: ${customer.id}</li>
                <li>Name: ${customer.name}</li>
                <li>Phone: ${customer.phone}</li>
                <li>Address: ${customer.address}</li>
                <li>City: ${customer.city}</li>
                <li>State: ${customer.state}</li>
                <li>Zip: ${customer.zip}</li>
                <li>Country: ${customer.country}</li>
            </ul>
            `;

pasteContent("content", "Wait.");

const getPosts = async () => {
  pasteContent("content", "Loading....");
  setTimeout(() => {
    let allMyPosts = "";
    posts.forEach((p) => {
      allMyPosts += beautifyPost(p);
    });
    pasteContent("content", allMyPosts);
  }, 500);
};

// Callback

// const createPosts = ({title, body}, callback) => {
//     setTimeout(()=>{
//         posts.push({
//             title,
//             body
//         });
//         callback();
//     }, 2000);
// }

// createPosts({title: 'Hello', body: 'World!'}, getPosts)

// Promises

// const createPosts = ({title, body}) => new Promise((resolve, reject) => {
//     setTimeout(()=>{
//         posts.push({
//             title,
//             body
//         });
//         const error = false;
//         // let's say we don't have error :))))
//         if(!error) {
//             resolve()
//         } else {
//             reject('Error: something wrong!')
//         }
//     }, 1000);
// })
// createPosts({title: 'Hello', body: 'World!'}).then(getPosts).catch(err => console.log(err));

// Async/await

const createPosts = async ({ title, body }) => {
  setTimeout(() => {
    posts.push({
      title,
      body,
    });
  }, 1000);
};

const fetchDataFromInternet = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos");
  if (res.ok) {
    const q = await res.json();
    pasteContent(
      "fromInternet",
      q.filter((x, i) => i < 20).map((x) => `${x.id} ${x.title}<br>`)
        .toString(),
    );
    // console.log(q);
  } else {
    pasteContent("error");
  }
};

(async () => {
  await createPosts({ title: "Hello", body: "World!" });
  await getPosts();
  await fetchDataFromInternet();
})();

// XHR (legacy)

document.getElementById("qqq").addEventListener("click", () => {
  const xhr = new XMLHttpRequest(),
    anotherXhr = new XMLHttpRequest(),
    veryAnotherXhr = new XMLHttpRequest();
  xhr.open("GET", "randomdata.txt", true);
  anotherXhr.open("GET", "random.json", true);
  veryAnotherXhr.open("GET", "customers.json", true);
  xhr.onload = function () {
    pasteContent("qqqq", this.responseText);
  };
  anotherXhr.onload = function () {
    // console.log(JSON.parse(this.responseText));
    pasteContent(
      "qqqqq",
      this.responseText,
    );
  };
  veryAnotherXhr.onload = function () {
    const customers = JSON.parse(this.responseText);
    let output = "";
    customers.forEach((customer) => {
      output += customerBeutify(customer);
    });
    pasteContent("qqqqqq", output);
  };

  xhr.send();
  anotherXhr.send();
  veryAnotherXhr.send();
});

document.getElementById("chuckNorris").addEventListener("click", () => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "https://api.chucknorris.io/jokes/random", true);
  xhr.onload = function () {
    const joke = JSON.parse(this.responseText);
    pasteContent("chuckNorris", joke.value);
  };
  xhr.send();
});

// fetch API

document.getElementById("btn1").addEventListener("click", () => {
  fetch("randomdata.txt")
    .then((res) => res.text())
    .then((data) => pasteContent("contentFetch", data));
});

document.getElementById("btn2").addEventListener("click", () => {
  fetch("customers.json")
    .then((res) => res.json())
    .then((data) => {
      let output = "";
      data.forEach((customer) => {
        output += customerBeutify(customer);
      });
      pasteContent("contentFetch", output);
    });
});

document.getElementById("btn3").addEventListener("click", () => {
  fetch("https://api.chucknorris.io/jokes/random")
    .then((res) => res.json())
    .then((data) => pasteContent("contentFetch", data.value));
});
