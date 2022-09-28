const data = [
  "Morning walk",
  "Breakfast",
  "Work",
  "Lunch",
  "Work",
  "Dinner",
  "Evening walk",
  "Sleep",
];

const list = document.getElementById("tasks"),
  input = document.getElementById("task"),
  button = document.getElementById("but");

const renderList = () => {
  list.innerHTML = `<h3>Total tasks: ${data.length}</h3>`;
  data.forEach((item, x) => {
    const ul = document.createElement("ul");
    ul.innerHTML =
      "<button style='margin-right: 5%;' class='delete'>Delete task</button>" +
      item;
    ul.setAttribute("data-index", x);
    list.appendChild(ul);
  });
};

const deleteTask = (e) => {
  if (e.target.classList.contains("delete")) {
    data.splice(e.target.parentElement.getAttribute("data-index"), 1);
  }
  renderList();
};

input.addEventListener("keyup", (e) => {
  if (e.key === "Enter") button.click();
});

button.addEventListener("click", () => {
  const value = input.value;
  if (value) {
    data.push(value);
    input.value = "";
    renderList();
  }
});

list.addEventListener("click", deleteTask);
document.addEventListener("DOMContentLoaded", renderList);
