//Node Packages
const cTable = require("console.table");
const inquirer = require("inquirer");
const mysql = require('mysql');
const department = require("./lib/department");
const Department = department.Deparment;
const role = require("./lib/role");
const Role = role.Role;
const employee = require("./lib/employee");
const Employee = employee.Employee;
const connection = mysql.createConnection({
  host     : "localhost",
  user     : "root",
  password : "jeld1988*",
  database : 'employees_db'
});

// connection.connect(function(err){
//   if(err){
//     console.log(err);
//   } else {
//     console.log("connection with the employees_db succesful!");
//   }
// });
//
//
// connection.end(function(err){
//   if(err){
//     console.log(err);
//   } else {
//     console.log("Connection with employees_db has ended!");
//   }
// });

// connection.destroy(); // NOTE: Confirm what method is prefered the end or destroy method to close the connection with the database.


//Global Variables:
const whatToDoQuestion = [
  {
    type: "list",
    name: "whatToDo",
    message: "What would you like todo?",
    choices: ["Create a Deparment", "Create a Role", "Add an Employee","Remove Employee","Update Employee Role","Update Employee Manager","View all Employess","View all Employees by Department","View all Employees By Manager","View the total utilized budget of a Department"]
  }
];

const createDepartmentQuestion = [{
    type: "input",
    name: "departmentName",
    message: "What is the of the department?"
  }
];

const createRoleQuestion = [{
  type: "input",
  name: "title",
  message: "What is the title for the new role?"
},
{
  type: "input",
  name: "salary",
  message: "What is the salary for the new role?"
},
{
  type: "list",
  name: "departmentName",
  message: "To what deparment does the new role belong to?",
  choices: ["Department1", "Deparment2", "Deparment3"] //Need to add query to DATABASE to retrive the deparment names.
}];

const createEmployeeQuestion = [{
  type: "input",
  name: "firstName",
  message: "What is the first name of the new employee?"
},
{
  type: "input",
  name: "lastName",
  message: "What is the last name of the new employee?"
},
{
  type: "list",
  name: "roleName",
  message: "What is the role of the new employee?",
  choices: ["Role1", "Role2", "Role3"] //Need to add query to DATABASE to retrive the role names.
},
{
  type: "list",
  name: "managerName",
  message: "What is the name of the manager that will supervise the new employee?",
  choices: ["Manager1", "Manager2", "Manager3"] //Need to add query to DATABASE to retrive the manager names.
}];

const updateEmployeRoleQuestion = [{
  type: "list",
  name: "employeeName",
  message: "What is the name of the employee that you want update?",
  choices: ["Employee1", "Employee2", "Employee3"] //Need to add query to DATABASE to retrive the employee names.
},
{
  type: "list",
  name: "roleName",
  message: "What role do you want to assign to the selected employee?",
  choices: ["Role1", "Role2", "Role3"] //Need to add query to DATABASE to retrive the role names.
}];

const updateEmployeManagerQuestion = [{
  type: "list",
  name: "employeeName",
  message: "What is the name of the employee that you want to update?",
  choices: ["Employee1", "Employee2", "Employee3"] //Need to add query to DATABASE to retrive the employee names.
},
{
  type: "list",
  name: "managerName",
  message: "What manager do you want to assign to the selected employee?",
  choices: ["Manager1", "Manager2", "Manager3"] //Need to add query to DATABASE to retrive the manager names.
}];

const removeEmployeeQuestion = [{
  type: "list",
  name: "employeeName",
  message: "What is the name of the employee that you want to remove?",
  choices: ["Employee1", "Employee2", "Employee3"] //Need to add query to DATABASE to retrive the employee names.
}];

const removeRoleQuestion = [{
  type: "list",
  name: "roleName",
  message: "What is the name of the role that you want to remove?",
  choices: ["Role1", "Role2", "Role3"] //Need to add query to DATABASE to retrive the role names.
}];

const removeDeparmentQuestion = [{
  type: "list",
  name: "deparmentName",
  message: "What is the name of the deparment that you want to remove?",
  choices: ["Department1", "Deparment2", "Department3"] //Need to add query to DATABASE to retrive the deparment names.
}];

const viewDepartmentBudgetQuestion = [{
  type: "list",
  name: "deparmentName",
  message: "For what deparment do you want to see the total utilized budget?",
  choices: ["Department1", "Deparment2", "Department3"] //Need to add query to DATABASE to retrive the deparment names.
}];
