const mysqlx = require('@mysql/xdevapi');
const colors = require('colors');
const {table} = require('table');

function Product() {

  this.bamazonSchema;
  this.productsTable;
  this.productAll = [];
  this.productSelected = [];
  this.productUpdated = [];

  this.connectionOption = {
    host: 'localhost',
    port: 33060,
    password: 'root',
    user: 'root'
  };

  this.outOfStockMessage = function() {
    return `Insufficient quantity! ${this.product_name} is currently out of stock`;
  };
  this.stockedMessage = function() {
    return `Yes, ${this.product_name} is currently ${this.stock_quantity} in stock`;
  };
}

Product.prototype.consoleDisplay = function(action) {

  if (action === 'getAll') {
    console.log(`Total ${this.productAll.length} products in the Bamazon, Amazon-Like online commerse`);
    console.log(table(this.productAll));    
  }
  else if (action === 'checkInventory') {
    console.log(`${this.productSelected}` 
      ? `your order for ${this.productSelected[0][1]} found` 
      : `${this.productAll[queryParam.itemId-1][1]} is out of stock or not enough quantity`.red);
    console.log(`${this.productSelected}`
      ? table(this.productSelected) 
      : '');    
  } else if (action === 'updateInventory') {
    console.log(`${this.productSelected[0][1]} stock quantiy is now ${this.productSelected[0][4]}.`)
    console.log(table(this.productSelected)); 
    console.log(`The toal cost for the order is $${this.productSelected[0][3] * queryParam.quantity}.`.inverse.green)   
  }
}

// read all rows in product table
Product.prototype.getAllProducts = function() {

  return mysqlx
    .getSession(this.connectionOption)
    .then(session => {
      this.bamazonSchema = session.getSchema('bamazon');
      this.productsTable = this.bamazonSchema.getTable('products');

      return this.productsTable
        .select('item_id', 'product_name', 'department_name', 'price', 'stock_quantity')
        .execute(row => {
          this.productAll.push(row);
          //console.log(table(this.productAll));    
        });
        //.then(() => this.consoleDisplay('getAll'));
        //.then(() => session);   
    }); 
    // .then(session => {
    //   console.log(`Total ${this.productAll.length} products in the Amazon-Like online commerse`);
    //   console.log(table(this.productAll));    
    //   //console.log(result.getAffectedRowsCount());
    //   return session;
    // })
    // .then(session => {
    //   return session.close();
    //   //process.exit(0);
    // })
    // .catch(err => {
    //   console.log(err.stack);
    //   process.exit(1);
    // })
}

Product.prototype.checkInventory = function(queryParam) {

  return mysqlx
    .getSession(this.connectionOption)
    .then(session => {
      this.bamazonSchema = session.getSchema('bamazon');
      this.productsTable = this.bamazonSchema.getTable('products');

      //console.log('product checkInventory', this.productsTable);
      return this.productsTable
        .select('item_id', 'product_name', 'department_name', 'price', 'stock_quantity')
        .where('item_id = :item_id && stock_quantity >= :stock_quantity')
        .bind('item_id', queryParam.itemId)
        .bind('stock_quantity', queryParam.quantity)
        .execute(row => {
          this.productSelected.push(row);
          //console.log(table(dataAll));    
        })
        .then(() => session);   
    })
    .then(session => {
      return session.close();
      //process.exit(0);
    })
    // .then(session => {
    //   console.log(`${this.productSelected}` 
    //         ? `your order for ${this.productSelected[0][1]} found` 
    //         : `${this.productAll[queryParam.itemId-1][1]} is out of stock or not enough quantity`.red);
    //   console.log(`${this.productSelected}`
    //         ? table(this.productSelected) 
    //         : '');    
    //   //console.log(result.getAffectedRowsCount());
    //   return session;
    // })
    // .then(session => {
    //   return session.close();
    //   //process.exit(0);
    // })
    // .catch(err => {
    //   console.log(err.stack);
    //   process.exit(1);
    // })
}

Product.prototype.updateInventory = function(queryParam) {
 //this.checkInventory(queryParam);
  if (this.productSelected.length == 1 && this.productSelected[0][0] == queryParam.itemId) {
    this.productSelected[0][4] -= queryParam.quantity;

    return mysqlx
    .getSession(this.connectionOption)
    .then(session => {
      this.bamazonSchema = session.getSchema('bamazon');
      this.productsTable = this.bamazonSchema.getTable('products');

      return this.productsTable
        .update('item_id', 'product_name', 'department_name', 'price', 'stock_quantity')
        .set('stock_quantity', this.productSelected[0][4])
        .where('item_id = :item_id')
        .bind('item_id', queryParam.itemId)
        .execute();
        // .execute(row => {
        //   this.productUpdated.push(row);
        //   //console.log(table(dataAll));    
        // })
        // .then(() => session);   
    })
    // .then(session => {
    //   console.log(`${this.productSelected[0][1]} stock quantiy is now ${this.productSelected[0][4]}.`)
    //   console.log(table(this.productSelected)); 
    //   console.log(`The toal cost for the order is $${this.productSelected[0][3] * queryParam.quantity}.`.inverse.green)   
    //   return session;
    //   //console.log(result.getAffectedRowsCount());
    // })
    // .then(session => {
    //   return session.close();
    //   //process.exit(0);
    // })
    // .catch(err => {
    //   console.log(err.stack);
    //   process.exit(1);
    // })
  }
}

module.exports = Product;