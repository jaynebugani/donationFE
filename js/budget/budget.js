import { url, setRouter } from "../router/router.js";

setRouter();

const logout = document.getElementById("logout");

logout.onclick = async () => {
    const response = await fetch(url + "/api/logout", {
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
            'ngrok-skip-browser-warning': 'any'
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

loadUserBudgets();

document.body.addEventListener('click', function(event) {
    const target = event.target;

    if (target.tagName === 'BUTTON' && target.id.startsWith('saveButton_')) {
        const budgetId = target.id.split('_')[1];
        saveEditedBudget(budgetId);
    }
});


function saveEditedBudget(budgetId) {
    const form = document.getElementById('budgetSaveForm');
    const formData = new FormData(form);



    fetch(url + `/api/budgetsave/${budgetId}`, {
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

                $('#editModal').modal('hide');

                loadUserBudgets();
                setTimeout(() => {
                    $('#sucessModal').modal('hide');
                }, 2000);
            }

        })
        .catch(error => {
            console.error('Validation Errors:', error.errors);
        });
}

const add = document.getElementById("add");

add.onclick = async () => {
    const form = document.getElementById('budgetAddForm');
    const formData = new FormData(form);

    clearErrors();
    setTimeout(() => {
        clearErrors();
    }, 5000);

    fetch(url + '/api/budgetadd', {
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
        console.log('Response Data:', data);

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
        form.reset();
        loadUserBudgets();
    })
    .catch(error => {
        console.error('An error occurred:', error);
    });
}


function clearErrors() {

    document.getElementById('errorList').innerHTML = '';


    document.getElementById('errorMessages').style.display = 'none';


    const inputFields = document.querySelectorAll('.is-invalid');
    inputFields.forEach(field => {
        field.classList.remove('is-invalid');
    });


    const errorFields = ['budget_type', 'category', 'amount', 'date'];
    errorFields.forEach(field => {
        const errorSpan = document.getElementById(`${field}_error`);
        if (errorSpan) {
            errorSpan.textContent = '';
        }
    });
}

function openEditModal(budgetId) {

    fetch(url + `/api/edit-user-budget/${budgetId}`, {
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

            if (data.budget) {
                const editBudget = data.budget;


                document.getElementById('editForm').innerHTML = `
                <form autocomplete="off" id="budgetSaveForm">

                            <label for="budget_type" class="">Budget type:</label><br>
                            <input type="text" style="        background-color: transparent;
                              border: 1px solid black;"
                                class="form-control inputSize"
                                name="edited_budget_type" value="${editBudget.budget_type}">



                        <br>


                            <label for="category" class="">Category:</label><br>
                            <select value="${editBudget.category}" id="category" style="        background-color: transparent;
                                 border: 1px solid black;"
                                class="form-select inputCategory"
                                name="edited_category">
                                <option value="${editBudget.category}" selected hidden>${editBudget.category}</option>
                                <option value="Education">Education</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Food">Food</option>
                                <option value="Health">Health</option>
                                <option value="Miscellaneous">Miscellaneous</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Transportation">Transportation</option>
                                <option value="Utilities">Utilities</option>
                            </select>


                        <br>
                        <label for="budget_type" class="">Amount:</label><br>
                        <div class="input-group amount">
                            <input style="background-color: transparent;
                            border: 1px solid black;" id="amount" type="text" class="form-control inpamount ps-4"
                                name="edited_amount" value="${editBudget.amount}">
                        </div>

                        <br>




                            <label for="date" class="">Date:</label><br>
                            <div class="input-group date">
                                <input data-provide="datepicker" style="background-color: transparent;
                                    border: 1px solid black;"
                                    value="${editBudget.date}" type="text"
                                    class="form-control inpdate datepicker" readonly name="edited_date" id="datepicker" />
                            </div>



                        <br>

                        <button style="        background-color: #8CEF84;
                                 border: 1px solid #69A544;" id="saveButton_${editBudget.budget_id}" type="button" class="btn float-end but_save"
                            ">Save
                        </button>

                        <button type="button" style=" margin-right: 10px;       background-color: transparent;
                                 border: 1px solid #69A544;" class="btn pt-2 float-end pe-3"
                            data-dismiss="modal">Cancel</button>

                    </form>
            `;


                $('#editModal').modal('show');


            } else {

                console.error('Budget data not found');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

document.querySelector('.scrollbar').addEventListener('click', function (event) {
    const target = event.target;


    if (target.tagName === 'BUTTON' && target.id.startsWith('deleteButton_')) {

        const budget_id = target.id.split('_')[1];

        console.log(budget_id);
   
        deleteBudget(budget_id);
    }

    if (target.tagName === 'BUTTON' && target.id.startsWith('butEdit_')) {

        const budget_id = target.id.split('_')[1];
    
        openEditModal(budget_id);
    }

});

function deleteBudget(budget_id) {

    fetch(url + `/api/budgetdelete/${budget_id}`, {
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
            loadUserBudgets();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function loadUserBudgets() {
    fetch(url + '/api/get-user-budgets', {
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


            data.userBudgets.forEach(budget => {
                const row = document.createElement('div');
                row.classList.add('row', 'row1', 'pt-4');
                row.innerHTML = `
                <div class="col colum2">
                    <h4 class="grey">${budget.category}</h4>
                </div>
                <div class="col colum1 text-break">
                    <h4>${ucfirst(budget.budget_type)}</h4>
                </div>
                <div class="col colum3">
                    <h4 class="pl-5 text-break">&#8369;${budget.amount}</h4>
                </div>
                <div class="col colum4 d-flex">
                    <h4 class="grey">${budget.date}</h4>
                </div>
                <div class="col colum5 text-center justify-content-center d-flex">
                <div class="dropdown pt-1">
                        <button style="color: #80AC64; border:1px solid #80AC64; background: #F1F1F1;"
                        class="btn dropdown-toggle butdrop d-flex float-end" type="button" id="dropdownMenu2"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>

                        <div style="background:#ECFAE2;border: 1px solid black;border-radius: 10px;"
                        class="dropdown-menu" aria-labelledby="dropdownMenu2">
                        <button style="border-bottom: 1px solid black; text-align: center;"
                        class="dropdown-item" id="butEdit_${budget.budget_id}" type="button">Edit
                            </button>
                        <button class="dropdown-item" style="text-align: center; name="delete" id="deleteButton_${budget.budget_id}">Delete</button>

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

function ucfirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}