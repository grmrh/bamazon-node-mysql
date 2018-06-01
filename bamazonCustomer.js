var Product = require('./products');
const inquirer = require('inquirer');

const question = [
  {
    type: 'input',
    name: 'itemId',
    message: 'Enter product ID to buy'
  },
  {
    type: 'input',
    name: 'quantity',
    message: 'Enter quantity(number)'
  }
]

function Bamazon() {
  this.Product = new Product();
}

Bamazon.prototype.processOrder = function() {
  inquirer.prompt(question)
    .then(ans => {
      //BIG question: why this instead of Bamazon does not work
      Bamazon.Product.checkInventory(ans);
      setTimeout(() => {
        if (Bamazon.Product.productSelected && Bamazon.Product.productSelected.length <= 0) {
          Bamazon.Product.outOfStockMessage();
          // ask customer if still want to palce an order
          Bamazon.processOrder();
        } 
        else {
          Bamazon.Product.updateInventory(ans);
          //this.Products.getTotalCost(ans);
        }
      }, 1000);
    });

}


var Bamazon = new Bamazon();
// get all products and display in console, then start to take an order from user input
Bamazon.Product
  .getAllProducts()
  .then(session => Bamazon.Product.consoleDisplay('getAll'))
  .then(() => Bamazon.processOrder());

//console.log(Bamazon.Product.getAllProducts());

                //.then(session => Bamazon.Product.consoleDisplay('getAll'));
//setTimeout(Bamazon.processOrder.bind(this), 1000);

