// import modules ----------
const mysql = require("mysql");
const inquirer = require("inquirer");
const tables = require("console.table");
const EmployeeDB = require("./EmployeeDB");

// set up database and tables ----------
let employeeDB = new EmployeeDB();

// create department table
employeeDB.createDepartmentTable();

// create role table
employeeDB.createRoleTable();

// create employee table
employeeDB.createEmployeeTable();

// inquirer questions ----------
// Initial questions menu
let mainMenuQn = {
    name: "mainMenuChoice",
    type: "list",
    message: "What would you like to do?",
    choices: ["Add an entry", "View entries", "Update entries"]
};

// add entry submenu
let addMenuQn = {
    name: "addMenuChoice",
    type: "list",
    message: "Which table would you like to add to?",
    choices: ["Department table", "Role table", "Employee table"]
};

// view entry submenu
let viewMenuQn = {
    name: "viewMenuChoice",
    type: "list",
    message: "Which table would you like to view?",
    choices: ["Department table", "Role table", "Employee table"]
};

// update employee role questions

// add department questions
let addDeptQn = {
    name: "departmentToAdd",
    type: "input",
    message: "Enter the name of the department to be added:"
}

// add role questions
let addRoleQns = [
    {
        name: "roleTitle",
        type: "input",
        message: "Enter the title of the role to be added:"
    },
    {
        name: "roleSalary",
        type: "input",
        message: "Enter the salary for this role in decimal format (0.00):"
    },
    {
        name: "roleDepartment",
        type: "input",
        message: "Enter the name of the department associated with this role:"
    }
];

// add employee questions
let addEmployeeQns = [
    {
        name: "employeeFirst",
        type: "input",
        message: "Enter the first name of the employee to be added:"
    },
    {
        name: "employeeLast",
        type: "input",
        message: "Enter the last name of the employee to be added:"
    },
    {
        name: "employeeRole",
        type: "input",
        message: "Enter the title of the employee's role:"
    },
    {
        name: "employeeManager",
        type: "input",
        message: "If the employee has a manager, enter the manager's first and last names:"
    }
];

// inquirer prompts ----------
// main menu
function askMainMenu(){
    inquirer.prompt(mainMenuQn).then((answer) => {
        // if choose "add"
        if (answer.mainMenuChoice === "Add an entry"){
            askAddMenu();
        }
        // if choose "view"
        else if (answer.mainMenuChoice === "View entries"){
            askViewMenu();
        }
    });
}

// add menu
function askAddMenu(){
    inquirer.prompt(addMenuQn).then((answer) => {
        // if choose "department"
        if (answer.addMenuChoice === "Department table"){
            askAddDepartment();
        }
        // if choose "role"
        else if (answer.addMenuChoice === "Role table"){
            askAddRole();
        }
        // if choose "employee"
        else if (answer.addMenChoice === "Employee table"){

        }
    });
}

// view menu
function askViewMenu(){
    inquirer.prompt(viewMenuQn).then((answer) => {
        // if choose "department"
        if (answer.viewMenuChoice === "Department table"){
            showDepartmentTable();
        }
        // if choose "role"
        else if (answer.viewMenuChoice === "Role table"){
            showRoleTable();
        }
        // if choose "employee"
        else if (answer.viewMenuChoice === "Employee table"){
            showEmployeeTable();
        }
    });
}

// add department details
function askAddDepartment(){
    inquirer.prompt(addDeptQn).then((answer) => {
        employeeDB.addDepartment(answer.departmentToAdd);
    });
}

// add role details
function askAddRole(){
    inquirer.prompt(addRoleQns).then((answers) => {
        employeeDB.addRole(answers.roleTitle, answers.roleSalary, answers.roleDepartment);
    });
}

// add employee details

// view departments table
function showDepartmentTable(){
    employeeDB.getDepartments();
}

// view roles table
function showRoleTable(){
    employeeDB.getRoles();
}

// view employees table
function showEmployeeTable(){

}

// run program
function runProgram(){
    console.log(`------------------------------------------------------
| Welcome to the Employee Database Management System. |
------------------------------------------------------`)
    askMainMenu();
}

runProgram();