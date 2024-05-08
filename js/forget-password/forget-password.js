import { setRouter, url } from "../router/router.js";

setRouter();

document.addEventListener("DOMContentLoaded", function () {
    const forgetpasswordForm = document.getElementById("forgetpasswordForm");

    forgetpasswordForm.onsubmit = async (e) => {
        e.preventDefault();

        clearErrors();

        document.querySelector("#forgetpasswordForm button").disabled = true;
        document.querySelector("#forgetpasswordForm button")
            .innerHTML =
            '<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Loading...</span></div>';

        const formData = new FormData(forgetpasswordForm);

        const response = await fetch(url + "/api/forget-password", {
            method: "POST",
            headers: {
                Accept: "application/json",
                'ngrok-skip-browser-warning': 'any'
            },
            body: formData,
        });

        if (response.ok) {
            const json = await response.json();
            console.log(json);
            
            successMessage("Check your email for OTP code.");  

            forgetpasswordForm.reset();

            window.location.href = "/reset-password.html";

        } else if (response.status == 422) {
            const json = await response.json();

           setTimeout(() => {
                clearErrors();
            }, 5000);

            Object.keys(json.errors).forEach((field) => {
                const inputField = document.getElementById(field);
                const errorDiv = document.getElementById(`${field}_Error`);
                if (errorDiv && inputField) {
                    errorDiv.innerHTML = json.errors[field][0];
                    inputField.setCustomValidity(json.errors[field][0]);
                    inputField.classList.add('is-invalid');
                }
            });

            console.log(json.errors);
        }

        document.querySelector("#forgetpasswordForm button").disabled = false;
        document.querySelector("#forgetpasswordForm button").innerHTML = "Submit";
    };
});

function successMessage(message) {
    const successMessageElement = document.getElementById("successMessage");

    if (successMessageElement) {
        successMessageElement.textContent = message;
        successMessageElement.hidden = false;
    }
}

function clearErrors() {
    const formElements = document.getElementById("forgetpasswordForm").elements;

    for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i];
        element.setCustomValidity(""); 
        element.classList.remove("is-invalid"); 

        const errorElement = document.getElementById(`${element.id}_Error`);
        if (errorElement) {
            errorElement.innerHTML = ""; 
        }
    }
}
