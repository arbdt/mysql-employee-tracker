const mysql = require("mysql");
class EmployeeDB {
    // constructor to establish connection and create database
    constructor (){
        this.connection = mysql.createConnection({
            host: "localhost",
            port: 3306,
            user: "root",
            password: "rocket"
        });
        this.connection.connect(function(err) {
            if (err) throw err;
            console.log("Connection established.");
            this.connection.query("CREATE DATABASE IF NOT EXISTS employeeDB", function (err, result) {
                if (err) throw err;
                console.log("Database created");
            });
        });
        this.connection.query("USE employeeDB", function(err, res){
            if (err) throw err;
            console.log("Database connected");
        });
    }

    // create department table
    createDepartmentTable(){
        this.connection.query("CREATE TABLE IF NOT EXISTS department (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30))"),
        function(error, result){
            if (error) throw error;
            console.log("Department table created.");
        };
    }

    // create role table
    createRoleTable(){
        this.connection.query(`CREATE TABLE IF NOT EXISTS role (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(30),
            salary DECIMAL,
            department_id INT NOT NULL,
            FOREIGN KEY(department_id) REFERENCES department(id))`),
        function(error, result){
            if (error) throw error;
            console.log("Role table created.");
        };
    }

    // create employee table
    createEmployeeTable(){
        this.connection.query(`CREATE TABLE IF NOT EXISTS employee (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(30),
            last_name VARCHAR(30),
            role_id INT NOT NULL,
            manager_id INT,
            FOREIGN KEY(role_id) REFERENCES role(id))`),
        function(error, result){
            if (error) throw error;
            console.log("Employee table created.")
        }
    }

}
module.exports = EmployeeDB;