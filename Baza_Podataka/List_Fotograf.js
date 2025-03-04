const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'http://localhost:8080/',
  user: 'user',
  password: 'password',
  database: 'mydb'
});

function printFotografTable() {
  const query = 'SELECT * FROM Fotograf';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Greska sa pronalazenjem tabele Fotograf:', error);
      return;
    }

    console.log('Lista Fotografa:');
    results.forEach(fotograf => {
      console.log(`${fotograf.ID} - ${fotograf.name} ${fotograf.lastname} - ${fotograf.email}`);
    });
  });
}

connection.connect((err) => {
  if (err) {
    console.error('Greska pri uspostavljanju konekcije sa bazom:', err);
    return;
  }
  console.log('Konekcija je uspesno uspostaljvena');

  printFotografTable();

  connection.end();
});
