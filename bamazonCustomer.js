var Product = require('./products');
const inquirer = require('inquirer');

const question = [
  {
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

function Bamazon() {
  this.products = new Product();
}

Bamazon.prototype.processOrder = function() {
  inquirer.prompt(question)
    .then(ans => {
      //BIG question: why this instead of Bamazon does not work
      this.products
        .checkInventory(ans)
        .then(() => this.products.consoleDisplay('checkInventory'))
        .then(() => {
          if (this.products.productSelected && this.products.productSelected.length <= 0) {        
            this.processOrder();}
          this.products.updateInventory(ans, 'reduce')})
        //.then(() => this.products.display('Inventory updated', this.products.productAll))
        .then(() => this.products.consoleDisplay('totalCost', ans))
          //this.processOrder();
        .catch(err => {
          console.log(err.stack);
          console.log(err.message);
          process.exit(1);
        })
    });
}

var bamazon = new Bamazon();
// get all products and display in console, then start to take an order from user input
bamazon.products
  .getAllProducts()
  .then(() => bamazon.products.consoleDisplay('getAll'))
  .then(() => bamazon.processOrder());

