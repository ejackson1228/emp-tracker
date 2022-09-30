const inquirer = require('inquirer');
const tableIt = require('console.table');
const db = require('./server');

const question1 = 
{
    type: 'list',
    name: 'Directions',
    message: 'What would you like to do?',
    choices: ['View all Departments', 'View all Roles', 'View all Employees', 'Add a Department', 'Add a Role', 'Add an employee', 'Update employee role'],
    default: 'View all Departments'
}
// view all departments
const viewAllDepartments = function () {
    const sql = 'SELECT * FROM departments';
    db.query(sql, (err, res) => {
        if (err) {
            res.json({ error: err.message });
            return;
        } else {
            console.table(res);
            init();
        }
    })

}
// view all roles
const viewAllRoles = function() {
    const sql = 'SELECT * FROM roles';
    db.query(sql, (err, res) => {
        if(err) {
            res.json({ error: err.message });
            return;
        } else {
            console.table(res);
            init();
        }
    })
};

//view all employees
const viewAllEmployees = function () {
    const sql = 'SELECT * FROM employee';
    db.query(sql, (err, res) => {
        if (err) {
            res.json({ error: err.message });
            return;
        } else {
            console.table(res);
            init();
        }
    })
}


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




const init = function() {
    console.log(`
    ==========================

         Employee Tracker

    ==========================
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
                // write function to add role to db
            break;

            case 'Add an Employee':
                //write function to add employee to db
            break;

            case 'Update employee role':
                //write function to update emplyee role in db
            break;
        }
    })
}; 

init();