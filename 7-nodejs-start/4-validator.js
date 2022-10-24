// run "npm ci" first before running this file
import validator from "validator";

const validEmail = "hello@azer.one",
  unvalidEmail = "hello@helloworld";

const checkForValid = (email) =>
  `The email "${email}" is ${validator.isEmail(email) ? "valid" : "not valid"}`;

console.log(checkForValid(validEmail));
console.log(checkForValid(unvalidEmail));
