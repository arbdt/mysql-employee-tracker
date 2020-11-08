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

// inquirer questions

// inquirer prompts

// sql queries

// run program