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