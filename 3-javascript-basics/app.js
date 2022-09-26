// Arrow function
let func1 = (arg1, arg2, ...argn) => {
  expression;
};

// functional epression
let func = function (arg1, arg2, ...argn) {
  return expression;
};

const summo = (a, b) => a + b;
console.log(summo(1, 2));

// Need browser
// let age = prompt("what is your age?")
// let welcome = (age < 18) ? () => alert('Hello') : () => alert('greetings')
// welcome()

// Higher order functions

var pilots = [
  {
    id: 10,
    name: "Poe Domeron",
    years: 14,
  },

  {
    id: 2,
    name: "Roy Cameron",
    years: 23,
  },

  {
    id: 41,
    name: "James Domeron",
    years: 23,
  },

  {
    id: 99,
    name: "Ello Istvan",
    years: 44,
  },
];

// forEach
pilots.forEach(function (pilot) {
  console.log(pilot.id, pilot.name);
});

// map fucntion
const elem = pilots.map(function (pp) {
  return pp.name;
});
console.log(elem);

const elem1 = pilots.map((pp) => pp.name);
console.log(elem1);

const elem2 = pilots.filter((pp) => pp.years > 20);
console.log(elem2);
elem2.forEach((pp) => {
  console.log(pp.name);
});

// combining map and filter together
const res = pilots.filter((pilot) => pilot.years > 20).map((pilot) =>
  `${pilot.name} ${pilot.years}`
);
console.log(res);
