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
            this.products.outOfStockMessage();
            // ask customer if still want to palce an order
            this.processOrder();
          } 
          else 
          {
            this.products.stockedMessage();           
            this.products.updateInventory_v2(ans, 'reduce');   
            this.products.consoleDisplay('updateInventory');
            this.products.consoleDisplay('totalCost', ans);
            process.exit(0);
            //this.Products.getTotalCost(ans);
          }
        })
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
  .then(session => bamazon.products.consoleDisplay('getAll'))
  .then(() => bamazon.processOrder());

