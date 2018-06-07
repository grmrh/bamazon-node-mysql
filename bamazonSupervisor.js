'use strict'

const inquirer = require('inquirer');
const colors = require('colors');
const Product = require('./products');

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
const questionToManage = [
  {
    type: 'input',
    name: 'itemId',
    message: 'Enter product ID to add: '
  },
  {
    type: 'input',
    name: 'quantity',
    message: 'Enter quantity: '
  }
];

const questionToAddProduct = [
  {
    type: 'input',
    name: 'itemId',
    message: 'Enter product ID to add: '
  },
  {
    type: 'input',
    name: 'productName',
    message: 'Enter product name to add: '
  }, 
  {
    type: 'input',
    name: 'department',
    message: 'Enter department name: '
  }, 
  {
    type: 'input',
    name: 'price',
    message: 'Enter a price for the product: '
  },
  {
    type: 'input',
    name: 'quantity',
    message: 'Enter a quantity for the product: '
  }
];

const definitionOfLowStock = 5;

class Manager {

  constructor(products) {
    this._products = products;
  }

  // getProducts() {
  //   return this._products;
  // }
  get products() {
    return this._products;
  }

  set products(productSet) {
    if (productSet) {
      this._products = productSet;
    }
  }

  managerTask() {

    inquirer.prompt(questionToDo)
    .then(ans => {

      switch (ans.toDo) {
        case menu[0]:
          this.viewAllProducts();
          //this.products.getAllProducts()
          break;
        case menu[1]:
          this.viewLowInventory(definitionOfLowStock);
          break;
        case menu[2]:
          inquirer.prompt(questionToManage)
            .then(ans => this.addInventory(ans));
          break;
        case menu[3]:
          inquirer.prompt(questionToAddProduct)
            .then(ans => this.addProduct(ans));
          break;
        default:
          return;
      };
      //setTimeout(this.managerTask(), 1000);
    });
    //.then(() => this.managerTask());
  }

  viewAllProducts() {
    this._products.getAllProducts()
      .then(() => this._products.consoleDisplay('getAll'))
      .then(() => this.managerTask())
      .catch(err => {
        console.log(err.stack);
        console.log(err.message);
        process.exit(1);
      })
  }

  viewLowInventory(limitOfLowStock) {
    this._products.getLowInventory(limitOfLowStock)
      .then(() => this._products.display(`Low inventory list - less than ${limitOfLowStock}`, this._products.productSelected))
      .then(() => this.managerTask())
      .catch(err => {
        console.log(err.stack);
        console.log(err.message);
        process.exit(1);
      })
  }

  addInventory(queryParam)  {
    this._products.getProduct(queryParam)
      .then(() => this._products.consoleDisplay('getProduct'))
      .then(() => this._products.updateInventory(queryParam, 'add'))
      //.then(() => this._products.display('Inventory updated', this._products.productAll))
      .then(() => this.managerTask())
      .catch(err => {
        console.log(err.stack);
        console.log(err.message);
        process.exit(1);
      })
  }

  addProduct(queryParam) {
    this._products.postProduct(queryParam)
      .then(() => this._products.getAllProducts())
      .then(() => this._products.consoleDisplay('getAll'))
      .then(() => this.managerTask())
      .catch(err => {
        console.log(err.stack);
        console.log(err.message);
        process.exit(1);
      })
  }

}

// let start manager task
var prod = new Product();
var manager = new Manager(prod);
manager.managerTask();