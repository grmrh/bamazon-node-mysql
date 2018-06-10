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

        let query = 'select department_id, trim(department_name), over_head_costs ' +
          'from bamazon.departments ' +
          'order by department_id asc';

        return session
          .executeSql(query)
          .execute(row => {
            this.departmentAll.push(row);
            //console.log(row);    
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

        var joinedGroupedQuery = 'select A.department_id, trim(A.department_name), A.over_head_costs, sum(if(B.product_sales, B.product_sales, 0.0))  as product_sales, ' +
          '(sum(if(B.product_sales, B.product_sales, 0.0)) - A.over_head_costs) as total_profit ' +
          'from bamazon.departments A ' +
          'left outer join bamazon.products B ' +
          'On A.department_name = B.department_name ' +
          'group by A.department_name ' +
          'order by A.department_id';
        return session
          .executeSql(joinedGroupedQuery)
          .execute(row => {
            this.productSalesByDepartment.push(row);
            //console.log(row);    
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

    //console.log(parseInt(queryParam.departmentId), queryParam.departmentName, parseFloat(queryParam.overHeadCosts));
    return mysqlx
      .getSession(this.connectionOption)
      .then(session => {
        this.bamazonSchema = session.getSchema('bamazon');
        this.departmentTable = this.bamazonSchema.getTable('departments');

        return this.departmentTable
          .insert(['department_id', 'department_name', 'over_head_costs'])
          .values([parseInt(queryParam.departmentId), queryParam.departmentName, parseFloat(queryParam.overHeadCosts)])
          .execute(() => {
            //this.departmentInserted.push(row);
            //console.log("The new department has been successfully added");
            //console.log(table(this.departmentInserted));  
            //this.getAllDepartments();
          })
          .then(() => session);
      })
      .then(session => {
        console.log("\nThe new department has been successfully added\n");
        return session.close();
      })
      .catch(err => {
        console.log(err.stack);
        process.exit(1);
      })
  }
}

module.exports = Department;