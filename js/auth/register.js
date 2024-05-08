// User Registration Form
const registrationForm = document.getElementById("registrationForm");

registrationForm.onsubmit = async (e) => {
  e.preventDefault();

  // Disable Button
  document.querySelector("#registrationForm button").disabled = true;
  document.querySelector("#registrationForm button").innerHTML = `<div class="spinner-border me-2" role="status"></div><span>Loading...</span>`;

  // Get Values of Form (input, textarea, select) set it as form-data
  const formData = new FormData(registrationForm);

  // Fetch API User Register Endpoint
  const response = await fetch("http://donations.test/api/user", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });

  // Handle the response
  if (response.ok) {
    const json = await response.json();
    console.log(json);

    // Reset registration form
    registrationForm.reset();

  } else if (response.status === 422) {
    const json = await response.json();

    alert(json.message);
  }

  // Enable Button
  document.querySelector("#registrationForm button").disabled = false;
  document.querySelector("#registrationForm button").innerHTML = "Sign up";
};
