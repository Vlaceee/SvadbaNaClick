const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'http://localhost:8080/',
  user: 'user',
  password: 'password',
  database: 'mydb'
});

function printAdminTable() {
  const query = 'SELECT * FROM Admin';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Greska sa pronalazenjem tabele Admin:', error);
      return;
    }

    console.log('Lista Admina:');
    results.forEach(admin => {
      console.log(`${admin.ID} - ${admin.name} ${admin.lastname} - ${admin.email}`);
    });
  });
}

connection.connect((err) => {
  if (err) {
    console.error('Greska pri uspostavljanju konekcije sa bazom:', err);
    return;
  }
  console.log('Konekcija je uspesno uspostaljvena');

  printAdminTable();

  connection.end();
});
