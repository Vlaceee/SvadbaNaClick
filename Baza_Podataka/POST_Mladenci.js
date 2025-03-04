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

app.post('/mladenci', (req, res) => {
  const mladenciData = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Problem sa konekcijom:', err);
      res.status(500).send('Problem sa Internal Server-om');
      return;
    }

    const query = 'INSERT INTO Mladenci (Ime, Prezime, Ime_Partnera, Prezime_Partnera, Email, Sifra) VALUES (?)';
    const query2 = 'INSERT INTO Korisnik (UID, TIP, Admin_ID, Mladenci_ID, Restoran_ID, Fotograf_ID, Poslasticar_ID, Dekoreter_ID) VALUES (?)';

    const {Ime, Prezime, Ime_Partnera, Prezime_Partnera, Email, Sifra} = mladenciData;
    const {UID, TIP, mladenci_ID} = korisnikData;

    connection.query(query, [Ime, Prezime, Ime_Partnera, Prezime_Partnera, Email, Sifra], (err, results) => {

      connection.release();

      if (err) {
        console.error('Problem sa query-em:', err);
        res.status(500).send('Problem prilikom ubacivanja podataka u tabelu!');
        return;
      }

      // Send success response
      res.status(200).send('Podaci su uspesno ubaceni!');
    });

    connection.query(query2,[UID, TIP, mladenci_ID], (err, results) => {

      connection.release();

      if (err) {
        console.error('Problem sa query-em:', err);
        res.status(500).send('Problem prilikom ubacivanja podataka u tabelu!');
        return;
      }

    })
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
