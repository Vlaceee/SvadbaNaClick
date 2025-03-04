/* eslint-disable grouped-accessor-pairs */
/* eslint-disable no-underscore-dangle */
class FotografClass {
  // eslint-disable-next-line max-len
  constructor(NazivAgencije, Email, SigurnosniKod, CenaUsluge, Cenaposlici, Datumosnivanja, OpisKompanije, SlobodniTermini, Lokacija) {
    this._NazivAgencije = NazivAgencije;
    this._Email = Email;
    this._SigurnosniKod = SigurnosniKod;
    this._CenaUsluge = CenaUsluge;
    this._Cenaposlici = Cenaposlici;
    this._Datumosnivanja = Datumosnivanja;
    this._OpisKompanije = OpisKompanije;
    this._SlobodniTermini = SlobodniTermini;
    this._Lokacija = Lokacija;
  }

  areAttributesValid() {
    if (
      typeof this._NazivAgencije !== 'string'
      || typeof this._Email !== 'string'
      || typeof this._SigurnosniKod !== 'number'
      || typeof this._CenaUsluge !== 'number'
      || typeof this._Cenaposlici !== 'number'
      || !(this._Datumosnivanja instanceof Date)
      || typeof this._OpisKompanije !== 'string'
      || !Array.isArray(this._SlobodniTermini)
      || this._SlobodniTermini.some((item) => !(item instanceof Date))
      || typeof this._Lokacija !== 'string'
    ) {
      return false; // Return false if any validation fails
    }
    return true; // Return true if all validations pass
  }

  // Getters
  get NazivAgencije() {
    return this._NazivAgencije;
  }

  get Email() {
    return this._Email;
  }

  get SigurnosniKod() {
    return this._SigurnosniKod;
  }

  get CenaUsluge() {
    return this._CenaUsluge;
  }

  get Cenaposlici() {
    return this._Cenaposlici;
  }

  get Datumosnivanja() {
    return this._Datumosnivanja;
  }

  get OpisKompanije() {
    return this._OpisKompanije;
  }

  get SlobodniTermini() {
    return this._SlobodniTermini;
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

  set SigurnosniKod(value) {
    this._SigurnosniKod = value;
  }

  set CenaUsluge(value) {
    this._CenaUsluge = value;
  }

  set Cenaposlici(value) {
    this._Cenaposlici = value;
  }

  set Datumosnivanja(value) {
    this._Datumosnivanja = value;
  }

  set OpisKompanije(value) {
    this._OpisKompanije = value;
  }

  set SlobodniTermini(value) {
    this._SlobodniTermini = value;
  }

  set Lokacija(value) {
    this._Lokacija = value;
  }
}

export default FotografClass;
