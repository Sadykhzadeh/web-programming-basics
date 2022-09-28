const form = document.querySelector("form");
const result = document.querySelector("#result");

const workWithData = (e) => {
  e.preventDefault();

  const type = document.querySelector("#type");
  const card = document.querySelector('input[name="card"]:checked');
  const extra = Array.from(
    document.querySelectorAll("input[type=checkbox]:checked"),
  );
  const name = document.querySelector("#name").value;
  const surname = document.querySelector("#surname").value;

  result.innerHTML = `
    <h2>Order</h2>
    <p><b>Card:</b> ${type.value.split("-")[0]} (Price: $${
    type.value.split("-")[1]
  })</p>
    <p><b>Type:</b> ${card ? card?.value.split("-")[0] : "No"} ${
    card ? "(Price: $" + card?.value.split("-")[1] + ")" : ""
  }</p>
    <p><b>Extras: </b></p>
    <ul>
    ${
    extra.map((item) =>
      `<li>${item.value.split("-")[0]} (Price: $${
        item.value.split("-")[1]
      })</li>`
    ).join("")
  }
    </ul>
    <p><b>Name:</b> ${name} ${surname}</p>

    <b>TOTAL: $${
    +type.value.split("-")[1] + (card ? +card?.value.split("-")[1] : 0) +
    (extra.length > 0
      ? extra.reduce((acc, item) => acc + +item.value.split("-")[1], 0)
      : 0)
  }</b>
  `;
};

[
  document.getElementById("type"),
  document.getElementById("classic"),
  document.getElementById("gold"),
  document.getElementById("platinum"),
  document.getElementById("name"),
  document.getElementById("surname"),
  document.getElementById("cashback"),
  document.getElementById("ApplePay"),
].forEach((item) => item.addEventListener("change", workWithData));
