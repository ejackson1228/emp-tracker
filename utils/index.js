const inquirer = require('inquirer');

const questions = 
[{
    type: 'list',
    name: 'Directions',
    message: 'What would you like to do?',
    Choices: ['View all Departments', 'View all Roles', 'View all Employees', 'Add a department', 'Add a Role', 'Add a employee', 'Update employee role']
},
{
    type: 'input',
    name: 'addDepartment',
    message: 'What is the name of the department you would like to add?',
    when: ({ Directions }) => {
        if()
    }
}
]




const init = function() {
    console.log(`
    ==========================

         Employee Tracker

    ==========================
    `);
    
    inquirer
    .prompt(questions)
}