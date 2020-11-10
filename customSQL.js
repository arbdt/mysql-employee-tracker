class customSQL {
    constructor (){
        this.createDepartmentTable = `CREATE TABLE IF NOT EXISTS department (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
             name VARCHAR(30))`;
        this.createRoleTable = `CREATE TABLE IF NOT EXISTS role (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(30),
            salary DECIMAL(10,2),
            department_id INT NOT NULL,
            FOREIGN KEY(department_id) REFERENCES department(id))`;
        this.createEmployeeTable = `CREATE TABLE IF NOT EXISTS employee (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(30),
                last_name VARCHAR(30),
                role_id INT NOT NULL,
                manager_id INT,
                FOREIGN KEY(role_id) REFERENCES role(id))`;
        this.addDepartment = `INSERT INTO department SET ?`;
        this.addRole = `INSERT INTO role SET ?`;
        this.addEmployee = `INSERT INTO employee SET ?`;
        this.getDepartments = `SELECT * FROM department`;
        this.getRoles = `SELECT role.id, role.title, department.name AS department
         FROM role JOIN department ON role.department_id = department.id`;
        this.getEmployees = `SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) as employee_name, role.title as role
        FROM employee JOIN role ON employee.role_id = role.id`;

    }
}

module.exports = customSQL;