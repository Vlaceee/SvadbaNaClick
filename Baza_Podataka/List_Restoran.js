const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'http://localhost:8080/',
  user: 'user',
  password: 'password',
  database: 'mydb'
});

function printRestoranTable() {
  const query = 'SELECT * FROM Restoran';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Greska sa pronalazenjem tabele Restoran:', error);
      return;
    }

    console.log('Lista Restorana:');
    results.forEach(restoran => {
      console.log(`${restoran.ID} - ${restoran.name} ${restoran.lastname} - ${restoran.email}`);
    });
  });
}

connection.connect((err) => {
  if (err) {
    console.error('Greska pri uspostavljanju konekcije sa bazom:', err);
    return;
  }
  console.log('Konekcija je uspesno uspostaljvena');

  printRestoranTable();

  connection.end();
});
