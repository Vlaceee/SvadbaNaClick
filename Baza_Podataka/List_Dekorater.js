const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'http://localhost:8080/',
  user: 'user',
  password: 'password',
  database: 'mydb'
});

function printDekoraterTable() {
  const query = 'SELECT * FROM Dekorater';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Greska sa pronalazenjem tabele Dekorater:', error);
      return;
    }

    console.log('Lista Dekoratera:');
    results.forEach(dekorater => {
      console.log(`${dekorater.ID} - ${dekorater.name} ${dekorater.lastname} - ${dekorater.email}`);
    });
  });
}

connection.connect((err) => {
  if (err) {
    console.error('Greska pri uspostavljanju konekcije sa bazom:', err);
    return;
  }
  console.log('Konekcija je uspesno uspostaljvena');

  printDekoraterTable();

  connection.end();
});
