/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable grouped-accessor-pairs */
/* eslint-disable no-unused-vars */
import { Foods, Jelo, Pice } from './Food';

class Restoran {
  constructor(NazivAgencije, Email, CenaUsluge, Jelovnik, OpisPosla, DatumOsnivanja, SigurnosniKod, SlobodniTermini, RestoranPraviTortu, Bend, Lokacija) {
    this._NazivAgencije = NazivAgencije;
    this._Email = Email;
    this._CenaUsluge = CenaUsluge;
    this._Jelovnik = Jelovnik;
    this._OpisPosla = OpisPosla;
    this._DatumOsnivanja = DatumOsnivanja;
    this._SigurnosniKod = SigurnosniKod;
    this._SlobodniTermini = SlobodniTermini;
    this._RestoranPraviTortu = RestoranPraviTortu;
    this._Bend = Bend;
    this._Lokacija = Lokacija;
    this.areAttributesValid();
   
  }

  areAttributesValid() {
    // Perform your validation checks here
    if (
      typeof this._NazivAgencije !== 'string'
      || typeof this._Email !== 'string'
      || typeof this._CenaUsluge !== 'number'
      || !Array.isArray(this._Jelovnik)
      || this._Jelovnik.some((item) => !(item instanceof Foods)) 
      || typeof this._OpisPosla !== 'string'
      || !(this._DatumOsnivanja instanceof Date)
      || typeof this._SigurnosniKod !== 'number'
      || !Array.isArray(this._SlobodniTermini)
      || this._SlobodniTermini.some((item) => !(item instanceof Date))
      || typeof this._RestoranPraviTortu !== 'boolean'
      || typeof this._Bend !== 'string'
      || typeof this._Lokacija !== 'string'
    ) {
      return false;
    }
    return true;
  }

  // Getters
  get NazivAgencije() {
    return this._NazivAgencije;
  }

  get Email() {
    return this._Email;
  }

  get CenaUsluge() {
    return this._CenaUsluge;
  }

  get Jelovnik() {
    return this._Jelovnik;
  }

  get OpisPosla() {
    return this._OpisPosla;
  }

  get DatumOsnivanja() {
    return this._DatumOsnivanja;
  }

  get SigurnosniKod() {
    return this._SigurnosniKod;
  }

  get SlobodniTermini() {
    return this._SlobodniTermini;
  }

  get RestoranPraviTortu() {
    return this._RestoranPraviTortu;
  }

  get Bend() {
    return this._Bend;
  }

  get Lokacija() {
    return this._Lokacija;
  }

  // Setters
  set NazivAgencije(value) {
    this._NazivAgencije = value;
  }

  set Email(value) {
    this._Email = value;
  }

  set CenaUsluge(value) {
    this._CenaUsluge = value;
  }

  set Jelovnik(value) {
    this._Jelovnik = value;
  }

  set OpisPosla(value) {
    this._OpisPosla = value;
  }

  set DatumOsnivanja(value) {
    this._DatumOsnivanja = value;
  }

  set SigurnosniKod(value) {
    this._SigurnosniKod = value;
  }

  set SlobodniTermini(value) {
    this._SlobodniTermini = value;
  }

  set RestoranPraviTortu(value) {
    this._RestoranPraviTortu = value;
  }

  set Bend(value) {
    this._Bend = value;
  }

  set Lokacija(value) {
    this._Lokacija = value;
  }
}

export default Restoran;
