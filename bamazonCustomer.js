var Product = require('./products');
const inquirer = require('inquirer');

const question = [{
    type: 'input',
    name: 'itemId',
    message: 'Enter product ID to buy: '
  },
  {
    type: 'input',
    name: 'quantity',
    message: 'Enter quantity: '
  }
]

function Bamazon(prod) {
  this.products = prod;
}

Bamazon.prototype.processOrder = function () {
  inquirer.prompt(question)
    .then(ans => {
      this.purchaseInventory(ans);
    })
}

Bamazon.prototype.purchaseInventory = function(queryParam) {
  this.products.checkInventory(queryParam)
    .then(() => this.products.consoleDisplay('checkInventory'))
    .then(() => this.products.updateInventory(queryParam, 'reduce'))   
    .then(() => this.processOrder())
    .catch(err => {
      console.log(err.stack);
      console.log(err.message);
      process.exit(1);
    });
}

// let start customer task
var prod = new Product();
var bamazon = new Bamazon(prod);
// get all products and display in console, then start to take an order from user input
bamazon.products
  .getAllProducts()
  .then(() => bamazon.products.consoleDisplay('getAll'))
  .then(() => bamazon.processOrder());
  