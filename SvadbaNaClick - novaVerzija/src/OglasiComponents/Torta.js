/* eslint-disable no-underscore-dangle */
/* eslint-disable grouped-accessor-pairs */
class Torta {
  constructor(NazivTorte, TipSlaga, Fondan, Tema, Posna, KratakOpisTorte, Cena) {
    this._NazivTorte = NazivTorte;
    this._TipSlaga = TipSlaga;
    this._Fondan = Fondan;
    this._Tema = Tema;
    this._Posna = Posna;
    this._KratakOpisTorte = KratakOpisTorte;
    this._Cena = Cena;
    this.areAttributesValid();
  }

  // Getters
  get NazivTorte() {
    return this._NazivTorte;
  }

  get TipSlaga() {
    return this._TipSlaga;
  }

  get Fondan() {
    return this._Fondan;
  }

  get Tema() {
    return this._Tema;
  }

  get Posna() {
    return this._Posna;
  }

  get KratakOpisTorte() {
    return this._KratakOpisTorte;
  }

  get Cena() {
    return this._Cena;
  }

  // Setters
  set NazivTorte(value) {
    this._NazivTorte = value;
  }

  set TipSlaga(value) {
    this._TipSlaga = value;
  }

  set Fondan(value) {
    this._Fondan = value;
  }

  set Tema(value) {
    this._Tema = value;
  }

  set Posna(value) {
    this._Posna = value;
  }

  set KratakOpisTorte(value) {
    this._KratakOpisTorte = value;
  }

  set Cena(value) {
    this._Cena = value;
  }

  areAttributesValid() {
    if (
      typeof this._NazivTorte !== 'string'
      || typeof this._TipSlaga !== 'string'
      || typeof this._Fondan !== 'boolean'
      || typeof this._Tema !== 'string'
      || typeof this._Posna !== 'boolean'
      || typeof this._KratakOpisTorte !== 'string'
      || typeof this._Cena !== 'number'
    ) {
      return false;
    }
    return true;
  }
}

export default Torta;
