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

loadUserExpenses();

$(function() {
        $('#picker').datepicker({
            format: 'yyyy-dd-mm-dd',
            autoclose: true,

        });
    });
    
    document.body.addEventListener('click', function(event) {
        const target = event.target;
    
        if (target.tagName === 'BUTTON' && target.id.startsWith('saveButton_')) {
            const expensesId = target.id.split('_')[1];
            saveEditExpenses(expensesId);
        }
    });
    

function saveEditExpenses(expensesId) {
    const form = document.getElementById('expensesSaveForm');
    const formData = new FormData(form);

    fetch(url + `/api/expensessave/${expensesId}`, {
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


                console.log('Data changes sully save.');

                const successMessage = document.getElementById('successMessage');
                if (successMessage) {
                    successMessage.textContent = 'Data changes successfully save.';
                }

                $('#sucessModal').modal({
                    backdrop: false,
                    show: true
                });

                $('#editExpensesModal').modal('hide');

                loadUserExpenses();
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

        const expenses_id = target.id.split('_')[1];

        console.log(expenses_id);
   
        deleteExpenses(expenses_id);
    }

    if (target.tagName === 'BUTTON' && target.id.startsWith('butEdit_')) {
       
        const expenses_id = target.id.split('_')[1];
    
        openExpensesModal(expenses_id);
    }

});

function deleteExpenses(expenses_id) {
    fetch(url+ `/api/expensesdelete/${expenses_id}`, {
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
            loadUserExpenses();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

const add = document.getElementById("add");

add.onclick = async () => {
    const form = document.getElementById('expensesAddForm');
    const formData = new FormData(form);

    clearErrors();
    setTimeout(() => {
        clearErrors();
    }, 5000);

    fetch(url + `/api/expensesadd`, {
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
            loadUserExpenses();
        })
}


function openExpensesModal(expensesId) {

    fetch(url + `/api/edit-user-expenses/${expensesId}`, {
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

            if (data.expenses) {
                const editExpenses = data.expenses;


                document.getElementById('expensesEditForm').innerHTML = `

                <form id="expensesSaveForm">
                    <label for="budget_type" class="">Budget type:</label><br>
                    <input type="text" style="        background-color: transparent;
                      border: 1px solid black;"
                        class="form-control inputSize"
                        name="edited_type" value="${editExpenses.type}">

                <br>

                    <label for="category" class="">Category:</label><br>
                    <select value="${editExpenses.category}" id="category" style="        background-color: transparent;
                         border: 1px solid black;"
                        class="form-select inputCategory"
                        name="edited_category">
                        <option value="${editExpenses.category}" selected hidden>${editExpenses.category}</option>
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
                        name="edited_amount" value="${editExpenses.amount}">
                </div>

                <br>


                    <label for="date" class="">Date:</label><br>
                    <div class="input-group date">
                        <input data-provide="datepicker" style="background-color: transparent;
                            border: 1px solid black;"
                            value="${editExpenses.date}" type="text"
                            class="form-control inpdate datepicker" readonly name="edited_date" id="datepicker" />
                    </div>



                <br>

                <button style="background-color: #8CEF84; border: 1px solid #69A544;"
     type="button" class="btn float-end but_save"
    id="saveButton_${editExpenses.expenses_id}">Save
        </button>


                <button type="button" style=" margin-right: 10px;       background-color: transparent;
                         border: 1px solid #69A544;" class="btn pt-2 float-end pe-3"
                    data-dismiss="modal">Cancel</button>
                </form>

        `;


                $('#editExpensesModal').modal('show');


            } else {

                console.error('Budget data not found');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}


   function loadUserExpenses() {
    fetch(url + '/api/get-user-expenses', {
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

            data.userExpenses.forEach(expenses => {
                const row = document.createElement('div');
                row.classList.add('row', 'pt-3', 'pb-2');
                row.innerHTML = `

                        <h4 class="col text-center">${expenses.category}</h4>
                        <h4 class="col grey text-center text-break">${ucfirst(expenses.type)} </h4>
                        <h4 class="col text-center text-break">&#8369;${expenses.amount}</h4>
                        <h4 class="col grey text-end">${expenses.date}</h4>
                        <div class="col text-center justify-content-center d-flex">
                            <div class="dropdown pt-1">
                                <button style="color: #80AC64; border:1px solid #80AC64; background: #F1F1F1;"
                                    class="btn dropdown-toggle butdrop d-flex float-end" type="button"
                                    id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true"
                                    aria-expanded="false"></button>

                                <div style="background:#ECFAE2;border: 1px solid black;border-radius: 10px;"
                                    class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                    <button style="border-bottom: 1px solid black; text-align: center;"
                                        class="dropdown-item" id="butEdit_${expenses.expenses_id}" type="button"
                                        >Edit
                                    </button>
                                    <button class="dropdown-item" style="text-align: center; name="delete"
                                        id="deleteButton_${expenses.expenses_id}"
                                        >Delete</button>
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
    if (typeof str === 'undefined' || str === null) {
        return ''; 
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}