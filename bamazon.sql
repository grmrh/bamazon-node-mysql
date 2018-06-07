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


INSERT INTO departments (department_id, department_name, over_head_costs)
VALUES (1001, "Computer & devices", 1000.00);

INSERT INTO departments (department_id, department_name, over_head_costs)
VALUES (1002, "Household kitchen", 500.00);

INSERT INTO departments (department_id, department_name, over_head_costs)
VALUES (1003, "Auto parts", 750.00);

INSERT INTO departments (department_id, department_name, over_head_costs)
VALUES (1004, "Seasonal", 300.00);

INSERT INTO departments (department_id, department_name, over_head_costs)
VALUES (1005, "Office products", 750.00);

INSERT INTO departments (department_id, department_name, over_head_costs)
VALUES (1006, "Food", 1750.00);

INSERT INTO departments (department_id, department_name, over_head_costs)
VALUES (1007, "Electronics", 2750.00);