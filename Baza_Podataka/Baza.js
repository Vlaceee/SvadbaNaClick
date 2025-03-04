var mysql = require("mysql");
var express = require("express");
const multer = require("multer");
const cors = require("cors");
const exp = require("constants");
const { error } = require("console");
const { ifError } = require("assert");
const { threadId, workerData } = require("worker_threads");
const fs = require("fs");
const bodyParser = require("body-parser");
const { get } = require("http");
const { create } = require("domain");
const path = require("path");
// const { default: Restoran } = require('../SvadbaNaClick - novaVerzija/src/OglasiComponents/RestorasClass');

const baza = express();
baza.use(cors());
baza.use(express.urlencoded({ extended: false }));
baza.use(bodyParser.json());
baza.use(bodyParser.urlencoded({ extended: true }));
baza.use("/Slike", express.static("Slike"));
baza.use('/slike', express.static(path.join(__dirname, 'Slike')));



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Slike/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});

conn.connect((err) => {
  if (err) throw new Error(err);
  console.log("Konektovano.");

  conn.query("CREATE DATABASE IF NOT EXISTS mydb", (err) => {
    if (err) throw new Error(err);
    console.log("Napravljena baza mydb ili vec postoji!!");
    conn.changeUser({ database: "mydb" }, (err) => {
      if (err) throw new Error(err);
      createTableAdmin(); //admin
      createTableRestoran(); //restoran
      createTableFotograf(); //fotograf
      createTableJelovnik(); //jelovnik
      createTableDekorater(); //dekorater
      createTablePoslasticar(); //poslasticar
      createTableTIP_TORTE(); //tip-torte
      createTableMladenci(); //mladenci
      createTableKorisnik(); //korisnik
      createTableSlobodniTermini(); //slobodni termini
      createTableSigKod(); //sigurnosni kodovi
      createTableMailSave(); //mail save
      createTableZakazano(); //rezervacija
      createTableLikedFotograf();
      createTableLikedDekorater();
      createTableLikedPoslasticar();
      createTableLikedRestoran();
      createTableZakazaniJelovnik();
      createTableGosti(); //gosti
      createTableOceneDekorater(); //ocena dekoratera
      createTableOcenePoslasticar(); //ocena poslasticara
      createTableOceneFotograf(); //ocena fotografa
      createTableOceneRestoran(); //ocena restorana
      createTriggersDekorater(); //triger za dekoratera
      createTriggersPoslasticar(); //triger za poslasticara
      createTriggersFotograf(); //triger za fotografa
      createTriggersRestoran(); //triger za restoran
      createTableSlikeDekorater(); //slike za dekoratera
      createTableSlikePoslasticar(); //slike za poslasticara
      createTableSlikeFotograf(); //slike za fotografa
      createTableSlikeRestoran(); //slike za restoran
    });
  });
});



function createTableAdmin() {
  conn.query(
    `CREATE TABLE IF NOT EXISTS Admin (
        ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
        Ime VARCHAR(50),
        Prezime VARCHAR(50),
        Email VARCHAR(100),
        Sifra VARCHAR(50),
        UID VARCHAR(100)
    )`,
    (err) => {
      if (err) throw new Error(err);
      console.log("Tabela Admin je napravljena ili vec postoji !!");
    }
  );
}

//vlasta funkcije

function createTableLikedFotograf() {
  conn.query(
    `CREATE TABLE IF NOT EXISTS LikedFotograf (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        Mladenci_UID VARCHAR(100),
        Fotograf_ID INT,
        FOREIGN KEY (Fotograf_ID) REFERENCES Fotograf(ID)
    )`,
    (err) => {
      if (err) throw new Error(err);
      console.log("Tabela LikedFotograf je napravljena ili vec postoji !!");
    }
  );
}
function createTableLikedRestoran() {
  conn.query(
    `CREATE TABLE IF NOT EXISTS LikedRestoran (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        Mladenci_UID VARCHAR(100),
        Restoran_ID INT,
        FOREIGN KEY (Restoran_ID) REFERENCES Restoran(ID)
    )`,
    (err) => {
      if (err) throw new Error(err);
      console.log("Tabela LikedRestoran je napravljena ili vec postoji !!");
    }
  );
}
function createTableLikedPoslasticar() {
  conn.query(
    `CREATE TABLE IF NOT EXISTS LikedPoslasticar (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        Mladenci_UID VARCHAR(100),
        Poslasticar_ID INT,
        FOREIGN KEY (Poslasticar_ID) REFERENCES Poslasticar(ID)
    )`,
    (err) => {
      if (err) throw new Error(err);
      console.log("Tabela LikedPoslasticar je napravljena ili vec postoji !!");
    }
  );
}
function createTableLikedDekorater() {
  conn.query(
    `CREATE TABLE IF NOT EXISTS LikedDekorater (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        Mladenci_UID VARCHAR(100),
        Dekorater_ID INT,
        FOREIGN KEY (Dekorater_ID) REFERENCES Dekorater(ID)
    )`,
    (err) => {
      if (err) throw new Error(err);
      console.log("Tabela LikedDekorater je napravljena ili vec postoji !!");
    }
  );
}
//Vlastimirove metode
// Define the get method
baza.delete("/mladencicelo/:uid", (req, res) => {
  const { uid } = req.params;

  const getMladenciIdQuery = `SELECT ID FROM Mladenci WHERE UID = ?`;

  const deleteQueries = [
    `DELETE FROM Gosti WHERE Mladenci_ID = ?`,
    `DELETE FROM LikedDekorater WHERE Mladenci_UID = ?`,
    `DELETE FROM LikedFotograf WHERE Mladenci_UID = ?`,
    `DELETE FROM LikedRestoran WHERE Mladenci_UID = ?`,
    `DELETE FROM LikedPoslasticar WHERE Mladenci_UID = ?`,
    `DELETE FROM ZakazaniJelovnik WHERE Mladenci_ID = ?`,
    `DELETE FROM Zakazano WHERE Mladenci_ID = ?`,
    `DELETE FROM Korisnik WHERE Mladenci_ID = ?`,
    `DELETE FROM Mladenci WHERE UID = ?`
  ];

  const executeDeleteQueries = async (mladenciId) => {
    try {
      await new Promise((resolve, reject) => {
        conn.beginTransaction((err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });

      for (const query of deleteQueries) {
        await new Promise((resolve, reject) => {
          const params = query.includes('Mladenci_ID') ? [mladenciId] : [uid];
          conn.query(query, params, (err, result) => {
            if (err) {
              return reject(err);
            }
            resolve(result);
          });
        });
      }

      await new Promise((resolve, reject) => {
        conn.commit((err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });

      console.log("Record and related data successfully deleted!");
      res.status(200).send("Record and related data successfully deleted!");
    } catch (err) {
      await new Promise((resolve, reject) => {
        conn.rollback((err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };

  conn.query(getMladenciIdQuery, [uid], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (result.length === 0) {
      return res.status(404).send("Nije pronadjen korisnik sa datim UID-em.");
    }

    const mladenciId = result[0].ID;
    executeDeleteQueries(mladenciId);
  });
});



baza.get("/mladenciadmin", (req, res) => {
  const query = `
        SELECT 
            m.ID AS Mladenci_ID, 
            m.Ime, 
            m.Prezime, 
            m.Email,
            m.Broj_Telefona,
            m.Ime_Partnera,
            m.Prezime_Partnera,
            m.Sifra,
            m.UID,
            g.ID AS Gosti_ID, 
            g.Ime AS Gost_Ime, 
            g.Prezime AS Gost_Prezime, 
            g.Broj_Stola,
            ld.ID AS LikedDekorater_ID, 
            ld.Dekorater_ID,
            ld.Mladenci_UID,
            lf.ID AS LikedFotograf_ID, 
            lf.Fotograf_ID,
            lf.Mladenci_UID,
            lr.ID AS LikedRestoran_ID, 
            lr.Restoran_ID,
            lr.Mladenci_UID,
            lp.ID AS LikedPoslasticar_ID, 
            lp.Poslasticar_ID,
            lp.Mladenci_UID,
            zj.ID AS ZakazaniJelovnik_ID, 
            zj.ImeJela, 
            zj.TipJela, 
            zj.Cena, 
            zj.Gramaza,
            z.ID AS Zakazano_ID, 
            z.Restoran_Termin, 
            z.Poslasticar_Termin, 
            z.Fotograf_Termin, 
            z.Dekorater_Termin, 
            z.Cena_Poslasticara, 
            z.Cena_Restorana
        FROM Mladenci m
        LEFT JOIN Gosti g ON m.ID = g.Mladenci_ID
        LEFT JOIN LikedDekorater ld ON m.UID = ld.Mladenci_UID
        LEFT JOIN LikedFotograf lf ON m.UID = lf.Mladenci_UID
        LEFT JOIN LikedRestoran lr ON m.UID = lr.Mladenci_UID
        LEFT JOIN LikedPoslasticar lp ON m.UID = lp.Mladenci_UID
        LEFT JOIN ZakazaniJelovnik zj ON m.ID = zj.Mladenci_ID
        LEFT JOIN Zakazano z ON m.ID = z.Mladenci_ID;
    `;

  conn.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const response = results.reduce((acc, row) => {
      const mladenciID = row.Mladenci_ID;

      if (!acc[mladenciID]) {
        acc[mladenciID] = {
          Mladenci_ID: mladenciID,
          Ime: row.Ime,
          Prezime: row.Prezime,
          Email: row.Email,
          Broj_Telefona: row.Broj_Telefona,
          Ime_Partnera: row.Ime_Partnera,
          Prezime_Partnera: row.Prezime_Partnera,
          Sifra: row.Sifra,
          UID: row.UID,
          Gosti: [],
          LikedDekorater: new Set(),
          LikedFotograf: new Set(),
          LikedRestoran: new Set(),
          LikedPoslasticar: new Set(),
          ZakazaniJelovnik: [],
          Zakazano: [],
        };
      }

      if (row.Gosti_ID) {
        acc[mladenciID].Gosti.push({
          Gosti_ID: row.Gosti_ID,
          Ime: row.Gost_Ime,
          Prezime: row.Gost_Prezime,
          Broj_Stola: row.Broj_Stola,
        });
      }

      if (row.LikedDekorater_ID) {
        acc[mladenciID].LikedDekorater.add(JSON.stringify({
          LikedDekorater_ID: row.LikedDekorater_ID,
          Dekorater_ID: row.Dekorater_ID,
          Mladenci_UID: row.Mladenci_UID,
        }));
      }

      if (row.LikedFotograf_ID) {
        acc[mladenciID].LikedFotograf.add(JSON.stringify({
          LikedFotograf_ID: row.LikedFotograf_ID,
          Fotograf_ID: row.Fotograf_ID,
          Mladenci_UID: row.Mladenci_UID,
        }));
      }

      if (row.LikedRestoran_ID) {
        acc[mladenciID].LikedRestoran.add(JSON.stringify({
          LikedRestoran_ID: row.LikedRestoran_ID,
          Restoran_ID: row.Restoran_ID,
          Mladenci_UID: row.Mladenci_UID,
        }));
      }

      if (row.LikedPoslasticar_ID) {
        acc[mladenciID].LikedPoslasticar.add(JSON.stringify({
          LikedPoslasticar_ID: row.LikedPoslasticar_ID,
          Poslasticar_ID: row.Poslasticar_ID,
          Mladenci_UID: row.Mladenci_UID,
        }));
      }

      if (row.ZakazaniJelovnik_ID) {
        acc[mladenciID].ZakazaniJelovnik.push({
          ZakazaniJelovnik_ID: row.ZakazaniJelovnik_ID,
          ImeJela: row.ImeJela,
          TipJela: row.TipJela,
          Cena: row.Cena,
          Gramaza: row.Gramaza,
        });
      }

      if (row.Zakazano_ID) {
        acc[mladenciID].Zakazano.push({
          Zakazano_ID: row.Zakazano_ID,
          Restoran_Termin: row.Restoran_Termin,
          Poslasticar_Termin: row.Poslasticar_Termin,
          Fotograf_Termin: row.Fotograf_Termin,
          Dekorater_Termin: row.Dekorater_Termin,
          Cena_Poslasticara: row.Cena_Poslasticara,
          Cena_Restorana: row.Cena_Restorana,
        });
      }

      return acc;
    }, {});

    // Convert Set back to Array
    Object.values(response).forEach(mladenac => {
      mladenac.LikedDekorater = Array.from(mladenac.LikedDekorater).map(item => JSON.parse(item));
      mladenac.LikedFotograf = Array.from(mladenac.LikedFotograf).map(item => JSON.parse(item));
      mladenac.LikedRestoran = Array.from(mladenac.LikedRestoran).map(item => JSON.parse(item));
      mladenac.LikedPoslasticar = Array.from(mladenac.LikedPoslasticar).map(item => JSON.parse(item));
    });

    res.json(Object.values(response));
  });
});

baza.get("/fotograf/:uid", (req, res) => {
  const { uid } = req.params;
  const query = `
        SELECT 
            Fotograf.ID AS FotografID,
            Fotograf.NazivAgencije,
            Fotograf.Opis_Kompanije,
            Fotograf.Email,
            Fotograf.SigurnosniKod,
            Fotograf.Cena_Usluge,
            Fotograf.Cena_Po_Slici,
            Fotograf.Lokacija,
            Fotograf.Datum_Osnivanja,
            Fotograf.Broj_Telefona,
            Fotograf.Ocena,
            Slobodni_Termini.ID AS TerminID,
            Slobodni_Termini.Slobodan_Termin,
            IF(LF.ID IS NOT NULL, true, false) AS Liked
        FROM Fotograf
        LEFT JOIN Slobodni_Termini ON Fotograf.ID = Slobodni_Termini.Fotograf_ID
        LEFT JOIN LikedFotograf AS LF ON Fotograf.ID = LF.Fotograf_ID AND LF.Mladenci_UID = ?
    `;

  conn.query(query, [uid], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    const fotografi = {};
    result.forEach((row) => {
      if (
        row.FotografID &&
        row.NazivAgencije &&
        row.Email &&
        row.Lokacija &&
        row.Cena_Usluge &&
        row.Cena_Po_Slici &&
        row.Datum_Osnivanja
      ) {
        if (!fotografi[row.FotografID]) {
          fotografi[row.FotografID] = {
            FotografID: row.FotografID,
            NazivAgencije: row.NazivAgencije,
            Opis_Kompanije: row.Opis_Kompanije,
            Email: row.Email,
            SigurnosniKod: row.SigurnosniKod,
            Lokacija: row.Lokacija,
            Cena_Usluge: row.Cena_Usluge,
            Cena_Po_Slici: row.Cena_Po_Slici,
            Datum_Osnivanja: row.Datum_Osnivanja,
            Broj_Telefona: row.Broj_Telefona,
            Ocena: row.Ocena,
            Slobodni_Termini: [],
            Liked: row.Liked, // Add Liked attribute
          };
        }
        if (row.TerminID && row.Slobodan_Termin) {
          fotografi[row.FotografID].Slobodni_Termini.push({
            Slobodan_Termin: row.Slobodan_Termin,
            ID: row.TerminID,
          });
        }
      }
    });

    const fotografiList = Object.values(fotografi);
    res.json(fotografiList);
  });
});

baza.get("/poslasticar/:uid", (req, res) => {
  const { uid } = req.params;
  const query = `
        SELECT 
            Poslasticar.ID AS PoslasticarID,
            Poslasticar.Ime,
            Poslasticar.Prezime,
            Poslasticar.Kratak_Opis,
            Poslasticar.Email,
            Poslasticar.Datum_Osnivanja,
            Poslasticar.Cena_Posiljke,
            Poslasticar.Lokacija,
            Poslasticar.Ocena,
            Poslasticar.Broj_Telefona,
            ST.Slobodan_Termin AS SlobodanTermin,
            ST.ID AS SlobodanTerminID,
            TT.ID AS TortaID,
            TT.Naziv AS TortaNaziv,
            TT.Tip_Slaga AS TortaTipSlaga,
            TT.Fondan AS TortaFondan,
            TT.Tema AS TortaTema,
            TT.Cena AS TortaCena,
            TT.Posno AS TortaPosno,
            TT.Kratak_Opis AS TortaKratakOpis,
            IF(LP.ID IS NOT NULL, true, false) AS Liked
        FROM Poslasticar
        LEFT JOIN Slobodni_Termini AS ST ON Poslasticar.ID = ST.Poslasticar_ID
        LEFT JOIN TIP_TORTE AS TT ON Poslasticar.ID = TT.Torta_ID
        LEFT JOIN LikedPoslasticar AS LP ON Poslasticar.ID = LP.Poslasticar_ID AND LP.Mladenci_UID = ?
    `;

  conn.query(query, [uid], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    const poslasticari = {};
    result.forEach((row) => {
      if (
        row.PoslasticarID &&
        row.Ime &&
        row.Prezime &&
        row.Email &&
        row.Cena_Posiljke &&
        row.Lokacija &&
        row.Datum_Osnivanja
      ) {
        if (!poslasticari[row.PoslasticarID]) {
          poslasticari[row.PoslasticarID] = {
            ID: row.PoslasticarID,
            Ime: row.Ime,
            Prezime: row.Prezime,
            Kratak_Opis: row.Kratak_Opis,
            Email: row.Email,
            Datum_Osnivanja: row.Datum_Osnivanja,
            Cena_Posiljke: row.Cena_Posiljke,
            Lokacija: row.Lokacija,
            Broj_Telefona: row.Broj_Telefona,
            Ocena: row.Ocena,
            Slobodni_Termini: [],
            Torte: [],
            Liked: row.Liked, // Add Liked attribute
          };
        }
        if (row.SlobodanTerminID && row.SlobodanTermin) {
          poslasticari[row.PoslasticarID].Slobodni_Termini.push({
            Slobodan_Termin: row.SlobodanTermin,
            ID: row.SlobodanTerminID,
          });
        }
        if (
          row.TortaID &&
          row.TortaNaziv &&
          row.TortaTipSlaga &&
          row.TortaFondan &&
          row.TortaTema &&
          row.TortaCena &&
          row.TortaPosno &&
          row.TortaKratakOpis
        ) {
          poslasticari[row.PoslasticarID].Torte.push({
            Naziv: row.TortaNaziv,
            Tip_Slaga: row.TortaTipSlaga,
            Fondan: row.TortaFondan,
            Tema: row.TortaTema,
            Cena: row.TortaCena,
            Posno: row.TortaPosno,
            Kratak_Opis: row.TortaKratakOpis,
            ID: row.TortaID,
          });
        }
      }
    });

    const poslasticariList = Object.values(poslasticari);
    res.json(poslasticariList);
  });
});
baza.get("/restoran/:uid", (req, res) => {
  const { uid } = req.params;
  const query = `
        SELECT 
            Restoran.ID AS RestoranID,
            Restoran.Naziv AS RestoranNaziv,
            Restoran.Kratak_Opis AS RestoranKratakOpis,
            Restoran.Email,
            Restoran.Cena AS RestoranCena,
            Restoran.Lokacija,
            Restoran.Datum_Osnivanja,
            Restoran.Sigurnosni_Kod,
            Restoran.RestoranPraviTortu,
            Restoran.Bend,
            Restoran.Ocena,
            Restoran.Broj_Telefona,
            Slobodni_Termini.ID AS TerminID,
            Slobodni_Termini.Slobodan_Termin,
            Jelovnik.ID AS JelovnikID,
            Jelovnik.ImeJela,
            Jelovnik.Cena,
            Jelovnik.TIP,
            Jelovnik.Kolicina,
            IF(LR.ID IS NOT NULL, true, false) AS Liked
        FROM Restoran
        LEFT JOIN Slobodni_Termini ON Restoran.ID = Slobodni_Termini.Restoran_ID
        LEFT JOIN Jelovnik ON Restoran.ID = Jelovnik.Restoran_ID
        LEFT JOIN LikedRestoran AS LR ON Restoran.ID = LR.Restoran_ID AND LR.Mladenci_UID = ?
    `;

  conn.query(query, [uid], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const restorani = {};
    result.forEach((row) => {
      if (!restorani[row.RestoranID]) {
        restorani[row.RestoranID] = {
          ID: row.RestoranID,
          Naziv: row.RestoranNaziv,
          Kratak_Opis: row.RestoranKratakOpis,
          Email: row.Email,
          Cena: row.RestoranCena,
          Lokacija: row.Lokacija,
          Datum_Osnivanja: row.Datum_Osnivanja,
          SigurnosniKod: row.Sigurnosni_Kod,
          RestoranPraviTortu: row.RestoranPraviTortu,
          Bend: row.Bend,
          Ocena: row.Ocena,
          Broj_Telefona: row.Broj_Telefona,
          Slobodni_Termini: [],
          Jelovnik: [],
          Liked: row.Liked, // Add Liked attribute
        };
      }

      if (row.TerminID) {
        restorani[row.RestoranID].Slobodni_Termini.push({
          Slobodan_Termin: row.Slobodan_Termin,
          ID: row.TerminID,
        });
      }

      if (row.JelovnikID) {
        if (!restorani[row.RestoranID].Jelovnik[row.JelovnikID]) {
          restorani[row.RestoranID].Jelovnik[row.JelovnikID] = {
            ID: row.JelovnikID,
            ImeJela: row.ImeJela,
            Cena: row.Cena,
            TIP: row.TIP,
            Kolicina: row.Kolicina,
          };
        }
      }
    });

    const restoraniList = Object.values(restorani).map((restoran) => ({
      ...restoran,
      Jelovnik: Object.values(restoran.Jelovnik),
    }));

    res.json(restoraniList);
  });
});
baza.get("/dekorater/:uid", (req, res) => {
  const { uid } = req.params;
  const query = `
        SELECT 
            Dekorater.ID AS DekoraterID,
            Dekorater.Ime,
            Dekorater.Kratak_Opis,
            Dekorater.Email,
            Dekorater.Lokacija,
            Dekorater.Cena,
            Dekorater.Datum_Osnivanja,
            Dekorater.Ocena,
            Dekorater.Broj_Telefona,
            Slobodni_Termini.ID AS TerminID,
            Slobodni_Termini.Slobodan_Termin,
            IF(LD.ID IS NOT NULL, true, false) AS Liked
        FROM Dekorater
        LEFT JOIN Slobodni_Termini ON Dekorater.ID = Slobodni_Termini.Dekorater_ID
        LEFT JOIN LikedDekorater AS LD ON Dekorater.ID = LD.Dekorater_ID AND LD.Mladenci_UID = ?
    `;

  conn.query(query, [uid], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const dekorateri = {};
    result.forEach((row) => {
      if (
        row.DekoraterID &&
        row.Ime &&
        row.Email &&
        row.Lokacija &&
        row.Cena &&
        row.Datum_Osnivanja
      ) {
        if (!dekorateri[row.DekoraterID]) {
          dekorateri[row.DekoraterID] = {
            DekoraterID: row.DekoraterID,
            Ime: row.Ime,
            Kratak_Opis: row.Kratak_Opis,
            Email: row.Email,
            Lokacija: row.Lokacija,
            Cena: row.Cena,
            Datum_Osnivanja: row.Datum_Osnivanja,
            Ocena: row.Ocena,
            Broj_Telefona: row.Broj_Telefona,
            Slobodni_Termini: [],
            Liked: row.Liked, // Add Liked attribute
          };
        }

        if (row.TerminID && row.Slobodan_Termin) {
          dekorateri[row.DekoraterID].Slobodni_Termini.push({
            Slobodan_Termin: row.Slobodan_Termin,
            ID: row.TerminID,
          });
        }
      }
    });

    const dekorateriList = Object.values(dekorateri);
    res.json(dekorateriList);
  });
});
// Delete function for LikedFotograf table
baza.delete("/likedfotograf/:id", (req, res) => {
  const { id } = req.params;

  const deleteQuery = `DELETE FROM LikedFotograf WHERE ID = ?`;

  conn.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Nije pronadjena stavka sa datim ID-em.");
    }

    console.log("Stavka uspešno obrisana!");
    res.status(200).send("Stavka uspešno obrisana!");
  });
});

// Delete function for LikedRestoran table
baza.delete("/likedrestoran/:id", (req, res) => {
  const { id } = req.params;

  const deleteQuery = `DELETE FROM LikedRestoran WHERE ID = ?`;

  conn.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Nije pronadjena stavka sa datim ID-em.");
    }

    console.log("Stavka uspešno obrisana!");
    res.status(200).send("Stavka uspešno obrisana!");
  });
});

