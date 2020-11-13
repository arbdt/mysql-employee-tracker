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
    choices: ["View entries", "Add an entry", "Update an entry", "Quit"]
};

// add entry submenu
let addMenuQn = {
    name: "addMenuChoice",
    type: "list",
    message: "What kind of entry would you like to add?",
    choices: ["Department", "Role", "Employee"]
};

// view entry submenu
let viewMenuQn = {
    name: "viewMenuChoice",
    type: "list",
    message: "Which dataset would you like to view?",
    choices: ["Departments", "Roles", "Employees"]
};

// inquirer prompts ----------
// main menu
function askMainMenu(){
    inquirer.prompt(mainMenuQn).then((answer) => {
        // if choose "add"
        if (answer.mainMenuChoice === "View entries"){
            askViewMenu();
        }
        // if choose "view"
        else if (answer.mainMenuChoice === "Add an entry"){
            askAddMenu();
        }
        // if choose "update"
        else if (answer.mainMenuChoice === "Update an entry"){
            askUpdateEmployee();
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
        if (answer.addMenuChoice === "Department"){
            askAddDepartment();
        }
        // if choose "role"
        else if (answer.addMenuChoice === "Role"){
            askAddRole();
        }
        // if choose "employee"
        else if (answer.addMenuChoice === "Employee"){
            askAddEmployee();
        }
    });
}

// view menu
function askViewMenu(){
    inquirer.prompt(viewMenuQn).then((answer) => {
        // if choose "department"
        if (answer.viewMenuChoice === "Departments"){
            viewDepartmentTable();
        }
        // if choose "role"
        else if (answer.viewMenuChoice === "Roles"){
            viewRoleTable();
        }
        // if choose "employee"
        else if (answer.viewMenuChoice === "Employees"){
            viewEmployeeTable();
        }
    });
}

// add department details
function askAddDepartment(){
    // questions for add to department
    let addDeptQn = {
        name: "departmentToAdd",
        type: "input",
        message: "Enter the name of the department to be added:"
    }

    // ask add department prompt
    inquirer.prompt(addDeptQn).then((answer) => {
        // run query
        connection.query(sql.addDepartment,{
            name: answer.departmentToAdd
        },function(error, result){
            if (error) throw error;
            console.log(`${result.affectedRows} department added.`);

            // display main menu
            askMainMenu();
        });
    });
}

// add role details
function askAddRole(){
    // get existing departments
    connection.query(sql.getDepartments, function(error, result){
        if (error) throw error;
        let departmentContent = result;
        
        // questions for add-role prompt
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

        // ask add role prompt
        inquirer.prompt(addRoleQns).then((answers) => {
            // get department id from chosen department name
            let deptID;
            for (let d = 0; d < departmentContent.length; d++){
                if(departmentContent[d].name === answers.roleDepartment){
                    deptID = departmentContent[d].id;
                }
            }
            // run query to add to role table
            connection.query(sql.addRole,{
                title: answers.roleTitle,
                salary: answers.roleSalary,
                department_id: deptID
            }, function(error, result){
                if (error) throw error;
                console.log(`${result.affectedRows} role added.`);

                // return to main menu
                askMainMenu();
            });
        });
    });
}

// add employee details
function askAddEmployee(){
    // get existing roles
    connection.query(sql.getRoles, function(error, result){
        if (error) throw error;
        let roleContent = result; // store role table


        // get existing managers (ie existing employees)
        connection.query(sql.getEmployees, function(error, result){
            let employeeContent = result; // store employee table


            // feed into question bank
            // questions for add-employee prompt
            let addEmployeeQns = [
                {
                    name: "employeeFirst",
                    type: "input",
                    message: "Enter the first name of the employee:"
                },
                {
                    name: "employeeLast",
                    type: "input",
                    message: "Enter the last name of the employee:"
                },
                {
                    name: "employeeRole",
                    type: "list",
                    message: "Choose the employee's role:",
                    choices: function(){
                        let roleTitles = [];
                        for (let r = 0; r < roleContent.length; r++){
                            roleTitles.push(roleContent[r].title);
                        }
                        return roleTitles;
                    }
                },
                {
                    name: "employeeManager",
                    type: "list",
                    message: "If the employee has a manager, choose that person, otherwise select \"N\/A\":",
                    choices: function(){
                        let managerNames = ["N/A"];
                        for (let m = 0; m < employeeContent.length; m++){
                            managerNames.push(employeeContent[m].employee_name);
                        }
                        return managerNames;
                    }
                }
            ];

            // run prompt
            inquirer.prompt(addEmployeeQns).then((answers) => {
                // match chosen role title with role_id
                let roleID;
                for (let r = 0; r < roleContent.length; r++){
                    if(answers.employeeRole === roleContent[r].title){
                        roleID = roleContent[r].id;
                    }
                }

                // extract manager name and convert to manager_id (if was selected)
                let managerID = null;
                if (answers.employeeManager != "N/A"){
                    for (let m = 0; m < employeeContent.length; m++){
                        if (answers.employeeManager === employeeContent[m].employee_name){
                            managerID = employeeContent[m].id;
                        }
                    }
                }

                // add employee to employee table
                connection.query(sql.addEmployee, {
                    first_name: answers.employeeFirst,
                    last_name: answers.employeeLast,
                    role_id: roleID,
                    manager_id: managerID
                }, function (error, result){
                    if (error) throw (error);
                    console.log(`${result.affectedRows} employee added.`);

                    //return to main menu
                    askMainMenu();
                });
            });
        });
    });
}

function askUpdateEmployee(){
    // get employees
    connection.query(sql.getEmployees, function(error, result){
        if (error) throw error;
        let employeeContent = result;

        // question to get specific employee
        let updateEmployeeSelectorQn = {
            name: "employeeChoice",
            type: "list",
            message: "Choose an employee record to update:",
            choices: function(){
                let employeeNames = [];
                for (let e = 0; e < employeeContent.length; e++){
                    employeeNames.push(`NAME:${employeeContent[e].employee_name}, ROLE:${employeeContent[e].role},  MANAGER:${employeeContent[e].manager_name}`);
                }
                return employeeNames;
            }
        }

        // ask prompt to select employee
        inquirer.prompt(updateEmployeeSelectorQn).then((answer) => {
            let chosenEmployeeID;
            for (let e = 0; e < employeeContent.length; e++){
                if (answer.employeeChoice.includes(employeeContent[e].employee_name)){
                    chosenEmployeeID = employeeContent[e].id;
                }
            }
            // get existing roles
            connection.query(sql.getRoles, function(error, result){
            if (error) throw error;
            let roleContent = result; // store role table

                // ask for new details
                let updateEmployeeDetailsQns = [
                    {
                        name: "employeeNewFirst",
                     type: "input",
                        message: "Enter the first name of the employee:"
                    },
                    {
                        name: "employeeNewLast",
                        type: "input",
                        message: "Enter the last name of the employee:"
                    },
                    {
                        name: "employeeNewRole",
                        type: "list",
                        message: "Choose the employee's role:",
                        choices: function(){
                            let roleTitles = [];
                            for (let r = 0; r < roleContent.length; r++){
                                roleTitles.push(roleContent[r].title);
                            }
                            return roleTitles;
                        }
                    },
                    {
                        name: "employeeNewManager",
                        type: "list",
                        message: "If the employee has a manager, choose that person, otherwise select \"N\/A\":",
                        choices: function(){
                            let managerNames = ["N/A"];
                            for (let m = 0; m < employeeContent.length; m++){
                                managerNames.push(employeeContent[m].employee_name);
                            }
                            return managerNames;
                        }
                    }
                ];
                // assert employee being edited
                console.log("Editing this record:");
                console.log(answer.employeeChoice);

                // run prompt
                inquirer.prompt(updateEmployeeDetailsQns).then((answers) => {
                    // match chosen role title with role_id
                    let roleID;
                    for (let r = 0; r < roleContent.length; r++){
                        if(answers.employeeNewRole === roleContent[r].title){
                            roleID = roleContent[r].id;
                        }
                    }

                    // extract manager name and convert to manager_id (if was selected)
                    let managerID = null;
                    if (answers.employeeNewManager != "N/A"){
                        for (let m = 0; m < employeeContent.length; m++){
                            if (answers.employeeNewManager === employeeContent[m].employee_name){
                                managerID = employeeContent[m].id;
                            }
                        }
                    }

                    // update employee entry in employee table
                    connection.query(sql.updateEmployee, [
                        {
                            first_name: answers.employeeNewFirst,
                            last_name: answers.employeeNewLast,
                            role_id: roleID,
                            manager_id: managerID
                        },
                        {
                            id: chosenEmployeeID
                        }
                    ], function (error, result){
                        if (error) throw (error);
                        console.log(`${result.affectedRows} employee updated.`);

                        //return to main menu
                        askMainMenu();
                    });
                });
            });
        });
    });
}

// view departments table
function viewDepartmentTable(){
    connection.query(sql.getDepartments, function(error, result){
        if (error) throw error;
        else {
            // display results
            console.log("Displaying Departments:");
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
            console.log("Displaying Roles:");
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
                console.log("Displaying Employees:");
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
------------------------------------------------------`);
    askMainMenu();
}

runProgram();