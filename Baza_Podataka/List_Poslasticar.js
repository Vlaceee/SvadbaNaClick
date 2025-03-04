const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'http://localhost:8080/',
  user: 'user',
  password: 'password',
  database: 'mydb'
});

function printPoslasticarTable() {
  const query = 'SELECT * FROM Poslasticar';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Greska sa pronalazenjem tabele Poslasticar:', error);
      return;
    }

    console.log('Lista Poslasticara:');
    results.forEach(poslasticar => {
      console.log(`${poslasticar.ID} - ${poslasticar.name} ${poslasticar.lastname} - ${poslasticar.email}`);
    });
  });
}

connection.connect((err) => {
  if (err) {
    console.error('Greska pri uspostavljanju konekcije sa bazom:', err);
    return;
  }
  console.log('Konekcija je uspesno uspostaljvena');

  printPoslasticarTable();

  connection.end();
});
