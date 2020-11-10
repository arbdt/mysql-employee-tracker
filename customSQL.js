// this file holds custom MYSQL queries for use in the main program
class customSQL {
    constructor (){
        // create tables -----
        // department
        this.createDepartmentTable = `CREATE TABLE IF NOT EXISTS department (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
             name VARCHAR(30))`;
        // role
        this.createRoleTable = `CREATE TABLE IF NOT EXISTS role (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(30),
            salary DECIMAL(10,2),
            department_id INT NOT NULL,
            FOREIGN KEY(department_id) REFERENCES department(id))`;
        // employee
        this.createEmployeeTable = `CREATE TABLE IF NOT EXISTS employee (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(30),
                last_name VARCHAR(30),
                role_id INT NOT NULL,
                manager_id INT,
                FOREIGN KEY(role_id) REFERENCES role(id))`;
        
        // add rows to tables
        // department
        this.addDepartment = `INSERT INTO department SET ?`;
        // role
        this.addRole = `INSERT INTO role SET ?`;
        // employee
        this.addEmployee = `INSERT INTO employee SET ?`;
        
        // retrieve content from tables
        // department
        this.getDepartments = `SELECT * FROM department`;
        // role
        this.getRoles = `SELECT role.id, role.title, department.name AS department
         FROM role JOIN department ON role.department_id = department.id`;
        // employee
        this.getEmployees = `SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) as employee_name, role.title as role,
         CONCAT(manager.first_name, " ", manager.last_name) as manager_name
        FROM employee INNER JOIN role ON employee.role_id = role.id LEFT JOIN employee AS manager on employee.manager_id = manager.id`;

    }
}

module.exports = customSQL;