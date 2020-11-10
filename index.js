// import modules ----------
const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("console.table");
const CustomSQL = require("./customSQL");

// set up database and tables ----------
let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rocket"
});
connection.query("CREATE DATABASE IF NOT EXISTS employeeDB", function (error, result) {
    if (error) throw error;
});
connection.query("USE employeeDB", function(error, result){
    if (error) throw error;
});
console.log("Database connected");
let sql = new CustomSQL();

// create department table
connection.query(sql.createDepartmentTable,
        function(error, result){
            if (error) throw error;
        });

// create role table
connection.query(sql.createRoleTable,
function(error, result){
    if (error) throw error;
});

// create employee table
connection.query(sql.createEmployeeTable,
function(error, result){
    if (error) throw error;
});

// inquirer questions ----------
// Initial questions menu
let mainMenuQn = {
    name: "mainMenuChoice",
    type: "list",
    message: "What would you like to do?",
    choices: ["Add an entry", "View entries", "Update entries", "Quit"]
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
        // if choose "quit"
        else if (answer.mainMenuChoice === "Quit"){
            connection.end(function(error){
                if (error) throw error;
            });
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
        else if (answer.addMenuChoice === "Employee table"){
            askAddEmployee();
        }
    });
}

// view menu
function askViewMenu(){
    inquirer.prompt(viewMenuQn).then((answer) => {
        // if choose "department"
        if (answer.viewMenuChoice === "Department table"){
            viewDepartmentTable();
        }
        // if choose "role"
        else if (answer.viewMenuChoice === "Role table"){
            viewRoleTable();
        }
        // if choose "employee"
        else if (answer.viewMenuChoice === "Employee table"){
            viewEmployeeTable();
        }
    });
}

// add department details
function askAddDepartment(){
    inquirer.prompt(addDeptQn).then((answer) => {
       connection.query(sql.addDepartment,{
           name: answer.departmentToAdd
       },function(error, result){
           if (error) throw error;
           console.log(`${result.affectedRows} department added.`);
       });
    });
}

// add role details
function askAddRole(){
    // get existing departments
    let departmentContent = employeeDB.getDepartments();

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
            type: "list",
            message: "Choose the department associated with this role:",
            choices: function(){
                let departmentNames = [];
                for (let d = 0; d < departmentContent.length; d++){
                    departmentNames.push(departmentContent[d].name);
                }
                return departmentNames;
            }
        }
    ];
    inquirer.prompt(addRoleQns).then((answers) => {
        employeeDB.addRole(answers.roleTitle, answers.roleSalary, answers.roleDepartment);
    });

    //askMainMenu();
}

// add employee details
function askAddEmployee(){
    inquirer.prompt(addEmployeeQns).then((answers) => {
        employeeDB.addEmployee(answers.employeeFirst, answers.employeeLast, answers.employeeRole, answers.employeeManager);
    });
}

// view departments table
function viewDepartmentTable(){
    connection.query(sql.getDepartments, function(error, result){
        if (error) throw error;
        else {
            // display results
            console.log("Displaying Departments:")
            console.table(result);
        }
        // return to main menu
        askMainMenu();
    });
}

// view roles table
function viewRoleTable(){
    connection.query(sql.getRoles, function(error, result){
        if (error) throw error;
        else {
            // display results
            console.log("Displaying Roles:")
            console.table(result);
        }
        // return to main menu
        askMainMenu();
    });
}

// view employees table
function viewEmployeeTable(){
    connection.query(sql.getEmployees, function(error, result){
            if (error) throw error;
            else {
                // display results
                console.log("Displaying Employees:")
                console.table(result);
            }
            // return to main menu
            askMainMenu();
        });
}

// run program
function runProgram(){

    console.log(`------------------------------------------------------
| Welcome to the Employee Database Management System. |
------------------------------------------------------`)
    askMainMenu();
}

runProgram();