const containerElem = document.getElementById("container");
const textElem = document.getElementById("text");
// console.log(containerElem);

const words = {
  "A": ["Apple", "Apricot", "Avocado"],
  "B": ["Banana", "Blackberry", "Blueberry"],
  "C": ["Cherry", "Coconut", "Cranberry"],
  "D": ["Date", "Dragonfruit", "Durian"],
};

const generateTable = (words) => `
  <table>
    ${
  Object.keys(words).map((id) => `
      <tr>
        <td>${+id + 1})</td>
        <td>${words[id]}</td>
      </tr>
    `).join("")
}
  </table>
`;

containerElem.addEventListener("click", (e) => {
  const id = e.target.id;
  console.log(`${id} clicked`);

  if (Object.keys(words).includes(id)) {
    textElem.innerHTML = generateTable(words[id]);
  } else {
    textElem.innerHTML = `no button clicked`;
  }
});

// ——————————————————————————————————————————————————

const anotherContainer = document.getElementById("anotherContainer");
const anotherText = document.getElementById("anotherText");

const footballCommands = {
  "AA": {
    "Arsenal": { points: "15", average: "2.5" },
    "Real Madrid": { points: "10", average: "1.5" },
    "Garabagh": { points: "8", average: "1.2" },
    "Barcelona": { points: "5", average: "0.8" },
  },
  "BB": {
    "Burnley": { points: "9", average: "1.3" },
    "Manchester City": { points: "7", average: "1.1" },
    "Juventus": { points: "3", average: "0.5" },
    "Manchester United": { points: "1", average: "0.2" },
  },
};

const generateFootballTable = (footballCommands) => `
  <table>
    <head>
      <tr>
        <th>ID</th>
        <th>Command Name</th>
        <th>Points</th>
        <th>Average</th>
      </tr>
    </head>
    ${
  Object.keys(footballCommands).map((id, cnt) => `
      <tr>
        <td>${cnt + 1}</td>
        <td>${id}</td>
        <td>${footballCommands[id].points}</td>
        <td>${footballCommands[id].average}</td>
      </tr>
    `).join("")
}
  </table>
`;

anotherContainer.addEventListener("click", (e) => {
  const id = e.target.id;
  if (Object.keys(footballCommands).includes(id)) {
    anotherText.innerHTML = generateFootballTable(footballCommands[id]);
  } else {
    anotherText.innerHTML = `no button clicked`;
  }
});