// Delete function for LikedPoslasticar table
baza.delete("/likedposlasticar/:id", (req, res) => {
  const { id } = req.params;

  const deleteQuery = `DELETE FROM LikedPoslasticar WHERE ID = ?`;

  conn.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Nije pronadjena stavka sa datim ID-em.");
    }

    console.log("Stavka uspešno obrisana!");
    res.status(200).send("Stavka uspešno obrisana!");
  });
});

// Delete function for LikedDekorater table
baza.delete("/likeddekorater/:id", (req, res) => {
  const { id } = req.params;

  const deleteQuery = `DELETE FROM LikedDekorater WHERE ID = ?`;

  conn.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Nije pronadjena stavka sa datim ID-em.");
    }

    console.log("Stavka uspešno obrisana!");
    res.status(200).send("Stavka uspešno obrisana!");
  });
});

// Assuming you have already set up your Express app
// Assuming you have already set up your Express app
baza.post("/addLikedEntity", (req, res) => {
  const { UID, Type, EntityID } = req.body; // Assuming your request body contains UID, Type, and EntityID

  // Define a switch statement to handle different types
  switch (Type) {
    case "Fotograf":
      conn.query(
        `INSERT INTO LikedFotograf (Mladenci_UID, Fotograf_ID) VALUES (?, ?)`,
        [UID, EntityID],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error adding liked Fotograf");
          }
          res.status(200).send("Liked Fotograf added successfully");
        }
      );
      break;
    case "Dekorater":
      conn.query(
        `INSERT INTO LikedDekorater (Mladenci_UID, Dekorater_ID) VALUES (?, ?)`,
        [UID, EntityID],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error adding liked Dekorater");
          }
          res.status(200).send("Liked Dekorater added successfully");
        }
      );
      break;
    case "Restoran":
      conn.query(
        `INSERT INTO LikedRestoran (Mladenci_UID, Restoran_ID) VALUES (?, ?)`,
        [UID, EntityID],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error adding liked Restoran");
          }
          res.status(200).send("Liked Restoran added successfully");
        }
      );
      break;
    case "Baker":
      conn.query(
        `INSERT INTO LikedPoslasticar (Mladenci_UID, Poslasticar_ID) VALUES (?, ?)`,
        [UID, EntityID],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error adding liked Poslasticar");
          }
          res.status(200).send("Liked Poslasticar added successfully");
        }
      );
      break;
    default:
      res.status(400).send("Invalid Type");
  }
});

// Assuming you have already set up your Express app
// Delete liked entity
baza.post("/deleteLikedEntity", (req, res) => {
  const { UID, Type, EntityID } = req.body;

  switch (Type) {
    case "Fotograf":
      conn.query(
        `DELETE FROM LikedFotograf WHERE Mladenci_UID = ? AND Fotograf_ID = ?`,
        [UID, EntityID],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error deleting liked Fotograf");
          }
          res.status(200).send("Liked Fotograf deleted successfully");
        }
      );
      break;
    case "Dekorater":
      conn.query(
        `DELETE FROM LikedDekorater WHERE Mladenci_UID = ? AND Dekorater_ID = ?`,
        [UID, EntityID],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error deleting liked Dekorater");
          }
          res.status(200).send("Liked Dekorater deleted successfully");
        }
      );
      break;
    case "Restoran":
      conn.query(
        `DELETE FROM LikedRestoran WHERE Mladenci_UID = ? AND Restoran_ID = ?`,
        [UID, EntityID],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error deleting liked Restoran");
          }
          res.status(200).send("Liked Restoran deleted successfully");
        }
      );
      break;
    case "Baker":
      conn.query(
        `DELETE FROM LikedPoslasticar WHERE Mladenci_UID = ? AND Poslasticar_ID = ?`,
        [UID, EntityID],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error deleting liked Poslasticar");
          }
          res.status(200).send("Liked Poslasticar deleted successfully");
        }
      );
      break;
    default:
      res.status(400).send("Invalid Type");
  }
});

// baza.get('/getLikedDekorater/:UID', (req, res) => {
//     const { UID } = req.params;

//     const selectquery =
//         `SELECT * FROM LikedDekorater
//         WHERE Mladenci_UID = ?
//         `;

//         conn.query(selectquery, [UID], (err, result) => {
//             if (err) {
//                  console.error(err);
//                 return res.status(500).send('Error retrieving liked Fotograf');
//             }

//             if (result.length === 0) {
//                 console.log('No records found for the provided UID');
//                 return res.status(404).send('No records found');
//             }

//             console.log('Uspesno su vraceni podaci!');
//             console.log(result);
//             res.status(200).json(result);
//         });
// });

baza.get("/getLikedDekorater/:uid", (req, res) => {
  const { uid } = req.params;

  const selectQuery = `SELECT * FROM LikedDekorater
        WHERE Mladenci_UID = ?
    `;

  conn.query(selectQuery, [uid], (err, result) => {
    if (err) {
      console.error("Error retrieving liked Dekorater:", err);
      return res.status(500).send("Error retrieving liked Dekorater");
    }

    console.log("Data successfully retrieved:");
    console.log(result);
    res.status(200).json(result);
  });
});

function createTableFotograf() {
  conn.query(
    `CREATE TABLE IF NOT EXISTS Fotograf (
        ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
        NazivAgencije VARCHAR(50),
        Opis_Kompanije VARCHAR(200),
        Email VARCHAR(100),
        SigurnosniKod VARCHAR(50),
        Cena_Usluge INT,
        Cena_Po_Slici FLOAT,
        Lokacija VARCHAR(50),
        Datum_Osnivanja DATETIME,
        Broj_Telefona VARCHAR(50),
        Ocena FLOAT (5, 1),
        UID VARCHAR(100)
    )`,
    (err) => {
      if (err) throw new Error(err);
      console.log("Tabela Fotograf je napravljena ili vec postoji !!");
    }
  );
}

function createTableMladenci() {
  conn.query(
    `CREATE TABLE IF NOT EXISTS Mladenci (
        ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
        Ime VARCHAR(50),
        Prezime VARCHAR(50),
        Broj_Telefona VARCHAR(50),
        Ime_Partnera VARCHAR(50),
        Prezime_Partnera VARCHAR(50),
        Email VARCHAR(100),
        Sifra VARCHAR(50),
        Ocena FLOAT,
        UID VARCHAR(100)
    )`,
    (err) => {
      if (err) throw new Error(err);
      console.log("Tabela Mladecni je napravljena ili vec postoji !!");
    }
  );
}

//ZA RESTORAN
//Jelovnik lista
function createTableRestoran() {
  conn.query(
    `CREATE TABLE IF NOT EXISTS Restoran (
        ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
        Naziv VARCHAR(50),
        Kratak_Opis VARCHAR(200),
        Email VARCHAR(100),
        Sifra VARCHAR(50),
        Lokacija VARCHAR(50),
        Cena INT(12),
        Datum_Osnivanja DATETIME,
        Sigurnosni_Kod VARCHAR(50),
        RestoranPraviTortu BOOLEAN,
        Bend VARCHAR(50),
        Ocena FLOAT (5, 1),
        Broj_Telefona VARCHAR(50),
        UID VARCHAR(100)
    )`,
    (err) => {
      if (err) throw new Error(err);
      console.log("Tabela Restoran je napravljena ili vec postoji !!");
    }
  );
}

// Slobodni_Termini_ID INT,
//         FOREIGN KEY (Slobodni_Termini_ID) REFERENCES Slobodni_Termini(ID)

//ZA DEKORATERA
function createTableDekorater() {
  conn.query(
    `CREATE TABLE IF NOT EXISTS Dekorater (
        ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
        Ime VARCHAR(50),
        Kratak_Opis VARCHAR(200),
        Email VARCHAR(100),
        Sifra VARCHAR(50),
        Lokacija VARCHAR(50),
        Cena INT(12),
        Sigurnosni_Kod VARCHAR(50),
        Datum_Osnivanja DATETIME,
        Ocena FLOAT (5, 1),
        Broj_Telefona VARCHAR(50),
        UID VARCHAR(100)
    )`,
    (err) => {
      if (err) throw new Error(err);
      console.log("Tabela Dekorater je napravljena ili vec postoji !!");
    }
  );
}

// ZA POSLASTICARA
//lista torti
function createTablePoslasticar() {
  conn.query(
    `CREATE TABLE IF NOT EXISTS Poslasticar (
        ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
        Ime VARCHAR(50),
        Prezime VARCHAR(50),
        Kratak_Opis VARCHAR(200),
        Email VARCHAR(100),
        Sifra VARCHAR(50),
        Sigurnosni_Kod VARCHAR(50),
        Datum_Osnivanja DATETIME,
        Cena_Posiljke INT(12),
        Lokacija VARCHAR(50),
        Broj_Telefona VARCHAR(50),
        Ocena FLOAT(5, 1),
        UID VARCHAR(100)
    )`,
    (err) => {
      if (err) throw new Error(err);
      console.log("Tabela Poslasticar je napravljena ili vec postoji !!");
    }
  );
}

function createTableKorisnik() {
  conn.query(
    `CREATE TABLE IF NOT EXISTS Korisnik(
        ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
        UID VARCHAR(100) NOT NULL UNIQUE,
        TIP VARCHAR(50),
        Admin_ID INT,
        Mladenci_ID INT,
        Fotograf_ID INT,
        Poslasticar_ID INT,
        Dekorater_ID INT,
        Restoran_ID INT,
        FOREIGN KEY (Admin_ID) REFERENCES Admin(ID),
        FOREIGN KEY (Mladenci_ID) REFERENCES Mladenci(ID),
        FOREIGN KEY (Fotograf_ID) REFERENCES Fotograf(ID),
        FOREIGN KEY (Poslasticar_ID) REFERENCES Poslasticar(ID),
        FOREIGN KEY (Dekorater_ID) REFERENCES Dekorater(ID),
        FOREIGN KEY (Restoran_ID) REFERENCES Restoran(ID)
      )`,
    (err) => {
      if (err) throw new Error(err);
      console.log("Tabela Korisnik je napravljena ili vec psotoji");
    }
  );
}

//ZA TIP_TORTE
function createTableTIP_TORTE() {
  conn.query(
    `CREATE TABLE IF NOT EXISTS TIP_TORTE (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        Naziv VARCHAR(255),
        Tip_Slaga VARCHAR(50),
        Fondan BOOLEAN,
        Tema VARCHAR(50),
        Cena INT(12),
        Posno VARCHAR(255),
        Kratak_Opis VARCHAR(200),
        Torta_ID INT,
        FOREIGN KEY (Torta_ID) REFERENCES Poslasticar(ID)
      )`,
    (err) => {
      if (err) throw new Error(err);
      console.log("Tabela TIP_TORTE je napravljena ili vec postoji !!");
    }
  );
}

function createTableSlobodniTermini() {
  conn.query(
    `
        CREATE TABLE IF NOT EXISTS Slobodni_Termini (
            ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
            Slobodan_Termin DATETIME,
            Dekorater_ID INT,
            Fotograf_ID INT,
            Poslasticar_ID INT,
            Restoran_ID INT,
            FOREIGN KEY (Dekorater_ID) REFERENCES Dekorater(ID),
            FOREIGN KEY (Fotograf_ID) REFERENCES Fotograf(ID),
            FOREIGN KEY (Poslasticar_ID) REFERENCES Poslasticar(ID),
            FOREIGN KEY (Restoran_ID) REFERENCES Restoran(ID)
        )`,
    (err) => {
      if (err) throw new Error(err);
      console.log("Tabela Slobodni_Termini je napravljena ili već postoji !!");
    }
  );
}

function createTableSigKod() {
  conn.query(
    `
    CREATE TABLE IF NOT EXISTS Sigurnosni_Kodovi (
        Sigurnosni_Kod VARCHAR(50) NOT NULL PRIMARY KEY
    )`,
    (err) => {
      if (err) throw new Error(err);
      console.log("Tabela Sigurnosni_Kodovi je napravljena ili već postoji !!");
    }
  );
}

function createTableJelovnik() {
  conn.query(
    `CREATE TABLE IF NOT EXISTS Jelovnik(
        ID INT AUTO_INCREMENT PRIMARY KEY,
        ImeJela VARCHAR(255),
        TIP VARCHAR(255),
        Cena INT(12),
        Kolicina FLOAT,
        Restoran_ID INT,
        FOREIGN KEY (Restoran_ID) REFERENCES Restoran(ID)
      )`,
    (err) => {
      if (err) throw new Error(err);
      console.log("Tabela Jelovnik je napravljena ili vec postoji !!");
    }
  );
}

function createTableGosti() {
  conn.query(
    `
        CREATE TABLE IF NOT EXISTS Gosti(
            ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
            Ime VARCHAR(50),
            Prezime VARCHAR(50),
            Broj_Stola INT,
            Mladenci_ID INT,
            FOREIGN KEY (Mladenci_ID) REFERENCES Mladenci(ID)
        )
    `,
    (err) => {
      if (err) throw new Error(err);
      console.log("Tabela Gosti je uspesno napravljena ili vec postoji.");
    }
  );
}

function createTableZakazano() {
  conn.query(
    `
        CREATE TABLE IF NOT EXISTS Zakazano (
            ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
            Restoran_Termin DATETIME,
            Poslasticar_Termin DATETIME,
            Fotograf_Termin DATETIME,
            Dekorater_Termin DATETIME,
            Cena_Poslasticara INT,
            Cena_Restorana INT,
            Naziv_Torte VARCHAR(50),
            Mladenci_ID INT,
            Poslasticar_ID INT,
            Restoran_ID INT,
            Dekorater_ID INT,
            Fotograf_ID INT,
            FOREIGN KEY (Mladenci_ID) REFERENCES Mladenci(ID),
            FOREIGN KEY (Poslasticar_ID) REFERENCES Poslasticar(ID),
            FOREIGN KEY (Restoran_ID) REFERENCES Restoran(ID),
            FOREIGN KEY (Dekorater_ID) REFERENCES Dekorater(ID),
            FOREIGN KEY (Fotograf_ID) REFERENCES Fotograf(ID)
        )`,
    (err) => {
      if (err) throw new Error(err);
      console.log("Tabela Zakazano je napravljena ili već postoji !!");
    }
  );
}

function createTableZakazaniJelovnik() {
  conn.query(
    `CREATE TABLE IF NOT EXISTS ZakazaniJelovnik(
        ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
        ImeJela VARCHAR(50),
        TipJela VARCHAR(50),
        Cena INT,
        Gramaza FLOAT,
        Mladenci_ID INT,
        FOREIGN KEY (Mladenci_ID) REFERENCES Mladenci(ID)
    )`,
    (err) => {
      if (err) throw new Error(err);
      console.log(
        "Tabela ZakazaniJelovnik je uspesno napravljena ili vec postoji."
      );
    }
  );
}

function createTablePregled_Info() {
  conn.query(
    `CREATE TABLE IF NOT EXISTS Pregled_Info(
        ID INT AUTO_INCREMENT PRIMARY KEY,
        Admin_ID INT,
        Mladenci_ID INT,
        Restoran_ID INT,
        Fotograf_ID INT,
        Poslasticar_ID INT,
        Dekorater_ID INT,
        Guest_ID INT,
        FOREIGN KEY (Admin_ID) REFERENCES Admin(ID),
        FOREIGN KEY (Mladenci_ID) REFERENCES Mladenci(ID),
        FOREIGN KEY (Restoran_ID) REFERENCES Restoran(ID),
        FOREIGN KEY (Fotograf_ID) REFERENCES Fotograf(ID),
        FOREIGN KEY (Poslasticar_ID) REFERENCES Poslasticar(ID),
        FOREIGN KEY (Dekorater_ID) REFERENCES Dekorater(ID)
      )`,
    (err) => {
      if (err) throw new Error(err);
      console.log("Tabela Pregled_Info je napravljena ili vec postoji !!");
    }
  );
}

function createTablePromena_Info() {
  conn.query(
    `CREATE TABLE IF NOT EXISTS Pregled_Info(
        ID INT AUTO_INCREMENT PRIMARY KEY,
        Admin_ID INT,
        Mladenci_ID INT,
        Restoran_ID INT,
        Fotograf_ID INT,
        Poslasticar_ID INT,
        Dekorater_ID INT,
        FOREIGN KEY (Admin_ID) REFERENCES Admin(ID),
        FOREIGN KEY (Mladenci_ID) REFERENCES Mladenci(ID),
        FOREIGN KEY (Restoran_ID) REFERENCES Restoran(ID),
        FOREIGN KEY (Fotograf_ID) REFERENCES Fotograf(ID),
        FOREIGN KEY (Poslasticar_ID) REFERENCES Poslasticar(ID),
        FOREIGN KEY (Dekorater_ID) REFERENCES Dekorater(ID)
      )`,
    (err) => {
      if (err) throw new Error(err);
      console.log("Tabela Promena_Info je napravljena ili vec postoji !!");
    }
  );
}

function createTablePromena_Sadrzaja() {
  conn.query(
    `CREATE TABLE IF NOT EXISTS Promena_Sadrzaja(
        ID INT AUTO_INCREMENT PRIMARY KEY,
        Admin_ID INT,
        Restoran_ID INT,
        Fotograf_ID INT,
        Poslasticar_ID INT,
        Dekorater_ID INT,
        FOREIGN KEY (Admin_ID) REFERENCES Admin(ID),
        FOREIGN KEY (Restoran_ID) REFERENCES Restoran(ID),
        FOREIGN KEY (Fotograf_ID) REFERENCES Fotograf(ID),
        FOREIGN KEY (Poslasticar_ID) REFERENCES Poslasticar(ID),
        FOREIGN KEY (Dekorater_ID) REFERENCES Dekorater(ID),
      )`,
    (err) => {
      if (err) throw new Error(err);
      console.log("Tabela Promena_Sadrzaja je napravljena ili vec postoji !!");
    }
  );
}

function createTableBrisanje_Sadrzaja() {
  conn.query(
    `CREATE TABLE IF NOT EXISTS Brisanje_Sadrzaja(
        ID INT AUTO_INCREMENT PRIMARY KEY,
        Admin_ID INT,
        Restoran_ID INT,
        Fotograf_ID INT,
        Poslasticar_ID INT,
        Dekorater_ID INT,
        FOREIGN KEY (Admin_ID) REFERENCES Admin(ID),
        FOREIGN KEY (Restoran_ID) REFERENCES Restoran(ID),
        FOREIGN KEY (Fotograf_ID) REFERENCES Fotograf(ID),
        FOREIGN KEY (Poslasticar_ID) REFERENCES Poslasticar(ID),
        FOREIGN KEY (Dekorater_ID) REFERENCES Dekorater(ID),
      )`,
    (err) => {
      if (err) throw new Error(err);
      console.log("Tabela Brisanje_Sadrzaja je napravljena ili vec postoji !!");
    }
  );
}

function createTableMailSave() {
  conn.query(
    `
        CREATE TABLE IF NOT EXISTS Proveri_Mail (
            ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
            Email VARCHAR(50)
        )`,
    (err) => {
      if (err) throw new Error(err);
      console.log("Tabela Proveri_Mail je napravljena ili već postoji !!");
    }
  );
}

function createTableOceneRestoran() {
  conn.query(
    `
        CREATE TABLE IF NOT EXISTS OceneRestoran (
            ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
            Ocena FLOAT,
            Restoran_ID INT,
            FOREIGN KEY (Restoran_ID) REFERENCES Restoran(ID)
        )`,
    (err) => {
      if (err) throw new Error(err);
      console.log("Tabela Ocene za restoran je napravljena ili već postoji !!");
    }
  );
}

function createTableOcenePoslasticar() {
  conn.query(
    `
        CREATE TABLE IF NOT EXISTS OcenePoslasticar (
            ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
            Ocena FLOAT,
            Poslasticar_ID INT,
            FOREIGN KEY (Poslasticar_ID) REFERENCES Poslasticar(ID)
        )`,
    (err) => {
      if (err) throw new Error(err);
      console.log(
        "Tabela Ocene za Poslasticar je napravljena ili već postoji !!"
      );
    }
  );
}

function createTableOceneDekorater() {
  conn.query(
    `
        CREATE TABLE IF NOT EXISTS OceneDekorater (
            ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
            Ocena FLOAT,
            Dekorater_ID INT,
            FOREIGN KEY (Dekorater_ID) REFERENCES Dekorater(ID)
        )`,
    (err) => {
      if (err) throw new Error(err);
      console.log(
        "Tabela Ocene za Dekorater je napravljena ili već postoji !!"
      );
    }
  );
}

function createTableOceneFotograf() {
  conn.query(
    `
        CREATE TABLE IF NOT EXISTS OceneFotograf (
            ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
            Ocena FLOAT,
            Fotograf_ID INT,
            FOREIGN KEY (Fotograf_ID) REFERENCES Fotograf(ID)
        )`,
    (err) => {
      if (err) throw new Error(err);
      console.log("Tabela Ocene za Fotograf je napravljena ili već postoji !!");
    }
  );
}

function createTriggersFotograf() {
  const triggers = [
    `CREATE TRIGGER IF NOT EXISTS after_insert_ocene_fotograf
         AFTER INSERT ON OceneFotograf
         FOR EACH ROW
         BEGIN
             UPDATE Fotograf
             SET Ocena = (SELECT AVG(Ocena) FROM OceneFotograf WHERE Fotograf_ID = NEW.Fotograf_ID)
             WHERE ID = NEW.Fotograf_ID;
         END;`,

    `CREATE TRIGGER IF NOT EXISTS after_update_ocene_fotograf
         AFTER UPDATE ON OceneFotograf
         FOR EACH ROW
         BEGIN
             UPDATE Fotograf
             SET Ocena = (SELECT AVG(Ocena) FROM OceneFotograf WHERE Fotograf_ID = NEW.Fotograf_ID)
             WHERE ID = NEW.Fotograf_ID;
         END;`,

    `CREATE TRIGGER IF NOT EXISTS after_delete_ocene_fotograf
         AFTER DELETE ON OceneFotograf
         FOR EACH ROW
         BEGIN
             UPDATE Fotograf
             SET Ocena = (SELECT AVG(Ocena) FROM OceneFotograf WHERE Fotograf_ID = OLD.Fotograf_ID)
             WHERE ID = OLD.Fotograf_ID;
         END;`,
  ];

  triggers.forEach((trigger) => {
    conn.query(trigger, (err) => {
      if (err) throw err;
      console.log("Trigger uspesno napravljen!");
    });
  });
}

function createTriggersRestoran() {
  const triggers = [
    `CREATE TRIGGER IF NOT EXISTS after_insert_ocene_Restoran
         AFTER INSERT ON OceneRestoran
         FOR EACH ROW
         BEGIN
             UPDATE Restoran
             SET Ocena = (SELECT AVG(Ocena) FROM OceneRestoran WHERE Restoran_ID = NEW.Restoran_ID)
             WHERE ID = NEW.Restoran_ID;
         END;`,

    `CREATE TRIGGER IF NOT EXISTS after_update_ocene_Restoran
         AFTER UPDATE ON OceneRestoran
         FOR EACH ROW
         BEGIN
             UPDATE Restoran
             SET Ocena = (SELECT AVG(Ocena) FROM OceneRestoran WHERE Restoran_ID = NEW.Restoran_ID)
             WHERE ID = NEW.Restoran_ID;
         END;`,

    `CREATE TRIGGER IF NOT EXISTS after_delete_ocene_Restoran
         AFTER DELETE ON OceneRestoran
         FOR EACH ROW
         BEGIN
             UPDATE Restoran
             SET Ocena = (SELECT AVG(Ocena) FROM OceneRestoran WHERE Restoran_ID = OLD.Restoran_ID)
             WHERE ID = OLD.Restoran_ID;
         END;`,
  ];

  triggers.forEach((trigger) => {
    conn.query(trigger, (err) => {
      if (err) throw err;
      console.log("Trigger uspesno napravljen!");
    });
  });
}

