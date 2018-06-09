# bamazon-node-mysql

***Please notes about mySQL version used in this application: One needs the lastest version of mySQL 8.x.x and nodejs installed in the user machine.***

### The amazon-like store front CLI application using inquirer CLI for user interaction. The application can be started with one of three entry point commands where users perform specific tasks:
* **customers** for viewing and purchasing products.
* **managers** for viewing products for sale or low inventory, adding to inventory and adding new product.
* **supervisors** for viewing product sales by department and creating new department.    


### Tools used: 
  * nodejs
  * mySQL 8.0.11 xDevAPI
  * mySQL Connector nodejs
  * Inquirer
  * npm package colors
  * npm package table

### Type the commands for each user role to start the application 
  * $node bamazonCustomer
  * $node bamazonManager
  * $node bamazonSupervisor

### Source codes
  * command for tasks
    * bamazonCustomer.js
    * bamazonManager.js
    * bamazonSupervisor.js
  * mySQL database CRUD 
    * products.js
    * departments.js
  * data file
    * bamazon.sql
    * bamazonProducts.csv
    * bamazonDepartments.csv

### Comments: 
### All database operations in mySQL 8.0.11 are asynchronous and return a promise that can be chained easily. But it also leads to a christmas tree like A HELL OF PROMISE. Luckily the recent version of nodejs inlucdes async/await like many other languages such as c#. The next application that uses mySQL for database backend should utilize this greatly simplifying and easy reading syntax for all asynchronous tasks.

