app.delete('/restoran/:id', (req, res) => {
    const restoranId = req.params.id;
  
    const query = 'DELETE FROM Restoran WHERE ID = ?';
  
    connection.query(query, restoranId, (error, result) => {
      if (error) {
        console.error('Greska prilikom brisanja:', error);
        res.status(500).send('Greska prilikom brisanja.');
        return;
      }
  
      if (result.affectedRows === 0) {
        res.status(404).send('Restoran sa datim ID-jem nije pronadjen!');
        return;
      }
  
      res.status(200).send('Restoran je uspesno izbrisan.');
    });
  });
  