function createTriggersDekorater() {
  const triggers = [
    `CREATE TRIGGER IF NOT EXISTS after_insert_ocene_Dekorater
         AFTER INSERT ON OceneDekorater
         FOR EACH ROW
         BEGIN
             UPDATE Dekorater
             SET Ocena = (SELECT AVG(Ocena) FROM OceneDekorater WHERE Dekorater_ID = NEW.Dekorater_ID)
             WHERE ID = NEW.Dekorater_ID;
         END;`,

    `CREATE TRIGGER IF NOT EXISTS after_update_ocene_Dekorater
         AFTER UPDATE ON OceneDekorater
         FOR EACH ROW
         BEGIN
             UPDATE Dekorater
             SET Ocena = (SELECT AVG(Ocena) FROM OceneDekorater WHERE Dekorater_ID = NEW.Dekorater_ID)
             WHERE ID = NEW.Dekorater_ID;
         END;`,

    `CREATE TRIGGER IF NOT EXISTS after_delete_ocene_Dekorater
         AFTER DELETE ON OceneDekorater
         FOR EACH ROW
         BEGIN
             UPDATE Dekorater
             SET Ocena = (SELECT AVG(Ocena) FROM OceneDekorater WHERE Dekorater_ID = OLD.Dekorater_ID)
             WHERE ID = OLD.Dekorater_ID;
         END;`,
  ];

  triggers.forEach((trigger) => {
    conn.query(trigger, (err) => {
      if (err) throw err;
      console.log("Trigger uspesno napravljen!");
    });
  });
}

function createTriggersPoslasticar() {
  const triggers = [
    `CREATE TRIGGER IF NOT EXISTS after_insert_ocene_Poslasticar
         AFTER INSERT ON OcenePoslasticar
         FOR EACH ROW
         BEGIN
             UPDATE Poslasticar
             SET Ocena = (SELECT AVG(Ocena) FROM OcenePoslasticar WHERE Poslasticar_ID = NEW.Poslasticar_ID)
             WHERE ID = NEW.Poslasticar_ID;
         END;`,

    `CREATE TRIGGER IF NOT EXISTS after_update_ocene_Poslasticar
         AFTER UPDATE ON OcenePoslasticar
         FOR EACH ROW
         BEGIN
             UPDATE Poslasticar
             SET Ocena = (SELECT AVG(Ocena) FROM OcenePoslasticar WHERE Poslasticar_ID = NEW.Poslasticar_ID)
             WHERE ID = NEW.Poslasticar_ID;
         END;`,

    `CREATE TRIGGER IF NOT EXISTS after_delete_ocene_Poslasticar
         AFTER DELETE ON OcenePoslasticar
         FOR EACH ROW
         BEGIN
             UPDATE Poslasticar
             SET Ocena = (SELECT AVG(Ocena) FROM OcenePoslasticar WHERE Poslasticar_ID = OLD.Poslasticar_ID)
             WHERE ID = OLD.Poslasticar_ID;
         END;`,
  ];

  triggers.forEach((trigger) => {
    conn.query(trigger, (err) => {
      if (err) throw err;
      console.log("Trigger uspesno napravljen!");
    });
  });
}

function createTableSlikeRestoran() {
  conn.query(
    `
        CREATE TABLE IF NOT EXISTS SlikeRestoran (
            ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
            Slike LONGBLOB,
            Restoran_ID INT,
            FOREIGN KEY (Restoran_ID) REFERENCES Restoran(ID)
        )`,
    (err) => {
      if (err) throw new Error(err);
      console.log("Tabela slike za restoran je napravljena ili već postoji !!");
    }
  );
}

function createTableSlikeDekorater() {
  conn.query(
    `
        CREATE TABLE IF NOT EXISTS SlikeDekorater (
            ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
            Slike LONGBLOB,
            Dekorater_UID VARCHAR(100),
            Dekorater_ID INT,
            FOREIGN KEY (Dekorater_ID) REFERENCES Dekorater(ID)
        )`,
    (err) => {
      if (err) throw new Error(err);
      console.log(
        "Tabela Slike za dekoratera je napravljena ili već postoji !!"
      );
    }
  );
}

function createTableSlikeFotograf() {
  conn.query(
    `
        CREATE TABLE IF NOT EXISTS SlikeFotograf (
            ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
            Slike LONGBLOB,
            Fotograf_ID INT,
            FOREIGN KEY (Fotograf_ID) REFERENCES Fotograf(ID)
        )`,
    (err) => {
      if (err) throw new Error(err);
      console.log(
        "Tabela Slike za fotografa je napravljena ili već postoji !!"
      );
    }
  );
}

function createTableSlikePoslasticar() {
  conn.query(
    `
        CREATE TABLE IF NOT EXISTS SlikePoslasticar (
            ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
            Slike LONGBLOB,
            Poslasticar_ID INT,
            FOREIGN KEY (Poslasticar_ID) REFERENCES Poslasticar(ID)
        )`,
    (err) => {
      if (err) throw new Error(err);
      console.log(
        "Tabela Slike za poslasticara je napravljena ili već postoji !!"
      );
    }
  );
}

//treba da vraca sigurnosni kod
baza.get("/sigurnosnikod/:sig_kod", (req, res) => {
  
  const { sig_kod } = req.params;

  conn.query('SELECT * FROM Sigurnosni_Kodovi WHERE Sigurnosni_Kod = ?',[sig_kod], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return null;
    }
    if (result.length === 0) {
      res.status(404).send("Not Found");
      return null;
    }
    res.status(200).json(result);
  });
})

//Tabela koja ce da cuve email adrese onih koji se jave za sigurnosni kod
baza.post("/email", (req, res) => {
  const { Email } = req.body;

  conn.query(
    "INSERT INTO Proveri_Mail (Email) VALUES (?)",
    [Email],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }
      console.log("Podaci su uspesno ubaceni.");
      res.status(200).send("Podaci su uspesno ubaceni.");
    }
  );
});

//ODAVDE SU CRUD METODE ZA SVAKU TABELU TJ KOJE SU POTREBNE

//POST za slike

// baza.post('/slikeRestoran/:uid', upload.array('images', 10), (req, res) => {
//     const { uid } = req.params;

//     if (!req.files || req.files.length === 0) {
//         return res.status(400).send('No files uploaded');
//     }

//     const imagePromises = req.files.map(file => {
//         return new Promise((resolve, reject) => {
//             const fileName = file.filename;

//             conn.query('SELECT ID FROM Restoran WHERE UID = ?', [uid], (err, result) => {
//                 if (err) {
//                     return reject(err);
//                 }

//                 const Restoran_ID = result[0].ID;
//                 conn.query('INSERT INTO SlikeRestoran (Slike, Restoran_ID) VALUES (?, ?)', [fileName, Restoran_ID], (err, resultSlike) => {
//                     if (err) {
//                         return reject(err);
//                     }

//                     resolve();
//                 });
//             });
//         });
//     });

//     Promise.all(imagePromises)
//         .then(() => {
//             console.log("Images successfully inserted into SlikeRestoran");
//             res.status(201).send('Images successfully uploaded');
//         })
//         .catch(err => {
//             console.error("Error inserting images into SlikeRestoran:", err);
//             res.status(500).send('Internal Server Error');
//         });
// });

baza.post("/slikeRestoran/:id", upload.array("images", 10), (req, res) => {
  const { id } = req.params;

    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded');
    }

    const imagePromises = req.files.map(file => {
        return new Promise((resolve, reject) => {

                const imageName = file.filename;

                conn.query('INSERT INTO SlikeRestoran (Slike, Restoran_ID) VALUES (?, ?)', [imageName, id], (err, resultSlike) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve();
                });
        });
    });

    Promise.all(imagePromises)
        .then(() => {
            console.log("Images successfully inserted into SlikeRestoran");
            res.status(201).send('Images successfully uploaded');
        })
        .catch(err => {
            console.error("Error inserting images into SlikeRestoran:", err);
            res.status(500).send('Internal Server Error');
        });
});

baza.get("/slikeRestoran/:id", (req, res) => {
  const id = req.params.id;

  conn.query(
    "SELECT Slike FROM SlikeRestoran WHERE Restoran_ID = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error(
          "Problem prilikom vracanja slike iz tabele SlikeRestoran:",
          err
        );
        return res.status(500).send("Internal Server Error");
      }

      if (results.length === 0) {
        return res.status(404).send("Images not found");
      }

      const images = results.map(row => row.Slike);
      const boundary = "slike-restoran";

      res.writeHead(200, {
        "Content-Type": `multipart/form-data; boundary=${boundary}`
      });

      images.forEach((image, index) => {
        res.write(`--${boundary}\r\n`);
        res.write(`Content-Disposition: form-data; name="file${index}"; filename="image${index}.jpg"\r\n`);
        res.write(`Content-Type: image/jpeg\r\n\r`);
        res.write(image);
        res.write("\r\n");
      });

      res.end(`--${boundary}--`);
    }
  );
});

baza.get("/slikeRestoran/url/:id", (req, res) => {
    const Restoran_ID = req.params.id;

    conn.query(
        "SELECT Slike FROM SlikeRestoran WHERE Restoran_ID = ?",
        [Restoran_ID],
        (err, results) => {
            if (err) {
                console.error(
                    "Problem prilikom vracanja slike iz tabele SlikeRestoran:",
                    err
                );
                return res.status(500).send("Internal Server Error");
            }

            if (results.length === 0) {
                return res.status(404).send("Images not found");
            }

            const imageUrls = results.map(row => {
                return `${req.protocol}://${req.get('host')}/Slike/${row.Slike}`;
            });

            res.status(200).json({
                message: 'Images fetched successfully',
                images: imageUrls
            });
        }
    );
});

//A ovo je da vrati sliku kao base64 string
baza.get("/slikeRestoran/string/:id", (req, res) => {
    const Restoran_ID = req.params.id;

    conn.query(
      "SELECT Slike FROM SlikeRestoran WHERE Restoran_ID = ?",
      [Restoran_ID],
      (err, results) => {
        if (err) {
          console.error(
            "Problem prilikom vracanja slike iz tabele SlikeRestoran:",
            err
          );
          return res.status(500).send("Internal Server Error");
        }
  
        if (results.length === 0) {
          return res.status(404).send("Images not found");
        }
  
        const images = results.map(row => ({
          filename: `image_${row.ID}.jpg`,
          content: `data:image/jpeg;base64,${row.Slike.toString('base64')}`
        }));
  
        res.json(images);
      }
    );
    // conn.query(
    //     "SELECT Slike FROM SlikeRestoran WHERE Restoran_ID = ?",
    //     [Restoran_ID],
    //     (err, results) => {
    //         if (err) {
    //             console.error("Problem prilikom vracanja slike iz tabele SlikeRestoran:", err);
    //             return res.status(500).send("Internal Server Error");
    //         }

    //         if (results.length === 0) {
    //             return res.status(404).send("Images not found");
    //         }

    //         const images = results.map(row => {
    //             const filePath = path.join(__dirname, 'uploads', row.Slike);
    //             const imageBuffer = fs.readFileSync(filePath);
    //             return {
    //                 filename: row.Slike,
    //                 data: imageBuffer.toString('base64')
    //             };
    //         });

    //         res.status(200).json({
    //             message: 'Images fetched successfully',
    //             images: images
    //         });
    //     }
    // );
});

baza.post("/slikePoslasticar/:id", upload.array("images", 10), (req, res) => {
    const { id } = req.params;

    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded');
    }

    const imagePromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
            const imageName = file.filename;

            conn.query('INSERT INTO SlikePoslasticar (Slike, Poslasticar_ID) VALUES (?, ?)', [imageName, id], (err, resultSlike) => {
                if (err) {
                    return reject(err);
                }

                resolve();
            });
        });
    });

    Promise.all(imagePromises)
        .then(() => {
            console.log("Images successfully inserted into SlikePoslasticar");
            res.status(201).send('Images successfully uploaded');
        })
        .catch(err => {
            console.error("Error inserting images into SlikePoslasticar:", err);
            res.status(500).send('Internal Server Error');
        });
});

//ovo je da vracamo sliku ali preko url-a
baza.get("/slikePoslasticar/url/:id", (req, res) => {
    const Poslasticar_ID = req.params.id;

    conn.query(
        "SELECT Slike FROM SlikePoslasticar WHERE Poslasticar_ID = ?",
        [Poslasticar_ID],
        (err, results) => {
            if (err) {
                console.error(
                    "Problem prilikom vracanja slike iz tabele SlikePoslasticar:",
                    err
                );
                return res.status(500).send("Internal Server Error");
            }

            if (results.length === 0) {
                return res.status(404).send("Images not found");
            }

            const imageUrls = results.map(row => {
                return `${req.protocol}://${req.get('host')}/slike/${row.Slike}`;
            });

            res.status(200).json({
                message: 'Images fetched successfully',
                images: imageUrls
            });
        }
    );
});

baza.get("/slikePoslasticar/:id", (req, res) => {
  const id = req.params.id;

  conn.query(
    "SELECT Slike FROM SlikePoslasticar WHERE Poslasticar_ID = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error(
          "Problem prilikom vracanja slike iz tabele SlikePoslasticar:",
          err
        );
        return res.status(500).send("Internal Server Error");
      }

      if (results.length === 0) {
        return res.status(404).send("Images not found");
      }

      const images = results.map(row => row.Slike);
      const boundary = "slike-poslasticar";

      res.writeHead(200, {
        "Content-Type": `multipart/form-data; boundary=${boundary}`
      });

      images.forEach((image, index) => {
        res.write(`--${boundary}\r\n`);
        res.write(`Content-Disposition: form-data; name="file${index}"; filename="image${index}.jpg"\r\n`);
        res.write(`Content-Type: image/jpeg\r\n\r`);
        res.write(image);
        res.write("\r\n");
      });

      res.end(`--${boundary}--`);
    }
  );
});

//A ovo je da vrati sliku kao base64 string
baza.get("/slikePoslasticar/string/:id", (req, res) => {
    const Poslasticar_ID = req.params.id;

    conn.query(
      "SELECT Slike FROM SlikePoslasticar WHERE Poslasticar_ID = ?",
      [Poslasticar_ID],
      (err, results) => {
        if (err) {
          console.error(
            "Problem prilikom vracanja slike iz tabele SlikePoslasticar:",
            err
          );
          return res.status(500).send("Internal Server Error");
        }
  
        if (results.length === 0) {
          return res.status(404).send("Images not found");
        }
  
        const images = results.map(row => ({
          filename: `image_${row.ID}.jpg`,
          content: `data:image/jpeg;base64,${row.Slike.toString('base64')}`
        }));
  
        res.json(images);
      }
    );
  
});



baza.post('/slikeDekorater/:id', upload.array('images', 10), (req, res) => {
    const { id } = req.params;

    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded');
    }

    const imagePromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
            conn.query('SELECT UID FROM Dekorater WHERE ID = ?', [id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                

                if (result.length === 0) {
                    return reject(new Error('Dekorater not found'));
                }

                console.log("Dekorater found");

                const Dekorater_UID = result[0].UID;
                const imageName = file.filename;

                conn.query('INSERT INTO SlikeDekorater (Slike, Dekorater_UID, Dekorater_ID) VALUES (?, ?, ?)', [imageName, Dekorater_UID, id], (err, resultSlike) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve();
                });
            });
        });
    });

    Promise.all(imagePromises)
        .then(() => {
            console.log("Images successfully inserted into SlikeDekorater");
            res.status(201).send('Images successfully uploaded');
        })
        .catch(err => {
            console.error("Error inserting images into SlikeDekorater:", err);
            res.status(500).send('Internal Server Error');
        });
});

//ovo je da vracamo sliku ali preko url-a
baza.get("/slikeDekorater/url/:id", (req, res) => {
    const {id} = req.params;

    conn.query(
        "SELECT Slike FROM SlikeDekorater WHERE Dekorater_ID = ?",
        [id],
        (err, results) => {
            if (err) {
                console.error(
                    "Problem prilikom vracanja slike iz tabele SlikeDekorater:",
                    err
                );
                return res.status(500).send("Internal Server Error");
            }

            if (results.length === 0) {
                return res.status(404).send("Images not found");
            }

            const imageUrls = results.map(row => {
                return `${req.protocol}://${req.get('host')}/slike/${row.Slike}`;
            });

            res.status(200).json({
                message: 'Uspesno vracene slike',
                images: imageUrls
            });
        }
    );
});

//Ovo je da vrati sliku kao sliku, meni vraca ime ne znam da li vraca sliku haha
baza.get("/slikeDekorater/:id", (req, res) => {
  const id = req.params.id;

  conn.query(
    "SELECT Slike FROM SlikeDekorater WHERE Dekorater_ID = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error(
          "Problem prilikom vracanja slike iz tabele SlikeDekorater:",
          err
        );
        return res.status(500).send("Internal Server Error");
      }

      if (results.length === 0) {
        return res.status(404).send("Images not found");
      }

      const images = results.map(row => row.Slike);
      const boundary = "slike-dekorater";

      res.writeHead(200, {
        "Content-Type": `multipart/form-data; boundary=${boundary}`
      });

      images.forEach((image, index) => {
        res.write(`--${boundary}\r\n`);
        res.write(`Content-Disposition: form-data; name="file${index}"; filename="image${index}.jpg"\r\n`);
        res.write(`Content-Type: image/jpeg\r\n\r\n`);
        res.write(image);
        res.write("\r\n");
      });

      res.end(`--${boundary}--`);
    }
  );
});

//A ovo je da vrati sliku kao base64 string
baza.get("/slikeDekorater/string/:id", (req, res) => {
    const Dekorater_ID = req.params.id;

    conn.query(
      "SELECT Slike FROM SlikeDekorater WHERE Dekorater_ID = ?",
      [Dekorater_ID],
      (err, results) => {
        if (err) {
          console.error(
            "Problem prilikom vracanja slike iz tabele SlikeDekorater:",
            err
          );
          return res.status(500).send("Internal Server Error");
        }
  
        if (results.length === 0) {
          return res.status(404).send("Images not found");
        }
  
        const images = results.map(row => ({
          filename: `image_${row.ID}.jpg`,
          content: `data:image/jpeg;base64,${row.Slike.toString('base64')}`
        }));
  
        res.json(images);
      }
    );

    // conn.query(
    //     "SELECT Slike FROM SlikeDekorater WHERE Dekorater_ID = ?",
    //     [Dekorater_ID],
    //     (err, results) => {
    //         if (err) {
    //             console.error("Problem prilikom vracanja slike iz tabele SlikeDekorater:", err);
    //             return res.status(500).send("Internal Server Error");
    //         }

    //         if (results.length === 0) {
    //             return res.status(404).send("Images not found");
    //         }

    //         const images = results.map(row => {
    //             // const filePath = path.join(__dirname, 'Slike', row.Slike);
    //             const imageBuffer = fs.readFileSync("./Slike/" + row.Slike);
    //             return {
    //                 filename: row.Slike,
    //                 data: imageBuffer.toString('base64')
    //             };
    //         });

    //         res.status(200).json({
    //             message: 'Images fetched successfully',
    //             images: images
    //         });
    //     }
    // );
});

// baza.get('/slikeDekorater/:id/:slikaid', (req, res) => {
//     const { id, slikaid } = req.params;

//     conn.query('SELECT Slike FROM SlikeDekorater WHERE Dekorater_ID = ? AND ID = ?', [id, slikaid], (err, resultSlike) => {
//         if (err) {
//             console.error("Error fetching image from SlikeDekorater:", err);
//             return res.status(500).send('Internal Server Error');
//         }

//         imeSlike = resultSlike.Slike;

//         if (resultSlike.length === 0) {
//             return res.status(404).send('Image not found for this decorator');
//         }

//         // const imagePath = path.join(__dirname, 'Slike');
        
//         if (fs.existsSync(imeSlike)) {
//             res.sendFile(imeSlike);
//         } else {
//             res.status(404).send('Image file not found');
//         }
//     });
// });

baza.post("/slikeFotograf/:id", upload.array("images", 10), (req, res) => {
  const { id } = req.params;

    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded');
    }

    const imagePromises = req.files.map(file => {
        return new Promise((resolve, reject) => {

                const imageName = file.filename;

                conn.query('INSERT INTO SlikeFotograf (Slike, Fotograf_ID) VALUES (?, ?)', [imageName, id], (err, resultSlike) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve();
                });
        });
    });

    Promise.all(imagePromises)
        .then(() => {
            console.log("Images successfully inserted into SlikeFotograf");
            res.status(201).send('Images successfully uploaded');
        })
        .catch(err => {
            console.error("Error inserting images into SlikeFotograf:", err);
            res.status(500).send('Internal Server Error');
        });
});

//A ovo je da vrati sliku kao base64 string
baza.get("/slikeFotograf/string/:id", (req, res) => {
    const Fotograf_ID = req.params.id;

    conn.query(
      "SELECT Slike FROM SlikeFotograf WHERE Fotograf_ID = ?",
      [Fotograf_ID],
      (err, results) => {
        if (err) {
          console.error(
            "Problem prilikom vracanja slike iz tabele SlikeFotograf:",
            err
          );
          return res.status(500).send("Internal Server Error");
        }
  
        if (results.length === 0) {
          return res.status(404).send("Images not found");
        }
  
        const images = results.map(row => ({
          filename: `image_${row.ID}.jpg`,
          content: `data:image/jpeg;base64,${row.Slike.toString('base64')}`
        }));
  
        res.json(images);
      }
    );
});

// baza.get("/slikeFotograf/:id", (req, res) => {
//     const Fotograf_ID = req.params.id;
  
//     conn.query(
//       "SELECT Slike FROM SlikeFotograf WHERE Fotograf_ID = ?",
//       [Fotograf_ID],
//       (err, results) => {
//         if (err) {
//           console.error(
//             "Problem prilikom vracanja slike iz tabele SlikeFotograf:",
//             err
//           );
//           return res.status(500).send("Internal Server Error");
//         }
  
//         if (results.length === 0) {
//           return res.status(404).send("Image not found");
//         }
  
//         const imageBuffer = results[0].Slike;
  
//         // Ovo je za jpg slike, ako je neki drugi format samo se promeni ovo gde pise /jpg
//         res.writeHead(200, {
//           "Content-Type": "image/jpg",
//           "Content-Length": imageBuffer.length,
//         });
//         res.end(imageBuffer);
//       }
//     );
// });

baza.get("/slikeFotograf/:id", (req, res) => {
  const id = req.params.id;

  conn.query(
    "SELECT Slike FROM SlikeFotograf WHERE Fotograf_ID = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error(
          "Problem prilikom vracanja slike iz tabele SlikeFotograf:",
          err
        );
        return res.status(500).send("Internal Server Error");
      }

      if (results.length === 0) {
        return res.status(404).send("Images not found");
      }

      const images = results.map(row => row.Slike);
      const boundary = "slike-fotograf";

      res.writeHead(200, {
        "Content-Type": `multipart/form-data; boundary=${boundary}`
      });

      images.forEach((image, index) => {
        res.write(`--${boundary}\r\n`);
        res.write(`Content-Disposition: form-data; name="file${index}"; filename="image${index}.jpg"\r\n`);
        res.write(`Content-Type: image/jpeg\r\n\r\n`);
        res.write(image);
        res.write("\r\n");
      });

      res.end(`--${boundary}--`);
    }
  );
});

  //ovo je da vracamo sliku ali preko url-a
baza.get("/slikeFotograf/url/:id", (req, res) => {
    const Fotograf_ID = req.params.id;

    conn.query(
        "SELECT Slike FROM SlikeFotograf WHERE Fotograf_ID = ?",
        [Fotograf_ID],
        (err, results) => {
            if (err) {
                console.error(
                    "Problem prilikom vracanja slike iz tabele SlikeFotograf:",
                    err
                );
                return res.status(500).send("Internal Server Error");
            }

            if (results.length === 0) {
                return res.status(404).send("Images not found");
            }

            const imageUrls = results.map(row => {
                return `${req.protocol}://${req.get('host')}/Slike/${row.Slike}`;
            });

            res.status(200).json({
                message: 'Images fetched successfully',
                images: imageUrls
            });
        }
    );
});

//POST za ocene

baza.post("/oceneRestoran/:id", (req, res) => {
  const { id } = req.params;
  const { Ocena } = req.body;
  conn.query(
    "INSERT INTO OceneRestoran (Ocena, Restoran_ID) VALUES (?, ?)",
    [Ocena, id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }
      console.log("Podaci su uspesno ubaceni.");
      res.status(200).send("Podaci su uspesno ubaceni.");
    }
  );
});

baza.post("/ocenePoslasticar/:id", (req, res) => {
  const { id } = req.params;
  const { Ocena } = req.body;
  conn.query(
    "INSERT INTO OcenePoslasticar (Ocena, Poslasticar_ID) VALUES (?, ?)",
    [Ocena, id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }
      console.log("Podaci su uspesno ubaceni.");
      res.status(200).send("Podaci su uspesno ubaceni.");
    }
  );
});

