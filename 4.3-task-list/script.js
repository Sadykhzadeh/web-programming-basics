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
  const ul = document.createElement("ul");
  data.forEach((item, x) => {
    const li = document.createElement("li");
    const deleteButton = document.createElement("button");
    deleteButton.style.marginRight = "5%";
    deleteButton.className = "delete";
    deleteButton.textContent = "Delete task";
    // the task text is typed by the user, so it must not be parsed as HTML
    li.append(deleteButton, item);
    li.setAttribute("data-index", x);
    ul.appendChild(li);
  });
  list.appendChild(ul);
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
