/* eslint-disable max-len */
import * as yup from 'yup';

const loginSchema = yup.object().shape({
  email: yup.string().email('Unesite validnu email adresu').required('Neophodno polje'),
  password: yup.string().min(6, 'Sifra mora imati minimum 6 karaktera').required('Neophodno polje'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Sifre se ne poklapaju').required('Neophodno polje'),
  ime: yup.string('Pogresan format!').required('Neophodno polje').matches(/^[A-Za-z]+$/, 'Samo slova su dozvoljena'),
  prezime: yup.string('Pogresan format!').required('Neophodno polje').matches(/^[A-Za-z]+$/, 'Samo slova su dozvoljena'),
  imePartnera: yup.string('Pogresan format!').required('Neophodno polje').matches(/^[A-Za-z]+$/, 'Samo slova su dozvoljena'),
  prezimePartnera: yup.string('Pogresan format!').required('Neophodno polje').matches(/^[A-Za-z]+$/, 'Samo slova su dozvoljena'),
  brojTelefona: yup.string().matches(/^[0-9+/ ]+$/, 'Pogresan format telefona').required('Neophodno polje').max(15, 'Duzina prevelika'),
  naziv: yup.string('Pogresan format!').required('Neophodno polje'),
  skod: yup.string('Pogresan format!').required('Neophodno polje'),
  opis: yup.string('Pogresan format!').required('Neophodno polje'),
  lokacija: yup.string('Pogresan format!').required('Neophodno polje'),
  cenaUsluge: yup.string().matches(/^[0-9]+$/, 'Pogresan format').required('Neophodno polje'),
  cenaPoSlici: yup.string().matches(/^[0-9]+$/, 'Pogresan format').required('Neophodno polje'),

});

const registerClientSchema = yup.object().shape({
  email: yup.string().email('Unesite validnu email adresu').required('Neophodno polje'),
  password: yup.string().min(6, 'Sifra mora imati minimum 6 karaktera').required('Neophodno polje'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Sifre se ne poklapaju').required('Neophodno polje'),
  ime: yup.string('Pogresan format!').required('Neophodno polje').matches(/^[A-Za-z]+$/, 'Samo slova su dozvoljena'),
  prezime: yup.string('Pogresan format!').required('Neophodno polje').matches(/^[A-Za-z]+$/, 'Samo slova su dozvoljena'),
  imePartnera: yup.string('Pogresan format!').required('Neophodno polje').matches(/^[A-Za-z]+$/, 'Samo slova su dozvoljena'),
  prezimePartnera: yup.string('Pogresan format!').required('Neophodno polje').matches(/^[A-Za-z]+$/, 'Samo slova su dozvoljena'),
  brojTelefona: yup.string().matches(/^[0-9+/ ]+$/, 'Pogresan format telefona').required('Neophodno polje').max(15, 'Duzina prevelika'),
});

const skodSchema = yup.object().shape({
  email: yup.string().email('Unesite validnu email adresu').required('Neophodno polje'),

});

const changeMladenciSchema = yup.object().shape({
  ime: yup.string('Pogresan format!').required('Neophodno polje').matches(/^[A-Za-z]+$/, 'Samo slova su dozvoljena'),
  prezime: yup.string('Pogresan format!').required('Neophodno polje').matches(/^[A-Za-z]+$/, 'Samo slova su dozvoljena'),
  imePartnera: yup.string('Pogresan format!').required('Neophodno polje').matches(/^[A-Za-z]+$/, 'Samo slova su dozvoljena'),
  prezimePartnera: yup.string('Pogresan format!').required('Neophodno polje').matches(/^[A-Za-z]+$/, 'Samo slova su dozvoljena'),
  brojTelefona: yup.string().matches(/^[0-9+/ ]+$/, 'Pogresan format telefona').required('Neophodno polje').max(15, 'Duzina prevelika'),
  email: yup.string().email('Unesite validnu email adresu').required('Neophodno polje'),
});

const changeDekoraterSchema = yup.object().shape({
  naziv: yup.string('Pogresan format!').required('Neophodno polje'),
  opis: yup.string('Pogresan format!').required('Neophodno polje'),
  brTelefona: yup.string().matches(/^[0-9+/ ]+$/, 'Pogresan format telefona').required('Neophodno polje').max(15, 'Duzina prevelika'),
  cena: yup.string().matches(/^[0-9]+$/, 'Pogresan format').required('Neophodno polje'),
});

const changePoslasticarSchema = yup.object().shape({
  naziv: yup.string('Pogresan format!').required('Neophodno polje'),
  opis: yup.string('Pogresan format!').required('Neophodno polje'),
  brTelefona: yup.string().matches(/^[0-9+/ ]+$/, 'Pogresan format telefona').required('Neophodno polje').max(15, 'Duzina prevelika'),
});

const changeRestoranSchema = yup.object().shape({
  naziv: yup.string('Pogresan format!').required('Neophodno polje'),
  opis: yup.string('Pogresan format!').required('Neophodno polje'),
  brTelefona: yup.string().matches(/^[0-9+/ ]+$/, 'Pogresan format telefona').required('Neophodno polje').max(15, 'Duzina prevelika'),
  minimumCena: yup.string().matches(/^[0-9]+$/, 'Pogresan format').required('Neophodno polje'),
  pravite: yup.string().matches(/^[0-1]+$/, 'Pogresan format').required('Neophodno polje'),
});

const changeFotografSchema = yup.object().shape({
  naziv: yup.string('Pogresan format!').required('Neophodno polje'),
  opis: yup.string('Pogresan format!').required('Neophodno polje'),
  brTelefona: yup.string().matches(/^[0-9+/ ]+$/, 'Pogresan format telefona').required('Neophodno polje').max(15, 'Duzina prevelika'),
  cena: yup.string().matches(/^[0-9]+$/, 'Pogresan format').required('Neophodno polje'),
  cenaPoSlici: yup.string().matches(/^[0-9]+$/, 'Pogresan format').required('Neophodno polje'),
});

export {
  changeMladenciSchema, loginSchema, skodSchema, registerClientSchema, changeDekoraterSchema, changeRestoranSchema, changePoslasticarSchema, changeFotografSchema,
};
