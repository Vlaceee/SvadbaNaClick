// app.delete('/admin/:id', (req, res) => {
//     const adminId = req.params.id;
  
//     const query = 'DELETE FROM Admin WHERE ID = ?';
  
//     connection.query(query, adminId, (error, result) => {
//       if (error) {
//         console.error('Greska prilikom brisanja:', error);
//         res.status(500).send('Greska prilikom brisanja.');
//         return;
//       }
  
//       if (result.affectedRows === 0) {
//         res.status(404).send('Admin sa datim ID-jem nije pronadjen!');
//         return;
//       }
  
//       res.status(200).send('Admin je uspesno izbrisan.');
//    });
// });

var mysql = require('mysql');
var express = require('express');
const cors = require('cors');

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mydb'
})

const baza = express();
baza.use(cors());

con.connect((err) =>{
  if(err) throw new Error(err);
  console.log("Konektovano.");

  con.changeUser({ database:'mydb' }, (err)=>{
    if(err) throw new Error(err);
    createTableAdmin();
  });
});


baza.delete('/admin/:id', (req, res) => {
  const IDadmina = req.params.id;

  conn.query("DELETE FROM Admin WHERE ID = ?", [IDadmina], (err) => {
    if(err) throw new Error(err);
    console.log("Admin je uspesno obrisan")
  })
})
  


baza.listen(8080);
