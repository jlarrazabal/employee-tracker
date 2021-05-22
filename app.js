//Node Packages
const cTable = require("console.table");
const inquirer = require("inquirer");
const mysql = require('mysql');
const department = require("./lib/department");
const Department = department.Department;
const role = require("./lib/role");
const Role = role.Role;
const employee = require("./lib/employee");
const Employee = employee.Employee;
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "jeld1988*",
  database: 'employees_db'
});

//Function to determine what the user wants to do and trigger the appropiate flow.
const toDo = function() {
  inquirer.prompt({
    type: "list",
    name: "whatToDo",
    message: "What would you like todo?",
    choices: ["Create a Department", "Create a Role", "Add an Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager", "View all Employess", "View all Employees by Department", "View all Employees By Manager", "View the total utilized budget of a Department", "Exit"]
  }).then(function(answers) {
    switch (answers.whatToDo) {
      case "Create a Department":
        createDepartment();
        break;
      case "Create a Role":
        createRole();
        break;
      case "Add an Employee":
        createEmployee();
        break;
      case "Remove Employee":
        removeEmployee();
        break;
      case "Update Employee Role":
        updateEmployeeRole();
        break;
      case "Update Employee Manager":
        udateEmployeeManager();
        break;
      case "View all Employess":
        viewAllEmployees();
        break;
      case "View all Employees by Department":
        viewAllEmployeesByDepartment();
        break;
      case "View all Employees By Manager":
        viewAllEmployeesByManager();
        break;
      case "View the total utilized budget of a Department":
        viewDepartmentBudget();
        break;
      case "Exit":
        exitApp();
    }
  });
}

//Fuction to Create a new department
const createDepartment = function() {
  inquirer.prompt({
    type: "input",
    name: "departmentName",
    message: "What is the of the department?"
  }).then(function(answers) {
    if (answers.departmentName === "") {
      console.log("Department name cannot be empty, please try again");
      createDepartment();
    } else {
      connection.query("INSERT INTO department SET ?", {
        name: answers.departmentName
      }, function(err, res) {
        if (err) {
          console.log(err);
        } else {
          console.log(`The new department "${answers.departmentName}" has been created successfully!`);
          toDo();
          // connection.end();
        }
      });
    }
  });
};

// Function to Create a new Role
const createRole = function() {
  connection.query("SELECT * FROM department", function(err, data) {
    if (err) {
      console.log(err);
    } else {
      // console.log(data);
      const departmentList = data.map(data => data.name);
      // console.log(departmentList);
      inquirer.prompt([{
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
          message: "To what department does the new role belong to?",
          choices: departmentList
        }
      ]).then(function(answers) {
        if (answers.title === "" || answers.salary === "" || isNaN(answers.salary)) {
          console.log("The information provided is incomplete or the salary provided for the new role was not a number, please try again.");
          createRole();
        } else {
          let dept = data.find(item => item.name === answers.departmentName);
          // console.log(dept);
          connection.query("INSERT INTO role SET ?", {
            title: answers.title,
            salary: answers.salary,
            department_id: dept.id
          }, function(err, res) {
            if (err) {
              console.log(err);
            } else {
              console.log(`The new Role "${answers.title}" has been created successfully under the ${dept.name} department!`);
              toDo();
            }
          });
        }
      });
    }
  });
};

