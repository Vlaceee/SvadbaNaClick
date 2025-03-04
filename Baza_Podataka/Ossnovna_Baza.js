
var mysql = require('mysql');

// Konfiguracija za povezivanje na MySQL bazu podataka
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Korisnicko ime za MySQL
  password: 'password', // Lozinka za MySQL
  database: 'mydb'
});

// Povezivanje na MySQL bazu podataka
conn.connect(function(err) {
  if (err) {
    console.error('Greska pri povezivanju: ' + err.stack);
    return;
  }

  
  conn.query("CREATE DATABASE mydb", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});

// SQL upit za stvaranje tabele Mladenci
const createMladenciTableQuery = `
CREATE TABLE IF NOT EXISTS Mladenci (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Ime VARCHAR(50),
    Prezime VARCHAR(50),
    ImePartnera VARCHAR(50),
    PrezimePartnera VARCHAR(50),
    Email VARCHAR(100),
    Sifra VARCHAR(50)
)`;

// SQL upit za stvaranje tabele Admin
const createAdminTableQuery = `
CREATE TABLE IF NOT EXISTS Admin (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Ime VARCHAR(50),
    Prezime VARCHAR(50),
    Email VARCHAR(100),
    Sifra VARCHAR(50)
)`;

// SQL upit za stvaranje tabele Restoran
const createRestoranTableQuery = `
CREATE TABLE IF NOT EXISTS Restoran (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Ime VARCHAR(50),
    Prezime VARCHAR(50),
    Email VARCHAR(100),
    Sifra VARCHAR(50)
)`;

// SQL upit za stvaranje tabele Fotograf
const createFotografTableQuery = `
CREATE TABLE IF NOT EXISTS Fotograf (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Ime VARCHAR(50),
    Prezime VARCHAR(50),
    Email VARCHAR(100),
    Sifra VARCHAR(50)
)`;

// SQL upit za stvaranje tabele Poslasticar
const createPoslasticarTableQuery = `
CREATE TABLE IF NOT EXISTS Poslasticar (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Ime VARCHAR(50),
    Prezime VARCHAR(50),
    Email VARCHAR(100),
    Sifra VARCHAR(50)
)`;

// SQL upit za stvaranje tabele Dekorater
const createDekoraterTableQuery = `
CREATE TABLE IF NOT EXISTS Dekorater (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Ime VARCHAR(50),
    Prezime VARCHAR(50),
    Email VARCHAR(100),
    Sifra VARCHAR(50)
)`;

// SQL upita za stvaranje tablica
connection.query(createMladenciTableQuery, function(err, results, fields) {
  if (err) {
    console.error('Greska pri stvaranju tabele Mladenci: ' + err.message);
  } else {
    console.log('Tabela Mladenci je uspesno kreirana.');
  }
});

connection.query(createAdminTableQuery, function(err, results, fields) {
  if (err) {
    console.error('Greska pri stvaranju tabele Admin: ' + err.message);
  } else {
    console.log('Tabela Admin je uspesno kreirana.');
  }
});


//Ovo je nesto sto sam isprobavao, ne vodite racuna o ovome
/*var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'youremail@gmail.com',
    pass: 'yourpassword'
  }
});

var mailOptions = {
  from: 'youremail@gmail.com',
  to: 'myfriend@yahoo.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});*/

// Zatvaranje konekcije nakon zavrsetka
connection.end();
