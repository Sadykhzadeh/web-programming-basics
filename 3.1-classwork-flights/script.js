// get form data
const direction = document.getElementById("direction");
const isRound = document.getElementById("isRoundWay");
const passengers = document.getElementById("passengers");
const child = document.getElementById("child");

const getFormData = () => {
  const directionValue = +direction.value;
  const isRoundValue = isRound.checked;
  const passengersValue = passengers.value;
  const childValue = +child.value;

  const result = directionValue *
    ((isRoundValue ? 1 : 1.5) * passengersValue +
      ((childValue < 2) ? 0 : (childValue >= 2 && childValue <= 7) ? 0.5 : 1));

  document.getElementById("result").innerHTML = `
    <h2>Result</h2>
    <p>Direction: ${directionValue}</p>
    <p>Is one way: ${isRoundValue ? "Yes" : "No"}</p>
    <p>Passengers: ${passengersValue}</p>
    <p>Child age: ${childValue} ${((childValue <= 2)
    ? "Free"
    : (childValue > 2 && childValue <= 7)
    ? "Half-price"
    : "Full-price")}</p>
    <p>Result: ${result}</p>
  `;
};

direction.addEventListener("change", getFormData);
isRound.addEventListener("change", getFormData);
passengers.addEventListener("change", getFormData);
child.addEventListener("change", getFormData);
