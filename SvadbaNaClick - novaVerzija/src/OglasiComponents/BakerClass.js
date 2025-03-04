/* eslint-disable no-underscore-dangle */
/* eslint-disable grouped-accessor-pairs */
/* eslint-disable max-len */
import Torta from './Torta';

class Baker {
  constructor(NazivAgencije, Email, CenaPosiljke, OpisPosla, DatumOsnivanja, SigurnosniKod, ListaTorti, SlobodniTermini, Lokacija) {
    this._NazivAgencije = NazivAgencije;
    this._Email = Email;
    this._CenaPosiljke = CenaPosiljke;
    this._OpisPosla = OpisPosla;
    this._DatumOsnivanja = DatumOsnivanja;
    this._SigurnosniKod = SigurnosniKod;
    this._ListaTorti = ListaTorti;
    this._SlobodniTermini = SlobodniTermini;
    this._Lokacija = Lokacija;
    this.areAttributesValid();
  }

  areAttributesValid() {
    if (
      typeof this._NazivAgencije !== 'string'
      || typeof this._Email !== 'string'
      || typeof this._CenaPosiljke !== 'number'
      || typeof this._OpisPosla !== 'string'
      || !(this._DatumOsnivanja instanceof Date)
      || typeof this._SigurnosniKod !== 'number'
      || !Array.isArray(this._ListaTorti)
      || this._ListaTorti.some((item) => !(item instanceof Torta))
      || !Array.isArray(this._SlobodniTermini)
      || this._SlobodniTermini.some((item) => !(item instanceof Date))
      || typeof this._Lokacija !== 'string'
    ) {
      return false;
    }
    return true;
  }

  // Getters
  get nazivAgencije() {
    return this._NazivAgencije;
  }

  get email() {
    return this._Email;
  }

  get cenaPosiljke() {
    return this._CenaPosiljke;
  }

  get opisPosla() {
    return this._OpisPosla;
  }

  get datumOsnivanja() {
    return this._DatumOsnivanja;
  }

  get sigurnosniKod() {
    return this._SigurnosniKod;
  }

  get listaTorti() {
    return this._ListaTorti;
  }

  get slobodniTermini() {
    return this._SlobodniTermini;
  }

  get lokacija() {
    return this._Lokacija;
  }

  // Setters
  set nazivAgencije(value) {
    this._NazivAgencije = value;
  }

  set email(value) {
    this._Email = value;
  }

  set cenaPosiljke(value) {
    this._CenaPosiljke = value;
  }

  set opisPosla(value) {
    this._OpisPosla = value;
  }

  set datumOsnivanja(value) {
    this._DatumOsnivanja = value;
  }

  set sigurnosniKod(value) {
    this._SigurnosniKod = value;
  }

  set listaTorti(value) {
    this._ListaTorti = value;
  }

  set slobodniTermini(value) {
    this._SlobodniTermini = value;
  }

  set lokacija(value) {
    this._Lokacija = value;
  }
}

export default Baker;