baza.post("/oceneDekorater/:id", (req, res) => {
  const { id } = req.params;
  const { Ocena } = req.body;
  conn.query(
    "INSERT INTO OceneDekorater (Ocena, Dekorater_ID) VALUES (?, ?)",
    [Ocena, id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }
      console.log("Podaci su uspesno ubaceni.");
      res.status(200).send("Podaci su uspesno ubaceni.");
    }
  );
});

baza.post("/oceneFotograf/:id", (req, res) => {
  const { id } = req.params;
  const { Ocena } = req.body;
  conn.query(
    "INSERT INTO OceneFotograf (Ocena, Fotograf_ID) VALUES (?, ?)",
    [Ocena, id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }
      console.log("Podaci su uspesno ubaceni.");
      res.status(200).send("Podaci su uspesno ubaceni.");
    }
  );
});

//GET za Korisnika
baza.get("/korisnik/:uid", (req, res) => {
  const { uid } = req.params;

  const selectquery = `
        SELECT * FROM Korisnik
        WHERE UID = ?
    `;
  conn.query(selectquery, [uid], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (result.length === 0) {
      return res
        .status(404)
        .send("Ne postoji podatak u tabeli sa trazenim UID-em");
    }

    console.log("Uspesno su vraceni podaci!");
    console.log(result);
    res.status(200).json(result[0]);
  });
});

//CRUD za Admina
baza.post("/admin/andrija", (req, res) => {
  conn.query(
    "INSERT INTO Admin SET ?",
    {
      Ime: "Andrija",
      Prezime: "Marinkovic",
      Email: "heakkeudobd@gmail.com",
      Sifra: "lozinka",
      UID: "ucd6lsr59FPsp6MOR1SjpEvwQcg2",
    },
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      const adminid = result.insertId;

      conn.query(
        "INSERT INTO KORISNIK (UID, TIP, Admin_ID) VALUES (?, ?, ?)",
        ["ucd6lsr59FPsp6MOR1SjpEvwQcg2", "Admin", adminid],
        (err) => {
          if (err) {
            console.log("Nije uspela nazalost.");
            console.error(err);
            res.status(500).send("Internal Server Error");
            return;
          }
          console.log("Podaci su uspesno ubaceni.");
          res.status(200).send("Podaci su uspesno ubaceni.");
        }
      );
    }
  );
});

baza.post("/admin/vlasta", (req, res) => {
  conn.query(
    "INSERT INTO Admin SET ?",
    {
      Ime: "Vlastimir",
      Prezime: "Zdravkovic",
      Email: "vacezdravkovic@gmail.com",
      Sifra: "password",
      UID: "TaeT4mKI5RefpWZmwbSgFViHGZn1",
    },
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      const adminid = result.insertId;

      conn.query(
        "INSERT INTO KORISNIK (UID, TIP, Admin_ID) VALUES (?, ?, ?)",
        ["TaeT4mKI5RefpWZmwbSgFViHGZn1", "Admin", adminid],
        (err) => {
          if (err) {
            console.log("Nije uspela nazalost.");
            console.error(err);
            res.status(500).send("Internal Server Error");
            return;
          }
          console.log("Podaci su uspesno ubaceni.");
          res.status(200).send("Podaci su uspesno ubaceni.");
        }
      );
    }
  );
});

baza.post("/admin/ilija", (req, res) => {
  conn.query(
    "INSERT INTO Admin SET ?",
    {
      Ime: "Ilija",
      Prezime: "Ilic",
      Email: "ilic.ilija002@gmail.com",
      Sifra: "admin",
      UID: "p3sQ3kxC4MRoRBDtDoWjBEHm0cr1",
    },
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      const adminid = result.insertId;

      conn.query(
        "INSERT INTO KORISNIK (UID, TIP, Admin_ID) VALUES (?, ?, ?)",
        ["p3sQ3kxC4MRoRBDtDoWjBEHm0cr1", "Admin", adminid],
        (err) => {
          if (err) {
            console.log("Nije uspela nazalost.");
            console.error(err);
            res.status(500).send("Internal Server Error");
            return;
          }
          console.log("Podaci su uspesno ubaceni.");
          res.status(200).send("Podaci su uspesno ubaceni.");
        }
      );
    }
  );
});

baza.put("/slobodnitermini/:id", (req, res) => {
  const terminId = req.params.id;
  const { Slobodan_Termin } = req.body;

  const updateSlobodanTerminQuery = `
        UPDATE Slobodni_Termini 
        SET Slobodan_Termin = ?
        WHERE ID = ?
    `;

  conn.query(
    updateSlobodanTerminQuery,
    [Slobodan_Termin, terminId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }

      if (result.affectedRows === 0) {
        return res.status(404).send("No record found with the provided ID");
      }

      console.log("Slobodan_Termin successfully updated");
      res.status(200).send("Slobodan_Termin successfully updated");
    }
  );
});

baza.post("/slobodniterminirestoran/prekoid/:id", (req, res) => {
  const restoranId = req.params.id;
  const { Slobodan_Termin } = req.body;

    conn.query('INSERT INTO Slobodni_Termini (Slobodan_Termin, Restoran_ID) VALUES (?, ?)', [Slobodan_Termin, restoranId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

      if (result.affectedRows === 0) {
        return res.status(404).send("No record found with the provided ID");
      }

      console.log("Slobodan_Termin successfully updated");
      res.status(200).send("Slobodan_Termin successfully updated");
    }
  );
});

baza.post('/slobodniterminifotograf/prekoid/:id', (req, res) => {
    const { id } = req.params;
    const { Slobodan_Termin } = req.body;

    conn.query('INSERT INTO Slobodni_Termini (Slobodan_Termin, Fotograf_ID) VALUES (?, ?)', [Slobodan_Termin, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

      if (result.affectedRows === 0) {
        return res.status(404).send("No record found with the provided ID");
      }

        console.log('Slobodan_Termin successfully updated');
        res.status(200).send('Slobodan_Termin successfully ubaceno');
    });
});

baza.post("/slobodniterminiposlasticar/prekoid/:id", (req, res) => {
  const poslasticarId = req.params.id;
  const { Slobodan_Termin } = req.body;

    conn.query('INSERT INTO Slobodni_Termini (Slobodan_Termin, Poslasticar_ID) VALUES (?, ?)', [Slobodan_Termin, poslasticarId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

      if (result.affectedRows === 0) {
        return res.status(404).send("No record found with the provided ID");
      }

      console.log("Slobodan_Termin successfully updated");
      res.status(200).send("Slobodan_Termin successfully updated");
    }
  );
});

baza.post("/slobodniterminidekorater/prekoid/:id", (req, res) => {
  const dekoraterId = req.params.id;
  const { Slobodan_Termin } = req.body;

    conn.query('INSERT INTO Slobodni_Termini (Slobodan_Termin, Dekorater_ID) VALUES (?, ?)', [Slobodan_Termin, dekoraterId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

      if (result.affectedRows === 0) {
        return res.status(404).send("No record found with the provided ID");
      }

      console.log("Slobodan_Termin successfully updated");
      res.status(200).send("Slobodan_Termin successfully updated");
    }
  );
});

// baza.get('/admin', (req, res) => {
//     conn.query('SELECT * FROM Admin', (err, result) => {
//         if (err) throw new Error(err);
//         res.json(result);
//         // console.log(result);
//         // res.end();
//     })
// });

// baza.put('/admin', (req, res) => {
//     conn.query('UPDATE Admin SET ? WHERE ID = 2', {
//         Ime: "Andrija",
//         Prezime: "Marinkovic",
//         Email: "heakkeudobd@gmail.com",
//         Sifra: "lozinka1",
//         UID: "ucd6lsr59FPsp6MOR1SjpEvwQcg2",
//     }, (err) => {
//         if (err) throw new Error(err);
//         console.log("Promenili smo podatke");
//         res.end();
//     })
// });

// baza.delete('/admin', (req, res) => {
//     conn.query('DELETE FROM Admin WHERE ID=2', (err) => {
//         if (err) throw new Error(err);
//         console.log("Izbrisano iz tabele");
//         res.end();
//     })
// });

//CRUD za Mladence

baza.post('/mladenci', (req, res) => {
    const { Ime, Prezime, Broj_Telefona, Ime_Partnera, Prezime_Partnera, Email, Sifra, UID } = req.body;
    var mladenci_id;
    conn.query(
        'INSERT INTO Mladenci (Ime, Prezime, Broj_Telefona, Ime_Partnera, Prezime_Partnera, Email, Sifra, UID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [Ime, Prezime, Broj_Telefona, Ime_Partnera, Prezime_Partnera, Email, Sifra, UID],
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }
           mladenci_id = result.insertId;
           conn.query(
            'INSERT INTO Korisnik (UID, TIP, Mladenci_ID) VALUES (?, ?, ?)',
            [UID, "Mladenci", mladenci_id],
            (err) => {
                if (err) {
                    console.log("Nije uspela nazalost.")
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                conn.query('INSERT INTO Zakazano (Mladenci_ID) VALUES (?)', [mladenci_id], (err) => {
                    if (err) {
                        console.log("Nije uspela nazalost.")
                        console.error(err);
                        res.status(500).send('Internal Server Error');
                        return;
                    }
                    console.log('Podaci su uspesno ubaceni.');
                    res.status(200).send('Podaci su uspesno ubaceni.');
                });
            },
        );
            console.log('Podaci su uspesno ubaceni!');
            //res.status(200).send('Podaci su uspesno ubaceni!');
        },
    );
    console.log("Sve je zavrseno.")
});

baza.get("/mladenci", (req, res) => {
  conn.query("SELECT * FROM Mladenci", (err, result) => {
    if (err) throw new Error(err);
    res.json(result);
    // console.log(result);
    // res.end();
  });
});

baza.get("/mladenci/:uid", (req, res) => {
  const { uid } = req.params;

  const selectquery = `
        SELECT * FROM Mladenci
        WHERE UID = ?
    `;
  conn.query(selectquery, [uid], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (result.length === 0) {
      return res
        .status(404)
        .send("Ne postoji podatak u tabeli sa trazenim UID-em");
    }

    console.log("Uspesno su vraceni podaci!");
    console.log(result);
    res.status(200).json(result[0]);

    //res.json(result);
    // console.log(result);
    // res.end();
  });
});

baza.put("/mladenci/:id", (req, res) => {
  const { id } = req.params;
  const {
    Ime,
    Prezime,
    Broj_Telefona,
    Ime_Partnera,
    Prezime_Partnera,
    Email,
    Sifra,
  } = req.body;

  const updateQuery = `
        UPDATE Mladenci 
        SET Ime = ?, Prezime = ?, Broj_Telefona = ?, Ime_Partnera = ?, Prezime_Partnera = ?, Email = ?, Sifra = ?
        WHERE ID = ?
    `;

  conn.query(
    updateQuery,
    [
      Ime,
      Prezime,
      Broj_Telefona,
      Ime_Partnera,
      Prezime_Partnera,
      Email,
      Sifra,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }

      //Ako nije pronadjen UID
      if (result.affectedRows === 0) {
        return res.status(404).send("No record found with the provided ID");
      }

      console.log("Podaci su uspesno azurirani!");
      res.status(200).send("Podaci su uspesno azurirani!");
    }
  );
});

baza.delete("/mladenci/:uid", (req, res) => {
  const { uid } = req.params;

  const deleteKorisnikQuery = `
        DELETE FROM Korisnik 
        WHERE Mladenci_ID = (SELECT ID FROM Mladenci WHERE UID = ?)
    `;

  const deleteMladenciQuery = `
        DELETE FROM Mladenci 
        WHERE UID = ?
    `;

  conn.query(deleteKorisnikQuery, [uid], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    conn.query(deleteMladenciQuery, [uid], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }

      if (result.affectedRows === 0) {
        return res.status(404).send("Nije pronadjen korisnik sa datim UID-em.");
      }

      console.log("Record successfully deleted!");
      res.status(200).send("Record successfully deleted!");
    });
  });
});

baza.delete("/fotograf/:id", (req, res) => {
  const { id } = req.params;

  const deleteKorisnikQuery = `
        DELETE FROM Korisnik 
        WHERE Fotograf_ID = ?
    `;

  const deleteSlobodniTerminiQuery = `
        DELETE FROM Slobodni_Termini
        WHERE Fotograf_ID = ?
    `;

  const deletefromOceneFotograf = `
        DELETE FROM OceneFotograf
        WHERE Fotograf_ID = ?
    `;

  const deletefromLikedFotograf = `
        DELETE FROM LikedFotograf
        WHERE Fotograf_ID = ?
    `;

  const deleteFotografQuery = `
        DELETE FROM Fotograf 
        WHERE ID = ?
    `;

  conn.query(deleteKorisnikQuery, [id], (err, resultKorisnik) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error Korisnik");
    }

    conn.query(deleteSlobodniTerminiQuery, [id], (err, resultSlobodniTermini) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error Slobodni_Termini");
      }

      conn.query(deletefromOceneFotograf, [id], (err, resultOceneFotograf) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error OceneFotograf");
        }

        conn.query(deletefromLikedFotograf, [id], (err, resultLikedFotograf) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error LikedFotograf");
          }

          conn.query(deleteFotografQuery, [id], (err, resultFotograf) => {
            if (err) {
              console.error(err);
              return res.status(500).send("Internal Server Error Fotograf");
            }

            if (resultFotograf.affectedRows === 0) {
              return res.status(404).send("Nije pronadjen fotograf sa datim ID-em.");
            }

            console.log("Record successfully deleted!");
            res.status(200).send("Record successfully deleted!");
          });
        });
      });
    });
  });
});


baza.delete("/poslasticar/:id", (req, res) => {
  const { id } = req.params;

  const deleteKorisnikQuery = `
        DELETE FROM Korisnik 
        WHERE Poslasticar_ID = ?
    `;

  const deletePoslasticarQuery = `
        DELETE FROM Poslasticar 
        WHERE ID = ?
    `;

  const deletefromOcenePoslasticar = `
        DELETE FROM OcenePoslasticar
        WHERE Poslasticar_ID = ?
    `;

  const deleteTipTorteQuery = `
        DELETE FROM TIP_TORTE
        WHERE Torta_ID = ?
    `;

  const deletefromSlobodniTermini = `
        DELETE FROM Slobodni_Termini
        WHERE Poslasticar_ID = ?
    `;

  const deletefromLikedPoslasticar = `
        DELETE FROM LikedPoslasticar
        WHERE Poslasticar_ID = ?
    `;

  conn.query(deleteKorisnikQuery, [id], (err, resultKorisnik) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error Korisnik");
    }

    conn.query(deletefromSlobodniTermini, [id], (err, resultTermini) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error Slobodni_Termini");
      }

      conn.query(deletefromOcenePoslasticar, [id], (err, resultOcenePoslasticar) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error OcenePoslasticar");
        }

        conn.query(deletefromLikedPoslasticar, [id], (err, resultLikedPoslasticar) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error LikedPoslasticar");
          }

          conn.query(deleteTipTorteQuery, [id], (err) => {
            if (err) {
              console.error(err);
              return res.status(500).send("Internal Server Error TIP_TORTE");
            }

            conn.query(deletePoslasticarQuery, [id], (err, resultPoslasticar) => {
              if (err) {
                console.error(err);
                return res.status(500).send("Internal Server Error Poslasticar");
              }

              if (resultPoslasticar.affectedRows === 0) {
                return res.status(404).send("Nije pronadjen poslasticar sa datim ID-em.");
              }

              console.log("Record successfully deleted!");
              res.status(200).send("Record successfully deleted!");
            });
          });
        });
      });
    });
  });
});


// Vlastimir menjao
baza.delete("/restoran/:id", (req, res) => {
  const { id } = req.params;

  const deleteKorisnikQuery = `
        DELETE FROM Korisnik 
        WHERE Restoran_ID = ?
    `;

  const deleteSlobodniTerminiQuery = `
        DELETE FROM Slobodni_Termini
        WHERE Restoran_ID = ?
    `;

  const deletefromOceneRestoran = `
        DELETE FROM OceneRestoran
        WHERE Restoran_ID = ?
    `;

  const deleteJelovnikQuery = `
        DELETE FROM Jelovnik 
        WHERE Restoran_ID = ?
    `;

  const deletefromLikedRestoran = `
        DELETE FROM LikedRestoran
        WHERE Restoran_ID = ?
    `;

  const deleteRestoranQuery = `
        DELETE FROM Restoran 
        WHERE ID = ?
    `;

  conn.query(deleteKorisnikQuery, [id], (err, resultKorisnik) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error Korisnik");
    }

    conn.query(deleteSlobodniTerminiQuery, [id], (err, resultSlobodniTermini) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error Slobodni_Termini");
      }

      conn.query(deleteJelovnikQuery, [id], (err, resultJelovnik) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error Jelovnik");
        }

        conn.query(deletefromOceneRestoran, [id], (err, resultOceneRestoran) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error OceneRestoran");
          }

          conn.query(deletefromLikedRestoran, [id], (err, resultLikedRestoran) => {
            if (err) {
              console.error(err);
              return res.status(500).send("Internal Server Error LikedRestoran");
            }

            conn.query(deleteRestoranQuery, [id], (err, resultRestoran) => {
              if (err) {
                console.error(err);
                return res.status(500).send("Internal Server Error Restoran");
              }

              if (resultRestoran.affectedRows === 0) {
                return res.status(404).send("Nije pronadjen restoran sa datim ID-em.");
              }

              console.log("Record successfully deleted!");
              res.status(200).send("Record successfully deleted!");
            });
          });
        });
      });
    });
  });
});


baza.delete("/dekorater/:id", (req, res) => {
  const { id } = req.params;

  const deleteKorisnikQuery = `
        DELETE FROM Korisnik 
        WHERE Dekorater_ID = ?
    `;

  const deleteSlobodniTerminiQuery = `
        DELETE FROM Slobodni_Termini
        WHERE Dekorater_ID = ?
    `;

  const deletefromOceneDekoraterQuery = `
        DELETE FROM OceneDekorater
        WHERE Dekorater_ID = ?
    `;

  const deletefromLikedDekorater = `
        DELETE FROM LikedDekorater
        WHERE Dekorater_ID = ?
    `;

  const deleteDekoraterQuery = `
        DELETE FROM Dekorater 
        WHERE ID = ?
    `;

  conn.query(deleteKorisnikQuery, [id], (err, resultKorisnik) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error Korisnik");
    }

    conn.query(deleteSlobodniTerminiQuery, [id], (err, resultSlobodniTermini) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error Slobodni_Termini");
      }

      conn.query(deletefromOceneDekoraterQuery, [id], (err, resultOceneDekorater) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error OceneDekoratera");
        }

        conn.query(deletefromLikedDekorater, [id], (err, resultLikedDekorater) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error LikedDekorater");
          }

          conn.query(deleteDekoraterQuery, [id], (err, resultDekorater) => {
            if (err) {
              console.error(err);
              return res.status(500).send("Internal Server Error Dekorater");
            }

            if (resultDekorater.affectedRows === 0) {
              return res.status(404).send("Nije pronadjen dekorater sa datim ID-em.");
            }

            console.log("Record successfully deleted!");
            res.status(200).send("Record successfully deleted!");
          });
        });
      });
    });
  });
});




//CRUD metode za Poslasticara
//post

baza.post("/poslasticar", (req, res) => {
  const {
    Ime,
    Prezime,
    Kratak_Opis,
    Email,
    Sifra,
    Datum_Osnivanja,
    Cena_Posiljke,
    Lokacija,
    Broj_Telefona,
    UID,
    SlobodniTermini,
    TIP_TORTE,
  } = req.body;
  var poslasticar_id;
  conn.query(
    "INSERT INTO Poslasticar (Ime, Prezime, Kratak_Opis, Email, Sifra, Datum_Osnivanja, Cena_Posiljke, Lokacija, Broj_Telefona, UID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      Ime,
      Prezime,
      Kratak_Opis,
      Email,
      Sifra,
      Datum_Osnivanja,
      Cena_Posiljke,
      Lokacija,
      Broj_Telefona,
      UID,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }
      poslasticar_id = result.insertId;
      conn.query(
        "INSERT INTO Korisnik (UID, TIP, Poslasticar_ID) VALUES (?, ?, ?)",
        [UID, "Poslasticar", poslasticar_id],
        (err) => {
          if (err) {
            console.log("Nije uspela nazalost.");
            console.error(err);
            res.status(500).send("Internal Server Error");
            return;
          }
          if (SlobodniTermini && SlobodniTermini.length > 0) {
            const terminiValues = SlobodniTermini.map((termin) => [
              termin,
              poslasticar_id,
            ]);
            conn.query(
              "INSERT INTO Slobodni_Termini (Slobodan_Termin, Poslasticar_ID) VALUES ?",
              [terminiValues],
              (err) => {
                if (err) {
                  console.error(err);
                  res.status(500).send("Internal Server Error");
                  return;
                }
                if (TIP_TORTE && TIP_TORTE.length > 0) {
                  const tipoviValues = TIP_TORTE.map((torta) => [
                    torta.Naziv,
                    torta.Tip_Slaga,
                    torta.Fondan,
                    torta.Tema,
                    torta.Cena,
                    torta.Posno,
                    torta.Kratak_Opis,
                    poslasticar_id,
                  ]);
                  conn.query(
                    "INSERT INTO TIP_TORTE (Naziv, Tip_Slaga, Fondan, Tema, Cena, Posno, Kratak_Opis, Torta_ID) VALUES ?",
                    [tipoviValues],
                    (err) => {
                      if (err) {
                        console.error(err);
                        res.status(500).send("Internal Server Error");
                        return;
                      }
                      console.log("Podaci su uspesno ubaceni.");
                      res.status(200).send("Podaci su uspesno ubaceni.");
                    }
                  );
                } else {
                  res.status(200).send("Podaci su uspesno ubaceni.");
                }
              }
            );
          } else {
            res.status(200).send("Podaci su uspešno ubačeni.");
          }
        }
      );
      console.log("Podaci su uspesno ubaceni!");
    }
  );
  console.log("Sve je zavrseno.");
});

//get
baza.get("/poslasticar", (req, res) => {
  const query = `
        SELECT 
            Poslasticar.ID AS PoslasticarID,
            Poslasticar.Ime,
            Poslasticar.Prezime,
            Poslasticar.Kratak_Opis,
            Poslasticar.Email,
            Poslasticar.Datum_Osnivanja,
            Poslasticar.Cena_Posiljke,
            Poslasticar.Lokacija,
            Poslasticar.Ocena,
            Poslasticar.Broj_Telefona,
            ST.Slobodan_Termin AS SlobodanTermin,
            ST.ID AS SlobodanTerminID,
            TT.ID AS TortaID,
            TT.Naziv AS TortaNaziv,
            TT.Tip_Slaga AS TortaTipSlaga,
            TT.Fondan AS TortaFondan,
            TT.Tema AS TortaTema,
            TT.Cena AS TortaCena,
            TT.Posno AS TortaPosno,
            TT.Kratak_Opis AS TortaKratakOpis
        FROM Poslasticar
        LEFT JOIN Slobodni_Termini AS ST ON Poslasticar.ID = ST.Poslasticar_ID
        LEFT JOIN TIP_TORTE AS TT ON Poslasticar.ID = TT.Torta_ID
    `;

  conn.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    const poslasticari = {};
    result.forEach((row) => {
      // Validate the necessary attributes
      if (
        row.PoslasticarID &&
        row.Ime &&
        row.Prezime &&
        row.Email &&
        row.Cena_Posiljke &&
        row.Lokacija &&
        row.Datum_Osnivanja
      ) {
        if (!poslasticari[row.PoslasticarID]) {
          poslasticari[row.PoslasticarID] = {
            ID: row.PoslasticarID,
            Ime: row.Ime,
            Prezime: row.Prezime,
            Kratak_Opis: row.Kratak_Opis,
            Email: row.Email,
            Datum_Osnivanja: row.Datum_Osnivanja,
            Cena_Posiljke: row.Cena_Posiljke,
            Lokacija: row.Lokacija,
            Broj_Telefona: row.Broj_Telefona,
            Ocena: row.Ocena,
            Slobodni_Termini: [],
            Torte: [],
          };
        }
        // Validate Slobodni_Termini before adding
        if (row.SlobodanTerminID && row.SlobodanTermin) {
          poslasticari[row.PoslasticarID].Slobodni_Termini.push({
            Slobodan_Termin: row.SlobodanTermin,
            ID: row.SlobodanTerminID,
          });
        }
        // Validate Torte before adding
        if (
          row.TortaID &&
          row.TortaNaziv &&
          row.TortaTipSlaga &&
          row.TortaFondan &&
          row.TortaTema &&
          row.TortaCena &&
          row.TortaPosno &&
          row.TortaKratakOpis
        ) {
          poslasticari[row.PoslasticarID].Torte.push({
            Naziv: row.TortaNaziv,
            Tip_Slaga: row.TortaTipSlaga,
            Fondan: row.TortaFondan,
            Tema: row.TortaTema,
            Cena: row.TortaCena,
            Posno: row.TortaPosno,
            Kratak_Opis: row.TortaKratakOpis,
            ID: row.TortaID,
          });
        }
      }
    });

    const poslasticariList = Object.values(poslasticari);
    res.json(poslasticariList);
  });
});

