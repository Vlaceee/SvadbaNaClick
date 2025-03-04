const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Povezivanje s MongoDB bazom
mongoose.connect('mongodb://localhost:27017/moja_baza', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Provjera povezivanja s bazom
db.on('error', console.error.bind(console, 'Greška prilikom povezivanja s bazom:'));
db.once('open', function() {
  console.log('Uspješno povezan s bazom.');
});

// Definiranje mongoose modela
const Korisnik = mongoose.model('Korisnik', {
  email: String,
  lozinka: String
});

// Parsiranje body-ja za POST zahtjeve
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ruta za ubacivanje korisnika
app.post('/dodaj-korisnika', (req, res) => {
  const { email, lozinka } = req.body;

  // Provjera da li su email i lozinka definirani
  if (!email || !lozinka) {
    return res.status(400).send('Nedostaje e-mail ili lozinka.');
  }

  // Kreiranje novog korisnika
  const noviKorisnik = new Korisnik({
    email,
    lozinka
  });

  // Spremanje korisnika u bazu
  noviKorisnik.save((err) => {
    if (err) {
      console.error('Greška prilikom spremanja korisnika:', err);
      return res.status(500).send('Greška prilikom spremanja korisnika u bazu.');
    }
    res.status(201).send('Korisnik uspješno dodan.');
  });
});

// Slušanje na određenom portu
app.listen(port, () => {
  console.log(`Server sluša na portu ${port}`);
});
