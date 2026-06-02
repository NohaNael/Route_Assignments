const exp=require('express');
const app=exp();
const port=3000;
const mysql = require('mysql2');

app.use(exp.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'retailstore'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});


//6-a 
app.post('/suppliers', (req, res) => {
    const { name, phone } = req.body;

    const sql = `INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES (?, ?)`;

    connection.execute(sql, [name, phone], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Supplier added', id: result.insertId });
    });
});

//6-b
app.post('/products', (req, res) => {
    const { name, price, stock, supplierId } = req.body;

    const sql = `
    INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID)
    VALUES (?, ?, ?, ?)
    `;

    connection.execute(sql, [name, price, stock, supplierId], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Product added', id: result.insertId });
    });
});

//6-c
app.post('/sales', (req, res) => {
    const { productId, quantity, date } = req.body;

    const sql = `
    INSERT INTO Sales (ProductID, QuantitySold, SaleDate)
    VALUES (?, ?, ?)
    `;

    connection.execute(sql, [productId, quantity, date], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Sale added', id: result.insertId });
    });
});


//7 
app.put('/products/:id', (req, res) => {
    const { price } = req.body;
    const { id } = req.params;

    connection.execute(`UPDATE Products SET Price=? WHERE ProductID=?`,
        [price, id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send('Product updated');
        });
});
  
//8
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;

    connection.execute(`DELETE FROM Products WHERE ProductID=?`,
        [id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send('Product deleted');
        });
});

//9
app.get('/sales/total', (req, res) => {
    const sql = `
    SELECT p.ProductName, IFNULL(SUM(s.QuantitySold),0) AS TotalSold
    FROM Products p
    LEFT JOIN Sales s ON p.ProductID = s.ProductID
    GROUP BY p.ProductName
    `;

    connection.execute(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

//10 
app.get('/products/highest', (req, res) => {
    connection.execute(`SELECT * FROM Products ORDER BY StockQuantity DESC LIMIT 1`,
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json(result[0]);
        });
});


//11
app.get('/suppliers/search', (req, res) => {
    const { letter } = req.query;

    connection.execute(`SELECT * FROM Suppliers WHERE SupplierName LIKE CONCAT('%', ?, '%')`,[letter],
    
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json(result);
        });
});

//12
app.get('/products/never-sold', (req, res) => {
    const sql = `
    SELECT p.ProductName
    FROM Products p
    LEFT JOIN Sales s ON p.ProductID = s.ProductID
    WHERE s.ProductID IS NULL
    `;

    connection.execute(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

//13
app.get('/sales', (req, res) => {
    const sql = `
    SELECT p.ProductName, s.SaleDate, s.QuantitySold
    FROM Sales s
    JOIN Products p ON s.ProductID = p.ProductID
    `;

    connection.execute(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

//14
app.post('/admin/create-user', (req, res) => {
    const sql = `
    CREATE USER 'store_manager'@'localhost' IDENTIFIED BY 'password123';
    GRANT SELECT, INSERT, UPDATE ON *.* TO 'store_manager'@'localhost';
    FLUSH PRIVILEGES;
    `;

    db.query(sql, (err) => {
        if (err) return res.status(500).send(err);
        res.send('User created');
    });
});


//15
app.post('/admin/revoke-update', (req, res) => {
    db.query(`REVOKE UPDATE ON *.* FROM 'store_manager'@'localhost'`,
        (err) => {
            if (err) return res.status(500).send(err);
            res.send('UPDATE revoked');
        });
});


//16
app.post('/admin/grant-delete', (req, res) => {
    db.query(`GRANT DELETE ON store_db.Sales TO 'store_manager'@'localhost'`,
        (err) => {
            if (err) return res.status(500).send(err);
            res.send('DELETE granted on Sales');
        });
});





app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
