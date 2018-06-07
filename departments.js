const mysqlx = require('@mysql/xdevapi');
const util = require('util');
const colors = require('colors');
const debug = require('debug');
const {table} = require('table');

class Department {

  constructor() {
    this.bamazonSchema;
    this.departmentTable;
    this.departmentAll = [];
    this.departmentSelected = [];
    this.departmentInserted = [];
    this.productSalesByDepartment = [];
    this.connectionOption = {
      host: 'localhost',
      port: 33060,
      password: 'root',
      user: 'root',
      database: 'bamazon'
    }; 
  }

  getAllDepartments() {

      this.departmentAll = [];
      return mysqlx
        .getSession(this.connectionOption)
        .then(session => {
          this.bamazonSchema = session.getSchema('bamazon');
          this.departmentTable = this.bamazonSchema.getTable('departments');
    
          return this.departmentTable
            .select('department_id', 'department_name', 'over_head_costs')
            .orderBy('department_id ASC')
            .execute(row => {
              this.departmentAll.push(row);
            })
            .then(() => session);   
        })
        .then(session => {
           console.log(table(this.departmentAll));    
           return session;
        })
        .then(session => {
          return session.close();
        })
        .catch(err => {
          console.log(err.stack);
          console.log(err.message);
          process.exit(1);
        })
  }
  
  getProductSalesByDepartment() {
      this.productSalesByDepartment = [];
      return mysqlx
        .getSession(this.connectionOption)
        .then(session => {
          this.bamazonSchema = session.getSchema('bamazon');
          this.departmentTable = this.bamazonSchema.getTable('departments');

          var joinedGroupedQuery = 'select A.*, sum(B.product_sales) as product_sales, ' +
                        '(sum(B.product_sales) -A.over_head_costs) as total_profit ' +                   
                        'from bamazon.departments A ' +
                        'join bamazon.products B ' +
                        'On A.department_name = B.department_name ' + 
                        'group by A.department_name ' +
                        'order by A.department_id';
          return session
            .executeSql(joinedGroupedQuery)
            .execute(row => {
              this.productSalesByDepartment.push(row);
              //console.log(table(this.productAll));    
            })
            .then(() => session);    
        })
        .then(session => {
          console.log(table(this.productSalesByDepartment));
          return session;
        })
        .then(session => {
          return session.close();
        })
        .catch(err => {
          console.log(err.stack);
          console.log(err.message);
          process.exit(1);
        })
  }
  
  postDepartment(queryParam) {
    this.departmentInserted = [];

    console.log(parseInt(queryParam.departmentId), queryParam.departmentName, parseFloat(queryParam.overHeadCosts));

    return mysqlx
      .getSession(this.connectionOption)
      .then(session => {
        this.bamazonSchema = session.getSchema('bamazon');
        this.departmentTable = this.bamazonSchema.getTable('departments');

        //console.log('product checkInventory', this.productsTable);
        return this.departmentTable
          .insert(['department_id', 'department_name',  'over_head_costs'])
          .values([parseInt(queryParam.departmentId), queryParam.departmentName, parseFloat(queryParam.price)])
          .execute(row => {
            this.departmentInserted.push(row);
          })
          .then(() => session);   
      })
      .then(session => {
        console.log(table(this.departmentAll));    
        return session;
      })
      .then(session => {
        return session.close();
      })
      .catch(err => {
        console.log(err.stack);
        process.exit(1);
      })
   }
}

module.exports = Department;