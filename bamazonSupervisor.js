'use strict'

const inquirer = require('inquirer');
const colors = require('colors');
const Departments = require('./departments');

const menu = [
  'View Product Sales by Department',
  'Create New Department',
  'View All Departments'
];
const questionToDo = [
  {
    type: 'list',
    name: 'toDo',
    message: 'select a task to do',
    choices: menu
  }
];
const questionToCreateDepartment = [
  {
    type: 'input',
    name: 'departmentId',
    message: 'Enter department ID to add: '
  },
  {
    type: 'input',
    name: 'departmentName',
    message: 'Enter department name to add: '
  }, 
  {
    type: 'input',
    name: 'overHeadCosts',
    message: 'Enter over-head-costs: '
  }
];

class Supervisor {

  constructor(departments) {
    this._departments = departments;
  }

  get departments() {
    return this._departments;
  }

  set departments(departmentSet) {
    if (departmentSet) {
      this._departments = departmentSet;
    }
  }

  supervisorTask() {

    inquirer.prompt(questionToDo)
    .then(ans => {

      switch (ans.toDo) {
        case menu[0]:
          this.viewProductSalesByDepartment();
          break;
        case menu[1]:
          inquirer.prompt(questionToCreateDepartment)
            .then(ans => this.addDepartment(ans));
          break;
        case menu[2]:
          this.viewAllDepartments();
          //this.products.getAllProducts()
          break;     
        default:
          return;
      };
    });
  }

  viewProductSalesByDepartment() {
    this._departments.getProductSalesByDepartment(() =>this.supervisorTask())
      // .then(() => this.documents.consoleDisplay('productSalesByDepartment'))
      // .then(() => this.supervisorsk())
      .catch(err => {
        console.log(err.stack);
        console.log(err.message);
        process.exit(1);
      })
  }

  addDepartment(queryParam) {
    this._departments.postDepartment(queryParam)
      .then(() => this.documents.getAllDepartments())
      .then(() => this.documents.consoleDisplay('getAllDepartment'))
      .then(() => this.supervisorTask())
      .catch(err => {
        console.log(err.stack);
        console.log(err.message);
        process.exit(1);
      })
  }

  viewAllDepartments() {
    this._departments.getAllDepartments()
      //.then(() => this._products.consoleDisplay('getAll'))
      .then(() => this.supervisorTask())
      .catch(err => {
        console.log(err.stack);
        console.log(err.message);
        process.exit(1);
      })
  }


}

// let start manager task
var depts = new Departments();
var supervisor = new Supervisor(depts);
supervisor.supervisorTask();