// baza.get('/poslasticar', (req, res) => {
//     conn.query('SELECT * FROM Poslasticar', (err, result) => {
//         if (err) throw new Error(err);
//         res.json(result);
//         // console.log(result);
//         // res.end();
//     })
// });

baza.get("/poslasticar/prekouid/:uid", (req, res) => {
  const { uid } = req.params;

  const query = `
        SELECT 
            P.ID AS PoslasticarID,
            P.Ime,
            P.Prezime,
            P.Kratak_Opis,
            P.Email,
            P.Datum_Osnivanja,
            P.Cena_Posiljke,
            P.Lokacija,
            P.Broj_Telefona,
            P.Ocena,
            ST.Slobodan_Termin AS SlobodanTermin,
            TT.ID,
            TT.Naziv AS TortaNaziv,
            TT.Tip_Slaga AS TortaTipSlaga,
            TT.Fondan AS TortaFondan,
            TT.Tema AS TortaTema,
            TT.Cena AS TortaCena,
            TT.Posno AS TortaPosno,
            TT.Kratak_Opis AS TortaKratakOpis
        FROM Poslasticar AS P
        LEFT JOIN Korisnik AS K ON P.ID = K.Poslasticar_ID
        LEFT JOIN Slobodni_Termini AS ST ON P.ID = ST.Poslasticar_ID
        LEFT JOIN TIP_TORTE AS TT ON P.ID = TT.Torta_ID
        WHERE P.UID = ?
    `;

  conn.query(query, [uid], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (result.length === 0) {
      return res.status(404).send("No data found for the provided UID");
    }

    const poslasticarData = {
      PoslasticarID: result[0].PoslasticarID,
      Ime: result[0].Ime,
      Prezime: result[0].Prezime,
      Kratak_Opis: result[0].Kratak_Opis,
      Email: result[0].Email,
      Datum_Osnivanja: result[0].Datum_Osnivanja,
      Cena_Posiljke: result[0].Cena_Posiljke,
      Lokacija: result[0].Lokacija,
      Broj_Telefona: result[0].Broj_Telefona,
      Ocena: result[0].Ocena,
      SlobodniTermini: result
        .map((row) => row.SlobodanTermin)
        .filter((term) => term !== null),
      Torte: result
        .map((row) => ({
          ID: row.ID,
          Naziv: row.TortaNaziv,
          Tip_Slaga: row.TortaTipSlaga,
          Fondan: row.TortaFondan,
          Tema: row.TortaTema,
          Cena: row.TortaCena,
          Posno: row.TortaPosno,
          Kratak_Opis: row.TortaKratakOpis,
        }))
        .filter((torta) => torta.Naziv !== null),
    };

    res.json(poslasticarData);
  });
});

baza.get("/poslasticar/prekouida/:uid", (req, res) => {
  const { uid } = req.params;

  const query = `
        SELECT 
            P.ID AS PoslasticarID,
            P.Ime,
            P.Prezime,
            P.Kratak_Opis,
            P.Email,
            P.Datum_Osnivanja,
            P.Cena_Posiljke,
            P.Lokacija,
            P.Broj_Telefona,
            P.Ocena,
            ST.ID AS TerminID,
            ST.Slobodan_Termin AS SlobodanTermin,
            TT.ID AS TortaID,
            TT.Naziv AS TortaNaziv,
            TT.Tip_Slaga AS TortaTipSlaga,
            TT.Fondan AS TortaFondan,
            TT.Tema AS TortaTema,
            TT.Cena AS TortaCena,
            TT.Posno AS TortaPosno,
            TT.Kratak_Opis AS TortaKratakOpis
        FROM Poslasticar AS P
        LEFT JOIN Korisnik AS K ON P.ID = K.Poslasticar_ID
        LEFT JOIN Slobodni_Termini AS ST ON P.ID = ST.Poslasticar_ID
        LEFT JOIN TIP_TORTE AS TT ON P.ID = TT.Torta_ID
        WHERE P.UID = ?
    `;

  conn.query(query, [uid], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (result.length === 0) {
      return res.status(404).send("No data found for the provided UID");
    }

    const poslasticarData = {
      PoslasticarID: result[0].PoslasticarID,
      Ime: result[0].Ime,
      Prezime: result[0].Prezime,
      Kratak_Opis: result[0].Kratak_Opis,
      Email: result[0].Email,
      Datum_Osnivanja: result[0].Datum_Osnivanja,
      Cena_Posiljke: result[0].Cena_Posiljke,
      Lokacija: result[0].Lokacija,
      Broj_Telefona: result[0].Broj_Telefona,
      Ocena: result[0].Ocena,
      SlobodniTermini: new Set(),
      Torte: new Map()
    };

    const terminMap = new Map();

    result.forEach(row => {
      if (row.TerminID !== null) {
        terminMap.set(row.TerminID, row.SlobodanTermin);
        poslasticarData.SlobodniTermini.add(row.TerminID);
      }

      if (row.TortaNaziv !== null) {
        if (!poslasticarData.Torte.has(row.TortaID)) {
          poslasticarData.Torte.set(row.TortaID, {
            ID: row.TortaID,
            Naziv: row.TortaNaziv,
            Tip_Slaga: row.TortaTipSlaga,
            Fondan: row.TortaFondan,
            Tema: row.TortaTema,
            Cena: row.TortaCena,
            Posno: row.TortaPosno,
            Kratak_Opis: row.TortaKratakOpis,
          });
        }
      }
    });

    poslasticarData.SlobodniTermini = Array.from(poslasticarData.SlobodniTermini).map(id => terminMap.get(id));
    poslasticarData.Torte = Array.from(poslasticarData.Torte.values());

    res.json(poslasticarData);
  });
});





//radi
baza.get("/poslasticar/prekoid/:id", (req, res) => {
  const { id } = req.params;

  const query = `
        SELECT 
            Poslasticar.ID AS PoslasticarID,
            Poslasticar.Ime,
            Poslasticar.Prezime,
            Poslasticar.Kratak_Opis,
            Poslasticar.Email,
            Poslasticar.Datum_Osnivanja,
            Poslasticar.Cena_Posiljke,
            Poslasticar.Lokacija,
            Poslasticar.Broj_Telefona,
            Poslasticar.Ocena,
            Slobodni_Termini.ID AS TerminID,
            Slobodni_Termini.Slobodan_Termin,
            TT.ID AS TortaID,
            TT.Naziv AS TortaNaziv,
            TT.Tip_Slaga AS TortaTipSlaga,
            TT.Fondan AS TortaFondan,
            TT.Tema AS TortaTema,
            TT.Cena AS TortaCena,
            TT.Posno AS TortaPosno,
            TT.Kratak_Opis AS TortaKratakOpis
        FROM Poslasticar 
        LEFT JOIN Slobodni_Termini ON Poslasticar.ID = Slobodni_Termini.Poslasticar_ID
        LEFT JOIN TIP_TORTE AS TT ON Poslasticar.ID = TT.Torta_ID
        WHERE Poslasticar.ID = ?
    `;

  conn.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (result.length === 0) {
      return res.status(404).send("No data found for the provided ID");
    }

    const poslasticari = {};
    result.forEach((row) => {
      if (!poslasticari[row.PoslasticarID]) {
        poslasticari[row.PoslasticarID] = {
          PoslasticarID: id,
          Ime: row.Ime,
          Prezime: row.Prezime,
          Kratak_Opis: row.Kratak_Opis,
          Email: row.Email,
          Datum_Osnivanja: row.Datum_Osnivanja,
          Cena_Posiljke: row.Cena_Posiljke,
          Lokacija: row.Lokacija,
          Broj_Telefona: row.Broj_Telefona,
          Ocena: row.Ocena,
          Slobodni_Termini: [],
          Torte: [],
          addedTerminIDs: new Set(),
          addedTortaIDs: new Set(),
        };
      }

      if (
        row.TerminID &&
        !poslasticari[row.PoslasticarID].addedTerminIDs.has(row.TerminID)
      ) {
        poslasticari[row.PoslasticarID].Slobodni_Termini.push({
          ID: row.TerminID,
          Slobodan_Termin: row.Slobodan_Termin,
        });
        poslasticari[row.PoslasticarID].addedTerminIDs.add(row.TerminID);
      }

      if (
        row.TortaID &&
        !poslasticari[row.PoslasticarID].addedTortaIDs.has(row.TortaID)
      ) {
        poslasticari[row.PoslasticarID].Torte.push({
          TortaID: row.TortaID,
          Naziv: row.TortaNaziv,
          Tip_Slaga: row.TortaTipSlaga,
          Fondan: row.TortaFondan,
          Tema: row.TortaTema,
          Cena: row.TortaCena,
          Posno: row.TortaPosno,
          Kratak_Opis: row.TortaKratakOpis,
        });
        poslasticari[row.PoslasticarID].addedTortaIDs.add(row.TortaID);
      }
    });

    const poslasticariList = Object.values(poslasticari).map((poslasticar) => {
      const { addedTerminIDs, addedTortaIDs, ...rest } = poslasticar;
      return rest;
    });

    res.json(poslasticariList);
  });
});

// baza.get('/poslasticar/:uid', (req, res) => {
//     const {uid} = req.params

//     const selectquery = `
//         SELECT * FROM Poslasticar
//         WHERE UID = ?
//     `
//     conn.query(selectquery, [uid], (err, result) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).send('Internal Server Error');
//         }

//         if (result.length === 0) {
//             return res.status(404).send('Ne postoji podatak u tabeli sa trazenim UID-em');
//         }

//         console.log('Uspesno su vraceni podaci!');
//         console.log(result);
//         res.status(200).json(result[0]);

//         //res.json(result);
//         // console.log(result);
//         // res.end();
//     })
// });

//put





//Vlastimirova metoda ne cackaj
baza.put("/poslasticar/admin/:id", (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  const {
    Ime,
    Prezime,
    Kratak_Opis,
    Email,
    Datum_Osnivanja,
    Cena_Posiljke,
    Lokacija,
    Ocena,
  
  } = updateFields;

  const setFields = [];
  const setValues = [];

  if (Email) {
    setFields.push("Email = ?");
    setValues.push(Email);
  }

  if (Ocena) {
    setFields.push("Ocena = ?");
    setValues.push(Ocena);
  }

  if (Ime) {
    setFields.push("Ime = ?");
    setValues.push(Ime);
  }
  if (Prezime) {
    setFields.push("Prezime = ?");
    setValues.push(Prezime);
  }
  if (Kratak_Opis) {
    setFields.push("Kratak_Opis = ?");
    setValues.push(Kratak_Opis);
  }
  if (Datum_Osnivanja) {
    setFields.push("Datum_Osnivanja = ?");
    setValues.push(Datum_Osnivanja);
  }
  if (Cena_Posiljke) {
    setFields.push("Cena_Posiljke = ?");
    setValues.push(Cena_Posiljke);
  }
  if (Lokacija) {
    setFields.push("Lokacija = ?");
    setValues.push(Lokacija);
  }
 

  if (setFields.length === 0) {
    return res.status(400).send("No fields provided for update");
  }

  const updateQuery = `
        UPDATE Poslasticar 
        SET ${setFields.join(", ")}
        WHERE ID = ?
    `;

  setValues.push(id);

  conn.query(updateQuery, setValues, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("No record found with the provided ID");
    }

    console.log("Podaci su uspešno promenjeni.");
    return res.status(200).send("Podaci su uspešno promenjeni.");
  });
});





baza.put("/poslasticar/prekoid/:id", (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  const {
    Ime,
    Prezime,
    Kratak_Opis,
    Datum_Osnivanja,
    Cena_Posiljke,
    Lokacija,
    Broj_Telefona,
  } = updateFields;

  const setFields = [];
  const setValues = [];

  if (Ime) {
    setFields.push("Ime = ?");
    setValues.push(Ime);
  }
  if (Prezime) {
    setFields.push("Prezime = ?");
    setValues.push(Prezime);
  }
  if (Kratak_Opis) {
    setFields.push("Kratak_Opis = ?");
    setValues.push(Kratak_Opis);
  }
  if (Datum_Osnivanja) {
    setFields.push("Datum_Osnivanja = ?");
    setValues.push(Datum_Osnivanja);
  }
  if (Cena_Posiljke) {
    setFields.push("Cena_Posiljke = ?");
    setValues.push(Cena_Posiljke);
  }
  if (Lokacija) {
    setFields.push("Lokacija = ?");
    setValues.push(Lokacija);
  }
  if (Broj_Telefona) {
    setFields.push("Broj_Telefona = ?");
    setValues.push(Broj_Telefona);
  }

  if (setFields.length === 0) {
    return res.status(400).send("No fields provided for update");
  }

  const updateQuery = `
        UPDATE Poslasticar 
        SET ${setFields.join(", ")}
        WHERE ID = ?
    `;

  setValues.push(id);

  conn.query(updateQuery, setValues, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("No record found with the provided ID");
    }

    console.log("Podaci su uspešno promenjeni.");
    return res.status(200).send("Podaci su uspešno promenjeni.");
  });
});


baza.put("/poslasticar/prekouid/:uid", (req, res) => {
  const { uid } = req.params;
  const updateFields = req.body;

  const {
    Ime,
    Prezime,
    Kratak_Opis,
    Datum_Osnivanja,
    Cena_Posiljke,
    Lokacija,
    Broj_Telefona,
  } = updateFields;

  const setFields = [];
  const setValues = [];

  if (Ime) {
    setFields.push("Ime = ?");
    setValues.push(Ime);
  }
  if (Prezime) {
    setFields.push("Prezime = ?");
    setValues.push(Prezime);
  }
  if (Kratak_Opis) {
    setFields.push("Kratak_Opis = ?");
    setValues.push(Kratak_Opis);
  }
  if (Datum_Osnivanja) {
    setFields.push("Datum_Osnivanja = ?");
    setValues.push(Datum_Osnivanja);
  }
  if (Cena_Posiljke) {
    setFields.push("Cena_Posiljke = ?");
    setValues.push(Cena_Posiljke);
  }
  if (Lokacija) {
    setFields.push("Lokacija = ?");
    setValues.push(Lokacija);
  }
  if (Broj_Telefona) {
    setFields.push("Broj_Telefona = ?");
    setValues.push(Broj_Telefona);
  }

  if (setFields.length === 0) {
    return res.status(400).send("No fields provided for update");
  }

  const updateQuery = `
        UPDATE Poslasticar 
        SET ${setFields.join(", ")}
        WHERE UID = ?
    `;

  setValues.push(uid);

  conn.query(updateQuery, setValues, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("No record found with the provided UID");
    }

    console.log("Podaci su uspešno promenjeni.");
    return res.status(200).send("Podaci su uspešno promenjeni.");
  });
});


//delete
baza.delete("/poslasticar/:uid", (req, res) => {
  const { uid } = req.params;

  const getPoslasticarIdQuery = `
        SELECT ID FROM Poslasticar WHERE UID = ?
    `;

  const deleteKorisnikQuery = `
        DELETE FROM Korisnik 
        WHERE Poslasticar_ID = ?
    `;

  const deleteSlobodniTerminiQuery = `
        DELETE FROM Slobodni_Termini
        WHERE Poslasticar_ID = ?
    `;

  const deletefromOcenePoslasticar = `
        DELETE FROM OcenePoslasticar
        WHERE Poslasticar_ID = ?
    `;

  const deleteTipTorteQuery = `
        DELETE FROM TIP_TORTE
        WHERE Torta_ID = ?
    `;

  const deletePoslasticarQuery = `
        DELETE FROM Poslasticar 
        WHERE UID = ?
    `;

  conn.query(getPoslasticarIdQuery, [uid], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (result.length === 0) {
      return res.status(404).send("No record found with the provided UID");
    }

    const poslasticarId = result[0].ID;

    conn.query(deleteKorisnikQuery, [poslasticarId], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }

      conn.query(deleteSlobodniTerminiQuery, [poslasticarId], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error");
        }

        conn.query(deleteTipTorteQuery, [poslasticarId], (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
          }

          conn.query(
            deletefromOcenePoslasticar,
            [poslasticarId],
            (err, resultOcenePoslasticar) => {
              if (err) {
                console.error(err);
                return res
                  .status(500)
                  .send("Internal Server Error OcenePoslasticar");
              }

              conn.query(
                deletePoslasticarQuery,
                [poslasticarId],
                (err, resultPoslasticar) => {
                  if (err) {
                    console.error(err);
                    return res
                      .status(500)
                      .send("Internal Server Error Poslasticar");
                  }

                  if (resultPoslasticar.affectedRows === 0) {
                    return res
                      .status(404)
                      .send("Nije pronadjen poslasticar sa datim ID-em.");
                  }

                  console.log("Record successfully deleted!");
                  res.status(200).send("Record successfully deleted!");
                }
              );
            }
          );
        });
      });
    });
  });
});



//CRUD za Restoran
//post RADI

