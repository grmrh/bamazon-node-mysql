DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

use bamazon;

CREATE TABLE products (
  item_id INT NOT NULL,
  product_name VARCHAR(250) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

ALTER TABLE products 
ADD product_sales DECIMAL(10, 2) NOT NULL;

CREATE TABLE departments (
  department_id INT NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  over_head_costs DECIMAL(10, 2) NOT NULL,
  PRIMARY KEY (department_id)
);