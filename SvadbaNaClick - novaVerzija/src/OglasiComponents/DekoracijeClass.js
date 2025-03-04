/* eslint-disable no-underscore-dangle */
/* eslint-disable grouped-accessor-pairs */
/* eslint-disable max-len */
class Dekorater {
  constructor(NazivAgencije, Email, CenaUsluge, DatumOsnivanja, SigurnosniKod, SlobodniTermini, Lokacija, OpisKompanije) {
    this._NazivAgencije = NazivAgencije;
    this._Email = Email;
    this._CenaUsluge = CenaUsluge;
    this._DatumOsnivanja = DatumOsnivanja;
    this._SigurnosniKod = SigurnosniKod;
    this._SlobodniTermini = SlobodniTermini;
    this._Lokacija = Lokacija;
    this._OpisKompanije = OpisKompanije;
    this.areAttributesValid();
  }

  areAttributesValid() {
    if (
      typeof this._NazivAgencije !== 'string'
      || typeof this._Email !== 'string'
      || typeof this._CenaUsluge !== 'number'
      || !(this._DatumOsnivanja instanceof Date)
      || typeof this._SigurnosniKod !== 'number'
      || !Array.isArray(this._SlobodniTermini)
      || this._SlobodniTermini.some((item) => !(item instanceof Date))
      || typeof this._Lokacija !== 'string'
      || typeof this._OpisKompanije !== 'string' // Add validation for OpisKompanije
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

  get DatumOsnivanja() {
    return this._DatumOsnivanja;
  }

  get SigurnosniKod() {
    return this._SigurnosniKod;
  }

  get SlobodniTermini() {
    return this._SlobodniTermini;
  }

  get Lokacija() {
    return this._Lokacija;
  }

  get OpisKompanije() {
    return this._OpisKompanije;
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

  set DatumOsnivanja(value) {
    this._DatumOsnivanja = value;
  }

  set SigurnosniKod(value) {
    this._SigurnosniKod = value;
  }

  set SlobodniTermini(value) {
    this._SlobodniTermini = value;
  }

  set Lokacija(value) {
    this._Lokacija = value;
  }

  set OpisKompanije(value) {
    this._OpisKompanije = value;
  }
}

export default Dekorater;