// Fuction to create an employee
const createEmployee = function() {
  connection.query("SELECT * FROM role", function(err, data) {
    if (err) {
      console.log(err);
    } else {
      // console.log(data);
      const roleList = data.map(data => data.title);
      // console.log(roleList);
      inquirer.prompt([{
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
          choices: roleList
        }
      ]).then(function(answers) {
        if (answers.firstName === "" || answers.lastName === "") {
          console.log("The information provided is incomplete, please try again");
          createEmployee();
        } else {
          let role = data.find(item => item.title === answers.roleName);
          // console.log(role);
          connection.query("SELECT * FROM employee WHERE manager_id=0", function(err, managers) {
            if (err) {
              console.log(err);
            } else {
              // console.log(managers);
              const managerList = managers.map(manager => `${manager.first_name} ${manager.last_name}`);
              inquirer.prompt([{
                type: "list",
                name: "isManager",
                choices: ["YES", "NO"],
                message: "Is the new employee a manager?"
              }]).then(function(result) {
                if (result.isManager === "YES") {
                  connection.query("INSERT INTO employee SET ?", {
                    first_name: answers.firstName,
                    last_name: answers.lastName,
                    role_id: role.id,
                    manager_id: 0
                  }, function(err, res) {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log(`The new employee "${answers.firstName} ${answers.lastName}" has been created successfully!`);
                      toDo();
                    }
                  });
                } else {
                  inquirer.prompt([{
                    type: "list",
                    name: "managerName",
                    choices: managerList,
                    message: "What is the name of the manager?"
                  }]).then(function(response) {
                    let managerNameArray = response.managerName.split(" ");
                    // console.log(managerNameArray);
                    connection.query(`SELECT id FROM employee WHERE first_name ='${managerNameArray[0]}' AND last_name ='${managerNameArray[1]}'`, function(err, mgrId) {
                      if (err) {
                        console.log(err);
                      } else {
                        // console.log(mgrId);
                        connection.query("INSERT INTO employee SET ?", {
                          first_name: answers.firstName,
                          last_name: answers.lastName,
                          role_id: role.id,
                          manager_id: mgrId[0].id
                        }, function(err, res) {
                          if (err) {
                            console.log(err);
                          } else {
                            console.log(`The new employee "${answers.firstName} ${answers.lastName}" has been created successfully!`);
                            toDo();
                          }
                        });
                      }
                    });
                  });
                }
              });
            }
          });
        }
      });
    }
  });
};
//
// removeEmployee();
//
// updateEmployeeRole();
//
// udateEmployeeManager();
//
//Function to see all Employees including roles and departments;
const viewAllEmployees = function() {
  connection.query("SELECT employee.*,role.title,role.salary,department.name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id", function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.table(data);
      toDo();
    }
  });
}

//Function to view the employees for a department
const viewAllEmployeesByDepartment = function() {
  connection.query("SELECT name FROM department", function(err, data) {
    if (err) {
      console.log(err);
    } else {
      // console.log(data);
      const departments = data.map(item => item.name);
      // console.log(departments);
      inquirer.prompt([{
        type: "list",
        name: "departmentName",
        choices: departments,
        message: "Plese select the department for which you want to see the employee list"
      }]).then(function(answers) {
        // console.log(answers);
        connection.query(`SELECT id FROM department WHERE name ='${answers.departmentName}'`, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            // console.log(result);
            connection.query(`SELECT employee.*,role.title,role.salary,department.name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE department_id ='${result[0].id}'`, function(err, response) {
              if (err) {
                console.log(err);
              } else {
                console.table(response);
                toDo();
              }
            });
          }
        });
      });
    }
  });
}

//Function to view the employees under a manager
const viewAllEmployeesByManager = function() {
  connection.query("SELECT first_name,last_name FROM employee WHERE manager_id=0", function(err, data) {
    if (err) {
      console.log(err);
    } else {
      // console.log(data);
      const managerList = data.map(manager => `${manager.first_name} ${manager.last_name}`);
      // console.log(managerList);
      inquirer.prompt([
        {
          type: "list",
          name: "managerName",
          choices: managerList,
          message: "Please select the manager name to retrive the employee list."
        }
      ]).then(function(answers){
        // console.log(answers);
        let managerNameArray = answers.managerName.split(" ");
        // console.log(managerNameArray);
        connection.query(`SELECT id FROM employee WHERE first_name ='${managerNameArray[0]}' AND last_name ='${managerNameArray[1]}'`, function(err, result){
          if(err){
            console.log(err);
          } else {
            // console.log(result);
            connection.query(`SELECT employee.*,role.title,role.salary,department.name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE manager_id ='${result[0].id}'`, function(err, response){
              if(err) {
                console.log(err);
              } else {
                console.table(response);
                toDo();
              }
            });
          }
        });
      });
    }
  });
}

// viewDepartmentBudget();

//Function to exit the App
const exitApp = function() {
  connection.end(function() {
    console.log("Connection to the employees database has been terminated successfully. Thank you for using The Employee Tracker APP!")
  })
}

//Initiating the App
const init = function() {
  toDo();
};
init();
