USE employees_db;

INSERT INTO department(name) VALUES ("IT");
INSERT INTO department(name) VALUES ("HR");
INSERT INTO department(name) VALUES ("Finance");

INSERT INTO role(title,salary,department_id) VALUES ("IT Manager",5000,1);
INSERT INTO role(title,salary,department_id) VALUES ("IT Admin",4200,1);
INSERT INTO role(title,salary,department_id) VALUES ("HR Manager",4900,2);
INSERT INTO role(title,salary,department_id) VALUES ("HR Analyst",4100,2);
INSERT INTO role(title,salary,department_id) VALUES ("Finance Manager",5100,3);
INSERT INTO role(title,salary,department_id) VALUES ("Finance Analyst",4300,3);

INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES ("John","Smith",1,0);
INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES ("Peter","Parker",2,1);
INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES ("Johana","Doe",3,0);
INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES ("Ken","Clark",4,3);
INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES ("Jennifer","Williams",5,0);
INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES ("Bob","Brown",6,5);
