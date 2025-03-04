/* eslint-disable no-multi-spaces */
/* eslint-disable spaced-comment */
/* eslint-disable grouped-accessor-pairs */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-underscore-dangle */
/* eslint-disable indent */

class Foods {   //dodao sam defualt
  constructor(kratakOpis, imeHrane, cena, specijalitet, slika, type) {
      this._kratakOpis = kratakOpis;
      this._imeHrane = imeHrane;
      this._cena = cena;
      this._specijalitet = specijalitet;
      this._slika = slika;
      this._type = type;
  }

  // Getters
  get kratakOpis() {
      return this._kratakOpis;
  }

  get imeHrane() {
      return this._imeHrane;
  }

  get cena() {
      return this._cena;
  }

  get specijalitet() {
      return this._specijalitet;
  }

  get slika() {
      return this._slika;
  }

  get type() {
      return this._type;
  }

  // Setters
  set kratakOpis(value) {
      this._kratakOpis = value;
  }

  set imeHrane(value) {
      this._imeHrane = value;
  }

  set cena(value) {
      this._cena = value;
  }

  set specijalitet(value) {
      this._specijalitet = value;
  }

  set slika(value) {
      this._slika = value;
  }

  set type(value) {
      this._type = value;
  }

  // Method to check if attributes are valid
  ifAttributesAreValid() {
      if (this._type === 'Jelo' || this._type === 'Pice') {
          return true;
      }
          return false;
  }
}

class Pice extends Foods {
  constructor(kratakOpis, imeHrane, cena, specijalitet, slika, alkoholno, kolicinuULitrima) {
      super(kratakOpis, imeHrane, cena, specijalitet, slika, 'Pice');
      this._alkoholno = alkoholno;
      this._kolicinuULitrima = kolicinuULitrima;
  }

  // Getters
  get alkoholno() {
      return this._alkoholno;
  }

  get kolicinuULitrima() {
      return this._kolicinuULitrima;
  }

  // Setters
  set alkoholno(value) {
      this._alkoholno = value;
  }

  set kolicinuULitrima(value) {
      this._kolicinuULitrima = value;
  }
}

class Jelo extends Foods {
  // eslint-disable-next-line max-len
  constructor(kratakOpis, imeHrane, cena, specijalitet, slika, dorucak, rucak, vecera, dezert, salata, posno, vegetarijansko, gramaza) {
      super(kratakOpis, imeHrane, cena, specijalitet, slika, 'Jelo');
      this._dorucak = dorucak;
      this._rucak = rucak;
      this._vecera = vecera;
      this._dezert = dezert;
      this._salata = salata;
      this._posno = posno;
      this._vegetarijansko = vegetarijansko;
      this._gramaza = gramaza;
  }

  // Getters
  get dorucak() {
      return this._dorucak;
  }

  get rucak() {
      return this._rucak;
  }

  get vecera() {
      return this._vecera;
  }

  get dezert() {
      return this._dezert;
  }

  get salata() {
      return this._salata;
  }

  get posno() {
      return this._posno;
  }

  get vegetarijansko() {
      return this._vegetarijansko;
  }

  get gramaza() {
      return this._gramaza;
  }

  // Setters
  set dorucak(value) {
      this._dorucak = value;
  }

  set rucak(value) {
      this._rucak = value;
  }

  set vecera(value) {
      this._vecera = value;
  }

  set dezert(value) {
      this._dezert = value;
  }

  // eslint-disable-next-line grouped-accessor-pairs
  set salata(value) {
      this._salata = value;
  }

  set posno(value) {
      this._posno = value;
  }

  // eslint-disable-next-line grouped-accessor-pairs
  set vegetarijansko(value) {
      this._vegetarijansko = value;
  }

  set gramaza(value) {
      this._gramaza = value;
  }
}

export { Foods, Jelo, Pice };
