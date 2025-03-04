app.delete('/mladenci/:id', (req, res) => {
    const mladenciId = req.params.id;
  
    const query = 'DELETE FROM Mladenci WHERE ID = ?';
  
    connection.query(query, mladenciId, (error, result) => {
      if (error) {
        console.error('Greska prilikom brisanja:', error);
        res.status(500).send('Greska prilikom brisanja.');
        return;
      }
  
      if (result.affectedRows === 0) {
        res.status(404).send('Mladenci sa datim ID-jem nije pronadjen!');
        return;
      }
  
      res.status(200).send('Mladenci je supesno izbrisan.');
    });
  });
  