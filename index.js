const inquirer = require('inquirer');
const tableIt = require('console.table');
const db = require('./server');

const question1 = 
{
    type: 'list',
    name: 'Directions',
    message: 'What would you like to do?',
    choices: ['View all Departments', 'View all Roles', 'View all Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update employee role', 'Update Employee Manager', 'View Managers', 'View Employees by Department', 'View Employees By Manager'],
    default: 'View all Departments'
}
// view all departments
const viewAllDepartments = function () {
    const sql = 'SELECT * FROM departments';
    db.query(sql, (err, res) => {
        if (err) {
            throw err;
        } else {
            console.table(res);
            init();
        }
    })

}
// view all roles
const viewAllRoles = function() {
    const sql = 'SELECT roles.title, roles.id, roles.salary, departments.department_name FROM roles, departments WHERE roles.department_id = departments.id';
    db.query(sql, (err, res) => {
        if(err) {
            throw err;
        } else {
            console.table(res);
            init();
        }
    })
};

//view all employees
const viewAllEmployees = function () {
    const sql = 'SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, roles.title, roles.salary, departments.department_name AS department FROM employee, roles, departments WHERE employee.role_id = roles.id AND roles.department_id = departments.id ORDER BY employee.id';
    db.query(sql, (err, res) => {
        if (err) {
            throw err;
        } else {
            console.table(res);
            init();
        }
    })
}

// add new department
const addDepartment = function () {
inquirer.prompt([{
    type: 'input',
    name: 'addDepartment',
    message: 'What is the name of the department you would like to add?',
    }
]) .then(function(answers) {
    const sql = 'INSERT INTO departments (department_name) VALUES (?)';
        db.query(sql, answers.addDepartment, (err, res) => {
            if (err){
                throw err;
            } else {
                console.table(res); //console tabling response. need to console table the row 
                init();
            }
        })
    })
};

//add new role
const addRole = function () {
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleTitle',
            message: 'What is the title of the new role?'
        },
        {
            type: 'number',
            name: 'roleSalary',
            message: 'What is this roles yearly salary?'
        },
        {
            type: 'input',
            name: 'roleDepartment',
            message: 'What is the ID of the department this new role belongs to?'
        }
    ]) .then( function(answers) {
        const sql = 'INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)'
        const params = [answers.roleTitle, answers.roleSalary, answers.roleDepartment]

        db.query(sql, params, (err, res) => {
            if (err) throw err;
            console.table(res);
            init();
        });
    })
};

// add new employee
const addEmployee = function () {
    inquirer.prompt([
        {
            type:'input',
            name: 'first_name',
            message: 'What is first name of the employee you would like to add?'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is the last name of the employee you would like to add?'
        },
        {
            type: 'number',
            name: 'role_id',
            message: 'What is the ID # of the role this employee wll be taking on?'
        },
        {
            type: 'number',
            name: 'manager_id',
            message: 'Please enter the ID # of the manager overseeing this employee. (Leave blank if no manager)'
        }
    ]) .then( function(answers) {
        if (!answers.manager_id) {
            const sql = 'INSERT INTO employee (first_name, last_name, role_id) VALUES (?,?,?)';
            const params = [answers.first_name, answers.last_name, answers.role_id];
            db.query(sql, params, (err, res) => {
                if (err) throw err;
                console.table(res);
                init();
            })
        
        } else {
            const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)';
            const params =  [answers.first_name, answers.last_name, answers.role_id, answers.manager_id];
            db.query(sql, params, (err, res) => {
                if (err) throw err;
                console.table(res);
                init();
            });
        }
    })
};

// update existing employee's role
const updateEmployee = function() {
    inquirer.prompt([{
        type: 'number',
        name:'employee_id',
        message: 'What is the ID # of the employee you wish to update?'
    },
    {
        type: 'number',
        name:'role_id',
        message: 'What is the ID # of the new role this employee is taking on?'
    }
    ]).then(function(answers) {
        const sql = 'UPDATE employee SET role_id = ? WHERE ID = ?';
        const params = [answers.role_id, answers.employee_id];

        db.query(sql, params, (err, res) => {
            if (err) throw err;
            console.table(res);
            init(); 
        })

})
}

