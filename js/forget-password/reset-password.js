import { setRouter, url } from "../router/router.js";

setRouter();

document.addEventListener("DOMContentLoaded", function () {
    const resetpasswordForm = document.getElementById("resetpasswordForm");

    resetpasswordForm.onsubmit = async (e) => {
        e.preventDefault();

        clearErrors();

        document.querySelector("#resetpasswordForm button").disabled = true;
        document.querySelector("#resetpasswordForm button")
            .innerHTML =
            '<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Loading...</span></div>';

        const formData = new FormData(resetpasswordForm);

        const response = await fetch(url + "/api/reset-password", {
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
            
            successMessage("Password successfully reset.");  

            resetpasswordForm.reset();

            window.location.href = "/index.html";

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

        document.querySelector("#resetpasswordForm button").disabled = false;
        document.querySelector("#resetpasswordForm button").innerHTML = "Submit";
    };
});

function successMessage(message) {
    const successMessageElement = document.getElementById("successMessage");

    if (successMessageElement) {
        successMessageElement.textContent = message;
        successMessageElement.hidden = false;
    }
}

function errorMessage(message) {
    const errorMessageElement = document.getElementById("errorMessage");
    errorMessageElement.hidden = true;
    if (errorMessageElement) {
        errorMessageElement.textContent = message;
        errorMessageElement.hidden = false;
        setTimeout(() => {
            errorMessageElement.hidden = true;
        }, 5000);
    }
}

function clearErrors() {
    const formElements = document.getElementById("resetpasswordForm").elements;

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
