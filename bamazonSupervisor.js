'use strict'

const inquirer = require('inquirer');
const colors = require('colors');
const product = require('./departments');

const menu = [
  'View Product Sales by Department',
  'Create New Department'
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

  constructor(documents) {
    this._documents = documents;
  }

  get documents() {
    return this._documents;
  }

  set documents(documentSet) {
    if (documentSet) {
      this._documents = documentSet;
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
        default:
          return;
      };
    });
  }

  viewProductSalesByDepartment() {
    this.documents.getProductSalesByDepartment(() =>this.supervisorTask())
      // .then(() => this.documents.consoleDisplay('productSalesByDepartment'))
      // .then(() => this.supervisorTask())
      .catch(err => {
        console.log(err.stack);
        console.log(err.message);
        process.exit(1);
      })
  }

  addDepartment(queryParam) {
    this.documents.postDepartment(queryParam)
      .then(() => this.documents.getAllDepartments())
      .then(() => this.documents.consoleDisplay('getAllDepartment'))
      .then(() => this.supervisorTask())
      .catch(err => {
        console.log(err.stack);
        console.log(err.message);
        process.exit(1);
      })
  }

}

// let start manager task
var prod = new Product();
var supervisor = new Supervisor(prod);
supervisor.supervisorTask();