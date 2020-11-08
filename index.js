// import modules
const mysql = require("mysql");
const inquirer = require("inquirer");
const tables = require("console.table");
const EmployeeDB = require("./EmployeeDB");

// set up database connection
let employeeDB = new EmployeeDB();

// create schema
employeeDB.createEmployeeDB();

// create department table
employeeDB.createDepartmentTable();

// create role table
employeeDB.createRoleTable();

// create employee table
employeeDB.createEmployeeTable();

// inquirer questions -------
// Initial questions menu
let mainMenuQn = {
    name: "mainMenuChoice",
    type: "list",
    message: "Welcome to the Employee Database Manager. What would you like to do today?",
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

// inquirer prompts

// sql queries

// run program