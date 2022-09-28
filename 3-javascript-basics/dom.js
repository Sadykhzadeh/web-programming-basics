const myclick = () => {
  // alert("Hello!");

  const elem = document.getElementById("pTag");
  console.log(elem);
  elem.style.background = "green";

  setTimeout(() => {}, 2000);

  const anotherElem = document.querySelector("#pTag");
  console.log(anotherElem);
  anotherElem.style.color = "blue";

  anotherElem.classList.add("mystyle");
};
// const addStyle = () => document.querySelector("#pTag").classList.add('mystyle');
// const removeStyle = () => document.querySelector("#pTag").classList.remove('mystyle');

document.getElementById("pTag").addEventListener("click", (e) => myclick());

const manageStyle = () =>
  document.querySelector("#pTag").classList.toggle("mystyle");
// document.getElementById("manageStyle").addEventListener("click", manageStyle);
document.querySelector(".classButton").addEventListener("click", manageStyle);

const qwe = () => alert(document.getElementById("input").value);
document.getElementById("get").addEventListener("click", qwe);

// get form data
const getFormData = () => {
  const name = document.getElementById("name").value,
    email = document.getElementById("age").value,
    password = document.getElementById("password").value,
    select = document.getElementById("select").value,
    checkbox = document.getElementById("checkbox").checked;

  const formData = {
    name,
    email,
    password,
    select,
    checkbox,
  };

  console.table(formData);
};

document.getElementById("submit").addEventListener("click", getFormData);
