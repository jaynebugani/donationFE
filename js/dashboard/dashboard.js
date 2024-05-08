import { setRouter, url } from "../router/router.js";

setRouter();

const logout = document.getElementById("logout");

logout.onclick = async () => {
    const response = await fetch(url + "/api/logout", {
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
    });
    if (response.ok) {
        localStorage.clear();
        window.location.href = "/index.html";

    } else {
        const json = await response.json();
        console.log(json.errors);
    }
};



loadUserIncomes();
dailyIncome();
dailySpending();
dailySaving();
weeklyIncome();
weeklySpending();
weeklySaving();

function weeklySaving() {
    fetch(url + '/api/weeklysaving', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: "Bearer " + localStorage.getItem("token"),
            'ngrok-skip-browser-warning': 'any'
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        document.querySelector('.weeklysavingcontainer').innerHTML =
            `<h2 class="fw-bold">&#8369;${data.weeklySaving}</h2>`;
    })
    .catch(error => {
        console.error('Error during fetch operation:', error);

        // Log the response text for further investigation
        response.text().then(text => console.error('Response Text:', text));
    });
}


function weeklySpending() {
    fetch(url+ '/api/weeklyspending', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: "Bearer " + localStorage.getItem("token"),
                'ngrok-skip-browser-warning': 'any'
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.querySelector('.weeklyspendingcontainer').innerHTML =
                `<h2 class="fw-bold">&#8369;${data.weeklySpending}</h2>`;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function weeklyIncome() {
    fetch( url + '/api/weeklyIncome', {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                Accept: 'application/json',
                'ngrok-skip-browser-warning': 'any'
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.querySelector('.weeklyincomecontainer').innerHTML =
                `<h2 class="fw-bold">&#8369;${data.weeklyIncome}</h2>`;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}


function dailySaving() {
    fetch( url + '/api/dailysaving', {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                Accept: 'application/json',
                'ngrok-skip-browser-warning': 'any'
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.querySelector('.dailysavingcontainer').innerHTML =
                `<h2 class="fw-bold">&#8369;${data.todaysSaving}</h2>`;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function dailySpending() {
    fetch(url+ '/api/dailyspending', {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                Accept: 'application/json',
                'ngrok-skip-browser-warning': 'any'
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.querySelector('.dailyspendingcontainer').innerHTML =
                `<h2 class="fw-bold">&#8369;${data.todaysSpending}</h2>`;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function dailyIncome() {
    fetch(url+ '/api/dailyincome', {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                Accept: 'application/json',
                'ngrok-skip-browser-warning': 'any'
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.querySelector('.dailyincomecontainer').innerHTML =
                `<h2 class="fw-bold">&#8369;${data.todaysIncome}</h2>`;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

document.body.addEventListener('click', function(event) {
    const target = event.target;

    if (target.tagName === 'BUTTON' && target.id.startsWith('saveButton_')) {
        const incomeId = target.id.split('_')[1];
        saveEditExpenses(incomeId);
    }
});



function saveEditExpenses(incomeId) {
    console.log('Income ID:', incomeId);
    const form = document.getElementById('incomeEditForm');
    const formData = new FormData(form);

    fetch(url+ `/api/incomesave/${incomeId}`, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                Accept: 'application/json',
                'ngrok-skip-browser-warning': 'any'
            },
        })

        .then(response => response.json())
        .then(data => {
            clearErrors();
            console.log(data);

            if (data.errors) {
                console.error('Validation Errors:', data.errors);


                Object.keys(data.errors).forEach(field => {
                    console.error(`Field: ${field}, Error: ${data.errors[field][0]}`);
                });


                Object.keys(data.errors).forEach(field => {
                    const errorMessages = data.errors[field].join(', ');

                    const errorListItem = document.createElement('li');
                    errorListItem.textContent = `${field}: ${errorMessages}`;
                    document.getElementById('errorList').appendChild(errorListItem);

                    const inputField = document.querySelector(`[name="${field}"]`);
                    inputField.classList.add('is-invalid');
                    inputField.style.border = "1px solid #ff3333";
                    setTimeout(() => {
                        clearErrors();
                        inputField.style.border = "1px solid #000000";
                    }, 5000);

                    const errorSpan = document.getElementById(`${field}_error`);
                    if (errorSpan) {
                        errorSpan.textContent = errorMessages;
                    }
                });
            } else {

                console.log('Data changes successfully save.');

                const successMessage = document.getElementById('successMessage');
                if (successMessage) {
                    successMessage.textContent = 'Data changes successfully save.';
                }

                $('#sucessModal').modal({
                    backdrop: false,
                    show: true
                });

                $('#incomeModal').modal('hide');

                loadUserIncomes();
                dailyIncome();
                dailySpending();
                dailySaving();
                weeklyIncome();
                weeklySpending();
                weeklySaving();
                
                setTimeout(() => {
                    $('#sucessModal').modal('hide');
                }, 2000);
            }

        })
        .catch(error => {
            console.error('Validation Errors:', error.errors);
        });
}


document.querySelector('.scrollbar').addEventListener('click', function (event) {
    const target = event.target;


    if (target.tagName === 'BUTTON' && target.id.startsWith('deleteButton_')) {

        const incomeId = target.id.split('_')[1];

   
        deleteExpenses(incomeId);
    }

    if (target.tagName === 'BUTTON' && target.id.startsWith('butEdit_')) {

        const incomeId = target.id.split('_')[1];

    
        openExpensesModal(incomeId);
    }

});

function deleteExpenses(incomeId) {
    fetch(url + `/api/incomedelete/${incomeId}`, {
        method: 'DELETE',
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            Accept: 'application/json',
            'ngrok-skip-browser-warning': 'any'
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data.message);
         const successMessage = document.getElementById('successMessage');
                if (successMessage) {
                    successMessage.textContent = 'Successfully Deleted!';
                }

                $('#sucessModal').modal({
                    backdrop: false,
                    show: true
                });

                $('#editModal').modal('hide');

                setTimeout(() => {
                    $('#sucessModal').modal('hide');
                }, 2000);
                loadUserIncomes();
                dailyIncome();
                dailySpending();
                dailySaving();
                weeklyIncome();
                weeklySpending();
                weeklySaving();
                
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}


function openExpensesModal(incomeId) {

    fetch(url + `/api/edit-user-income/${incomeId}`, {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                Accept: 'application/json',
                'ngrok-skip-browser-warning': 'any'
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            if (data.income) {
                const editIncome = data.income;


                document.getElementById('incomeEditForm').innerHTML = `


            <label for="budget_type" class="">Budget type:</label><br>
            <input type="text" style="        background-color: transparent;
              border: 1px solid black;"
                class="form-control inputSize"
                name="edited_type" value="${editIncome.type}">

        <br>
        <label for="budget_type" class="">Amount:</label><br>
        <div class="input-group amount">
            <input style="background-color: transparent;
            border: 1px solid black;" id="amount" type="text" class="form-control inpamount ps-4"
                name="edited_amount" value="${editIncome.amount}">
        </div>

        <br>


            <label for="date" class="">Date:</label><br>
            <div class="input-group date">
                <input style="background-color: transparent;
                    border: 1px solid black;"
                    value="${editIncome.date}" type="text" data-provide="datepicker"
                    class="form-control inpdate datepicker" readonly name="edited_date" id="picker" />
            </div>



          <br>

             <button style="background-color: #8CEF84; border: 1px solid #69A544;"
                type="button" class="btn float-end but_save" id="saveButton_${editIncome.income_id}"
                >Save
                </button>


        <button type="button" style=" margin-right: 10px;       background-color: transparent;
                 border: 1px solid #69A544;" class="btn pt-2 float-end pe-3"
            data-dismiss="modal">Cancel</button>


            `;

                $('#incomeModal').modal('show');


            } else {

                console.error('Budget data not found');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

    const add = document.getElementById("add");


    add.onclick = async () => {

        const form = document.getElementById('incomeForm');
        const formData = new FormData(form);

    clearErrors();
    setTimeout(() => {
        clearErrors();
    }, 5000);

    fetch(url + `/api/incomeadd`, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                Accept: 'application/json',
            },
        })

        .then(response => response.json())
        .then(data => {
            clearErrors();
            console.log(data);

            if (data.errors) {
                console.error('Validation Errors:', data.errors);

                Object.keys(data.errors).forEach(field => {
                    console.error(`Field: ${field}, Error: ${data.errors[field][0]}`);
                });

                Object.keys(data.errors).forEach(field => {
                    const errorMessages = data.errors[field].join(', ');

                    const errorListItem = document.createElement('li');
                    errorListItem.textContent = `${field}: ${errorMessages}`;
                    document.getElementById('errorList').appendChild(errorListItem);

                    const inputField = document.querySelector(`[name="${field}"]`);
                    inputField.classList.add('is-invalid');

                    const errorSpan = document.getElementById(`${field}_error`);
                    if (errorSpan) {
                        errorSpan.textContent = errorMessages;
                    }
                });
            } else {
                console.log('Successfully Added!');
                form.reset();
                const successMessage = document.getElementById('successMessage');
                if (successMessage) {
                    successMessage.textContent = 'Successfully Added!';
                }

                $('#sucessModal').modal({
                    backdrop: false,
                    show: true
                });

                $('#editModal').modal('hide');

                setTimeout(() => {
                    $('#sucessModal').modal('hide');
                }, 2000);
            }
           
            loadUserIncomes();
            dailyIncome();
            weeklyIncome();
        })
    }

function loadUserIncomes() {
    fetch(url + '/api/get-user-incomes', {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                Accept: 'application/json',
                'ngrok-skip-browser-warning': 'any'
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            document.querySelector('.scrollbar').innerHTML = '';


            data.userIncomes.forEach(incomes => {
                const row = document.createElement('div');
                 
                row.innerHTML = `
                <div class="row rowAl pt-2">
                                    <div class="col text-center">
                                        <h4>${incomes.type}</h4>
                                    </div>
                                    <div class="col grey text-center">
                                        <h4>&#8369;${incomes.amount}</h4>
                                    </div>
                                    <div class="col text-center">

                                        <h4>${incomes.date}</h4>
                                    </div>
                                    <div class="col">
                                        <div class="dropdown d-flex justify-content-center pt-2">
                                            <button
                                                style="color: #80AC64; border:1px solid #80AC64; background: #F1F1F1;"
                                                class="btn dropdown-toggle butdrop d-flex float-end" type="button"
                                                id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true"
                                                aria-expanded="false"></button>

                                            <div style="background:#ECFAE2;border: 1px solid black;border-radius: 10px;"
                                                class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                                <button style="border-bottom: 1px solid black; text-align: center;"
                                                    class="dropdown-item" id="butEdit_${incomes.income_id}" type="button"
                                                    >Edit
                                                </button>
                                                <button
                                                class="dropdown-item" style="text-align: center;" type="button"
                                                id="deleteButton_${incomes.income_id}">Delete</button>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                

            `;

                document.querySelector('.scrollbar').appendChild(row);
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function clearErrors() {
    const errorList = document.getElementById('errorList');
    if (errorList) {
        errorList.innerHTML = ''; 
    }

    const formElements = document.querySelectorAll('.is-invalid');
    formElements.forEach(element => {
        element.classList.remove('is-invalid'); 
    });

    const validationErrorElements = document.querySelectorAll('.validation-error-color');
    validationErrorElements.forEach(element => {
        element.textContent = ''; 
    });
}

function ucfirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