baza.post("/restoran", (req, res) => {
  const {
    Naziv,
    Kratak_Opis,
    Email,
    Sifra,
    Cena,
    Lokacija,
    Datum_Osnivanja,
    Sigurnosni_Kod,
    RestoranPraviTortu,
    Bend,
    Broj_Telefona,
    UID,
    Slobodni_Termini,
    Jelovnik,
  } = req.body;

  const insertRestoranQuery = `
        INSERT INTO Restoran (Naziv, Kratak_Opis, Email, Sifra, Cena, Lokacija, Datum_Osnivanja, Sigurnosni_Kod, RestoranPraviTortu, Bend,  Broj_Telefona, UID)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

  const insertKorisnik = `
        INSERT INTO Korisnik (UID, TIP, Restoran_ID)
        VALUES (?, ?, ?)
    `;

  const restoranValues = [
    Naziv,
    Kratak_Opis,
    Email,
    Sifra,
    Cena,
    Lokacija,
    Datum_Osnivanja,
    Sigurnosni_Kod,
    RestoranPraviTortu,
    Bend,
    Broj_Telefona,
    UID,
  ];

  conn.query(insertRestoranQuery, restoranValues, (err, result) => {
    if (err) {
      console.error("Error inserting Restoran:", err);
      return res.status(500).send("Internal Server Error");
    }

    const restoranID = result.insertId;

    conn.query(insertKorisnik, [UID, "Restoran", restoranID], (err) => {
      if (err) {
        console.log("Nije uspela nazalost.");
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      if (Slobodni_Termini && Slobodni_Termini.length > 0) {
        const terminiValues = Slobodni_Termini.map((termin) => [
          termin,
          restoranID,
        ]);
        const insertTerminiQuery =
          "INSERT INTO Slobodni_Termini (Slobodan_Termin, Restoran_ID) VALUES ?";
        conn.query(insertTerminiQuery, [terminiValues], (err) => {
          if (err) {
            console.error("Error inserting Slobodni_Termini:", err);
            return res.status(500).send("Internal Server Error");
          }
        });
      }

      if (Jelovnik && Jelovnik.length > 0) {
        Jelovnik.forEach((jelovnik) => {
          const insertJelovnikQuery = `
                        INSERT INTO Jelovnik (Naziv, Cena, TIP, Kolicina, Restoran_ID)
                        VALUES (?, ?, ?, ?, ?)
                    `;
          const jelovnikValues = [
            jelovnik.ImeJela,
            jelovnik.Cena,
            jelovnik.TIP,
            jelovnik.Kolicina,
            restoranID,
          ];
          conn.query(insertJelovnikQuery, jelovnikValues, (err, result) => {
            if (err) {
              console.error("Error inserting Jelovnik:", err);
              return res.status(500).send("Internal Server Error");
            }
          });
        });
      }
    });
    res.status(201).send("Restoran uspesno kreiran.");
  });
});



//get menjam da ima validaciju kad Andrija napravi da izgleda kako treba

baza.get("/restoran", (req, res) => {
  const query = `
        SELECT 
            Restoran.ID AS RestoranID,
            Restoran.Naziv AS RestoranNaziv,
            Restoran.Kratak_Opis AS RestoranKratakOpis,
            Restoran.Email,
            Restoran.Cena AS RestoranCena,
            Restoran.Lokacija,
            Restoran.Datum_Osnivanja,
            Restoran.Sigurnosni_Kod,
            Restoran.RestoranPraviTortu,
            Restoran.Bend,
            Restoran.Ocena,
            Restoran.Broj_Telefona,
            Slobodni_Termini.ID AS TerminID,
            Slobodni_Termini.Slobodan_Termin,
            Jelovnik.ID AS JelovnikID,
            Jelovnik.ImeJela,
            Jelovnik.Cena,
            Jelovnik.TIP,
            Jelovnik.Kolicina
        FROM Restoran
        LEFT JOIN Slobodni_Termini ON Restoran.ID = Slobodni_Termini.Restoran_ID
        LEFT JOIN Jelovnik ON Restoran.ID = Jelovnik.Restoran_ID
    `;

  conn.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const restorani = {};
    result.forEach((row) => {
      if (!restorani[row.RestoranID]) {
        restorani[row.RestoranID] = {
          ID: row.RestoranID,
          Naziv: row.RestoranNaziv,
          Kratak_Opis: row.RestoranKratakOpis,
          Email: row.Email,
          Cena: row.RestoranCena,
          Lokacija: row.Lokacija,
          Datum_Osnivanja: row.Datum_Osnivanja,
          SigurnosniKod: row.Sigurnosni_Kod,
          RestoranPraviTortu: row.RestoranPraviTortu,
          Bend: row.Bend,
          Ocena: row.Ocena,
          Broj_Telefona: row.Broj_Telefona,
          Slobodni_Termini: [],
          Jelovnik: [],
        };
      }

      if (row.TerminID) {
        restorani[row.RestoranID].Slobodni_Termini.push({
          Slobodan_Termin: row.Slobodan_Termin,
          ID: row.TerminID,
        });
      }

      if (row.JelovnikID) {
        if (!restorani[row.RestoranID].Jelovnik[row.JelovnikID]) {
          restorani[row.RestoranID].Jelovnik[row.JelovnikID] = {
            ID: row.JelovnikID,
            ImeJela: row.ImeJela,
            Cena: row.Cena,
            TIP: row.TIP,
            Kolicina: row.Kolicina,
          };
        }
      }
    });

    const restoraniList = Object.values(restorani).map((restoran) => ({
      ...restoran,
      Jelovnik: Object.values(restoran.Jelovnik),
    }));

    res.json(restoraniList);
  });
});

//get sa uid za restoran
baza.get("/restoran/prekouid/:uid", (req, res) => {
  const { uid } = req.params;
  const query = `
        SELECT 
            Restoran.ID AS RestoranID,
            Restoran.Naziv AS RestoranNaziv,
            Restoran.Kratak_Opis AS RestoranKratakOpis,
            Restoran.Email,
            Restoran.Cena AS RestoranCena,
            Restoran.Lokacija,
            Restoran.Datum_Osnivanja,
            Restoran.Sigurnosni_Kod,
            Restoran.RestoranPraviTortu,
            Restoran.Bend,
            Restoran.Ocena,
            Restoran.Broj_Telefona,
            Slobodni_Termini.ID AS TerminID,
            Slobodni_Termini.Slobodan_Termin,
            Jelovnik.ID AS JelovnikID,
            Jelovnik.ImeJela,
            Jelovnik.Cena,
            Jelovnik.TIP,
            Jelovnik.Kolicina
        FROM Restoran
        LEFT JOIN Slobodni_Termini ON Restoran.ID = Slobodni_Termini.Restoran_ID
        LEFT JOIN Jelovnik ON Restoran.ID = Jelovnik.Restoran_ID
        WHERE Restoran.UID = ?
    `;

  conn.query(query, [uid], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const restorani = {};
    result.forEach((row) => {
      if (!restorani[row.RestoranID]) {
        restorani[row.RestoranID] = {
          ID: row.RestoranID,
          Naziv: row.RestoranNaziv,
          Kratak_Opis: row.RestoranKratakOpis,
          Email: row.Email,
          Cena: row.RestoranCena,
          Lokacija: row.Lokacija,
          Datum_Osnivanja: row.Datum_Osnivanja,
          SigurnosniKod: row.Sigurnosni_Kod,
          RestoranPraviTortu: row.RestoranPraviTortu,
          Bend: row.Bend,
          Ocena: row.Ocena,
          Broj_Telefona: row.Broj_Telefona,
          Slobodni_Termini: [],
          Jelovnik: [],
        };
      }

      if (row.TerminID) {
        restorani[row.RestoranID].Slobodni_Termini.push({
          Slobodan_Termin: row.Slobodan_Termin,
          ID: row.TerminID,
        });
      }

      if (row.JelovnikID) {
        if (!restorani[row.RestoranID].Jelovnik[row.JelovnikID]) {
          restorani[row.RestoranID].Jelovnik[row.JelovnikID] = {
            ID: row.JelovnikID,
            ImeJela: row.ImeJela,
            Cena: row.Cena,
            TIP: row.TIP,
            Kolicina: row.Kolicina,
          };
        }
      }
    });

    const restoraniList = Object.values(restorani).map((restoran) => ({
      ...restoran,
      Jelovnik: Object.values(restoran.Jelovnik),
    }));

    res.json(restoraniList);
  });
});

//radi
baza.get("/restoran/prekoid/:id", (req, res) => {
  const { id } = req.params;
  const query = `
        SELECT 
            Restoran.ID AS RestoranID,
            Restoran.Naziv AS RestoranNaziv,
            Restoran.Kratak_Opis AS RestoranKratakOpis,
            Restoran.Email,
            Restoran.Cena AS RestoranCena,
            Restoran.Lokacija,
            Restoran.Datum_Osnivanja,
            Restoran.Sigurnosni_Kod,
            Restoran.RestoranPraviTortu,
            Restoran.Bend,
            Restoran.Ocena,
            Restoran.Broj_Telefona,
            Slobodni_Termini.ID AS TerminID,
            Slobodni_Termini.Slobodan_Termin,
            Jelovnik.ID AS JelovnikID,
            Jelovnik.ImeJela,
            Jelovnik.Cena,
            Jelovnik.TIP,
            Jelovnik.Kolicina
        FROM Restoran
        LEFT JOIN Slobodni_Termini ON Restoran.ID = Slobodni_Termini.Restoran_ID
        LEFT JOIN Jelovnik ON Restoran.ID = Jelovnik.Restoran_ID
        WHERE Restoran.ID = ?
    `;

  conn.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const restorani = {};
    result.forEach((row) => {
      if (!restorani[row.RestoranID]) {
        restorani[row.RestoranID] = {
          ID: row.RestoranID,
          Naziv: row.RestoranNaziv,
          Kratak_Opis: row.RestoranKratakOpis,
          Email: row.Email,
          Cena: row.RestoranCena,
          Lokacija: row.Lokacija,
          Datum_Osnivanja: row.Datum_Osnivanja,
          SigurnosniKod: row.Sigurnosni_Kod,
          RestoranPraviTortu: row.RestoranPraviTortu,
          Bend: row.Bend,
          Ocena: row.Ocena,
          Broj_Telefona: row.Broj_Telefona,
          Slobodni_Termini: [],
          Jelovnik: [],
          addedTerminIDs: new Set(),
          addedJelovnikIDs: new Set(),
        };
      }

      if (
        row.TerminID &&
        !restorani[row.RestoranID].addedTerminIDs.has(row.TerminID)
      ) {
        restorani[row.RestoranID].Slobodni_Termini.push({
          ID: row.TerminID,
          Slobodan_Termin: row.Slobodan_Termin,
        });
        restorani[row.RestoranID].addedTerminIDs.add(row.TerminID);
      }

      if (
        row.JelovnikID && 
        !restorani[row.RestoranID].addedJelovnikIDs.has(row.JelovnikID)) {
        {
            restorani[row.RestoranID].Jelovnik.push({
                ID: row.JelovnikID,
                ImeJela: row.ImeJela,
                Cena: row.Cena,
                TIP: row.TIP,
                Kolicina: row.Kolicina,
            });
            restorani[row.RestoranID].addedJelovnikIDs.add(row.JelovnikID);
        }
      }
    });

    const restoraniList = Object.values(restorani).map((restoran) => {
        const { addedTerminIDs, addedJelovnikIDs, ...rest } = restoran;
        return rest;
      });

    // const restoraniList = Object.values(restorani).map((restoran) => ({
    //   ...restoran,
    //   Jelovnik: Object.values(restoran.Jelovnik),
    //   Slobodni_Termini: Object.values(restoran.Slobodni_Termini),
    // }));

    res.json(restoraniList);
  });
});

//VLASTIMIROVA METODA
baza.put("/restoran/prekoid/:id", (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  const {
    Naziv,
    Kratak_Opis,
    Email,
    Lokacija,
    Cena,
    Datum_Osnivanja,
    RestoranPraviTortu,
    Bend,
    Broj_Telefona,
    Ocena,
  } = updateFields;

  const setFields = [];
  const setValues = [];
  if (Ocena){
    setFields.push("Ocena = ?");
    setValues.push(Ocena);
  }
  if (Naziv) {
    setFields.push("Naziv = ?");
    setValues.push(Naziv);
  }
  if (Kratak_Opis) {
    setFields.push("Kratak_Opis = ?");
    setValues.push(Kratak_Opis);
  }
  if (Email) {
    setFields.push("Email = ?");
    setValues.push(Email);
  }
  if (Lokacija) {
    setFields.push("Lokacija = ?");
    setValues.push(Lokacija);
  }
  if (Cena) {
    setFields.push("Cena = ?");
    setValues.push(Cena);
  }
  if (Datum_Osnivanja) {
    setFields.push("Datum_Osnivanja = ?");
    setValues.push(Datum_Osnivanja);
  }
  if (RestoranPraviTortu) {
    setFields.push("RestoranPraviTortu = ?");
    setValues.push(RestoranPraviTortu);
  }
  if (Bend) {
    setFields.push("Bend = ?");
    setValues.push(Bend);
  }
  if (Broj_Telefona) {
    setFields.push("Broj_Telefona = ?");
    setValues.push(Broj_Telefona);
  }

  if (setFields.length === 0) {
    return res.status(400).send("No fields provided for update");
  }

  const updateQuery = `
        UPDATE Restoran 
        SET ${setFields.join(", ")}
        WHERE ID = ?
    `;

  setValues.push(id);

  conn.query(updateQuery, setValues, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("No record found with the provided ID");
    }

    console.log("Podaci su uspešno promenjeni.");
    return res.status(200).send("Podaci su uspešno promenjeni.");
  });
});

baza.put("/restoran/prekouid/:uid", (req, res) => {
  const { uid } = req.params;
  const updateFields = req.body;

  const {
    Naziv,
    Kratak_Opis,
    Email,
    Lokacija,
    Cena,
    Datum_Osnivanja,
    RestoranPraviTortu,
    Bend,
    Broj_Telefona,
  } = updateFields;

  const setFields = [];
  const setValues = [];

  if (Naziv) {
    setFields.push("Naziv = ?");
    setValues.push(Naziv);
  }
  if (Kratak_Opis) {
    setFields.push("Kratak_Opis = ?");
    setValues.push(Kratak_Opis);
  }
  if (Email) {
    setFields.push("Email = ?");
    setValues.push(Email);
  }
  if (Lokacija) {
    setFields.push("Lokacija = ?");
    setValues.push(Lokacija);
  }
  if (Cena) {
    setFields.push("Cena = ?");
    setValues.push(Cena);
  }
  if (Datum_Osnivanja) {
    setFields.push("Datum_Osnivanja = ?");
    setValues.push(Datum_Osnivanja);
  }
  if (RestoranPraviTortu) {
    setFields.push("RestoranPraviTortu = ?");
    setValues.push(RestoranPraviTortu);
  }
  if (Bend) {
    setFields.push("Bend = ?");
    setValues.push(Bend);
  }
  if (Broj_Telefona) {
    setFields.push("Broj_Telefona = ?");
    setValues.push(Broj_Telefona);
  }

  if (setFields.length === 0) {
    return res.status(400).send("No fields provided for update");
  }

  const updateQuery = `
        UPDATE Restoran 
        SET ${setFields.join(", ")}
        WHERE UID = ?
    `;

  setValues.push(uid);

  conn.query(updateQuery, setValues, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("No record found with the provided UID");
    }

    console.log("Podaci su uspešno promenjeni.");
    return res.status(200).send("Podaci su uspešno promenjeni.");
  });
});



baza.delete("/restoran/:uid", (req, res) => {
  const { uid } = req.params;

  const getRestoranID = `
        SELECT ID FROM Restoran
        WHERE UID = ?
    `;

  const deleteKorisnikQuery = `
        DELETE FROM Korisnik 
        WHERE Restoran_ID = ?
    `;

  const deleteSlobodniTerminiQuery = `
        DELETE FROM Slobodni_Termini
        WHERE Restoran_ID = ?
    `;

  const deletefromOceneRestoranaQuery = `
        DELETE FROM OceneRestoran
        WHERE Restoran_ID = ?
    `;

  const deleteJelovnikQuery = `
        DELETE FROM Jelovnik
        WHERE Restoran_ID = ?
    `;

  const deleteRestoranQuery = `
        DELETE FROM Restoran 
        WHERE UID = ?
    `;

  conn.query(getRestoranID, [uid], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal server error.");
    }

    const restoranid = result[0].ID;

    conn.query(deleteKorisnikQuery, [restoranid], (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal server error.");
      }

      conn.query(deleteSlobodniTerminiQuery, [restoranid], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error Slobodni_Termini");
        }

        conn.query(deleteJelovnikQuery, [restoranid], (err, results3) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error Jelovnik.");
          }

          conn.query(
            deletefromOceneRestoranaQuery,
            [restoranid],
            (err, results4) => {
              if (err) {
                console.error(err);
                return res
                  .status(500)
                  .send("Internal Server Error OceneRestoran.");
              }

              conn.query(deleteRestoranQuery, [uid], (err, result) => {
                if (err) {
                  console.error(err);
                  return res.status(500).send("Internal Server Error Fotograf");
                }

                if (result.affectedRows === 0) {
                  return res
                    .status(404)
                    .send("Nije pronadjen korisnik sa datim UID-em.");
                }

                console.log("Record successfully deleted!");
                res.status(200).send("Record successfully deleted!");
              });
            }
          );
        });
      });
    });
  });
});

//Delete preko id
baza.delete("/restoran/:id", (req, res) => {
  const { id } = req.params;

  const deleteKorisnikQuery = `
        DELETE FROM Korisnik 
        WHERE Restoran_ID = ?
    `;

  const deleteSlobodniTerminiQuery = `
        DELETE FROM Slobodni_Termini
        WHERE Restoran_ID = ?
    `;

  const deletefromOceneRestoran = `
        DELETE FROM OceneRestoran
        WHERE Restoran_ID = ?
    `;

  const deleteJelovnikQuery = `
        DELETE FROM Jelovnik 
        WHERE Restoran_ID = ?
    `;

  const deletefromLikedRestoran = `
        DELETE FROM LikedRestoran
        WHERE Restoran_ID = ?
    `;

  const deleteRestoranQuery = `
        DELETE FROM Restoran 
        WHERE ID = ?
    `;

  conn.query(deleteKorisnikQuery, [id], (err, resultKorisnik) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error Korisnik");
    }

    conn.query(deleteSlobodniTerminiQuery, [id], (err, resultSlobodniTermini) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error Slobodni_Termini");
      }

      conn.query(deleteJelovnikQuery, [id], (err, resultJelovnik) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error Jelovnik");
        }

        conn.query(deletefromOceneRestoran, [id], (err, resultOceneRestoran) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error OceneRestoran");
          }

          conn.query(deletefromLikedRestoran, [id], (err, resultLikedRestoran) => {
            if (err) {
              console.error(err);
              return res.status(500).send("Internal Server Error LikedRestoran");
            }

            conn.query(deleteRestoranQuery, [id], (err, resultRestoran) => {
              if (err) {
                console.error(err);
                return res.status(500).send("Internal Server Error Restoran");
              }

              if (resultRestoran.affectedRows === 0) {
                return res.status(404).send("Nije pronadjen restoran sa datim ID-em.");
              }

              console.log("Record successfully deleted!");
              res.status(200).send("Record successfully deleted!");
            });
          });
        });
      });
    });
  });
});




baza.post("/fotograf", (req, res) => {
  const {
    NazivAgencije,
    Opis_Kompanije,
    Email,
    SigurnosniKod,
    Cena_Usluge,
    Cena_Po_Slici,
    Lokacija,
    Datum_Osnivanja,
    Broj_Telefona,
    UID,
    SlobodniTermini,
  } = req.body;
  var fotograf_id;
  conn.query(
    "INSERT INTO Fotograf (NazivAgencije, Opis_Kompanije, Email, SigurnosniKod, Cena_Usluge, Cena_Po_Slici, Lokacija, Datum_Osnivanja, Broj_Telefona, UID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      NazivAgencije,
      Opis_Kompanije,
      Email,
      SigurnosniKod,
      Cena_Usluge,
      Cena_Po_Slici,
      Lokacija,
      Datum_Osnivanja,
      Broj_Telefona,
      UID,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }
      fotograf_id = result.insertId;
      conn.query(
        "INSERT INTO Korisnik (UID, TIP, Fotograf_ID) VALUES (?, ?, ?)",
        [UID, "Fotograf", fotograf_id],
        (err) => {
          if (err) {
            console.log("Nije uspela nazalost.");
            console.error(err);
            res.status(500).send("Internal Server Error");
            return;
          }
          if (SlobodniTermini && SlobodniTermini.length > 0) {
            const terminiValues = SlobodniTermini.map((termin) => [
              termin,
              fotograf_id,
            ]);
            conn.query(
              "INSERT INTO Slobodni_Termini (Slobodan_Termin, fotograf_ID) VALUES ?",
              [terminiValues],
              (err) => {
                if (err) {
                  console.error(err);
                  res.status(500).send("Internal Server Error");
                  return;
                }
                console.log("Podaci su uspesno ubaceni.");
                res.status(200).send("Podaci su uspešno ubačeni.");
              }
            );
          } else {
            res.status(200).send("Podaci su uspešno ubačeni.");
          }
        }
      );
    }
  );
  console.log("Sve je zavrseno.");
});

baza.get("/fotograf", (req, res) => {
  const query = `
        SELECT 
            Fotograf.ID AS FotografID,
            Fotograf.NazivAgencije,
            Fotograf.Opis_Kompanije,
            Fotograf.Email,
            Fotograf.SigurnosniKod,
            Fotograf.Cena_Usluge,
            Fotograf.Cena_Po_Slici,
            Fotograf.Lokacija,
            Fotograf.Datum_Osnivanja,
            Fotograf.Broj_Telefona,
            Fotograf.Ocena,
            Slobodni_Termini.ID AS TerminID,
            Slobodni_Termini.Slobodan_Termin
        FROM Fotograf
        LEFT JOIN Slobodni_Termini ON Fotograf.ID = Slobodni_Termini.Fotograf_ID
    `;

  conn.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    const fotografi = {};
    result.forEach((row) => {
      if (
        row.FotografID &&
        row.NazivAgencije &&
        row.Email &&
        row.Lokacija &&
        row.Cena_Usluge &&
        row.Cena_Po_Slici &&
        row.Datum_Osnivanja
      ) {
        if (!fotografi[row.FotografID]) {
          fotografi[row.FotografID] = {
            FotografID: row.FotografID,
            NazivAgencije: row.NazivAgencije,
            Opis_Kompanije: row.Opis_Kompanije,
            Email: row.Email,
            SigurnosniKod: row.SigurnosniKod,
            Lokacija: row.Lokacija,
            Cena_Usluge: row.Cena_Usluge,
            Cena_Po_Slici: row.Cena_Po_Slici,
            Datum_Osnivanja: row.Datum_Osnivanja,
            Broj_Telefona: row.Broj_Telefona,
            Ocena: row.Ocena,
            Slobodni_Termini: [],
          };
        }
        if (row.TerminID && row.Slobodan_Termin) {
          fotografi[row.FotografID].Slobodni_Termini.push({
            Slobodan_Termin: row.Slobodan_Termin,
            ID: row.TerminID,
          });
        }
      }
    });

    const fotografiList = Object.values(fotografi);
    res.json(fotografiList);
  });
});

//get za fotografa
baza.get("/fotograf/prekouid/:uid", (req, res) => {
  const { uid } = req.params;
  const query = `
        SELECT 
            Fotograf.ID AS FotografID,
            Fotograf.NazivAgencije,
            Fotograf.Opis_Kompanije,
            Fotograf.Email,
            Fotograf.SigurnosniKod,
            Fotograf.Cena_Usluge,
            Fotograf.Cena_Po_Slici,
            Fotograf.Lokacija,
            Fotograf.Datum_Osnivanja,
            Fotograf.Broj_Telefona,
            Fotograf.Ocena,
            Slobodni_Termini.ID AS TerminID,
            Slobodni_Termini.Slobodan_Termin
        FROM Fotograf
        LEFT JOIN Slobodni_Termini ON Fotograf.ID = Slobodni_Termini.Fotograf_ID
        WHERE Fotograf.UID = ?
    `;

  conn.query(query, [uid], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    const fotografi = {};
    result.forEach((row) => {
      if (!fotografi[row.FotografID]) {
        fotografi[row.FotografID] = {
          FotografID: row.FotografID,
          NazivAgencije: row.NazivAgencije,
          Opis_Kompanije: row.Opis_Kompanije,
          Email: row.Email,
          SigurnosniKod: row.SigurnosniKod,
          Lokacija: row.Lokacija,
          Cena_Usluge: row.Cena_Usluge,
          Cena_Po_Slici: row.Cena_Po_Slici,
          Datum_Osnivanja: row.Datum_Osnivanja,
          Broj_Telefona: row.Broj_Telefona,
          Ocena: row.Ocena,
          Slobodni_Termini: [],
        };
      }
      if (row.TerminID) {
        fotografi[row.FotografID].Slobodni_Termini.push({
          Slobodan_Termin: row.Slobodan_Termin,
          ID: row.TerminID,
        });
      }
    });

    const fotografiList = Object.values(fotografi);
    res.json(fotografiList);
  });
});

baza.get("/fotograf/prekoid/:id", (req, res) => {
  const { id } = req.params;
  const query = `
        SELECT 
            Fotograf.ID AS FotografID,
            Fotograf.NazivAgencije,
            Fotograf.Opis_Kompanije,
            Fotograf.Email,
            Fotograf.SigurnosniKod,
            Fotograf.Cena_Usluge,
            Fotograf.Cena_Po_Slici,
            Fotograf.Lokacija,
            Fotograf.Datum_Osnivanja,
            Fotograf.Broj_Telefona,
            Fotograf.Ocena,
            Slobodni_Termini.ID AS TerminID,
            Slobodni_Termini.Slobodan_Termin
        FROM Fotograf
        LEFT JOIN Slobodni_Termini ON Fotograf.ID = Slobodni_Termini.Fotograf_ID
        WHERE Fotograf.ID = ?
    `;

  conn.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    const fotografi = {};
    result.forEach((row) => {
      if (!fotografi[row.FotografID]) {
        fotografi[row.FotografID] = {
          FotografID: row.FotografID,
          NazivAgencije: row.NazivAgencije,
          Opis_Kompanije: row.Opis_Kompanije,
          Email: row.Email,
          SigurnosniKod: row.SigurnosniKod,
          Lokacija: row.Lokacija,
          Cena_Usluge: row.Cena_Usluge,
          Cena_Po_Slici: row.Cena_Po_Slici,
          Datum_Osnivanja: row.Datum_Osnivanja,
          Broj_Telefona: row.Broj_Telefona,
          Ocena: row.Ocena,
          Slobodni_Termini: [],
        };
      }
      if (row.TerminID) {
        fotografi[row.FotografID].Slobodni_Termini.push({
          Slobodan_Termin: row.Slobodan_Termin,
          ID: row.TerminID,
        });
      }
    });

    const fotografiList = Object.values(fotografi);
    res.json(fotografiList);
  });
});

// baza.get('/fotograf', (req, res) => {
//     conn.query('SELECT * FROM Fotograf', (err, result) => {
//         if (err) throw new Error(err);
//         res.json(result);
//         // console.log(result);
//         // res.end();
//     })
// });

// baza.get('/fotograf/:uid', (req, res) => {
//     const {uid} = req.params

//     const selectquery = `
//         SELECT * FROM Fotograf
//         WHERE UID = ?
//     `
//     conn.query(selectquery, [uid], (err, result) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).send('Internal Server Error');
//         }

//         if (result.length === 0) {
//             return res.status(404).send('Ne postoji podatak u tabeli sa trazenim UID-em');
//         }

//         console.log('Uspesno su vraceni podaci!');
//         console.log(result);
//         res.status(200).json(result[0]);

//         //res.json(result);
//         // console.log(result);
//         // res.end();
//     })
// });
//VLASTIMIROVA METODA NE CACKAJ
baza.put("/fotograf/:id", (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  const {
    NazivAgencije,
    Opis_Kompanije,
    Email,
    Cena_Usluge,
    Cena_Po_Slici,
    
    Ocena,
    Lokacija,
    Datum_Osnivanja,
    
  } = updateFields;

  const setFields = [];
  const setValues = [];

  if (Email) {
    setFields.push("Email = ?");
    setValues.push(Email);
  }
  if (Ocena) {
    setFields.push("Ocena = ?");
    setValues.push(Ocena);
  }
  if (Lokacija) {
    setFields.push("Lokacija = ?");
    setValues.push(Lokacija);
  }
  if (Datum_Osnivanja) {
    setFields.push("Datum_Osnivanja = ?");
    setValues.push(Datum_Osnivanja);
  }

  if (NazivAgencije) {
    setFields.push("NazivAgencije = ?");
    setValues.push(NazivAgencije);
  }
  if (Opis_Kompanije) {
    setFields.push("Opis_Kompanije = ?");
    setValues.push(Opis_Kompanije);
  }
  if (Cena_Usluge) {
    setFields.push("Cena_Usluge = ?");
    setValues.push(Cena_Usluge);
  }
  if (Cena_Po_Slici) {
    setFields.push("Cena_Po_Slici = ?");
    setValues.push(Cena_Po_Slici);
  }


  if (setFields.length === 0) {
    return res.status(400).send("No fields provided for update");
  }

  const updateQuery = `
        UPDATE Fotograf 
        SET ${setFields.join(", ")}
        WHERE ID = ?
    `;

  setValues.push(id);

  conn.query(updateQuery, setValues, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("No record found with the provided ID");
    }

    console.log("Podaci su uspešno promenjeni.");
    return res.status(200).send("Podaci su uspešno promenjeni.");
  });
});


baza.put("/fotograf/prekoid/:id", (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  const {
    NazivAgencije,
    Opis_Kompanije,
    Cena_Usluge,
    Cena_Po_Slici,
    Broj_Telefona,
  } = updateFields;

  const setFields = [];
  const setValues = [];

  if (NazivAgencije) {
    setFields.push("NazivAgencije = ?");
    setValues.push(NazivAgencije);
  }
  if (Opis_Kompanije) {
    setFields.push("Opis_Kompanije = ?");
    setValues.push(Opis_Kompanije);
  }
  if (Cena_Usluge) {
    setFields.push("Cena_Usluge = ?");
    setValues.push(Cena_Usluge);
  }
  if (Cena_Po_Slici) {
    setFields.push("Cena_Po_Slici = ?");
    setValues.push(Cena_Po_Slici);
  }
  if (Broj_Telefona) {
    setFields.push("Broj_Telefona = ?");
    setValues.push(Broj_Telefona);
  }

  if (setFields.length === 0) {
    return res.status(400).send("No fields provided for update");
  }

  const updateQuery = `
        UPDATE Fotograf 
        SET ${setFields.join(", ")}
        WHERE ID = ?
    `;

  setValues.push(id);

  conn.query(updateQuery, setValues, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("No record found with the provided ID");
    }

    console.log("Podaci su uspešno promenjeni.");
    return res.status(200).send("Podaci su uspešno promenjeni.");
  });
});


//ako ne radi ova iznad

