# Product-Management-System

# Create database table

Creating database table by using SQL
For example:

```mysql
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255),
  price FLOAT,
  stock INT
);
```

# Create file db_config.json

Create file `db_config.json` in root directory project and add database config for the project
For example: in file `db_config.json`

```json
{
  "host": "localhost",
  "port": "",
  "user": "root",
  "password": "password",
  "database": "product_management_system_v2_db"
}
```
