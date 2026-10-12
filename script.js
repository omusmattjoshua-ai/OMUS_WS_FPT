// Student Registration Form: validation, feedback, and interactive controls.
const form = document.getElementById("registrationForm");
const successMessage = document.getElementById("successMessage");
const togglePasswordButton = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

const fields = [
  "studentId", "fullName", "email", "phone", "dob",
  "program", "yearLevel", "address", "password", "confirmPassword"
];

function getField(id) {
  return document.getElementById(id);
}

function showError(field, message) {
  const errorElement = getField(${field.id}Error);
  field.classList.add("error");
  field.setAttribute("aria-invalid", "true");
  if (errorElement) errorElement.textContent = message;
}

function clearError(field) {
  const errorElement = getField(${field.id}Error);
  field.classList.remove("error");
  field.removeAttribute("aria-invalid");
  if (errorElement) errorElement.textContent = "";
}

function validateTextField(id, message) {
  const field = getField(id);
  field.value = field.value.trim();
  if (!field.value) {
    showError(field, message);
    return false;
  }
  clearError(field);
  return true;
}

function validateForm() {
  let isValid = true;

  // Read custom data-* attributes through dataset.
  const studentId = getField("studentId");
  const requiredLabel = studentId.dataset.label; // "Student ID"
  const isRequired = studentId.dataset.required === "true";
  if (isRequired && !validateTextField("studentId", ${requiredLabel} is required.)) isValid = false;

  if (!validateTextField("fullName", "Please enter your full name.")) isValid = false;

  const email = getField("email");
  email.value = email.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!email.value) {
    showError(email, "Email address is required.");
    isValid = false;
  } else if (!emailPattern.test(email.value)) {
    showError(email, "Enter a valid email address, such as name@example.com.");
    isValid = false;
  } else clearError(email);

  const phone = getField("phone");
  phone.value = phone.value.trim();
  if (!phone.value) {
    showError(phone, "Phone number is required.");
    isValid = false;
  } else if (!/^09\d{9}$/.test(phone.value)) {
    showError(phone, "Use the 11-digit format 09XXXXXXXXX.");
    isValid = false;
  } else clearError(phone);

  const dob = getField("dob");
  if (!dob.value) {
    showError(dob, "Please select your date of birth.");
    isValid = false;
  } else if (new Date(dob.value) >= new Date(new Date().toDateString())) {
    showError(dob, "Date of birth must be in the past.");
    isValid = false;
  } else clearError(dob);

  const genderField = document.getElementById("genderField");
  const selectedGender = form.querySelector('input[name="gender"]:checked');
  const genderError = getField("genderError");
  if (!selectedGender) {
    genderField.classList.add("error-group");
    genderError.textContent = "Please select a gender option.";
    isValid = false;
  } else {
    genderField.classList.remove("error-group");
    genderError.textContent = "";
  }

  ["program", "yearLevel"].forEach((id) => {
    const field = getField(id);
    if (!field.value) {
      showError(field, Please select your ${field.dataset.label.toLowerCase()}.);
      isValid = false;
    } else clearError(field);
  });

  if (!validateTextField("address", "Please enter your home address.")) isValid = false;

  const password = getField("password");
  if (!password.value) {
    showError(password, "Please create a password.");
    isValid = false;
  } else if (password.value.length < 😎 {
    showError(password, "Password must contain at least 8 characters.");
    isValid = false;
  } else clearError(password);

  const confirmPassword = getField("confirmPassword");
  if (!confirmPassword.value) {
    showError(confirmPassword, "Please confirm your password.");
    isValid = false;
  } else if (password.value !== confirmPassword.value) {
    showError(confirmPassword, "Passwords do not match.");
    isValid = false;
  } else clearError(confirmPassword);

  const agreement = getField("agreement");
  const agreementError = getField("agreementError");
  if (!agreement.checked) {
    agreement.classList.add("error");
    agreement.setAttribute("aria-invalid", "true");
    agreementError.textContent = "You must agree before submitting the form.";
    isValid = false;
  } else {
    agreement.classList.remove("error");
    agreement.removeAttribute("aria-invalid");
    agreementError.textContent = "";
  }

  return isValid;
}

// Submit event and Event Object: prevent page reload until every check passes.
form.addEventListener("submit", function(event) {
  event.preventDefault();
  successMessage.hidden = true;

  if (validateForm()) {
    // Remove any remaining error styling/messages after successful validation.
    fields.forEach((id) => clearError(getField(id)));
    document.getElementById("genderField").classList.remove("error-group");
    getField("genderError").textContent = "";
    getField("agreementError").textContent = "";
    successMessage.textContent = Registration successful! Welcome, ${getField("fullName").value}.;
    successMessage.hidden = false;
    successMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } else {
    const firstInvalid = form.querySelector(".error, .error-group");
    if (firstInvalid) firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

// Toggle password visibility with classList.toggle() and meaningful type attribute changes.
togglePasswordButton.addEventListener("click", function() {
  const currentlyVisible = passwordInput.type === "text";
  const newType = currentlyVisible ? "password" : "text";
  passwordInput.setAttribute("type", newType);
  confirmPasswordInput.setAttribute("type", newType);
  togglePasswordButton.classList.toggle("is-visible", !currentlyVisible);
  togglePasswordButton.setAttribute("aria-pressed", String(!currentlyVisible));
  togglePasswordButton.textContent = currentlyVisible ? "Show passwords" : "Hide passwords";
});

// Clear a field's own error as the user corrects it.
fields.forEach((id) => {
  const field = getField(id);
  field.addEventListener("input", () => {
    if (field.value.trim()) clearError(field);
    successMessage.hidden = true;
  });
  field.addEventListener("change", () => {
    if (field.value.trim()) clearError(field);
    successMessage.hidden = true;
  });
});

form.querySelectorAll('input[name="gender"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    document.getElementById("genderField").classList.remove("error-group");
    getField("genderError").textContent = "";
    successMessage.hidden = true;
  });
});
getField("agreement").addEventListener("change", () => {
  if (getField("agreement").checked) {
    getField("agreement").classList.remove("error");
    getField("agreement").removeAttribute("aria-invalid");
    getField("agreementError").textContent = "";
  }
  successMessage.hidden = true;
});

// Reset event restores the original form state and password visibility.
form.addEventListener("reset", function() {
  window.setTimeout(() => {
    fields.forEach((id) => clearError(getField(id)));
    document.getElementById("genderField").classList.remove("error-group");
    getField("genderError").textContent = "";
    getField("agreement").classList.remove("error");
    getField("agreement").removeAttribute("aria-invalid");
    getField("agreementError").textContent = "";
    successMessage.textContent = "";
    successMessage.hidden = true;
    passwordInput.setAttribute("type", "password");
    confirmPasswordInput.setAttribute("type", "password");
    togglePasswordButton.classList.remove("is-visible");
    togglePasswordButton.setAttribute("aria-pressed", "false");
    togglePasswordButton.textContent = "Show passwords";
  }, 0);
});