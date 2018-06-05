const mysqlx = require('@mysql/xdevapi');
const colors = require('colors');
const debug = require('debug');
const {table} = require('table');

function Product() {

  this.bamazonSchema;
  this.productsTable;
  this.productAll = [];
  this.productSelected = [];
  this.productUpdated = [];
  this.productInserted = [];
  this.inventoryUpdated = [];

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

Product.prototype.consoleDisplay = function(action, queryParam) {

  if (action === 'getAll') {
    console.log(`Total ${this.productAll.length} products in the Bamazon, Amazon-Like online commerse`.green);
    console.log(table(this.productAll));    
  }
  else if (action === 'getProduct') {
    console.log('Product selected for adding its inventory');
    console.log(table(this.productSelected));    
  }
  else if (action === 'checkInventory') {
    console.log(`${this.productSelected}` 
      ? `your order for ${this.productSelected[0][1]} found` 
      : `${this.productSelected[0][1]} is out of stock or not enough quantity`.red);
    console.log(`${this.productSelected}`
      ? table(this.productSelected) 
      : '');    
  } 
  else if (action === 'updateInventory') {
    console.log(`${this.productSelected[0][1]} stock quantiy is now ${this.productSelected[0][4]}.`)
    console.log(table(this.productSelected)); 
  } 
  else if (action === 'totalCost') {
    console.log(`The toal cost for the order is $${(this.productSelected[0][3] * queryParam.quantity).toFixed(2)}.`.inverse.green);   
  }
}

Product.prototype.print = function(message, data) {
  console.log(message || '');
  data.forEach(d => console.log(d.join('; ')));
}
Product.prototype.display = function(message, data, callback) {
  if (callback) {
    callback(message, data);
  }
  else {
    console.log(message);
    console.log(table(data));
  }
}
// read all rows in product table
Product.prototype.getAllProducts = function() {
  this.productAll = [];
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
        //.then(() => session);   
    })
    // .then(session => {
    //   return session.close();
    // })
    .catch(err => {
      console.log(err.stack);
      process.exit(1);
    })
}

Product.prototype.getProduct = function(queryParam) {
  this.productSelected = [];
  return mysqlx
    .getSession(this.connectionOption)
    .then(session => {
      this.bamazonSchema = session.getSchema('bamazon');
      this.productsTable = this.bamazonSchema.getTable('products');

      //console.log('product checkInventory', this.productsTable);
      return this.productsTable
        .select('item_id', 'product_name', 'department_name', 'price', 'stock_quantity')
        .where('item_id = :item_id')
        .bind('item_id', queryParam.itemId)
        .execute(row => {
          this.productSelected.push(row);
          //console.log(table(dataAll));    
        });
        // .then(() => session);   
    })
    // .then(session => {
    //   return session.close();
    // })
    .catch(err => {
      console.log(err.stack);
      process.exit(1);
    })
}

Product.prototype.checkInventory = function(queryParam) {
  this.productSelected = [];
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
      //return session;
      return session.close();
    })
    .catch(err => {
      console.log(err.stack);
      process.exit(1);
    })
}

Product.prototype.updateInventory = function(queryParam, act) {

  if (this.productSelected.length != 1 || this.productSelected[0][0] != queryParam.itemId) {
    throw Error();
  }
  if (act && act === 'add') {
    this.productSelected[0][4] += parseInt(queryParam.quantity);
  }
  else if (act && act === 'reduce') {
    this.productSelected[0][4] -= parseInt(queryParam.quantity);
  }

  console.log('product selected inside updateInventory', this.productSelected[0][4])

  return mysqlx
    .getSession(this.connectionOption)
    .then(session => {
      this.bamazonSchema = session.getSchema('bamazon');
      this.productsTable = this.bamazonSchema.getTable('products');

      return this.productsTable
        // .update('item_id', 'product_name', 'department_name', 'price', 'stock_quantity')
        .update()
        .where('item_id = 4')
        .set('stock_quantity',  4)
        
        //.bind('item_id', queryParam.itemId)
        //.bind('stock_quantity', this.productSelected[0][4])
        .execute();
      // .execute(row => {
      //   this.productUpdated.push(row);
      //   //console.log(table(dataAll));    
      // })
      // .then(() => session);   
    })
    .catch(err => {
      console.log(err.stack);
      process.exit(1);
    })
}

Product.prototype.updateInventory_v2 = function(queryParam, act) {

  // if (act && act === 'add') {
  //   this.productSelected[0][4] += parseInt(queryParam.quantity);
  // }
  // else if (act && act === 'reduce') {
  //   this.productSelected[0][4] -= parseInt(queryParam.quantity);
  // }

  var selectedItemQuantiy = 0;
  var session;
  mysqlx.getSession(this.connectionOption)
  .then(function(s) {
    session = s;
    return session.getSchema('bamazon');
  })
  .then(function() {
    return Promise.all([
      session.sql('USE products').execute(),
      session.sql(`SELECT stock_quantity FROM products WHERE item_id = ${queryParam.itemId}`)
      .execute(ret => selectedItemQuantiy = ret.quantity), 
    ])
  })
  .then(function() {
    return session.sql('UPDATE products SET stock_quantity = 100 WHERE item_id = 4')
      .execute(function(row) {
        console.log(row);
      })

    //   return session.sql(`UPDATE products SET stock_quantity = ${this.productSelected[0][4]} 
    // WHERE item_id = ${selectedItemQuantity - parseInt(queryParam.itemId)}`)
    //   .execute()
  })
}

Product.prototype.getLowInventory = function(num_below_than) {
  this.productSelected = [];
  return mysqlx
    .getSession(this.connectionOption)
    .then(session => {
      this.bamazonSchema = session.getSchema('bamazon');
      this.productsTable = this.bamazonSchema.getTable('products');

      //console.log('product checkInventory', this.productsTable);
      return this.productsTable
        .select('item_id', 'product_name', 'department_name', 'price', 'stock_quantity')
        .where('stock_quantity <= :stock_quantity')
        .bind('stock_quantity', num_below_than)
        .execute(row => {
          this.productSelected.push(row);
          //console.log(table(dataAll));    
        });
        // .then(() => session);   
    })
    // .then(session => {
    //   return session.close();
    // })
    .catch(err => {
      console.log(err.stack);
      process.exit(1);
    })
}

Product.prototype.postProduct = function(queryParam) {
  this.productInserted = [];

  console.log(parseInt(queryParam.itemId), queryParam.productName, queryParam.department, 
  parseFloat(queryParam.price), parseInt(queryParam.quantity));

  return mysqlx
    .getSession(this.connectionOption)
    .then(session => {
      this.bamazonSchema = session.getSchema('bamazon');
      this.productsTable = this.bamazonSchema.getTable('products');

      //console.log('product checkInventory', this.productsTable);
      return this.productsTable
        .insert(['item_id', 'product_name', 'department_name', 'price', 'stock_quantity'])
        // .values([20, 'Small coffee filter', 'Office product', 23.54, 350])
        .values([parseInt(queryParam.itemId), queryParam.productName, queryParam.department, 
          parseFloat(queryParam.price), parseInt(queryParam.quantity)])
        .execute(row => {
          this.productInserted.push(row);
        });
        // .then(() => session);   
    })
    // .then(session => {
    //   return session.close();
    // })
    .catch(err => {
      console.log(err.stack);
      process.exit(1);
    })
}

module.exports = Product;