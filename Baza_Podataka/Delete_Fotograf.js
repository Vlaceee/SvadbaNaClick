app.delete('/fotograf/:id', (req, res) => {
    const fotografId = req.params.id;
  
    const query = 'DELETE FROM Fotograf WHERE ID = ?';
  
    connection.query(query, fotografId, (error, result) => {
      if (error) {
        console.error('Greska prilikom brisanja:', error);
        res.status(500).send('Greska prilikom brisanja.');
        return;
      }
  
      if (result.affectedRows === 0) {
        res.status(404).send('Fotograf sa datim ID-jem nije pronadjen!');
        return;
      }
  
      res.status(200).send('Fotograf je supesno izbrisan.');
    });
  });
  