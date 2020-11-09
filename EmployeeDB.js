// modules --------
const mysql = require("mysql");
const consTable = require("console.table");

// class definition --------
class EmployeeDB {
    // constructor to establish connection and create database
    constructor (){
        this.connection = mysql.createConnection({
            host: "localhost",
            port: 3306,
            user: "root",
            password: "rocket"
        });
            this.connection.query("CREATE DATABASE IF NOT EXISTS employeeDB", function (err, result) {
                if (err) throw err;
            });
            this.connection.query("USE employeeDB", function(err, res){
                if (err) throw err;
            });
    }
    // TABLE CREATION ---------
    // create department table
    createDepartmentTable(){
        this.connection.query("CREATE TABLE IF NOT EXISTS department (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30))",
        function(error, result){
            if (error) throw error;
        });
    }

    // create role table
    createRoleTable(){
        this.connection.query(`CREATE TABLE IF NOT EXISTS role (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(30),
            salary DECIMAL(10,2),
            department_id INT NOT NULL,
            FOREIGN KEY(department_id) REFERENCES department(id))`,
        function(error, result){
            if (error) throw error;
        });
    }

    // create employee table
    createEmployeeTable(){
        this.connection.query(`CREATE TABLE IF NOT EXISTS employee (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(30),
            last_name VARCHAR(30),
            role_id INT NOT NULL,
            manager_id INT,
            FOREIGN KEY(role_id) REFERENCES role(id))`,
        function(error, result){
            if (error) throw error;
        });
    }

    // INSERT FUNCTIONS ----------
    // function for adding department
    addDepartment(deptName){
        this.connection.query(`INSERT INTO department SET ?`,
        {
            name: deptName
        }, function(error, result){
            if (error) throw error;
            console.log(`${result.affectedRows} department added.`);
        });
    }

    // function for adding role
    addRole(roleTitle, roleSalary, roleDepartment){
        let departmentID;
        let parent = this;
        // get department reference
        this.connection.query(`SELECT id FROM department WHERE ?`,
        {
            name: roleDepartment
        }, function (error, result){
            if (error) throw error;
            departmentID = result[0].id;
            console.log(`department ID is ${departmentID}`);

            parent.connection.query(`INSERT INTO role SET ?`,
            {
                title: roleTitle,
                salary: roleSalary,
                department_id: departmentID
            }, function(error, result){
                if (error) throw error;
                console.log(`${result.affectedRows} role added.`);
            });
        });

    }

    // function for adding employee
    addEmployee(firstNameValue, lastNameValue, roleTitle, managerFullName){
        let parent = this;
        // if manager name was provided
        /*if (managerFullName){
            let managerSplitName = managerFullName.split(" ");
            console.log(managerSplitName);
            this.connection.query("SELECT id FROM employee WHERE ?",
            {
                first_name: managerSplitName[0],
                last_name: managerSplitName[1]
            }, function(error, result){
                if (error) throw error;
                console.log(result[0].id);
            });
        }*/
        this.connection.query(`INSERT INTO employee SET ?`, {
            first_name: firstNameValue,
            last_name: lastNameValue,
            role_id: 1 
        }, function(error, result){
            if (error) throw error;
            console.log(`${result.affectedRows} employee added.`);
        });
    }

    // SELECT FUNCTIONS --------
    // function to retrieve content of department table
    getDepartments(){
        this.connection.query(`SELECT * FROM department`, function(error, result){
            if (error) throw error;
            console.log("Displaying DEPARTMENT:")
            console.table(result);
        });
    }

    // function to retrieve content of role table
    getRoles(){
        // join with department so that department name is exposed
        this.connection.query(`SELECT role.id, role.title, department.name AS department FROM role JOIN department ON role.department_id = department.id`,
         function(error, result){
            if (error) throw error;
            console.log("Displaying Roles:")
            console.table(result);
        });
    }

    // function to retrieve content of employee table
    getEmployees(){
        // join with role id so that role title is exposed
        this.connection.query(`SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) as employee_name, role.title as role
         FROM employee JOIN role ON employee.role_id = role.id`,
          function(error, result){
            if (error) throw error;
            console.log("Displaying Employees:")
            console.table(result);
        });
    }

}
module.exports = EmployeeDB;