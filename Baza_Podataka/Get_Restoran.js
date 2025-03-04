const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'mongodb://localhost:27017/mydb',
  user: 'user',
  password: 'password',
  database: 'mydb'
});

// app.get('/restoran/:id', (req, res) => {

//   const restoranId = req.params.id;
  
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error('Problem sa konekcijom:', err);
//       res.status(500).send('Internal Server Problem');
//       return;
//     }

//     const query = 'SELECT * FROM Restoran WHERE ID = ?';

//     connection.query(query, [restoranId], (err, results) => {

//       connection.release();

//       if (err) {
//         console.error('Error executing query:', err);
//         res.status(500).send('Problem prilikom uzimanja podataka iz tabele');
//         return;
//       }

//       if (results.length === 0) {
//         res.status(404).send('Tabela nije nadjena');
//         return;
//       }

//       res.status(200).json(results[0]);
//     });
//   });
// });


function getRestoranInfo(restoranId, callback) {

  pool.getConnection((err, connection) => {
    if (err) {
      callback(err, null);
      return;
    }

    const query = 'SELECT * FROM Restoran WHERE ID = ?';

    connection.query(query, [restoranId], (err, results) => {

      connection.release();

      if (err) {
        callback(err, null);
        return;
      }


      callback(null, results);

    });
  });
}