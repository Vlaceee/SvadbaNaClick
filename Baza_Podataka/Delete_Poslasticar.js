app.delete('/poslasticar/:id', (req, res) => {
    const poslasticarId = req.params.id;
  
    const query = 'DELETE FROM Poslasticar WHERE ID = ?';
  
    connection.query(query, poslasticarId, (error, result) => {
      if (error) {
        console.error('Greska prilikom brisanja:', error);
        res.status(500).send('Greska prilikom brisanja.');
        return;
      }
  
      if (result.affectedRows === 0) {
        res.status(404).send('Poslasticar sa datim ID-jem nije pronadjen!');
        return;
      }
  
      res.status(200).send('Poslasticar je supesno izbrisan.');
    });
  });
  