## 12: MySQL Employee Database and Node JS Command Line Interface

# About this project
This is a command-line-interface JavaScript application that runs using Node. It makes use of the `Inquirer`, `MYSQL`, and `Console.table` modules.

This program allows users to organise the departments, roles, and employees of an organisation using a MYSQL database. One initiating the program, the user is asked whether they want to  view table content, add to tables, or update an entry. They are then prompted to choose a table to view/add to and then prompted for the details needed (if adding or editing). User choices or entries are passed to the database via mysql query functions and the result is returned to be displayed using console.table.
Due to table relations and dependencies, Department entries must be created before Role entries, and Role entries before Employee entries. Ideally, Employees should be added in top-down order, as the "manager" property refers to existing employees, but this can be initialised as null and updated later.

At present, all three tables may be viewed and added to, but only employee records can be updated.

# Demonstration
A video that goes through the process of running the application to view tables, add entries, and update entries can be found [on YouTube](https://youtu.be/8aDYbT942SY).