baza.put("/fotograf/prekouid/:uid", (req, res) => {
  const { uid } = req.params;
  const updateFields = req.body;

  const {
    NazivAgencije,
    Opis_Kompanije,
    Cena_Usluge,
    Cena_Po_Slici,
    Broj_Telefona,
  } = updateFields;

  const setFields = [];
  const setValues = [];

  if (NazivAgencije) {
    setFields.push("NazivAgencije = ?");
    setValues.push(NazivAgencije);
  }
  if (Opis_Kompanije) {
    setFields.push("Opis_Kompanije = ?");
    setValues.push(Opis_Kompanije);
  }
  if (Cena_Usluge) {
    setFields.push("Cena_Usluge = ?");
    setValues.push(Cena_Usluge);
  }
  if (Cena_Po_Slici) {
    setFields.push("Cena_Po_Slici = ?");
    setValues.push(Cena_Po_Slici);
  }
  if (Broj_Telefona) {
    setFields.push("Broj_Telefona = ?");
    setValues.push(Broj_Telefona);
  }

  if (setFields.length === 0) {
    return res.status(400).send("No fields provided for update");
  }

  const updateQuery = `
        UPDATE Fotograf 
        SET ${setFields.join(", ")}
        WHERE UID = ?
    `;

  setValues.push(uid);

  conn.query(updateQuery, setValues, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("No record found with the provided UID");
    }

    console.log("Podaci su uspešno promenjeni.");
    return res.status(200).send("Podaci su uspešno promenjeni.");
  });
});



baza.delete("/fotograf/:uid", (req, res) => {
  const { uid } = req.params;

  const getFotografIdQuery = `
        SELECT ID FROM Fotograf WHERE UID = ?
    `;

  const deleteKorisnikQuery = `
        DELETE FROM Korisnik 
        WHERE Fotograf_ID = ?
    `;

  const deletefromOceneFotograf = `
        DELETE FROM OceneFotograf
        WHERE Fotograf_ID = ?
    `;

  const deleteSlobodniTerminiQuery = `
        DELETE FROM Slobodni_Termini
        WHERE FOtograf_ID = ?
    `;

  const deleteFotografQuery = `
        DELETE FROM Fotograf 
        WHERE UID = ?
    `;

  conn.query(getFotografIdQuery, [uid], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (results.length === 0) {
      return res.status(404).send("Nije pronadjen korisnik sa datim UID-em.");
    }

    const fotografId = results[0].ID;

    conn.query(deleteKorisnikQuery, [fotografId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error Korisnik");
      }

      conn.query(deleteSlobodniTerminiQuery, [fotografId], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error Slobodni_Termini");
        }

        conn.query(deletefromOceneFotograf, [fotografId], (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error OceneFotograf");
          }

          conn.query(deleteFotografQuery, [uid], (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).send("Internal Server Error Fotograf");
            }

            if (result.affectedRows === 0) {
              return res
                .status(404)
                .send("Nije pronadjen korisnik sa datim UID-em.");
            }

            console.log("Record successfully deleted!");
            res.status(200).send("Record successfully deleted!");
          });
        });
      });
    });
  });
});



baza.post("/dekorater", (req, res) => {
  const {
    Ime,
    Kratak_Opis,
    Email,
    Sifra,
    Lokacija,
    Sigurnosni_Kod,
    Datum_Osnivanja,
    Cena,
    Broj_Telefona,
    UID,
    SlobodniTermini,
  } = req.body;
  var dekorater_id;
  conn.query(
    "INSERT INTO Dekorater (Ime, Kratak_Opis, Email, Sifra, Lokacija, Sigurnosni_Kod, Datum_Osnivanja, Cena, Broj_Telefona, UID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      Ime,
      Kratak_Opis,
      Email,
      Sifra,
      Lokacija,
      Sigurnosni_Kod,
      Datum_Osnivanja,
      Cena,
      Broj_Telefona,
      UID,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }
      dekorater_id = result.insertId;
      conn.query(
        "INSERT INTO Korisnik (UID, TIP, Dekorater_ID) VALUES (?, ?, ?)",
        [UID, "Dekorater", dekorater_id],
        (err) => {
          if (err) {
            console.log("Nije uspela nazalost.");
            console.error(err);
            res.status(500).send("Internal Server Error");
            return;
          }
          if (SlobodniTermini && SlobodniTermini.length > 0) {
            const terminiValues = SlobodniTermini.map((termin) => [
              termin,
              dekorater_id,
            ]);
            conn.query(
              "INSERT INTO Slobodni_Termini (Slobodan_Termin, dekorater_ID) VALUES ?",
              [terminiValues],
              (err) => {
                if (err) {
                  console.error(err);
                  res.status(500).send("Internal Server Error");
                  return;
                }
                console.log("Podaci su uspesno ubaceni.");
                res.status(200).send("Podaci su uspešno ubačeni.");
              }
            );
          } else {
            res.status(200).send("Podaci su uspešno ubačeni.");
          }
        }
      );
    }
  );
});

baza.get("/dekorater", (req, res) => {
  const query = `
        SELECT 
            Dekorater.ID AS DekoraterID,
            Dekorater.Ime,
            Dekorater.Kratak_Opis,
            Dekorater.Email,
            Dekorater.Lokacija,
            Dekorater.Cena,
            Dekorater.Datum_Osnivanja,
            Dekorater.Ocena,
            Dekorater.Broj_Telefona,
            Slobodni_Termini.ID AS TerminID,
            Slobodni_Termini.Slobodan_Termin
        FROM Dekorater
        LEFT JOIN Slobodni_Termini ON Dekorater.ID = Slobodni_Termini.Dekorater_ID
    `;

  conn.query(query, (err, result) => {
    if (err) throw new Error(err);

    const dekorateri = {};
    result.forEach((row) => {
      if (
        row.DekoraterID &&
        row.Ime &&
        row.Email &&
        row.Lokacija &&
        row.Cena &&
        row.Datum_Osnivanja
      ) {
        if (!dekorateri[row.DekoraterID]) {
          dekorateri[row.DekoraterID] = {
            DekoraterID: row.DekoraterID,
            Ime: row.Ime,
            Kratak_Opis: row.Kratak_Opis,
            Email: row.Email,
            Lokacija: row.Lokacija,
            Cena: row.Cena,
            Datum_Osnivanja: row.Datum_Osnivanja,
            Ocena: row.Ocena,
            Broj_Telefona: row.Broj_Telefona,
            Slobodni_Termini: [],
          };
        }

        if (row.TerminID && row.Slobodan_Termin) {
          dekorateri[row.DekoraterID].Slobodni_Termini.push({
            Slobodan_Termin: row.Slobodan_Termin,
            ID: row.TerminID,
          });
        }
      }
    });

    const dekorateriList = Object.values(dekorateri);

    res.json(dekorateriList);
  });
});



baza.get("/dekorater/prekouid/:uid", (req, res) => {
  const { uid } = req.params;

  const query = `
        SELECT
            Dekorater.ID AS DekoraterID, 
            Dekorater.Ime,
            Dekorater.Kratak_Opis,
            Dekorater.Email,
            Dekorater.Sifra,
            Dekorater.Lokacija,
            Dekorater.Cena,
            Dekorater.Sigurnosni_Kod AS SigurnosniKod,
            Dekorater.Datum_Osnivanja AS Datum_Osnivanja,
            Dekorater.Ocena,
            Dekorater.Broj_Telefona,
            Slobodni_Termini.ID AS TerminID,
            Slobodni_Termini.Slobodan_Termin
        FROM Dekorater
        LEFT JOIN Slobodni_Termini ON Dekorater.ID = Slobodni_Termini.Dekorater_ID
        WHERE Dekorater.UID = ?
    `;

  conn.query(query, [uid], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    const dekorateri = {};
    result.forEach((row) => {
      if (!dekorateri[row.DekoraterID]) {
        dekorateri[row.DekoraterID] = {
          DekoraterID: row.DekoraterID,
          Ime: row.Ime,
          Kratak_Opis: row.Kratak_Opis,
          Email: row.Email,
          Sifra: row.Sifra,
          Lokacija: row.Lokacija,
          Cena: row.Cena,
          SigurnosniKod: row.SigurnosniKod,
          Datum_Osnivanja: row.Datum_Osnivanja,
          Ocena: row.Ocena,
          Broj_Telefona: row.Broj_Telefona,
          Slobodni_Termini: [],
        };
      }
      if (row.TerminID) {
        dekorateri[row.DekoraterID].Slobodni_Termini.push({
          Slobodan_Termin: row.Slobodan_Termin,
          ID: row.TerminID,
        });
      }
    });

    const dekorateriList = Object.values(dekorateri);
    res.json(dekorateriList);
  });
});

baza.get("/dekorater/prekoid/:id", (req, res) => {
  const { id } = req.params;
  const query = `
        SELECT 
            Dekorater.ID AS DekoraterID,
            Dekorater.Ime,
            Dekorater.Kratak_Opis,
            Dekorater.Email,
            Dekorater.Sifra,
            Dekorater.Sigurnosni_Kod,
            Dekorater.Cena,
            Dekorater.Lokacija,
            Dekorater.Datum_Osnivanja,
            Dekorater.Broj_Telefona,
            Dekorater.Ocena,
            Slobodni_Termini.ID AS TerminID,
            Slobodni_Termini.Slobodan_Termin
        FROM Dekorater
        LEFT JOIN Slobodni_Termini ON Dekorater.ID = Slobodni_Termini.Dekorater_ID
        WHERE Dekorater.ID = ?
    `;

  conn.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    const dekorateri = {};
    result.forEach((row) => {
      if (!dekorateri[row.DekoraterID]) {
        dekorateri[row.DekoraterID] = {
          DekoraterID: row.DekoraterID,
          Ime: row.Ime,
          Kratak_Opis: row.Kratak_Opis,
          Email: row.Email,
          SigurnosniKod: row.SigurnosniKod,
          Lokacija: row.Lokacija,
          Cena: row.Cena,
          Datum_Osnivanja: row.Datum_Osnivanja,
          Broj_Telefona: row.Broj_Telefona,
          Ocena: row.Ocena,
          Slobodni_Termini: [],
        };
      }
      if (row.TerminID) {
        dekorateri[row.DekoraterID].Slobodni_Termini.push({
          Slobodan_Termin: row.Slobodan_Termin,
          ID: row.TerminID,
        });
      }
    });

    const dekorateriList = Object.values(dekorateri);
    res.json(dekorateriList);
  });
});

//VLASTIMIROVA PUTA METODA
baza.put("/dekorater/:id", (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  const { Ime, Kratak_Opis, Lokacija, Datum_Osnivanja, Cena, Broj_Telefona,Ocena } =
    updateFields;

  const setFields = [];
  const setValues = [];
  if (Ocena){
    setFields.push("Ocena = ?");
    setValues.push(Ocena);
  }
  if (Ime) {
    setFields.push("Ime = ?");
    setValues.push(Ime);
  }
  if (Kratak_Opis) {
    setFields.push("Kratak_Opis = ?");
    setValues.push(Kratak_Opis);
  }
  if (Lokacija) {
    setFields.push("Lokacija = ?");
    setValues.push(Lokacija);
  }
  if (Datum_Osnivanja) {
    setFields.push("Datum_Osnivanja = ?");
    setValues.push(Datum_Osnivanja);
  }
  if (Cena) {
    setFields.push("Cena = ?");
    setValues.push(Cena);
  }
  if (Broj_Telefona) {
    setFields.push("Broj_Telefona = ?");
    setValues.push(Broj_Telefona);
  }

  if (setFields.length === 0) {
    return res.status(400).send("No fields provided for update");
  }

  const updateQuery = `
        UPDATE Dekorater 
        SET ${setFields.join(", ")}
        WHERE ID = ?
    `;

  setValues.push(id);

  conn.query(updateQuery, setValues, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("No record found with the provided ID");
    }

    console.log("Podaci su uspešno promenjeni.");
    return res.status(200).send("Podaci su uspešno promenjeni.");
  });
});

// baza.put('/dekorater/:id', (req, res) => {
//     const { id } = req.params;
//     const { Ime, Kratak_Opis, Email, Lokacija, Datum_Osnivanja, Cena, Broj_Telefona } = req.body;

//     const updateQuery = `
//         UPDATE Dekorater
//         SET Ime = ?, Kratak_Opis = ?, Email = ?, Lokacija = ?, Datum_Osnivanja = ?, Cena = ?, Broj_Telefona = ?
//         WHERE ID = ?
//     `;

//     const getDekoraterIdQuery = `
//         SELECT ID FROM Dekorater
//         WHERE ID = ?
//     `;

//     conn.query(getDekoraterIdQuery, [id], (err, results) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).send("Internal Server Error");
//         }

//         if (results.length === 0) {
//             return res.status(404).send('No record found with the provided ID');
//         }

//         conn.query(updateQuery, [Ime, Kratak_Opis, Email, Lokacija, Datum_Osnivanja, Cena, Broj_Telefona, id], (err, result) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).send('Internal Server Error');
//             }

//             if (result.affectedRows === 0) {
//                 return res.status(404).send('No record found with the provided ID');
//             }

//             console.log('Podaci su uspešno promenjeni.');
//             return res.status(200).send('Podaci su uspešno promenjeni.');
//         });
//     });
// });

//dekorater uid
// baza.put('/dekorater/prekouid/:uid', (req, res) => {
//     const { uid } = req.params;
//     const { Ime, Kratak_Opis, Lokacija, Datum_Osnivanja, Cena, Broj_Telefona } = req.body;

//     const updateQuery = `
//         UPDATE Dekorater
//         SET Ime = ?, Kratak_Opis = ?, Lokacija = ?, Datum_Osnivanja = ?, Cena = ?, Broj_Telefona = ?
//         WHERE UID = ?
//     `;

//     const getDekoraterIdQuery = `
//         SELECT ID FROM Dekorater
//         WHERE UID = ?
//     `;

//     conn.query(getDekoraterIdQuery, [uid], (err, results) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).send("Internal Server Error");
//         }

//         if (results.length === 0) {
//             return res.status(404).send('No record found with the provided UID');
//         }

//         conn.query(updateQuery, [Ime, Kratak_Opis, Lokacija, Datum_Osnivanja, Cena, Broj_Telefona, uid], (err, result) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).send('Internal Server Error');
//             }

//             if (result.affectedRows === 0) {
//                 return res.status(404).send('No record found with the provided UID');
//             }

//             console.log('Podaci su uspešno promenjeni.');
//             return res.status(200).send('Podaci su uspešno promenjeni.');
//         });
//     });
// });

// baza.put('/dekorater/prekouid/:uid', (req, res) => {
//     const { uid } = req.params;
//     const { Ime, Kratak_Opis, Sifra, Lokacija, Datum_Osnivanja, Cena, SlobodniTermini } = req.body;

//     const updateQuery = `
//         UPDATE Dekorater
//         SET Ime = ?, Kratak_Opis = ?, Sifra = ?, Lokacija = ?, Datum_Osnivanja = ?, Cena = ?
//         WHERE ID = ?
//     `;

//     const updateSlobodni = `
//         UPDATE Slobodni_Termini
//         SET Slobodan_Termin = ?
//         WHERE Dekorater_ID = ?
//     `;

//     const getDekoraterIdQuery = `
//         SELECT ID FROM Dekorater
//         WHERE UID = ?
//     `;

//     conn.query(getDekoraterIdQuery, [uid], (err, result) => {
//         if (err) {
//             console.error(err);
//             res.status(500).send("Internal Server Error");
//         }

//         const fotografId = res[0].ID;

//         conn.query(updateQuery, [Ime, Kratak_Opis, Sifra, Lokacija, Datum_Osnivanja, Cena, uid], (err, resultupdate) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).send('Internal Server Error');
//             }

//             if (SlobodniTermini && SlobodniTermini.length > 0) {
//                 const terminiValues = SlobodniTermini.map(termin => [termin, fotografId]);
//                 conn.query(updateSlobodni, [terminiValues, id], (err) => {
//                         if (err) {
//                             console.error(err);
//                             res.status(500).send('Internal Server Error');
//                             return;
//                         }
//                         console.log('Podaci su uspesno promenjeni.');
//                         res.status(200).send('Podaci su uspešno promenjeni.');
//                     }
//                 );
//             } else {
//                 res.status(200).send('Podaci su uspešno promenjeni, zamalo.');
//             }

//             //Ako nije pronadjen ID
//             if (result.affectedRows === 0) {
//                 return res.status(404).send('No record found with the provided ID');
//             }

//             // console.log('Podaci su uspesno azurirani!');
//             // res.status(200).send('Podaci su uspesno azurirani!');
//         });
//     });
// });

//ova radi

baza.put("/dekorater/prekouid/:uid", (req, res) => {
  const { uid } = req.params;
  const updateFields = req.body;

  const { Ime, Kratak_Opis, Lokacija, Datum_Osnivanja, Cena, Broj_Telefona } =
    updateFields;

  const setFields = [];
  const setValues = [];

  if (Ime) {
    setFields.push("Ime = ?");
    setValues.push(Ime);
  }
  if (Kratak_Opis) {
    setFields.push("Kratak_Opis = ?");
    setValues.push(Kratak_Opis);
  }
  if (Lokacija) {
    setFields.push("Lokacija = ?");
    setValues.push(Lokacija);
  }
  if (Datum_Osnivanja) {
    setFields.push("Datum_Osnivanja = ?");
    setValues.push(Datum_Osnivanja);
  }
  if (Cena) {
    setFields.push("Cena = ?");
    setValues.push(Cena);
  }
  if (Broj_Telefona) {
    setFields.push("Broj_Telefona = ?");
    setValues.push(Broj_Telefona);
  }

  if (setFields.length === 0) {
    return res.status(400).send("No fields provided for update");
  }

  const updateQuery = `
        UPDATE Dekorater 
        SET ${setFields.join(", ")}
        WHERE UID = ?
    `;

  setValues.push(uid);

  conn.query(updateQuery, setValues, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("No record found with the provided UID");
    }

    console.log("Podaci su uspešno promenjeni.");
    return res.status(200).send("Podaci su uspešno promenjeni.");
  });
});

baza.delete("/dekorater/:uid", (req, res) => {
  const { uid } = req.params;

  const getDekoraterIdQuery = `
        SELECT ID FROM Dekorater WHERE UID = ?
    `;

  const deleteKorisnikQuery = `
        DELETE FROM Korisnik 
        WHERE Dekorater_ID = ?
    `;

  const deleteSlobodniTerminiQuery = `
        DELETE FROM Slobodni_Termini
        WHERE Dekorater_ID = ?
    `;

  const deletefromOceneDekorateraQuery = `
        DELETE FROM OceneDekorater
        WHERE Dekorater_ID = ?
    `;

  const deleteDekoraterQuery = `
        DELETE FROM Dekorater 
        WHERE UID = ?
    `;

  conn.query(getDekoraterIdQuery, [uid], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    const dekoraterid = result[0].ID;

    conn.query(deleteKorisnikQuery, [dekoraterid], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }

      conn.query(deleteSlobodniTerminiQuery, [dekoraterid], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error");
        }

        conn.query(
          deletefromOceneDekorateraQuery,
          [dekoraterid],
          (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).send("Internal Server Error");
            }

            conn.query(deleteDekoraterQuery, [uid], (err, result) => {
              if (err) {
                console.error(err);
                return res.status(500).send("Internal Server Error");
              }

              if (result.affectedRows === 0) {
                return res
                  .status(404)
                  .send("Nije pronadjen korisnik sa datim UID-em.");
              }

              console.log("Record successfully deleted!");
              res.status(200).send("Record successfully deleted!");
            });
          }
        );
      });
    });
  });
});


//CRUD za Jelovnik

baza.get("/jelovnik/:id", (req, res) => {
  const { id } = req.params;

  const query = `
        SELECT * FROM Jelovnik
        WHERE Restoran_ID = ?
    `;

  conn.query(query, [id], (err, result) => {
    if (err) throw new Error(err);

    const jelovnici = {};
    result.forEach((row) => {
      if (!jelovnici[row.ID]) {
        jelovnici[row.ID] = {
            ID: row.ID,
            ImeJela: row.ImeJela,
            Cena: row.Cena,
            TIP: row.TIP,
            Kolicina: row.Kolicina,
        };
      }
    });

    const jelovniciList = Object.values(jelovnici);

    res.json(jelovniciList);
  });
});

baza.post("/jelovnik/:id", (req, res) => {
  const { id } = req.params;
  const { ImeJela, Cena, TIP, Kolicina } = req.body;

  conn.query(
    "INSERT INTO Jelovnik (ImeJela, Cena, TIP, Kolicina, Restoran_ID) VALUES (?, ?, ?, ?, ?)",
    [ImeJela, Cena, TIP, Kolicina, id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.status(200).send("Podaci su uspešno ubačeni.");
    }
  );
});

baza.put("/jelovnik/:id", (req, res) => {
  const { id } = req.params;
  const { ImeJela, Cena, TIP, Kolicina } = req.body;

  const updateJelovnikQuery = `
        UPDATE Jelovnik 
        SET ImeJela = ?, Cena = ?, TIP = ?, Kolicina = ?
        WHERE ID = ?
    `;

  conn.query(
    updateJelovnikQuery,
    [ImeJela, Cena, TIP, Kolicina, id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.status(200).send("Podaci su uspešno promenjeni.");
    }
  );
});

baza.delete("/jelovnik/:id", (req, res) => {
  const { id } = req.params;

  const deleteJelovnikQuery = `
        DELETE FROM Jelovnik 
        WHERE ID = ?
    `;

  conn.query(deleteJelovnikQuery, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Nije pronađen jelovnik sa datim ID-em.");
    }

    console.log("Record successfully deleted!");
    res.status(200).send("Record successfully deleted!");
  });
});

//zakazani jelovnik

baza.post("/jelovnikzakazano/:id", (req, res) => {
    const { id } = req.params;
    const { ImeJela, TipJela, Cena, Gramaza } = req.body;
  
    conn.query(
      "INSERT INTO ZakazaniJelovnik (ImeJela, TipJela, Cena, Gramaza, Mladenci_ID) VALUES (?, ?, ?, ?, ?)",
      [ImeJela, TipJela, Cena, Gramaza, id],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
          return;
        }
  
        res.status(200).send("Podaci su uspešno ubačeni.");
      }
    );
});

baza.delete("/jelovnikzakazano/:id", (req, res) => {
    const { id } = req.params;
  
    const deleteJelovnikQuery = `
          DELETE FROM ZakazaniJelovnik 
          WHERE ID = ?
      `;
  
    conn.query(deleteJelovnikQuery, [id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).send("Nije pronađen jelovnik sa datim ID-em.");
      }
  
      console.log("Record successfully deleted!");
      res.status(200).send("Record successfully deleted!");
    });
});

baza.get("/jelovnikzakazano/:id", (req, res) => {
    const { id } = req.params;
  
    const query = `
          SELECT * FROM ZakazaniJelovnik
          WHERE Mladenci_ID = ?
      `;
  
    conn.query(query, [id], (err, result) => {
      if (err) throw new Error(err);
  
      const jelovnici = {};
      result.forEach((row) => {
        if (!jelovnici[row.ID]) {
          jelovnici[row.ID] = {
            ID: row.ID,
            ImeJela: row.ImeJela,
            Cena: row.Cena,
            TIP: row.TIP,
            Kolicina: row.Kolicina,
          };
        }
      });
  
      const jelovniciList = Object.values(jelovnici);
  
      res.json(jelovniciList);
    });
  });

//CRUD za Goste
//GET
baza.get("/gosti/:id", (req, res) => {
  const { id } = req.params;

  const getmladenci_id = `SELECT ID FROM Mladenci Where UID = ?`;

  const vrati = `
    SELECT * FROM Gosti
    WHERE Mladenci_ID = ?
    `;

  conn.query(vrati, [id], (err, result) => {
    if (err) throw new Error(err);

    const gosti = {};
    result.forEach((row) => {
      if (!gosti[row.ID]) {
        gosti[row.ID] = {
          ID: row.ID,
          Ime: row.Ime,
          Prezime: row.Prezime,
          Broj_Stola: row.Broj_Stola,
        };
      }
    });

    const lista_gostiju = Object.values(gosti);

    res.json(lista_gostiju);
  });
});

