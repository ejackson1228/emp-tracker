const inquirer = require('inquirer');
const tableIt = require('console.table');
const db = require('./server');

const question1 = 
{
    type: 'list',
    name: 'Directions',
    message: 'What would you like to do?',
    choices: ['View all Departments', 'View all Roles', 'View all Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update employee role'],
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
        switch (question1.Directions) {
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
        }
    })
}; 

init(); // call to initiate app