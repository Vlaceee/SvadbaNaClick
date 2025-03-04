const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'http://localhost:8080/',
  user: 'user',
  password: 'password',
  database: 'mydb'
});

function printMladenciTable() {
  const query = 'SELECT * FROM Mladenci';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Greska sa pronalazenjem tabele Mladenci:', error);
      return;
    }

    console.log('Lista Mladenaca:');
    results.forEach(mladenci => {
      console.log(`${mladenci.ID} - ${mladenci.name} ${mladenci.lastname} - ${mladenci.email}`);
    });
  });
}

connection.connect((err) => {
  if (err) {
    console.error('Greska pri uspostavljanju konekcije sa bazom:', err);
    return;
  }
  console.log('Konekcija je uspesno uspostaljvena');

  printMladenciTable();

  connection.end();
});