//POST
baza.post("/gosti", (req, res) => {
  const { Ime, Prezime, Broj_Stola, Mladenci_ID } = req.body;

  const query = `
        INSERT INTO Gosti (Ime, Prezime, Broj_Stola, Mladenci_ID) VALUES (?, ?, ?, ?)
    `;

  conn.query(query, [Ime, Prezime, Broj_Stola, Mladenci_ID], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Nije pronađen jelovnik sa datim ID-em.");
    }

    res.status(200).send("Podaci su uspešno ubačeni.");
  });
});
//GET preko id
baza.get("/gosti/prekoid/:id", (req, res) => {
  const id = req.params;

  const vrati = `
    SELECT  
        Ime,
        Prezime,
        Broj_Stola
    FROM Gosti
    WHERE Mladenci_ID = ?
    `;

  conn.query(vrati, [id], (err, result) => {
    if (err) throw new Error(err);

    const gosti = {};
    result.forEach((row) => {
      if (!gosti[row.ID]) {
        gosti[row.ID] = {
          ID: row.ID,
          Ime: row.Ime,
          Prezime: row.Prezime,
          Broj_Stola: row.Broj_Stola,
        };
      }
    });

    const lista_gostiju = Object.values(gosti);

    res.json(lista_gostiju);
  });
});

//PUT
baza.put("/gosti/:id", (req, res) => {
  const { id } = req.params;
  const { Ime, Prezime, Broj_Stola } = req.body;

  const updateQuery = `
        UPDATE Gosti
        SET Ime = ?, Prezime = ?, Broj_Stola = ?
        WHERE ID = ?
    `;

  conn.query(updateQuery, [Ime, Prezime, Broj_Stola, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Nisu pronadjeni gosti za date mladence.");
    }

    res.status(200).send("Podaci su uspešno promenjeni.");
  });
});

//DELETE
baza.delete("/gosti/:id", (req, res) => {
  const { id } = req.params;

  const deleteQuery = `
        DELETE FROM Gosti WHERE ID = ?
    `;

  conn.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Nije pronađen Gost sa datim ID-em.");
    }

    res
      .status(200)
      .send(
        "Gost sa datim ID-em je uspesno izbrisan. Nije ti ni trebao na svadbi da ti kazem."
      );
  });
});

//GET metode za LIKED

baza.get("/getLikedRestoran/:uid", (req, res) => {
  const { uid } = req.params;

  const selectQuery = `
        SELECT * FROM LikedRestoran
        WHERE Mladenci_UID = ?
    `;

  conn.query(selectQuery, [uid], (err, result) => {
    if (err) {
      console.error("Error retrieving liked Restoran:", err);
      return res.status(500).send("Error retrieving liked Restoran");
    }

    console.log("Data successfully retrieved:");
    console.log(result);
    res.status(200).json(result);
  });
});

baza.get("/getLikedFotograf/:uid", (req, res) => {
  const { uid } = req.params;

  const selectQuery = `SELECT * FROM LikedFotograf
        WHERE Mladenci_UID = ?`;
  conn.query(selectQuery, [uid], (err, result) => {
    if (err) {
      console.error("Error retrieving liked Fotograf:", err);
      return res.status(500).send("Error retrieving liked Fotograf");
    }

    console.log("Data successfully retrieved:");
    console.log(result);
    res.status(200).json(result);
  });
});

baza.get("/getLikedPoslasticar/:uid", (req, res) => {
  const { uid } = req.params;

  const selectQuery = `SELECT * FROM LikedPoslasticar
        WHERE Mladenci_UID = ?`;
  conn.query(selectQuery, [uid], (err, result) => {
    if (err) {
      console.error("Error retrieving liked Poslasticar:", err);
      return res.status(500).send("Error retrieving liked Poslasticar");
    }

    console.log("Data successfully retrieved:");
    console.log(result);
    res.status(200).json(result);
  });
});

//radi
baza.get('/zakazanomladencima/prekouid/:uid', (req, res) => {
  const { uid } = req.params;

  const getMladenciIDQuery = `
    SELECT ID FROM Mladenci
    WHERE UID = ?
  `;

  const getZakazanoQuery = `
    SELECT
      Poslasticar_Termin,
      Fotograf_Termin,
      Dekorater_Termin,
      Restoran_Termin,
      Cena_Poslasticara,
      Cena_Restorana,
      Naziv_Torte,
      Restoran_ID,
      Poslasticar_ID,
      Dekorater_ID,
      Fotograf_ID
    FROM Zakazano
    WHERE Mladenci_ID = ?
  `;

  conn.query(getMladenciIDQuery, [uid], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length === 0) {
      return res.status(404).send('Nije pronađen Restoran za datog mladence.');
    }

    const mladenciID = result[0].ID;

    conn.query(getZakazanoQuery, [mladenciID], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      if (result.length === 0) {
        return res.status(404).send('Nije pronađen Restoran za datog mladence.');
      }

      res.status(200).json(result);

    });
  });
});

//Zakazivanje Restorana
baza.put('/zakazivanjerestorana/prekouid/:uid', (req, res) => { 
    const { uid } = req.params;
    const { Restoran_Termin, Cena_Restorana, Restoran_ID } = req.body;
    
    const getMladenciID = `
        SELECT ID FROM Mladenci
        WHERE UID = ?
    `;
    
    const deleteTermini = `
        DELETE FROM Slobodni_Termini
        WHERE Restoran_ID = ? AND Slobodan_Termin = ?
    `;
    
    const UpdateZakazano = `
        UPDATE Zakazano
        Set Restoran_Termin = ?, Cena_Restorana = ?, Restoran_ID = ?
        WHERE Mladenci_ID = ?
    `;

    conn.query(getMladenciID, [uid], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        if (result.length === 0) {
            return res.status(404).send('Nije pronađen Restoran za datog mladence.');
        }  

        const mladenciID = result[0].ID;

        conn.query(UpdateZakazano, [Restoran_Termin, Cena_Restorana, Restoran_ID, mladenciID], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }

            if (result.affectedRows === 0) {
                return res.status(404).send('Nije pronađen Restoran za datog mladence.');
            }
            conn.query(deleteTermini, [Restoran_ID, Restoran_Termin], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Internal Server Error');
                }
                console.log('Podaci su uspesno ubaceni.');
                res.status(200).send('Podaci su uspesno ubaceni.');
            })

        });
    });

});



//Zakazivanje Poslasticara

baza.get('/zakazanirestorani/prekouid/:uid', (req, res) => {
  const { uid } = req.params;

  const getRestoranIDQuery = `
    SELECT ID FROM Restoran
    WHERE UID = ?
  `;

  const getMladenciIDQuery = `
    SELECT 
    Mladenci_ID,
    Restoran_Termin
    FROM Zakazano
    WHERE Restoran_ID = ?
  `;

  const getJelovnikQuery = `
    SELECT
    Mladenci_ID,
    ImeJela,
    TipJela,
    Cena,
    Gramaza
    FROM ZakazaniJelovnik
    WHERE Mladenci_ID IN (?)
  `;

  const getMladenciQuery = `
    SELECT
    ID,
    Ime,
    Prezime,
    Broj_Telefona,
    Ime_Partnera,
    Prezime_Partnera,
    Email
    FROM Mladenci
    WHERE ID IN (?)
  `;

  conn.query(getRestoranIDQuery, [uid], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length === 0) {
      return res.status(404).send('Nije pronađen Restoran za datog UID.');
    }

    const restoranID = result[0].ID;

    conn.query(getMladenciIDQuery, [restoranID], (err, resultMladenci) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      if (resultMladenci.length === 0) {
        return res.status(404).send('Nije pronađen Mladenci za dati restoran.');
      }

      const mladenciIDs = resultMladenci.map(row => row.Mladenci_ID);

      conn.query(getJelovnikQuery, [mladenciIDs], (err, resultsJelovnik) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }

        conn.query(getMladenciQuery, [mladenciIDs], (err, resultsvimladecni) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
          }
  
          if (resultsvimladecni.length === 0) {
            return res.status(404).send('Nije pronađen Mladenci za dati restoran.');
          }

          const jelovnikByMladenciID = resultsJelovnik.reduce((acc, item) => {
            if (!acc[item.Mladenci_ID]) {
              acc[item.Mladenci_ID] = [];
            }
            acc[item.Mladenci_ID].push({
              ImeJela: item.ImeJela,
              TipJela: item.TipJela,
              Cena: item.Cena,
              Gramaza: item.Gramaza
            });
            return acc;
          }, {});
  
          const mladenci = resultsvimladecni.map(row => ({
            Ime: row.Ime,
            Prezime: row.Prezime,
            Broj_Telefona: row.Broj_Telefona,
            Ime_Partnera: row.Ime_Partnera,
            Prezime_Partnera: row.Prezime_Partnera,
            Email: row.Email,
            Restoran_Termin: resultMladenci.find(item => item.Mladenci_ID === row.ID).Restoran_Termin,
            Jelovnik: jelovnikByMladenciID[row.ID] || []
          }));
  
          res.status(200).json(mladenci);
        });
      });
    });
  });
});

baza.put('/zakazivanjeposlasticara/prekouid/:uid', (req, res) => { 
    const { uid } = req.params;
    const { Poslasticar_Termin, Cena_Poslasticara, Naziv_Torte, Poslasticar_ID } = req.body;
    
    const getMladenciID = `
        SELECT ID FROM Mladenci
        WHERE UID = ?
    `;

    const deleteTermini = `
        DELETE FROM Slobodni_Termini
        WHERE Poslasticar_ID = ? AND Slobodan_Termin = ?
    `;
    
    const UpdateZakazano = `
        UPDATE Zakazano
        Set Poslasticar_Termin = ?, Cena_Poslasticara = ?, Naziv_Torte = ?, Poslasticar_ID = ?
        WHERE Mladenci_ID = ?
    `;

    conn.query(getMladenciID, [uid], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        if (result.length === 0) {
            return res.status(404).send('Nije pronađen Poslasticar za datog mladence.');
        }

        const mladenciID = result[0].ID;

        conn.query(UpdateZakazano, [Poslasticar_Termin, Cena_Poslasticara, Naziv_Torte, Poslasticar_ID, mladenciID], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }

            if (result.affectedRows === 0) {
                return res.status(404).send('Nije pronađen Poslasticar za datog mladence.');
            }

            conn.query(deleteTermini, [Poslasticar_ID, Poslasticar_Termin], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Internal Server Error');
                }
                console.log('Podaci su uspesno ubaceni.');
                res.status(200).send('Podaci su uspesno ubaceni.');
            })

        });
    });

});

//get za zakazane poslasticare
// baza.get('/zakazaniposlasticari/prekouid/:uid', (req, res) => {
//   const { uid } = req.params;

//   const getPoslasticarIDQuery = `
//     SELECT ID FROM Poslasticar
//     WHERE UID = ?
//   `;

//   const getMladenciIDQuery = `
//     SELECT 
//     Mladenci_ID,
//     Poslasticar_Termin,
//     Naziv_Torte
//     FROM Zakazano
//     WHERE Poslasticar_ID = ?
//   `;


//   const getMladenciQuery = `
//     SELECT
//     Ime,
//     Prezime,
//     Broj_Telefona,
//     Ime_Partnera,
//     Prezime_Partnera,
//     Email
//     FROM Mladenci
//     WHERE ID IN (?)
//   `;

//   conn.query(getPoslasticarIDQuery, [uid], (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('Internal Server Error');
//     }

//     if (result.length === 0) {
//       return res.status(404).send('Nije pronađen Poslasticar za datog mladence.');
//     }

//     const PoslasticarID = result[0].ID;

//     conn.query(getMladenciIDQuery, [PoslasticarID], (err, resultMladenci) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).send('Internal Server Error');
//       }

//       if (resultMladenci.length === 0) {
//         return res.status(404).send('Nije pronađen Poslasticar za datog mladence.');
//       }

//       const mladenciIDs = resultMladenci.map(row => row.Mladenci_ID);

//       conn.query(getMladenciQuery, [mladenciIDs], (err, resultsvimladecni) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).send('Internal Server Error');
//         }

//         if (resultsvimladecni.length === 0) {
//           return res.status(404).send('Nije pronađen Mladenci za datog Poslasticara.');
//         }

//         const mladenci = resultsvimladecni.map(row => ({
//           Ime: row.Ime,
//           Prezime: row.Prezime,
//           Broj_Telefona: row.Broj_Telefona,
//           Ime_Partnera: row.Ime_Partnera,
//           Prezime_Partnera: row.Prezime_Partnera,
//           Email: row.Email,
//           Poslasticar_Termin: resultMladenci.find(item => item.Mladenci_ID === row.ID).Poslasticar_Termin
//         }));

//         const mladenci_List = Object.values(mladenci);
//         res.status(200).json(mladenci_List);

//         //res.status(200).json(mladenci);
//       });
//     });
//   });
// });

//Zakazivanje Fotografa

baza.get('/zakazaniposlasticari/prekouid/:uid', (req, res) => {
  const { uid } = req.params;

  const getPoslasticarIDQuery = `
    SELECT ID FROM Poslasticar
    WHERE UID = ?
  `;

  const getMladenciIDQuery = `
    SELECT 
    Mladenci_ID,
    Poslasticar_Termin,
    Naziv_Torte
    FROM Zakazano
    WHERE Poslasticar_ID = ?
  `;

  const getMladenciQuery = `
    SELECT
    ID,
    Ime,
    Prezime,
    Broj_Telefona,
    Ime_Partnera,
    Prezime_Partnera,
    Email
    FROM Mladenci
    WHERE ID IN (?)
  `;

  conn.query(getPoslasticarIDQuery, [uid], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length === 0) {
      return res.status(404).send('Nije pronađen Poslasticar za datog UID.');
    }

    const PoslasticarID = result[0].ID;

    conn.query(getMladenciIDQuery, [PoslasticarID], (err, resultMladenci) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      if (resultMladenci.length === 0) {
        return res.status(404).send('Nije pronađen Mladenci za datog Poslasticara.');
      }

      const mladenciIDs = resultMladenci.map(row => row.Mladenci_ID);

      conn.query(getMladenciQuery, [mladenciIDs], (err, resultsvimladecni) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }

        if (resultsvimladecni.length === 0) {
          return res.status(404).send('Nije pronađen Mladenci za datog Poslasticara.');
        }

        const mladenci = resultsvimladecni.map(row => {
          const zakazano = resultMladenci.find(item => item.Mladenci_ID === row.ID) || {};
          return {
            Ime: row.Ime,
            Prezime: row.Prezime,
            Broj_Telefona: row.Broj_Telefona,
            Ime_Partnera: row.Ime_Partnera,
            Prezime_Partnera: row.Prezime_Partnera,
            Email: row.Email,
            Poslasticar_Termin: zakazano.Poslasticar_Termin || null,
            Naziv_Torte: zakazano.Naziv_Torte || null
          };
        });

        res.status(200).json(mladenci);
      });
    });
  });
});


baza.put('/zakazivanjefotografa/prekouid/:uid', (req, res) => { 
    const { uid } = req.params;
    const { Fotograf_Termin, Fotograf_ID } = req.body;
    
    const getMladenciID = `
        SELECT ID FROM Mladenci
        WHERE UID = ?
    `;

    const deleteTermini = `
        DELETE FROM Slobodni_Termini
        WHERE Fotograf_ID = ? AND Slobodan_Termin = ?
    `;
    
    const UpdateZakazano = `
        UPDATE Zakazano
        Set Fotograf_Termin = ?, Fotograf_ID = ?
        WHERE Mladenci_ID = ?
    `;

    conn.query(getMladenciID, [uid], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        if (result.length === 0) {
            return res.status(404).send('Nije pronađen Fotograf za datog mladence.');
        }

        const mladenciID = result[0].ID;

        conn.query(UpdateZakazano, [Fotograf_Termin, Fotograf_ID, mladenciID], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }

            if (result.affectedRows === 0) {
                return res.status(404).send('Nije pronađen Fotograf za datog mladence.');
            }
            
            conn.query(deleteTermini, [Fotograf_ID, Fotograf_Termin], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Internal Server Error');
                }
                console.log('Podaci su uspesno ubaceni.');
                res.status(200).send('Podaci su uspesno ubaceni.');
            });
        });
    });
});



//Zakazivanje Dekoratera

baza.get('/zakazanifotografi/prekouid/:uid', (req, res) => {
  const { uid } = req.params;

  const getFotografIDQuery = `
    SELECT ID FROM Fotograf
    WHERE UID = ?
  `;

  const getMladenciIDQuery = `
    SELECT 
    Mladenci_ID,
    Fotograf_Termin
    FROM Zakazano
    WHERE Fotograf_ID = ?
  `;

  const getMladenciQuery = `
    SELECT
    ID,
    Ime,
    Prezime,
    Broj_Telefona,
    Ime_Partnera,
    Prezime_Partnera,
    Email
    FROM Mladenci
    WHERE ID IN (?)
  `;

  conn.query(getFotografIDQuery, [uid], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length === 0) {
      return res.status(404).send('Nije pronađen Fotograf za datog UID.');
    }

    const FotografID = result[0].ID;

    conn.query(getMladenciIDQuery, [FotografID], (err, resultMladenci) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      if (resultMladenci.length === 0) {
        return res.status(404).send('Nije pronađen Mladenci za datog Fotografa.');
      }

      const mladenciIDs = resultMladenci.map(row => row.Mladenci_ID);

      conn.query(getMladenciQuery, [mladenciIDs], (err, resultsvimladecni) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }

        if (resultsvimladecni.length === 0) {
          return res.status(404).send('Nije pronađen Mladenci za datog Fotografa.');
        }

        const mladenci = resultsvimladecni.map(row => {
          const zakazano = resultMladenci.find(item => item.Mladenci_ID === row.ID) || {};
          return {
            Ime: row.Ime,
            Prezime: row.Prezime,
            Broj_Telefona: row.Broj_Telefona,
            Ime_Partnera: row.Ime_Partnera,
            Prezime_Partnera: row.Prezime_Partnera,
            Email: row.Email,
            Fotograf_Termin: zakazano.Fotograf_Termin || null
          };
        });

        res.status(200).json(mladenci);
      });
    });
  });
});

baza.put('/zakazivanjedekoratera/prekouid/:uid', (req, res) => { 
    const { uid } = req.params;
    const { Dekorater_Termin, Dekorater_ID } = req.body;
    
    const getMladenciID = `
        SELECT ID FROM Mladenci
        WHERE UID = ?
    `;

    const deleteTermini = `
        DELETE FROM Slobodni_Termini
        WHERE Dekorater_ID = ? AND Slobodan_Termin = ?
    `;
    
    const UpdateZakazano = `
        UPDATE Zakazano
        Set Dekorater_Termin = ?, Dekorater_ID = ?
        WHERE Mladenci_ID = ?
    `;

    conn.query(getMladenciID, [uid], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        if (result.length === 0) {
            return res.status(404).send('Nije pronađen Dekorater za datog mladence.');
        }

        const mladenciID = result[0].ID;

        conn.query(UpdateZakazano, [Dekorater_Termin, Dekorater_ID, mladenciID], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }

            if (result.affectedRows === 0) {
                return res.status(404).send('Nije pronađen Dekorater za datog mladence.');
            }
            
            conn.query(deleteTermini, [Dekorater_ID, Dekorater_Termin], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Internal Server Error');
                }
                console.log('Podaci su uspesno ubaceni.');
                res.status(200).send('Podaci su uspesno ubaceni.');
            });
        });
    });

});



baza.get('/zakazanidekorateri/prekouid/:uid', (req, res) => {
  const { uid } = req.params;

  const getDekoraterIDQuery = `
    SELECT ID FROM Dekorater
    WHERE UID = ?
  `;

  const getMladenciIDQuery = `
    SELECT 
    Mladenci_ID,
    Dekorater_Termin
    FROM Zakazano
    WHERE Dekorater_ID = ?
  `;

  const getMladenciQuery = `
    SELECT
    ID,
    Ime,
    Prezime,
    Broj_Telefona,
    Ime_Partnera,
    Prezime_Partnera,
    Email
    FROM Mladenci
    WHERE ID IN (?)
  `;

  conn.query(getDekoraterIDQuery, [uid], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length === 0) {
      return res.status(404).send('Nije pronađen Dekorater za datog UID.');
    }

    const DekoraterID = result[0].ID;

    conn.query(getMladenciIDQuery, [DekoraterID], (err, resultMladenci) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      if (resultMladenci.length === 0) {
        return res.status(404).send('Nije pronađen Mladenci za datog Dekoratera.');
      }

      const mladenciIDs = resultMladenci.map(row => row.Mladenci_ID);

      conn.query(getMladenciQuery, [mladenciIDs], (err, resultsvimladecni) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }

        if (resultsvimladecni.length === 0) {
          return res.status(404).send('Nije pronađen Mladenci za datog Dekoratera.');
        }

        const mladenci = resultsvimladecni.map(row => ({
          Ime: row.Ime,
          Prezime: row.Prezime,
          Broj_Telefona: row.Broj_Telefona,
          Ime_Partnera: row.Ime_Partnera,
          Prezime_Partnera: row.Prezime_Partnera,
          Email: row.Email,
          Dekorater_Termin: resultMladenci.find(item => item.Mladenci_ID === row.ID).Dekorater_Termin
        }));

        const mladenci_List = Object.values(mladenci);
        res.status(200).json(mladenci_List);
      });
    });
  });
});

// baza.get('/zakazanidekorateri/prekouid/:uid', (req, res) => {
//   const { uid } = req.params;

//   const getDekoraterIDQuery = `
//     SELECT ID FROM Dekorater
//     WHERE UID = ?
//   `;

//   const getMladenciIDQuery = `
//     SELECT  Mladenci_ID FROM Zakazano
//     WHERE Dekorater_ID = ?
//   `;

//   const getMladenciQuery = `
//     SELECT
//     Ime,
//     Prezime,
//     Broj_Telefona,
//     Ime_Partnera,
//     Prezime_Partnera,
//     Email
//     FROM Mladenci
//     WHERE ID = ?
//   `;

//   conn.query(getDekoraterIDQuery, [uid], (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('Internal Server Error');
//     }

//     if (result.length === 0) {
//       return res.status(404).send('Nije pronađen Dekorater za datog mladence.');
//     }

//     const DekoraterID = result[0].ID;

//     conn.query(getMladenciIDQuery, [DekoraterID], (err, resultMladenci) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).send('Internal Server Error');
//       }

//       if (resultMladenci.length === 0) {
//         return res.status(404).send('Nije pronađen Dekorater za datog mladence.');
//       }

//       const mladenciID = resultMladenci[0].Mladenci_ID;

//       conn.query(getMladenciQuery, [mladenciID], (err, resultsvimladecni) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).send('Internal Server Error');
//         }

//         if (resultsvimladecni.length === 0) {
//           return res.status(404).send('Nije pronađen Dekorater za datog mladence.');
//         }

//         const mladenci = {};

//         resultsvimladecni.forEach((row) => {
//             if (!mladenci[row.ID]) {
//               mladenci[row.ID] = {
//                 Ime: row.Ime,
//                 Prezime: row.Prezime,
//                 Broj_Telefona: row.Broj_Telefona,
//                 Ime_Partnera: row.Ime_Partnera,
//                 Prezime_Partnera: row.Prezime_Partnera,
//                 Email: row.Email
//               };
//             }
//         });

//         const lista_mladenaca = Object.values(mladenci);
//         res.status(200).json(lista_mladenaca);

//       });
//     });
//   });
// });


//vraca id u poslasticara

//TORTE METODE

baza.post('/posttorte/:uid', (req, res) => {
  const { uid } = req.params;

  const { Naziv, Tip_Slaga, Fondan, Tema, Cena, Posno, Kratak_Opis } = req.body;

  const query = `
    INSERT INTO TIP_TORTE (Naziv, Tip_Slaga, Fondan, Tema, Cena, Posno, Kratak_Opis, Torta_ID)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const getPoslasticarIDQuery = `
    SELECT ID FROM Poslasticar
    WHERE UID = ?
  `;

  conn.query(getPoslasticarIDQuery, [uid], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    const poslasticar_id = result[0].ID;

    conn.query(query, [Naziv, Tip_Slaga, Fondan, Tema, Cena, Posno, Kratak_Opis, poslasticar_id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      if (result.affectedRows === 0) {
        return res.status(404).send('Nije pronađen Poslasticar za datog mladence.');
      }

      res.status(200).send('Podaci su uspesno ubaceni.');

    });
  });
});

baza.delete('/deletetorte/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM TIP_TORTE WHERE ID = ?';

  conn.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    res.status(200).send('Podaci su uspesno obrisani.');

  });
});

baza.listen(8080);
