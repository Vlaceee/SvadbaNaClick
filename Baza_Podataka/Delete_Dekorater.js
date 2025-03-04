app.delete('/dekorater/:id', (req, res) => {
    const dekoraterId = req.params.id;
  
    const query = 'DELETE FROM Dekorater WHERE ID = ?';
  
    connection.query(query, dekoraterId, (error, result) => {
      if (error) {
        console.error('Greska prilikom brisanja:', error);
        res.status(500).send('Greska prilikom brisanja.');
        return;
      }
  
      if (result.affectedRows === 0) {
        res.status(404).send('Dekorater sa datim ID-jem nije pronadjen!');
        return;
      }
  
      res.status(200).send('Dekorater je supesno izbrisan.');
    });
  });
  