const submitButton = document.getElementById("submit"),
  unameInfo = document.getElementById("usernameInfo"),
  passInfo = document.getElementById("passwordInfo"),
  confInfo = document.getElementById("confirmationInfo"),
  pass = document.getElementById("pass");

submitButton.onclick = () => {
  unameInfo.innerHTML = "";
  passInfo.innerHTML = "";
  confInfo.innerHTML = "";

  validateUsername();
  validatePassword.validateLength();
  validatePassword.validateLowercase();
  validatePassword.validateUpperCase();
  validatePassword.validateNumbers();
  confirmPassword();
};

const validateUsername = () => {
  const uname = document.getElementById("uname").value;
  if (uname.length >= 3 || uname.length < 20) {
    console.log("Username is accepted.");
  } else {
    unameInfo.innerHTML =
      "Username must be at least 3 and at most 20 characters long!";
  }
};

const validatePassword = {
  validateLength: () => {
    if (pass.value.length >= 8 || pass.value.length < 16) {
      console.log("Password length is accepted.");
    } else {
      passInfo.innerHTML +=
        "Password must be at least 8 and at most 16 characters long!";
    }
  },

  validateLowercase: () => {
    const lowerCaseLetters = /[a-z]/g;
    if (pass.value.match(lowerCaseLetters)) {
      console.log("Password has at least one lowercase letter.");
    } else {
      passInfo.innerHTML +=
        "Password must contain at least one lowercase letter!";
    }
  },

  validateUpperCase: () => {
    const upperCaseLetters = /[A-Z]/g;
    if (pass.value.match(upperCaseLetters)) {
      console.log("Password has at least one uppercase letter.");
    } else {
      passInfo.innerHTML +=
        "Password must contain at least one uppercase letter!";
    }
  },

  validateNumbers: () => {
    if (pass.value.split("").map(Number).filter(Boolean).length > 0) {
      console.log("Password has a number.");
    } else {
      console.log(pass.value.split("").map(Number));
      passInfo.innerHTML += "\nPassword must contain at least one number!";
    }
  },
};

const confirmPassword = () => {
  const confPass = document.getElementById("confirmation").value;

  if (pass.value === confPass) {
    console.log("Passwords match.");
    confInfo.innerHTML = "Passwords match!";
  } else {
    confInfo.innerHTML = "Passwords do not match!";
  }
};