//update employee manager
const updateManager = function() {
    inquirer.prompt([
        {
            type: 'number',
            name: 'employee_id',
            message: 'What is the ID # of the employee who needs a new manager?'
        },
        {
            type: 'number',
            name: 'manager_id',
            message: 'What is the employee ID # of the manager who will manage this employee?'
        }
    ]).then( function(answers) {
        const sql = 'UPDATE employee SET manager_id = ? WHERE id = ?';
        const params = [answers.manager_id, answers.employee_id];

        db.query(sql, params, (err, res) => {
            if (err) throw err;
            console.table(res);
            init();
        });
    });
};

const viewManagers = function() { // view all managers
    const sql = 'SELECT employee.id, employee.first_name, employee.last_name FROM employee WHERE manager_id IS NULL'
    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    })
}

viewEmployeesByDepartment = async () => { // view all employees in a specific department
    let choices = await getDepartments();
    console.log(choices);
    return new Promise((resolve, reject) => {
    inquirer.prompt([
        {
        type: 'list', // if the choices option doesn't work, console log the available departments and have the user type the name in an 'input' parameter
        name: 'departmentChoice',
        message: 'Which departments employees would you like to view?',
        choices: choices // returns undefined because choices is an object array. how do i extract the values and use them as an array for choices?
        }
    ]).then( function(answer) {
        resolve();

        const sql = 'SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, employee.role_id, departments.department_name FROM employee JOIN roles ON employee.role_id = roles.id JOIN departments ON roles.department_id = departments.id WHERE departments.department_name = ?';
        const param = [answer.departmentChoice];

        db.query(sql, param, (err, res) => {
            if (err) throw err;
            console.table(res);
            init();
        });
    });
    });   
};

getDepartments = () => { // funcction to populate choices in inquirer prompt for viewEmployeesByDepartment (using promises)
    return new Promise((resolve, reject) => {
        db.query('SELECT department_name AS name FROM departments', (err, res) => { // for some reason inquirer's choices only reads object values when their key is 'name'?? research this
            if (err) reject(err);
            resolve(res);
        });
    });
}

viewEmployeesByManager = async () => {
    let choices = await getManagers();
    console.log(choices);
    return new Promise( (resolve, reject) => {
        inquirer.prompt([
            {
                name: 'manager',
                type: 'list',
                message: 'Please select a manager',
                choices: choices
            }
        ]).then(  function(answer) {
            resolve();
            console.log(answer.manager)
            const sql = 'SELECT employee.id, employee.first_name, employee.last_name, employee.role_id FROM employee WHERE manager_id = ?';
            const param = [answer.manager]

            db.query(sql, param, (err, res) => {
                if (err) throw err;
                console.table(res);
                init();
            })
        })
    });
}

const getManagers = () => { // function to update inquirer list of choices for 'view employees by manager'
    return new Promise(( resolve, reject) => {
        db.query('SELECT employee.id AS name, CONCAT(employee.first_name, " ", employee.last_name) AS manager_name FROM employee WHERE employee.manager_id IS NULL', (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

const deleteDepartment = function() {

}


// initialization function
const init = function() {
    console.log(`
    ==========================

         Employee Tracker

    ==========================

       type ctrl + C to exit
        
    __________________________
    `);
    
    inquirer
    .prompt(question1)
    .then( function (question1)  {
        switch (question1.Directions) { //switch based on user command
            case 'View all Departments':
                viewAllDepartments();
            break;

            case 'View all Roles':
                viewAllRoles();
            break;

            case 'View all Employees':
                viewAllEmployees();
            break;

            case 'Add a Department': 
                addDepartment();
            break;

            case 'Add a Role':
                addRole();
            break;

            case 'Add an Employee':
                addEmployee();
            break;

            case 'Update employee role':
                updateEmployee();
            break;

            case 'Update Employee Manager':
                updateManager();
            break;

            case 'View Managers':
                viewManagers();
            break;

            case 'View Employees by Department':
                viewEmployeesByDepartment();
            break;

            case 'View Employees By Manager':
                viewEmployeesByManager();
            break;
        }
    })
}; 

init(); // call to initiate app