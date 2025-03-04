//Ovde ide put do tabele (ruta)
app.put('/dekorater/:id', (req, res) => {
    const fotografId = req.params.id;
    const fotografData = req.body;
  
    //Uspostavljamo konekciju
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Greska u konekciji:', err);
        res.status(500).send('Greska sa serverom (Internal Server Error)');
        return;
      }
  
      const setFields = [];
      const values = [];
      for (const [key, value] of Object.entries(fotografData)) {
        setFields.push(`${key} = ?`);
        values.push(value);
      }
      values.push(fotografId); 
  
      
      const query = `UPDATE Fotograf SET ${setFields.join(',')} WHERE ID = ${fotografId}`;
  
      
      connection.query(query, values, (err, results) => {
        
        connection.release();
  
        if (err) {
          console.error('Greska u query-ju:', err);
          res.status(500).send('Greska prilikom promene podataka.');
          return;
        }
  
        //Proveravamo da li je uspesno odradjena PUT metoda
        if (results.affectedRows === 0) {
          res.status(404).send('Nije pronadjen red u tabeli Admin koji odgovara.');
          return;
        }
  
        //Ako je uspesno sta da salje
        res.status(200).send('Podaci su uspesno promenjeni !');
      });
    });
  });
  