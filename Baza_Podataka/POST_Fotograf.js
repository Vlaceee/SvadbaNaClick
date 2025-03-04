const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');


const app = express();
const port = 3000;

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'mongodb://localhost:27017/mydb',
  user: 'user',
  password: 'password',
  database: 'mydb'
});

// Parsovanje
app.use(bodyParser.json());

app.post('/fotograf', (req, res) => {
  const fotografData = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Problem sa konekcijom:', err);
      res.status(500).send('Problem sa Internal Server-om');
      return;
    }

    const query = 'INSERT INTO Fotograf (ID, Ime, Prezime, Email, Sifra) VALUES (?, ?, ?, ?, ?)';

    const { ID, Ime, Prezime, Email, Sifra} = fotografData;

    connection.query(query, [ID, Ime, Prezime, Email, Sifra], (err, results) => {

      connection.release();

      if (err) {
        console.error('Problem sa query-em:', err);
        res.status(500).send('Problem prilikom ubacivanja podataka u tabelu!');
        return;
      }

      // Send success response
      res.status(200).send('Podaci su uspesno ubaceni!');
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
